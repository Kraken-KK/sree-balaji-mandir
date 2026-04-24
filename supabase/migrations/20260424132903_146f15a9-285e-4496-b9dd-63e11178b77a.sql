-- Add family role to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'family';

-- Family access requests
CREATE TABLE IF NOT EXISTS public.family_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.family_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own family requests"
ON public.family_requests FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own family request"
ON public.family_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update family requests"
ON public.family_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to grant family role
CREATE POLICY "Admins can insert user roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));