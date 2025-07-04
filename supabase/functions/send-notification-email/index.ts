
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  name: string;
  type: 'signup' | 'service_booking' | 'event_registration' | 'donation_receipt' | 'broadcast' | 'contact_form';
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, type, data }: EmailRequest = await req.json();
    
    console.log('Email request received:', { to, name, type, data });
    
    let subject = '';
    let htmlContent = '';
    
    const logoUrl = "/lovable-uploads/7b3b360d-af81-4d6e-a115-8e6e878163a7.png";

    switch (type) {
      case 'signup':
        subject = '🙏 Welcome to Sri Balaji Temple Community!';
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fff5f5 0%, #fef7cd 100%);">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${logoUrl}" alt="Sri Balaji Temple" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🙏 Welcome to Our Divine Community!</h1>
            </div>
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #ff6b35; margin-bottom: 20px;">Namaste ${name}! 🕉️</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                Welcome to Sri Balaji Temple! We're blessed to have you join our spiritual community. 
                Your journey of devotion and enlightenment begins here.
              </p>
              <div style="background: #fef7cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">✨ What you can do now:</h3>
                <ul style="color: #333; line-height: 1.8;">
                  <li>🎪 Register for upcoming festivals and events</li>
                  <li>🛕 Book special pujas and temple services</li>
                  <li>💝 Make donations to support temple activities</li>
                  <li>📸 Explore our beautiful temple gallery</li>
                  <li>🤖 Chat with Sribot for spiritual guidance</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sree-balaji-mandir.lovable.app/" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
                  🏛️ Visit Temple Website
                </a>
              </div>
              <p style="color: #666; font-style: italic; text-align: center; margin-top: 30px;">
                "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"<br>
                <small>May all beings be happy, may all beings be free from illness</small>
              </p>
            </div>
            <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0;">🕉️ Sri Balaji Temple | Divine Blessings Always With You 🙏</p>
            </div>
          </div>
        `;
        break;

      case 'service_booking':
        subject = `🎪 Service Booking Confirmation - ${data?.serviceName || 'Temple Service'}`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fff5f5 0%, #fef7cd 100%);">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${logoUrl}" alt="Sri Balaji Temple" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 26px;">🛕 Service Booking Confirmed!</h1>
            </div>
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #ff6b35; margin-bottom: 20px;">🙏 Namaste ${name}!</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
                Your temple service has been successfully booked! The divine blessings await you.
              </p>
              <div style="background: #fef7cd; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">📋 Booking Details:</h3>
                <ul style="color: #333; line-height: 1.8; list-style: none; padding: 0;">
                  <li><strong>🛕 Service:</strong> ${data?.serviceName || 'Temple Service'}</li>
                  <li><strong>💰 Amount:</strong> ₹${data?.servicePrice?.toLocaleString() || '0'}</li>
                  <li><strong>🎫 Ticket Number:</strong> ${data?.ticketNumber || 'N/A'}</li>
                  <li><strong>📅 Service Date:</strong> ${data?.serviceDate || 'To be confirmed'}</li>
                </ul>
              </div>
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #2d5a2d; margin: 0; font-weight: bold; text-align: center;">
                  🎫 Please save your ticket number for reference
                </p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sree-balaji-mandir.lovable.app/" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  🏛️ Visit Temple Website
                </a>
              </div>
              <p style="color: #666; font-style: italic; text-align: center; margin-top: 30px;">
                "हरि ॐ तत्सत्" - May Lord's blessings be with you always 🙏
              </p>
            </div>
            <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0;">🕉️ Sri Balaji Temple | Your Spiritual Journey Continues 🙏</p>
            </div>
          </div>
        `;
        break;

      case 'donation_receipt':
        subject = `🙏 Thank You for Your Donation - Sri Balaji Temple`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fff5f5 0%, #fef7cd 100%);">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${logoUrl}" alt="Sri Balaji Temple" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 26px;">🙏 Thank You for Your Donation!</h1>
            </div>
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #ff6b35; margin-bottom: 20px;">🙏 Namaste ${name}!</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
                Your generous donation has been received with gratitude. May the divine bless you abundantly.
              </p>
              <div style="background: #fef7cd; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">💝 Donation Details:</h3>
                <ul style="color: #333; line-height: 1.8; list-style: none; padding: 0;">
                  <li><strong>💰 Amount:</strong> ₹${data?.donationAmount?.toLocaleString() || '0'}</li>
                  <li><strong>📅 Date:</strong> ${new Date().toLocaleDateString('en-IN')}</li>
                  <li><strong>🎯 Purpose:</strong> ${data?.purpose || 'General Temple Fund'}</li>
                </ul>
              </div>
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #2d5a2d; margin: 0; font-weight: bold; text-align: center;">
                  📄 This donation is eligible for 80G tax benefits
                </p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sree-balaji-mandir.lovable.app/" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  🏛️ Visit Temple Website
                </a>
              </div>
              <p style="color: #666; font-style: italic; text-align: center; margin-top: 30px;">
                "दानं वै यज्ञः" - Charity itself is worship 🙏
              </p>
            </div>
            <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0;">🕉️ Sri Balaji Temple | Your Generosity Blesses All 🙏</p>
            </div>
          </div>
        `;
        break;

      case 'event_registration':
        subject = `🎊 Event Registration Confirmed - ${data.eventName}`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fff5f5 0%, #fef7cd 100%);">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${logoUrl}" alt="Sri Balaji Temple" style="width: 80px; height: 80px; border-radius: 50%; background: white; padding: 10px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 26px;">🎉 Event Registration Successful!</h1>
            </div>
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #ff6b35; margin-bottom: 20px;">🙏 Namaste ${name}!</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
                You have successfully registered for our upcoming temple event! We're excited to celebrate with you.
              </p>
              <div style="background: #fef7cd; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">🎪 Event Details:</h3>
                <ul style="color: #333; line-height: 1.8; list-style: none; padding: 0;">
                  <li><strong>🎊 Event:</strong> ${data.eventName}</li>
                  <li><strong>📅 Date:</strong> ${data.eventDate}</li>
                  <li><strong>👥 Members:</strong> ${data.registrationMembers}</li>
                </ul>
              </div>
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #2d5a2d; margin: 0; font-weight: bold; text-align: center;">
                  📧 You will receive event updates and reminders via email
                </p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://sree-balaji-mandir.lovable.app/events" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  🎪 View All Events
                </a>
              </div>
              <p style="color: #666; font-style: italic; text-align: center; margin-top: 30px;">
                "सत्यं शिवं सुन्दरम्" - Truth, Goodness, Beauty 🕉️
              </p>
            </div>
            <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0;">🕉️ Sri Balaji Temple | Celebrating Divine Moments Together 🙏</p>
            </div>
          </div>
        `;
        break;

      case 'contact_form':
        subject = `📧 New Contact Form Submission from ${data.customerName}`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fff5f5 0%, #fef7cd 100%);">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${logoUrl}" alt="Sri Balaji Temple" style="width: 80px; height: 80px; border-radius: 50%; background: white; padding: 10px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 26px;">📧 New Contact Form Submission</h1>
            </div>
            <div style="padding: 40px 30px; background: white;">
              <h2 style="color: #ff6b35; margin-bottom: 20px;">Contact Details:</h2>
              <div style="background: #fef7cd; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ff6b35;">
                <ul style="color: #333; line-height: 1.8; list-style: none; padding: 0;">
                  <li><strong>👤 Name:</strong> ${data.customerName}</li>
                  <li><strong>📧 Email:</strong> ${data.customerEmail}</li>
                  <li><strong>📱 Phone:</strong> ${data.customerPhone || 'Not provided'}</li>
                </ul>
              </div>
              <div style="background: #f0f8ff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4a90e2;">
                <h3 style="color: #4a90e2; margin-top: 0;">💬 Message:</h3>
                <p style="color: #333; line-height: 1.6; margin: 0;">${data.message}</p>
              </div>
              <div style="background: #fff2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #d32f2f; margin: 0; font-weight: bold; text-align: center;">
                  📞 Please respond to this inquiry promptly
                </p>
              </div>
            </div>
            <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0;">🕉️ Sri Balaji Temple Admin Dashboard</p>
            </div>
          </div>
        `;
        break;

      case 'broadcast':
        subject = data.subject;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #fff5f5 0%, #fef7cd 100%);">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <img src="${logoUrl}" alt="Sri Balaji Temple" style="width: 80px; height: 80px; border-radius: 50%; background: white; padding: 10px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 26px;">🏛️ Sri Balaji Temple</h1>
            </div>
            <div style="padding: 40px 30px; background: white;">
              ${data.content}
            </div>
            <div style="background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0;">🕉️ Sri Balaji Temple | Divine Blessings Always With You 🙏</p>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    const recipients = Array.isArray(to) ? to : [to];
    
    console.log('Sending email to:', recipients, 'with subject:', subject);
    
    const emailResponse = await resend.emails.send({
      from: "Sri Balaji Temple <onboarding@resend.dev>",
      to: recipients,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
