
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
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

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { amount, currency = "inr", description, customerEmail, customerName, type } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Valid amount is required");
    }

    // Initialize Stripe with the correct environment variable
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not found in environment variables");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail || user.email,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { 
              name: type === 'donation' ? `Donation - ${description}` : `Service - ${description}`,
              description: description
            },
            unit_amount: Math.round(amount * 100), // Convert to paisa for INR
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=${type}&amount=${amount}&description=${encodeURIComponent(description)}`,
      cancel_url: `${req.headers.get("origin")}${type === 'donation' ? '/donations' : '/services'}`,
      metadata: {
        type: type,
        customer_name: customerName || user.user_metadata?.full_name || 'User',
        description: description,
        user_id: user.id,
        amount: amount.toString(),
        currency: currency
      }
    });

    // Store payment record in database
    const supabaseService = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    await supabaseService.from('payments').insert({
      user_id: user.id,
      stripe_session_id: session.id,
      amount: amount,
      currency: currency,
      type: type,
      description: description,
      status: 'pending',
      customer_name: customerName || user.user_metadata?.full_name || 'User',
      customer_email: customerEmail || user.email
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
