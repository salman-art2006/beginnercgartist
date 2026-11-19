
-- Tutorials table
CREATE TABLE public.tutorials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Blender',
  difficulty text NOT NULL DEFAULT 'Beginner',
  duration_minutes integer NOT NULL DEFAULT 15,
  thumbnail text NOT NULL DEFAULT '/placeholder.svg',
  tags text[] NOT NULL DEFAULT '{}',
  video_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tutorials" ON public.tutorials FOR SELECT TO public USING (true);
CREATE POLICY "Only service role can insert tutorials" ON public.tutorials FOR INSERT TO public WITH CHECK (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);
CREATE POLICY "Only service role can update tutorials" ON public.tutorials FOR UPDATE TO public USING (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);

CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON public.tutorials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Resources library table
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Textures',
  file_type text NOT NULL DEFAULT '.blend',
  file_size text,
  thumbnail text NOT NULL DEFAULT '/placeholder.svg',
  download_count integer NOT NULL DEFAULT 0,
  is_premium boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read resources" ON public.resources FOR SELECT TO public USING (true);
CREATE POLICY "Only service role can manage resources" ON public.resources FOR INSERT TO public WITH CHECK (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);

-- Download tracking table
CREATE TABLE public.download_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id uuid REFERENCES public.subscribers(id) ON DELETE SET NULL,
  resource_id text NOT NULL,
  resource_type text NOT NULL DEFAULT 'portfolio',
  downloaded_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can read download logs" ON public.download_logs FOR SELECT TO public USING (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);
CREATE POLICY "Service role can insert download logs" ON public.download_logs FOR INSERT TO public WITH CHECK (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);
