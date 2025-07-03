
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
  name?: string;
  type: 'signup' | 'service_booking' | 'donation' | 'event_registration' | 'broadcast';
  data?: {
    serviceName?: string;
    servicePrice?: number;
    ticketNumber?: string;
    donationAmount?: number;
    eventName?: string;
    eventDate?: string;
    registrationMembers?: number;
    subject?: string;
    content?: string;
  };
}

const getEmailContent = (type: string, name: string, data: any) => {
  const settingsUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com')}/settings`;
  
  const logoHeader = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275" alt="Sri Balaji Temple" style="max-width: 120px; height: auto;" />
    </div>
  `;
  
  switch (type) {
    case 'broadcast':
      return {
        subject: data.subject || "Important Update from Sri Balaji Temple",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            ${logoHeader}
            <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🕉️ Message from Sri Balaji Temple</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              ${data.content || '<p>Greetings from Sri Balaji Temple!</p>'}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${settingsUrl}" style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Visit Temple Portal
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666;">
              <p>🙏 With divine blessings</p>
              <p style="font-style: italic;">With warm regards,<br><strong>Karthikeya</strong><br>Sri Balaji Temple</p>
            </div>
          </div>
        `
      };
      
    case 'signup':
      return {
        subject: "Welcome to Sri Balaji Temple! 🙏",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            ${logoHeader}
            <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🕉️ Welcome to Sri Balaji Temple!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Dear ${name},</h2>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                Welcome to our spiritual community! We're delighted to have you join the Sri Balaji Temple family.
              </p>
              
              <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">What you can do now:</h3>
                <ul style="color: #555; line-height: 1.8;">
                  <li>📅 Register for upcoming events and festivals</li>
                  <li>🛕 Book temple services and pujas</li>
                  <li>💝 Make donations for various causes</li>
                  <li>📸 Browse our gallery of temple moments</li>
                  <li>📱 Chat with our AI assistant Sribot for guidance</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${settingsUrl}" style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Visit Your Dashboard
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666;">
              <p>🙏 Thank you for joining our spiritual journey</p>
              <p style="font-style: italic;">With warm regards,<br><strong>Karthikeya</strong><br>Sri Balaji Temple</p>
            </div>
          </div>
        `
      };
      
    case 'service_booking':
      return {
        subject: `Service Booked Successfully - ${data.serviceName} 🛕`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            ${logoHeader}
            <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🛕 Service Booking Confirmed!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Dear ${name},</h2>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                Your service booking has been confirmed successfully. May this sacred service bring peace and blessings to your life.
              </p>
              
              <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">Booking Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Service:</td>
                    <td style="padding: 8px 0; color: #333;">${data.serviceName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                    <td style="padding: 8px 0; color: #333;">₹${data.servicePrice?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Ticket Number:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold;">${data.ticketNumber}</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${settingsUrl}" style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  View Your Invoice
                </a>
              </div>
              
              <p style="color: #555; line-height: 1.6; font-size: 14px; font-style: italic;">
                Please save your ticket number for future reference. You can always check your booking details in your settings.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666;">
              <p>🙏 Thank you for your devotion and support</p>
              <p style="font-style: italic;">With divine blessings,<br><strong>Karthikeya</strong><br>Sri Balaji Temple</p>
            </div>
          </div>
        `
      };
      
    case 'donation':
      return {
        subject: `Donation Received - Thank You for Your Generosity 💝`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            ${logoHeader}
            <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">💝 Donation Received!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Dear ${name},</h2>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                Your generous donation has been received with immense gratitude. Your contribution helps us serve the community and maintain our sacred traditions.
              </p>
              
              <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">Donation Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold; font-size: 18px;">₹${data.donationAmount?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                    <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="color: #2e7d32; font-weight: bold; margin: 0; font-size: 16px;">
                  "The best charity is that given in Ramadan. The hand that gives is better than the hand that receives."
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${settingsUrl}" style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  View Your Receipt
                </a>
              </div>
              
              <p style="color: #555; line-height: 1.6; font-size: 14px; font-style: italic;">
                Your donation receipt is available in your settings for tax purposes.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666;">
              <p>🙏 Your generosity makes a difference</p>
              <p style="font-style: italic;">With heartfelt gratitude,<br><strong>Karthikeya</strong><br>Sri Balaji Temple</p>
            </div>
          </div>
        `
      };
      
    case 'event_registration':
      return {
        subject: `Event Registration Confirmed - ${data.eventName} 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            ${logoHeader}
            <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">🎉 Event Registration Confirmed!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Dear ${name},</h2>
              
              <p style="color: #555; line-height: 1.6; font-size: 16px;">
                We're excited to confirm your registration for our upcoming event. We look forward to celebrating this sacred occasion with you and your family.
              </p>
              
              <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">Event Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Event:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold;">${data.eventName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                    <td style="padding: 8px 0; color: #333;">${data.eventDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Members:</td>
                    <td style="padding: 8px 0; color: #333;">${data.registrationMembers}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="color: #1565c0; font-weight: bold; margin: 0;">
                  📧 Event reminders and updates will be sent to your email
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${settingsUrl}" style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  View Registration Details
                </a>
              </div>
              
              <p style="color: #555; line-height: 1.6; font-size: 14px; font-style: italic;">
                Please arrive 15 minutes before the event start time. Bring this email confirmation for easy check-in.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666;">
              <p>🙏 We're blessed to have you join our celebration</p>
              <p style="font-style: italic;">With joy and anticipation,<br><strong>Karthikeya</strong><br>Sri Balaji Temple</p>
            </div>
          </div>
        `
      };
      
    default:
      return {
        subject: "Sri Balaji Temple Notification",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">${logoHeader}<p>Dear ${name},<br><br>Thank you for being part of our temple community.<br><br>With regards,<br>Karthikeya<br>Sri Balaji Temple</p></div>`
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, type, data }: EmailRequest = await req.json();

    const emailContent = getEmailContent(type, name || 'Devotee', data);

    // Handle multiple recipients for broadcast emails
    const recipients = Array.isArray(to) ? to : [to];

    const emailResponse = await resend.emails.send({
      from: "Sri Balaji Temple <onboarding@resend.dev>",
      to: recipients,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`Email sent successfully to ${recipients.length} recipient(s) for ${type}:`, emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
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
