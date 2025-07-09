
-- Create subscriptions table to track user subscription information
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  plan_type TEXT NOT NULL,
  interval TEXT NOT NULL DEFAULT 'month',
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  customer_email TEXT,
  customer_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Create policy for edge functions to insert subscriptions
CREATE POLICY "Edge functions can insert subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for edge functions to update subscriptions
CREATE POLICY "Edge functions can update subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (true);
