import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, anon);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Auth required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: { user }, error: authErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !user) return new Response(JSON.stringify({ error: "Auth required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { ticketNumber, reason } = await req.json();
    if (!ticketNumber) throw new Error("Ticket number required");
    if (!reason || typeof reason !== 'string' || reason.trim().length < 10) {
      throw new Error("A cancellation reason of at least 10 characters is required");
    }

    const admin = createClient(supabaseUrl, service, { auth: { persistSession: false } });

    // Find ticket belonging to user
    const { data: ticket, error: tErr } = await admin
      .from('tickets')
      .select('*, services(name, price)')
      .eq('ticket_number', ticketNumber.trim())
      .eq('user_id', user.id)
      .maybeSingle();

    if (tErr || !ticket) throw new Error("Ticket not found or doesn't belong to you");
    if (ticket.status === 'cancelled') throw new Error("Already cancelled");

    // Determine refund amount based on policy
    const serviceDate = ticket.service_date ? new Date(ticket.service_date) : null;
    const now = new Date();
    const hoursUntil = serviceDate ? (serviceDate.getTime() - now.getTime()) / 36e5 : 9999;
    const price = Number(ticket.services?.price || 0);
    let refundPct = 0;
    let refundStatus = 'No refund (cancellation < 24h)';
    if (hoursUntil >= 48) { refundPct = 100; refundStatus = 'Full refund'; }
    else if (hoursUntil >= 24) { refundPct = 50; refundStatus = '50% refund'; }
    const refundAmount = Math.round((price * refundPct) / 100);

    // Try Stripe refund
    let stripeRefundId: string | null = null;
    if (refundAmount > 0) {
      try {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2025-08-27.basil" });
        const { data: payment } = await admin
          .from('payments')
          .select('stripe_session_id')
          .eq('user_id', user.id)
          .eq('type', 'service')
          .eq('status', 'completed')
          .ilike('description', `%${ticket.services?.name || ''}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (payment?.stripe_session_id) {
          const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id);
          if (session.payment_intent) {
            const refund = await stripe.refunds.create({
              payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id,
              amount: refundAmount * 100,
              reason: 'requested_by_customer',
            });
            stripeRefundId = refund.id;
          }
        } else {
          refundStatus += ' (manual processing)';
        }
      } catch (e: any) {
        console.error('Stripe refund failed:', e.message);
        refundStatus = `Refund pending manual processing: ${e.message}`;
      }
    }

    // Cancel ticket
    await admin.from('tickets').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', ticket.id);

    // Fire emails in parallel without blocking the response
    const emailPromises = Promise.allSettled([
      admin.functions.invoke('send-notification-email', {
        body: {
          to: ticket.customer_email,
          name: ticket.customer_name,
          type: 'service_cancelled',
          data: {
            serviceName: ticket.services?.name || 'Service',
            ticketNumber: ticket.ticket_number,
            refundAmount,
            refundStatus,
            reason,
          },
        },
      }),
      admin.functions.invoke('send-notification-email', {
        body: {
          to: ticket.customer_email,
          name: ticket.customer_name,
          type: 'service_thankyou',
          data: {
            serviceName: ticket.services?.name || 'Service',
            ticketNumber: ticket.ticket_number,
            message: `We're sorry to see you cancel your ${ticket.services?.name || 'service'} booking. Your feedback helps us improve. We hope to serve you again soon. 🙏`,
          },
        },
      }),
    ]);
    // Don't await — let it run in background. Use EdgeRuntime.waitUntil if available.
    try { (globalThis as any).EdgeRuntime?.waitUntil?.(emailPromises); } catch {}

    return new Response(JSON.stringify({ success: true, refundAmount, refundStatus, stripeRefundId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error('Cancel error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
