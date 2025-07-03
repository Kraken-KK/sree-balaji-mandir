import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  serviceName?: string;
  servicePrice?: number;
  ticketNumber?: string;
  donationAmount?: number;
  eventName?: string;
  eventDate?: string;
  registrationMembers?: number;
  serviceDate?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  message?: string;
  subject?: string;
  content?: string;
}

export const sendNotificationEmail = async (
  to: string,
  name: string,
  type: 'signup' | 'service_booking' | 'donation' | 'event_registration' | 'broadcast' | 'contact_form',
  data?: EmailData
) => {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        to,
        name,
        type,
        data
      }
    });

    if (error) {
      console.error('Email sending error:', error);
      return false;
    }

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};
