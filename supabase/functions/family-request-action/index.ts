import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Public endpoint: links from admin email -> approve/reject
// URL: /family-request-action?id=xxx&action=approve|reject&token=xxx
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const action = url.searchParams.get("action");
  const token = url.searchParams.get("token");

  const adminToken = Deno.env.get("FAMILY_ADMIN_TOKEN") || "552010";
  if (token !== adminToken) {
    return new Response(htmlPage("Unauthorized", "Invalid or missing token.", false), { status: 401, headers: { "Content-Type": "text/html" } });
  }
  if (!id || !["approve", "reject"].includes(action || "")) {
    return new Response(htmlPage("Invalid Request", "Missing or invalid parameters.", false), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: request, error } = await admin
      .from("family_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !request) {
      return new Response(htmlPage("Not Found", "Request does not exist.", false), { status: 404, headers: { "Content-Type": "text/html" } });
    }

    if (request.status !== "pending") {
      return new Response(htmlPage("Already Processed", `This request was already ${request.status}.`, false), { headers: { "Content-Type": "text/html" } });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    await admin.from("family_requests").update({
      status: newStatus,
      reviewed_at: new Date().toISOString(),
    }).eq("id", id);

    if (newStatus === "approved") {
      // Grant family role (avoid duplicate)
      const { data: existing } = await admin
        .from("user_roles")
        .select("id")
        .eq("user_id", request.user_id)
        .eq("role", "family")
        .maybeSingle();

      if (!existing) {
        await admin.from("user_roles").insert({ user_id: request.user_id, role: "family" });
      }
    }

    // Notify user
    await admin.functions.invoke("send-notification-email", {
      body: {
        to: request.user_email,
        name: request.user_name,
        type: newStatus === "approved" ? "family_approved" : "family_rejected",
      },
    });

    return new Response(
      htmlPage(
        newStatus === "approved" ? "✓ Approved" : "✕ Rejected",
        `${request.user_name} has been ${newStatus}. They have been notified by email.`,
        true
      ),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (e: any) {
    return new Response(htmlPage("Error", e.message, false), { status: 500, headers: { "Content-Type": "text/html" } });
  }
});

function htmlPage(title: string, message: string, success: boolean) {
  const color = success ? "#16a34a" : "#dc2626";
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:-apple-system,Segoe UI,Arial,sans-serif;background:linear-gradient(135deg,#fff7ed,#fef3c7);min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0;padding:20px}.card{background:#fff;border-radius:18px;box-shadow:0 10px 40px rgba(0,0,0,.1);padding:40px;max-width:420px;text-align:center}h1{color:${color};margin:0 0 14px}p{color:#444;line-height:1.6;margin:0 0 18px}.t{font-size:48px;margin-bottom:10px}</style></head><body><div class="card"><div class="t">${success ? "🎉" : "⚠️"}</div><h1>${title}</h1><p>${message}</p><p style="font-size:13px;color:#888">Sree Balaji Mandir</p></div></body></html>`;
}
