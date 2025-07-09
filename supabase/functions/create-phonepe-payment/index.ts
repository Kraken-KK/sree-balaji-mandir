
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { amount, currency = "INR", description, customerEmail, customerName, type } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Valid amount is required");
    }

    // PhonePe configuration
    const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID");
    const saltKey = Deno.env.get("PHONEPE_SALT_KEY");
    const saltIndex = Deno.env.get("PHONEPE_SALT_INDEX") || "1";
    
    if (!merchantId || !saltKey) {
      throw new Error("PhonePe configuration missing");
    }

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // PhonePe payment request payload
    const paymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: user.id,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${req.headers.get("origin")}/payment-success?txnId=${transactionId}&type=${type}&amount=${amount}&description=${encodeURIComponent(description)}`,
      redirectMode: "POST",
      callbackUrl: `${req.headers.get("origin")}/api/phonepe-callback`,
      mobileNumber: customerEmail || user.email,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Encode payload to base64
    const base64Payload = btoa(JSON.stringify(paymentPayload));
    
    // Create checksum
    const checksumString = base64Payload + "/pg/v1/pay" + saltKey;
    const checksum = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(checksumString));
    const checksumHex = Array.from(new Uint8Array(checksum))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('') + "###" + saltIndex;

    // Store payment record in database
    const supabaseService = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    await supabaseService.from('payments').insert({
      user_id: user.id,
      stripe_session_id: transactionId,
      amount: amount,
      currency: currency,
      type: type,
      description: description,
      status: 'pending',
      customer_name: customerName || user.user_metadata?.full_name || 'User',
      customer_email: customerEmail || user.email
    });

    // Make API call to PhonePe
    const phonePeResponse = await fetch("https://api.phonepe.com/apis/hermes/pg/v1/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksumHex
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const phonePeData = await phonePeResponse.json();

    if (phonePeData.success) {
      return new Response(JSON.stringify({ 
        url: phonePeData.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error(phonePeData.message || "PhonePe payment creation failed");
    }

  } catch (error) {
    console.error("PhonePe payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
