import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FROM = "Sree Balaji Mandir <noreply@mail.tatthva.tech>";
const SITE = "https://sree-balaji-mandir.lovable.app";
const TEMPLE_ADDRESS = "Behind Kavadiguda petrol pump";
const TEMPLE_PHONE = "+91 7780132988";
const TEMPLE_EMAIL = "karthikeya.ramarapu@icloud.com";
const LOGO = "https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275";

interface EmailRequest {
  to: string | string[];
  name: string;
  type:
    | 'signup'
    | 'service_booking'
    | 'service_thankyou'
    | 'service_cancelled'
    | 'event_registration'
    | 'event_thankyou'
    | 'donation_receipt'
    | 'donation_thankyou'
    | 'broadcast'
    | 'promotional'
    | 'contact_form'
    | 'newsletter_signup'
    | 'newsletter'
    | 'family_request_admin'
    | 'family_approved'
    | 'family_rejected';
  data?: any;
}

const wrap = (title: string, name: string, body: string, cta?: { label: string; url: string }) => `
<div style="max-width:600px;margin:0 auto;font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#ff6b35 0%,#f7931e 100%);padding:30px;text-align:center">
    <img src="${LOGO}" alt="Sree Balaji Mandir" style="width:72px;height:72px;border-radius:50%;background:#fff;padding:8px;margin-bottom:14px"/>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:600">${title}</h1>
  </div>
  <div style="padding:32px 28px;color:#333;line-height:1.6;font-size:15px">
    <p style="margin:0 0 16px;font-size:17px"><strong>🙏 Namaste ${name}!</strong></p>
    ${body}
    ${cta ? `<div style="text-align:center;margin:28px 0 8px"><a href="${cta.url}" style="background:linear-gradient(135deg,#ff6b35,#f7931e);color:#fff;padding:13px 28px;text-decoration:none;border-radius:24px;display:inline-block;font-weight:600">${cta.label}</a></div>` : ''}
    <p style="color:#888;font-style:italic;text-align:center;margin-top:28px;font-size:13px">"सर्वे भवन्तु सुखिनः" — May all be blessed 🕉️</p>
  </div>
  <div style="background:#1a1a1a;color:#ddd;padding:20px;text-align:center;font-size:12px">
    <p style="margin:0 0 6px"><strong>Sree Balaji Mandir</strong></p>
    <p style="margin:2px 0">📍 ${TEMPLE_ADDRESS}</p>
    <p style="margin:2px 0">📞 ${TEMPLE_PHONE} · ✉️ ${TEMPLE_EMAIL}</p>
  </div>
</div>`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { to, name, type, data }: EmailRequest = await req.json();
    console.log('Email request:', { to, type });

    let subject = '';
    let html = '';

    switch (type) {
      case 'signup':
        subject = '🙏 Welcome to Sree Balaji Mandir';
        html = wrap('Welcome to our Divine Family', name,
          `<p>We are blessed to have you join our spiritual community. Your devotional journey begins here.</p>
           <ul style="background:#fff7ed;padding:16px 20px;border-radius:10px;border-left:3px solid #ff6b35">
             <li>Book sacred pujas & services</li>
             <li>Register for festivals & events</li>
             <li>Make donations with tax benefits</li>
             <li>Chat with Sribot for guidance</li>
           </ul>`,
          { label: 'Visit Temple', url: SITE });
        break;

      case 'service_booking':
        subject = `🛕 Booking Confirmed — ${data?.serviceName}`;
        html = wrap('Service Booking Confirmed', name,
          `<p>Your sacred service has been booked. Divine blessings await.</p>
           <div style="background:#fff7ed;padding:18px;border-radius:10px;margin:16px 0">
             <p style="margin:4px 0"><strong>Service:</strong> ${data?.serviceName}</p>
             <p style="margin:4px 0"><strong>Amount:</strong> ₹${Number(data?.servicePrice||0).toLocaleString('en-IN')}</p>
             <p style="margin:4px 0"><strong>Ticket:</strong> <code>${data?.ticketNumber}</code></p>
             <p style="margin:4px 0"><strong>Date:</strong> ${data?.serviceDate || 'TBD'}</p>
           </div>
           <p style="background:#ecfdf5;color:#065f46;padding:12px;border-radius:8px;text-align:center"><strong>Save your ticket number for reference</strong></p>`,
          { label: 'View My Tickets', url: `${SITE}/history` });
        break;

      case 'service_thankyou':
        subject = `🙏 Thank you, ${name} — Service Completed`;
        html = wrap('Thank You for Visiting', name,
          `<p>Thank you for participating in <strong>${data?.serviceName}</strong>. May the Lord's blessings remain with you and your family always.</p>
           <p>We would love to hear from you — your feedback helps us serve devotees better.</p>`,
          { label: 'Share Feedback', url: `${SITE}/contact` });
        break;

      case 'service_cancelled':
        subject = `Service Cancellation — ${data?.serviceName}`;
        html = wrap('Cancellation Confirmed', name,
          `<p>Your booking for <strong>${data?.serviceName}</strong> (Ticket: <code>${data?.ticketNumber}</code>) has been cancelled.</p>
           <div style="background:#fff7ed;padding:16px;border-radius:10px;margin:14px 0">
             <p style="margin:4px 0"><strong>Refund Status:</strong> ${data?.refundStatus || 'Processing'}</p>
             <p style="margin:4px 0"><strong>Refund Amount:</strong> ₹${Number(data?.refundAmount||0).toLocaleString('en-IN')}</p>
             ${data?.reason ? `<p style="margin:4px 0"><strong>Reason:</strong> ${data.reason}</p>` : ''}
           </div>
           <p>Refunds typically appear in 5–7 business days.</p>`);
        break;

      case 'event_registration':
        subject = `🎊 Registered — ${data?.eventName}`;
        html = wrap('Event Registration Confirmed', name,
          `<p>You're successfully registered. We can't wait to celebrate with you!</p>
           <div style="background:#fff7ed;padding:18px;border-radius:10px;margin:14px 0">
             <p style="margin:4px 0"><strong>Event:</strong> ${data?.eventName}</p>
             <p style="margin:4px 0"><strong>Date:</strong> ${data?.eventDate}</p>
             <p style="margin:4px 0"><strong>Members:</strong> ${data?.registrationMembers}</p>
           </div>`,
          { label: 'View Events', url: `${SITE}/events` });
        break;

      case 'event_thankyou':
        subject = `🙏 Thank you for joining ${data?.eventName}`;
        html = wrap('Thank You for Attending', name,
          `<p>It was a pleasure having you at <strong>${data?.eventName}</strong>. Your presence made the celebration brighter.</p>`,
          { label: 'Upcoming Events', url: `${SITE}/events` });
        break;

      case 'donation_receipt':
        subject = `🙏 Donation Receipt — ₹${Number(data?.donationAmount||0).toLocaleString('en-IN')}`;
        html = wrap('Donation Received', name,
          `<p>Your generous contribution has been received with deep gratitude.</p>
           <div style="background:#fff7ed;padding:18px;border-radius:10px;margin:14px 0">
             <p style="margin:4px 0"><strong>Amount:</strong> ₹${Number(data?.donationAmount||0).toLocaleString('en-IN')}</p>
             <p style="margin:4px 0"><strong>Purpose:</strong> ${data?.purpose || 'General Fund'}</p>
             <p style="margin:4px 0"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
           </div>
           <p style="background:#ecfdf5;color:#065f46;padding:12px;border-radius:8px;text-align:center"><strong>Eligible for 80G tax benefit</strong></p>`);
        break;

      case 'donation_thankyou':
        subject = `🌸 Heartfelt thanks for your kindness, ${name}`;
        html = wrap('Your Generosity Blesses Many', name,
          `<p>Because of devotees like you, we can serve our community — feeding the hungry, maintaining the temple, and celebrating the divine.</p>
           <p>"दानं वै यज्ञः" — Charity itself is worship.</p>`);
        break;

      case 'contact_form':
        subject = `📧 Contact Form — ${data?.customerName}`;
        html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#ff6b35">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${data?.customerName}</p>
          <p><strong>Email:</strong> ${data?.customerEmail}</p>
          <p><strong>Phone:</strong> ${data?.customerPhone || 'N/A'}</p>
          <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-top:14px">
            <strong>Message:</strong><br/>${data?.message}
          </div>
        </div>`;
        break;

      case 'broadcast':
        subject = data?.subject || 'Update from Sree Balaji Mandir';
        html = wrap(data?.subject || 'Temple Update', name, `<div>${data?.content}</div>`, { label: 'Visit Temple', url: SITE });
        break;

      case 'promotional':
        subject = `🎁 ${data?.title || 'Special Offer from Sree Balaji Mandir'}`;
        html = wrap(data?.title || 'A Special Blessing for You', name,
          `<p>${data?.message || 'We have something special prepared just for our devotees.'}</p>
           ${data?.offer ? `<div style="background:linear-gradient(135deg,#fff7ed,#fef3c7);padding:18px;border-radius:10px;text-align:center;margin:16px 0;border:2px dashed #ff6b35"><p style="font-size:20px;font-weight:700;color:#ff6b35;margin:0">${data.offer}</p></div>`:''}
           <p>This offer is exclusive for our temple family.</p>`,
          { label: data?.ctaLabel || 'Explore Now', url: data?.ctaUrl || SITE });
        break;

      case 'newsletter_signup':
        subject = '📧 Welcome to our Newsletter';
        html = wrap('Newsletter Subscription Confirmed', name,
          `<p>Thank you for subscribing! You'll receive:</p>
           <ul style="background:#fff7ed;padding:16px 20px;border-radius:10px;border-left:3px solid #ff6b35">
             <li>Festival announcements & event invites</li>
             <li>Daily mantras & spiritual reflections</li>
             <li>Temple updates and devotee stories</li>
             <li>Exclusive offers and seva opportunities</li>
           </ul>`,
          { label: 'Visit Temple', url: SITE });
        break;

      case 'newsletter':
        subject = data?.subject || '🕉️ Weekly Temple Newsletter';
        html = wrap(data?.title || 'Weekly Temple Update', name,
          `<div>${data?.content || 'Latest temple news, events and spiritual reflections inside.'}</div>`,
          { label: 'Read More', url: SITE });
        break;

      case 'family_request_admin':
        subject = `👨‍👩‍👧 Family Access Request from ${data?.applicantName}`;
        html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff">
          <div style="background:linear-gradient(135deg,#ff6b35,#f7931e);padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0">Family Access Request</h1>
          </div>
          <div style="padding:28px;background:#fff;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px">
            <p><strong>${data?.applicantName}</strong> has applied for Family access.</p>
            <div style="background:#f9fafb;padding:14px;border-radius:8px;margin:14px 0">
              <p style="margin:4px 0"><strong>Name:</strong> ${data?.applicantName}</p>
              <p style="margin:4px 0"><strong>Email:</strong> ${data?.applicantEmail}</p>
              <p style="margin:4px 0"><strong>Request ID:</strong> <code>${data?.requestId}</code></p>
            </div>
            <p>Click below to review and decide:</p>
            <div style="text-align:center;margin:24px 0;display:flex;gap:12px;justify-content:center">
              <a href="${data?.approveUrl}" style="background:#16a34a;color:#fff;padding:13px 28px;text-decoration:none;border-radius:24px;display:inline-block;font-weight:600;margin:4px">✓ Approve</a>
              <a href="${data?.rejectUrl}" style="background:#dc2626;color:#fff;padding:13px 28px;text-decoration:none;border-radius:24px;display:inline-block;font-weight:600;margin:4px">✕ Reject</a>
            </div>
            <p style="color:#666;font-size:13px;text-align:center">Or manage in the <a href="${SITE}/admin">Admin Dashboard</a></p>
          </div>
        </div>`;
        break;

      case 'family_approved':
        subject = '🎉 Welcome to the Temple Family!';
        html = wrap('You are now part of our Family', name,
          `<p>We are delighted to welcome you as a <strong>Family</strong> member of Sree Balaji Mandir.</p>
           <div style="background:linear-gradient(135deg,#fff7ed,#fef3c7);padding:18px;border-radius:10px;margin:16px 0;border:2px solid #ff6b35">
             <p style="margin:0;font-weight:600;color:#ff6b35">✨ Your Family Benefits:</p>
             <ul style="margin:10px 0 0">
               <li><strong>20% discount</strong> on all temple services</li>
               <li>Special Family badge on your profile</li>
               <li>Priority access to events</li>
             </ul>
           </div>
           <p>Open the app to see your new status reflected.</p>`,
          { label: 'View My Profile', url: `${SITE}/settings` });
        break;

      case 'family_rejected':
        subject = 'Family Access Application Update';
        html = wrap('Application Update', name,
          `<p>Thank you for your interest in becoming a Family member of Sree Balaji Mandir.</p>
           <p>After review, we are unable to approve your application at this time. You remain a valued member of our community and we welcome you to continue participating in temple activities.</p>
           <p>If you have questions, please contact us at ${TEMPLE_EMAIL}.</p>`);
        break;

      default:
        subject = 'Sree Balaji Mandir';
        html = wrap('Update', name, '<p>Thank you for being part of our community.</p>');
    }

    const recipients = Array.isArray(to) ? to : [to];
    const result = await resend.emails.send({
      from: FROM,
      to: recipients,
      subject,
      html,
    });

    console.log('Resend result:', result);
    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
