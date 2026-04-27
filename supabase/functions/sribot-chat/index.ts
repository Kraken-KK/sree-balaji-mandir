import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'en' } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Fetch live temple data
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [eventsRes, servicesRes, galleryRes] = await Promise.all([
      supabase.from('events').select('*').order('date', { ascending: true }).limit(15),
      supabase.from('services').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('gallery').select('title, category').limit(10),
    ]);

    const events = eventsRes.data || [];
    const services = servicesRes.data || [];
    const gallery = galleryRes.data || [];

    const liveContext = `
LIVE TEMPLE DATA (use these specifics in answers):

EVENTS (${events.length}):
${events.map((e: any) => `• ${e.name} — ${e.date} at ${e.time}, ${e.location}${e.description ? ` — ${e.description}` : ''}`).join('\n') || '• None scheduled'}

SERVICES (${services.length}):
${services.map((s: any) => `• ${s.name} — ₹${s.price}${s.duration ? ` (${s.duration})` : ''}${s.description ? ` — ${s.description}` : ''}`).join('\n') || '• None available'}

GALLERY HIGHLIGHTS:
${gallery.map((g: any) => `• ${g.title}${g.category ? ` [${g.category}]` : ''}`).join('\n') || '• None'}
`;

    const languageMap: Record<string, string> = {
      en: "Respond in English with occasional Sanskrit mantras",
      hi: "हिंदी में उत्तर दें",
      te: "తెలుగులో సమాధానం ఇవ్వండి",
      ta: "தமிழில் பதிலளிக்கவும்",
      kn: "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ",
    };

    const systemPrompt = `You are Sribot — the agentic AI concierge for Sree Balaji Mandir. You are knowledgeable, devotional, proactive, and action-oriented. Use 🙏 and tasteful emojis.

${languageMap[language] || languageMap.en}

${liveContext}

AGENTIC BEHAVIOR (very important):
- Be PROACTIVE: when a user expresses intent (e.g. "I want to do an abhishekam", "I'd like to donate"), don't just describe — guide them with concrete next steps and a markdown link to the right page.
- Always recommend the most relevant next action at the end of every reply, formatted as a markdown link:
  • Booking a service → [Book this service →](/services)
  • Registering for an event → [Register for the event →](/events)
  • Donating → [Make a donation →](/donations)
  • Viewing photos → [View gallery →](/gallery)
  • Viewing past tickets → [Your tickets →](/history)
  • Contacting temple → [Contact us →](/contact)
- When asked about pricing, ALWAYS quote the exact ₹ amount from the live data.
- When asked about an event, ALWAYS include date, time, location AND suggest related services if any exist.
- If the user seems unsure, offer 2-3 clear options as a bullet list with deep links.
- For multi-step tasks (e.g. "register me for Diwali and book an abhishekam"), break it into a numbered checklist with links per step.
- Be concise (under ~120 words usually), warm, and devotional. Use **bold** for key facts.
- NEVER invent prices, dates, or services not in the live data above.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('sribot-chat error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      response: "🙏 Technical difficulty. Please try again."
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
