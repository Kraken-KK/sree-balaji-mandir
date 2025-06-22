import { supabase } from '@/integrations/supabase/client';
import { sendMessageToGemini } from './gemini-fallback';

export const sendMessageToSribot = async (message: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('sribot-chat', {
      body: { message }
    });

    if (error) {
      console.error('Supabase function error:', error);
      // Fallback to Gemini direct call
      return await sendMessageToGemini(message);
    }

    return data.response || "🙏 I apologize, but I couldn't process your request at the moment. Please try again.";
  } catch (error) {
    console.error('API call error:', error);
    // Fallback to Gemini direct call
    return await sendMessageToGemini(message);
  }
};
