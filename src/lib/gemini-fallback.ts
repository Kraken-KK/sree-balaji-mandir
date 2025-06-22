// Gemini fallback for Sribot chat
// This file provides a direct Gemini API call if Supabase fails

const GEMINI_API_KEY = (window as any).VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const templeKnowledge = `Sri Balaji Temple - Complete Information Database:
... (shortened for brevity, copy from supabase function) ...`;

export async function sendMessageToGemini(message: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "🙏 Gemini API key not configured. Please contact the temple.";
  }
  const prompt = `You are Sribot, the AI assistant for Sri Balaji Temple. You are knowledgeable, helpful, and speak with devotion and respect. Always start responses with appropriate greetings like \"🙏\" or \"Namaste\".\n\nUse this temple knowledge to answer questions:\n${templeKnowledge}\n\nUser Question: ${message}\n\nInstructions:\n- Always be respectful and use appropriate Hindu/temple terminology\n- Provide specific costs, dates, and details when available\n- If asked about booking or services, guide users to the appropriate page\n- Use emojis appropriately (🙏, 🪔, 🌺, ✨, etc.)\n- Keep responses helpful but concise\n- If you don't know something specific, admit it and suggest contacting the temple directly\n- Always maintain the sacred and devotional tone appropriate for a temple assistant\n\nRespond as Sribot:`;

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }),
  });
  if (!res.ok) {
    return "🙏 I apologize, but I couldn't process your request at the moment. Please try again or contact the temple directly.";
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "🙏 I apologize, but I couldn't process your request at the moment. Please try again.";
}
