
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { getAllUsers, userIds } = await req.json();
    
    let emails: string[] = [];

    if (getAllUsers) {
      // Get all users
      const { data: users, error } = await supabaseClient.auth.admin.listUsers();
      if (error) throw error;
      
      emails = users.users.map(user => user.email).filter(Boolean);
    } else if (userIds && userIds.length > 0) {
      // Get specific users by IDs
      const { data: users, error } = await supabaseClient.auth.admin.listUsers();
      if (error) throw error;
      
      emails = users.users
        .filter(user => userIds.includes(user.id))
        .map(user => user.email)
        .filter(Boolean);
    }

    return new Response(
      JSON.stringify({ emails }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error getting user emails:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
