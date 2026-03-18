
CREATE TABLE public.portfolio_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  long_description text NOT NULL DEFAULT '',
  tools text[] NOT NULL DEFAULT '{}',
  software text[] NOT NULL DEFAULT '{}',
  image text NOT NULL DEFAULT '/placeholder.svg',
  gallery_images text[] NOT NULL DEFAULT '{}',
  workflow_steps jsonb NOT NULL DEFAULT '[]',
  render_time text,
  poly_count text,
  resolution text,
  download_file_id text,
  download_file_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portfolio projects"
  ON public.portfolio_projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only service role can insert portfolio projects"
  ON public.portfolio_projects
  FOR INSERT
  TO public
  WITH CHECK (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Only service role can update portfolio projects"
  ON public.portfolio_projects
  FOR UPDATE
  TO public
  USING (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Only service role can delete portfolio projects"
  ON public.portfolio_projects
  FOR DELETE
  TO public
  USING (((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'service_role'::text);

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
