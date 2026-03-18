-- Tighten blog_posts: only service-role (via edge functions) can write
-- Drop the permissive policies
DROP POLICY IF EXISTS "Service role can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Service role can update blog posts" ON public.blog_posts;

-- Recreate with service-role check (current_setting returns 'service_role' for service key)
CREATE POLICY "Only service role can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
  );

CREATE POLICY "Only service role can update blog posts" ON public.blog_posts
  FOR UPDATE USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
  );

-- Tighten subscribers: keep public INSERT but restrict reads to service role
DROP POLICY IF EXISTS "Service role can read subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;

CREATE POLICY "Public can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (
    name IS NOT NULL AND email IS NOT NULL AND token IS NOT NULL
  );

CREATE POLICY "Only service role can read subscribers" ON public.subscribers
  FOR SELECT USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
  );