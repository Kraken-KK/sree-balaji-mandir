
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const templeKnowledge = `
Sri Balaji Temple - Complete Information Database:

TEMPLE OVERVIEW:
- Sacred Hindu temple dedicated to Lord Venkateswara (Balaji)
- Modern digital platform for temple services and community engagement
- Located with beautiful architecture and spiritual ambiance

UPCOMING EVENTS & FESTIVALS:
- Diwali Celebration: October 24, 2024 - Grand festival with lights, prayers, and community feast
- Weekly Aarti: Every Tuesday and Friday at 7:00 PM
- Monthly Abhishek: First Sunday of every month at 6:00 AM
- Navratri Festival: September dates - 9 days of divine celebration
- Annual Brahmotsavam: December - Grand temple festival
- New Year Prayers: January 1st - Special blessing ceremony
- Krishna Janmashtami: August celebration with special decorations

TEMPLE SERVICES & COSTS:
1. Regular Pooja Services:
   - Daily Aarti: Free for all devotees
   - Special Abhishek: ₹501
   - Archana with flowers: ₹101
   - Satyanarayana Pooja: ₹1,001

2. Wedding & Life Events:
   - Wedding ceremonies: ₹5,001
   - Griha Pravesh: ₹2,001
   - Naming ceremony: ₹1,501
   - Sacred thread ceremony: ₹3,001

3. Special Services:
   - Private darshan: ₹501
   - Prasadam delivery: ₹201
   - Birthday/Anniversary prayers: ₹301
   - Vehicle blessing: ₹501

DONATION INFORMATION:
- Online donations accepted through secure payment gateway
- Minimum donation: ₹11
- Popular amounts: ₹51, ₹101, ₹501, ₹1001
- Annadanam (free food) sponsorship: ₹2,501
- Temple maintenance fund contributions welcome
- All donations provide tax receipts

GALLERY HIGHLIGHTS:
- Beautiful temple architecture photos
- Festival celebration videos
- Daily ritual documentation
- Devotee testimonials and experiences
- Historical temple moments
- Artistic temple decorations

TEMPLE HISTORY:
- Established with divine vision and community dedication
- Rich tradition of Vedic rituals and practices
- Serves thousands of devotees annually
- Maintains ancient traditions with modern accessibility
- Community-centered approach to spiritual growth

DIGITAL PLATFORM FEATURES:
1. Event Booking: Reserve spots for festivals and ceremonies
2. Service Scheduling: Book specific pooja and rituals
3. Donation Portal: Secure online giving platform
4. Gallery Access: View temple photos and videos
5. History Section: Learn about temple heritage
6. User Dashboard: Track your bookings and donations
7. Mobile Responsive: Access from any device
8. QR Code Services: Quick access to temple information

CONTACT INFORMATION:
- Temple Address: [Temple Address, City]
- Phone: +91 98765 43210
- Email: info@sribalajiTemple.org
- Website: Sri Balaji Temple Digital Platform
- Social Media: Active on multiple platforms

TUTORIALS & NAVIGATION:
1. How to Book Events: Go to Events page → Select event → Choose date → Confirm booking
2. Making Donations: Visit Donations page → Choose amount → Select payment method → Complete transaction
3. Viewing Gallery: Click Gallery → Browse by category → Click for full view
4. Reading History: Access History page for complete temple background
5. User Registration: Sign up for personalized experience and booking history
6. Settings: Customize language preferences and notifications

SPECIAL FEATURES:
- Multi-language support
- Dark/Light mode themes
- Mobile-first design
- Offline event information
- Real-time booking availability
- Secure payment processing
- Community forums and updates

COMMUNITY STATISTICS:
- 10,000+ active devotees
- 500+ events hosted annually
- ₹10 Lakh+ in donations received
- 100+ daily visitors to digital platform

ACCESSIBILITY:
- Wheelchair accessible temple premises
- Audio assistance for visually impaired
- Large text options in digital platform
- Multiple payment options for donations
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `You are Sribot, the AI assistant for Sri Balaji Temple. You are knowledgeable, helpful, and speak with devotion and respect. Always start responses with appropriate greetings like "🙏" or "Namaste".

Use this temple knowledge to answer questions:
${templeKnowledge}

User Question: ${message}

Instructions:
- Always be respectful and use appropriate Hindu/temple terminology
- Provide specific costs, dates, and details when available
- If asked about booking or services, guide users to the appropriate page
- Use emojis appropriately (🙏, 🪔, 🌺, ✨, etc.)
- Keep responses helpful but concise
- If you don't know something specific, admit it and suggest contacting the temple directly
- Always maintain the sacred and devotional tone appropriate for a temple assistant

Respond as Sribot:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "🙏 I apologize, but I couldn't process your request at the moment. Please try again or contact the temple directly.";

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sribot-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "🙏 I'm experiencing some technical difficulties. Please try again in a moment or contact our temple directly for assistance."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
