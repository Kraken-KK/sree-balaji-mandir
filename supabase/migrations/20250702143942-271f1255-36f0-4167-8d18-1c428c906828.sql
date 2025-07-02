
-- Create admin functions to bypass RLS policies for admin dashboard

-- Function to get all tickets for admin
CREATE OR REPLACE FUNCTION public.get_all_tickets_admin()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  service_id uuid,
  payment_id uuid,
  booking_date timestamp with time zone,
  service_date date,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  customer_name text,
  ticket_number text,
  customer_email text,
  status text,
  qr_code text,
  services json
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.user_id,
    t.service_id,
    t.payment_id,
    t.booking_date,
    t.service_date,
    t.created_at,
    t.updated_at,
    t.customer_name,
    t.ticket_number,
    t.customer_email,
    t.status,
    t.qr_code,
    row_to_json(s.*) as services
  FROM public.tickets t
  LEFT JOIN public.services s ON t.service_id = s.id
  ORDER BY t.created_at DESC;
END;
$$;

-- Function to get all users for admin
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  full_name text,
  username text,
  bio text,
  phone text,
  location text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.user_id,
    up.created_at,
    up.updated_at,
    up.full_name,
    up.username,
    up.bio,
    up.phone,
    up.location
  FROM public.user_profiles up
  ORDER BY up.created_at DESC;
END;
$$;

-- Grant execute permissions on these functions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_tickets_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_admin() TO authenticated;
