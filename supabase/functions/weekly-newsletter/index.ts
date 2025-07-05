import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting weekly newsletter send...');

    // Get all active newsletter subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      throw subscribersError;
    }

    console.log(`Found ${subscribers?.length || 0} active subscribers`);

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No active subscribers found',
        sent: 0 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get upcoming events for newsletter content
    const { data: upcomingEvents } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(3);

    // Get recent gallery items
    const { data: recentGallery } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    // Generate newsletter content
    const newsletterContent = generateNewsletterContent(upcomingEvents || [], recentGallery || []);

    // Send newsletter to all subscribers
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: "Sri Balaji Temple <onboarding@resend.dev>",
        to: subscriber.email,
        subject: "🙏 Weekly Blessings from Sri Balaji Temple",
        html: newsletterContent,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const failureCount = results.filter(result => result.status === 'rejected').length;

    console.log(`Newsletter sent: ${successCount} successful, ${failureCount} failed`);

    return new Response(JSON.stringify({
      message: 'Weekly newsletter sent successfully',
      sent: successCount,
      failed: failureCount,
      total: subscribers.length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error sending weekly newsletter:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateNewsletterContent(events: any[], gallery: any[]): string {
  const logoUrl = "/lovable-uploads/7b3b360d-af81-4d6e-a115-8e6e878163a7.png";
  const currentWeek = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const eventsHtml = events.length > 0 ? events.map(event => `
    <div style="background: #fef7cd; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ff6b35;">
      <h4 style="color: #ff6b35; margin: 0 0 5px 0;">${event.name}</h4>
      <p style="margin: 0; color: #333; font-size: 14px;">
        📅 ${new Date(event.date).toLocaleDateString('en-IN')} at ${event.time}<br>
        📍 ${event.location}
      </p>
      ${event.description ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">${event.description}</p>` : ''}
    </div>
  `).join('') : '<p style="color: #666; font-style: italic;">No upcoming events scheduled.</p>';

  const galleryHtml = gallery.length > 0 ? gallery.map(item => `
    <div style="display: inline-block; margin: 5px; text-align: center;">
      <img src="${item.image_url}" alt="${item.title}" style="width: 150px; height: 100px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${item.title}</p>
    </div>
  `).join('') : '<p style="color: #666; font-style: italic;">No recent photos available.</p>';

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fff5f5 0%, #fef7cd 100%);">
      <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <img src="${logoUrl}" alt="Sri Balaji Temple" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🙏 Weekly Temple Newsletter</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Week of ${currentWeek}</p>
      </div>
      <div style="padding: 40px 30px; background: white;">
        <h2 style="color: #ff6b35; margin-bottom: 20px;">🕉️ Namaste Dear Devotee!</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
          May this week bring you divine blessings, inner peace, and spiritual growth. Here's what's happening at Sri Balaji Temple:
        </p>

        <div style="margin: 30px 0;">
          <h3 style="color: #ff6b35; margin-bottom: 15px; border-bottom: 2px solid #ff6b35; padding-bottom: 5px;">🎪 Upcoming Events</h3>
          ${eventsHtml}
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #ff6b35; margin-bottom: 15px; border-bottom: 2px solid #ff6b35; padding-bottom: 5px;">📸 Recent Temple Moments</h3>
          <div style="text-align: center;">
            ${galleryHtml}
          </div>
        </div>

        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #2d5a2d; margin-top: 0;">📿 Weekly Spiritual Thought</h3>
          <p style="color: #2d5a2d; margin: 0; font-style: italic; font-size: 16px;">
            "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज"<br>
            <small>"Abandon all varieties of dharma and just surrender unto Me alone" - Bhagavad Gita</small>
          </p>
        </div>

        <div style="background: #fef7cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff6b35;">
          <h3 style="color: #ff6b35; margin-top: 0;">🛕 Ways to Connect</h3>
          <ul style="color: #333; line-height: 1.8; margin: 0;">
            <li>📱 Chat with Sribot for spiritual guidance</li>
            <li>🎪 Register for upcoming events</li>
            <li>💝 Make donations to support temple activities</li>
            <li>📸 Visit our gallery for divine darshan</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://sree-balaji-mandir.lovable.app/" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
            🏛️ Visit Temple Website
          </a>
        </div>

        <p style="color: #666; font-style: italic; text-align: center; margin-top: 30px;">
          "ॐ शान्ति शान्ति शान्तिः" - Om Peace Peace Peace 🕉️
        </p>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="margin: 0;">🕉️ Sri Balaji Temple | Divine Blessings Always With You 🙏</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">
          <a href="https://sree-balaji-mandir.lovable.app/" style="color: #ccc; text-decoration: underline;">Unsubscribe</a> | 
          <a href="https://sree-balaji-mandir.lovable.app/" style="color: #ccc; text-decoration: underline;">Update Preferences</a>
        </p>
      </div>
    </div>
  `;
}

serve(handler);