import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const templeKnowledge = `
Sri Balaji Temple - Complete Information Database:

TEMPLE OVERVIEW:
- Sacred Hindu temple dedicated to Lord Venkateswara (Balaji)
- Modern digital platform for temple services and community engagement

UPCOMING EVENTS & FESTIVALS:
- Diwali Celebration - Grand festival with lights, prayers, and community feast
- Weekly Aarti: Every Tuesday and Friday at 7:00 PM
- Monthly Abhishek: First Sunday of every month at 6:00 AM
- Navratri Festival - 9 days of divine celebration
- Annual Brahmotsavam - Grand temple festival

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

3. Special Services:
   - Private darshan: ₹501
   - Prasadam delivery: ₹201
   - Birthday/Anniversary prayers: ₹301

DONATION INFORMATION:
- Online donations accepted through secure payment gateway
- Popular amounts: ₹51, ₹101, ₹501, ₹1001
- Annadanam (free food) sponsorship: ₹2,501
- All donations provide tax receipts (80G eligible)

DIGITAL PLATFORM FEATURES:
1. Event Booking: Reserve spots for festivals and ceremonies
2. Service Scheduling: Book specific pooja and rituals
3. Donation Portal: Secure online giving platform
4. Gallery Access: View temple photos and videos
5. QR Code Services: Quick access to temple information

CONTACT INFORMATION:
- Website: Sri Balaji Temple Digital Platform
- Email: info@sribalajiTemple.org
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, language = 'en' } = await req.json();

    const languageInstructions: Record<string, string> = {
      en: "Respond in English with occasional Sanskrit mantras and temple terminology",
      hi: "हिंदी में उत्तर दें और संस्कृत मंत्रों का उपयोग करें",
      te: "తెలుగులో సమాధానం ఇవ్వండి మరియు సంస్కృత మంత్రాలను ఉపయోగించండి",
      ta: "தமிழில் பதிலளிக்கவும் மற்றும் சமஸ்கிருத மந்திரங்களைப் பயன்படுத்தவும்",
      kn: "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ ಮತ್ತು ಸಂಸ್ಕೃತ ಮಂತ್ರಗಳನ್ನು ಬಳಸಿ",
    };

    const languageInstruction = languageInstructions[language] || languageInstructions.en;

    const prompt = `You are Sribot, the multilingual AI assistant for Sri Balaji Temple. You are knowledgeable, helpful, and speak with devotion and respect. Always start responses with appropriate greetings like "🙏" or "Namaste".

Language Instructions: ${languageInstruction}

Use this temple knowledge to answer questions:
${templeKnowledge}

User Question: ${message}

Instructions:
- Always be respectful and use appropriate Hindu/temple terminology
- Provide specific costs, dates, and details when available
- Use emojis appropriately (🙏, 🪔, 🌺, ✨, etc.)
- Keep responses helpful but concise
- Always maintain the sacred and devotional tone

Respond as Sribot:`;

    // Use Lovable AI gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content ||
      "🙏 I apologize, but I couldn't process your request at the moment. Please try again.";

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
