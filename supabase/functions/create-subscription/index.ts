
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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

    const { planType, interval = "month" } = await req.json();

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    // Define subscription plans
    const plans = {
      basic: { price: 999, name: "Basic Plan", features: ["Basic temple services", "Event notifications", "Prayer reminders"] },
      premium: { price: 1999, name: "Premium Plan", features: ["All basic features", "Priority booking", "Personalized prayers", "Monthly spiritual guidance"] },
      devotee: { price: 4999, name: "Devotee Plan", features: ["All premium features", "VIP temple access", "Personal priest consultation", "Special ceremony bookings"] }
    };

    const selectedPlan = plans[planType as keyof typeof plans];
    if (!selectedPlan) {
      throw new Error("Invalid plan type");
    }

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
    }

    // Create subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: selectedPlan.name,
              description: selectedPlan.features.join(", ")
            },
            unit_amount: selectedPlan.price,
            recurring: { interval: interval as "month" | "year" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/subscription-success?session_id={CHECKOUT_SESSION_ID}&plan=${planType}`,
      cancel_url: `${req.headers.get("origin")}/subscriptions`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        interval: interval
      }
    });

    // Store subscription record
    const supabaseService = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    await supabaseService.from('subscriptions').insert({
      user_id: user.id,
      stripe_session_id: session.id,
      plan_type: planType,
      interval: interval,
      amount: selectedPlan.price,
      status: 'pending',
      customer_email: user.email,
      customer_name: user.user_metadata?.full_name || user.email.split('@')[0]
    });

    return new Response(JSON.stringify({ url: session.url, plan: selectedPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Subscription creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
