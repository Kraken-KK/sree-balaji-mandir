
CREATE TABLE public.event_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(event_id, service_id)
);

ALTER TABLE public.event_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event services viewable by everyone" ON public.event_services
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage event services" ON public.event_services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
