
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

    // PhonePe configuration - Updated for correct API structure
    const clientId = Deno.env.get("PHONEPE_CLIENT_ID");
    const clientSecret = Deno.env.get("PHONEPE_CLIENT_SECRET");
    const clientVersion = Deno.env.get("PHONEPE_CLIENT_VERSION") || "1.0";
    const merchantId = Deno.env.get("PHONEPE_MERCHANT_ID");
    
    console.log("PhonePe config check:", { 
      hasClientId: !!clientId, 
      hasClientSecret: !!clientSecret, 
      hasMerchantId: !!merchantId 
    });

    // If PhonePe credentials are missing, fallback to Stripe
    if (!clientId || !clientSecret || !merchantId) {
      console.log("PhonePe credentials missing, falling back to Stripe");
      return await createStripePayment(req, user, amount, currency, description, customerEmail, customerName, type);
    }

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // PhonePe payment request payload - Updated structure
    const paymentPayload = {
      merchantId: merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: user.id,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${req.headers.get("origin")}/payment-success?txnId=${transactionId}&type=${type}&amount=${amount}&description=${encodeURIComponent(description)}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${req.headers.get("origin")}/api/phonepe-callback`,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    console.log("PhonePe payment payload:", paymentPayload);

    // Encode payload to base64
    const base64Payload = btoa(JSON.stringify(paymentPayload));
    
    // Create checksum using client secret
    const checksumString = base64Payload + "/pg/v1/pay" + clientSecret;
    const checksum = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(checksumString));
    const checksumHex = Array.from(new Uint8Array(checksum))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('') + "###1";

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

    // Make API call to PhonePe - Updated endpoint and headers
    const phonePeResponse = await fetch("https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksumHex,
        "X-CLIENT-ID": clientId,
        "X-CLIENT-VERSION": clientVersion
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const phonePeData = await phonePeResponse.json();
    console.log("PhonePe response:", phonePeData);

    if (phonePeData.success && phonePeData.data?.instrumentResponse?.redirectInfo?.url) {
      return new Response(JSON.stringify({ 
        url: phonePeData.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId,
        gateway: 'phonepe'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      console.log("PhonePe failed, falling back to Stripe:", phonePeData);
      // Fallback to Stripe if PhonePe fails
      return await createStripePayment(req, user, amount, currency, description, customerEmail, customerName, type);
    }

  } catch (error) {
    console.error("PhonePe payment creation error:", error);
    // Fallback to Stripe on any error
    try {
      const { data: { user } } = await createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
      ).auth.getUser();
      
      if (user) {
        const { amount, currency, description, customerEmail, customerName, type } = await req.json();
        return await createStripePayment(req, user, amount, currency, description, customerEmail, customerName, type);
      }
    } catch (fallbackError) {
      console.error("Stripe fallback also failed:", fallbackError);
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Stripe fallback function
async function createStripePayment(req: Request, user: any, amount: number, currency: string, description: string, customerEmail?: string, customerName?: string, type?: string) {
  const Stripe = (await import("https://esm.sh/stripe@14.21.0")).default;
  
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    throw new Error("Neither PhonePe nor Stripe is properly configured");
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail || user.email,
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase() === 'inr' ? 'usd' : currency.toLowerCase(),
          product_data: { 
            name: type === 'donation' ? `Donation - ${description}` : `Service - ${description}`,
            description: description
          },
          unit_amount: currency.toLowerCase() === 'inr' ? Math.round(amount * 1.2) : Math.round(amount * 100), // Convert INR to USD approximation
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=${type}&amount=${amount}&description=${encodeURIComponent(description)}`,
    cancel_url: `${req.headers.get("origin")}${type === 'donation' ? '/donations' : '/services'}`,
    metadata: {
      type: type || 'payment',
      customer_name: customerName || user.user_metadata?.full_name || 'User',
      description: description,
      user_id: user.id,
      amount: amount.toString(),
      currency: currency,
      fallback_from: 'phonepe'
    }
  });

  // Store payment record
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  await supabaseService.from('payments').insert({
    user_id: user.id,
    stripe_session_id: session.id,
    amount: amount,
    currency: currency,
    type: type || 'payment',
    description: description,
    status: 'pending',
    customer_name: customerName || user.user_metadata?.full_name || 'User',
    customer_email: customerEmail || user.email
  });

  return new Response(JSON.stringify({ 
    url: session.url,
    gateway: 'stripe_fallback'
  }), {
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    status: 200,
  });
}
