-- =============================================================================
-- Beginner CG Artist — Initial Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================================

-- ── Helper: auto-update updated_at on row changes ────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- BLOG POSTS
-- =============================================================================
create table if not exists public.blog_posts (
  id                 uuid        primary key default gen_random_uuid(),
  slug               text        not null unique,
  title              text        not null,
  excerpt            text        not null default '',
  content            text        not null default '',
  featured_image     text        not null default '',
  category           text        not null default 'Blender',
  tags               text[]      not null default '{}',
  author             text        not null default 'Beginner CG Artist',
  read_time_minutes  integer     not null default 5,
  published_at       timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx         on public.blog_posts (slug);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_category_idx     on public.blog_posts (category);

create or replace trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function update_updated_at();

-- RLS: anyone can read; only service role (edge functions) can write
alter table public.blog_posts enable row level security;
drop policy if exists "blog_posts_public_read"  on public.blog_posts;
drop policy if exists "blog_posts_service_write" on public.blog_posts;
create policy "blog_posts_public_read"   on public.blog_posts for select using (true);
create policy "blog_posts_service_write" on public.blog_posts for all    using (auth.role() = 'service_role');

-- =============================================================================
-- PORTFOLIO PROJECTS
-- =============================================================================
create table if not exists public.portfolio_projects (
  id                 uuid        primary key default gen_random_uuid(),
  slug               text        not null unique,
  title              text        not null,
  category           text        not null default 'Environment',
  description        text        not null default '',
  long_description   text        not null default '',
  tools              text[]      not null default '{}',
  software           text[]      not null default '{}',
  image              text        not null default '/placeholder.svg',
  gallery_images     text[]      not null default '{}',
  workflow_steps     jsonb       not null default '[]',
  render_time        text,
  poly_count         text,
  resolution         text,
  download_file_id   text,
  download_file_name text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists portfolio_slug_idx       on public.portfolio_projects (slug);
create index if not exists portfolio_created_at_idx on public.portfolio_projects (created_at desc);

create or replace trigger portfolio_projects_updated_at
  before update on public.portfolio_projects
  for each row execute function update_updated_at();

alter table public.portfolio_projects enable row level security;
drop policy if exists "portfolio_public_read"   on public.portfolio_projects;
drop policy if exists "portfolio_service_write" on public.portfolio_projects;
create policy "portfolio_public_read"   on public.portfolio_projects for select using (true);
create policy "portfolio_service_write" on public.portfolio_projects for all    using (auth.role() = 'service_role');

-- =============================================================================
-- TUTORIALS
-- =============================================================================
create table if not exists public.tutorials (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        not null unique,
  title            text        not null,
  description      text        not null default '',
  content          text        not null default '',
  category         text        not null default 'Beginner',
  difficulty       text        not null default 'Beginner',
  duration_minutes integer     not null default 0,
  thumbnail        text        not null default '/placeholder.svg',
  tags             text[]      not null default '{}',
  video_url        text,
  order_index      integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists tutorials_slug_idx        on public.tutorials (slug);
create index if not exists tutorials_order_index_idx on public.tutorials (order_index);

create or replace trigger tutorials_updated_at
  before update on public.tutorials
  for each row execute function update_updated_at();

alter table public.tutorials enable row level security;
drop policy if exists "tutorials_public_read"   on public.tutorials;
drop policy if exists "tutorials_service_write" on public.tutorials;
create policy "tutorials_public_read"   on public.tutorials for select using (true);
create policy "tutorials_service_write" on public.tutorials for all    using (auth.role() = 'service_role');

-- =============================================================================
-- RESOURCES (library — materials, HDRIs, templates, etc.)
-- =============================================================================
create table if not exists public.resources (
  id             uuid        primary key default gen_random_uuid(),
  slug           text        not null unique,
  title          text        not null,
  description    text        not null default '',
  category       text        not null default 'Materials',
  file_type      text        not null default '.zip',
  file_size      text,
  thumbnail      text        not null default '/placeholder.svg',
  download_count integer     not null default 0,
  is_premium     boolean     not null default false,
  tags           text[]      not null default '{}',
  created_at     timestamptz not null default now()
);

create index if not exists resources_slug_idx     on public.resources (slug);
create index if not exists resources_category_idx on public.resources (category);

alter table public.resources enable row level security;
drop policy if exists "resources_public_read"   on public.resources;
drop policy if exists "resources_service_write" on public.resources;
create policy "resources_public_read"   on public.resources for select using (true);
create policy "resources_service_write" on public.resources for all    using (auth.role() = 'service_role');

-- =============================================================================
-- SUBSCRIBERS
-- No public read — service role only (via edge functions)
-- =============================================================================
create table if not exists public.subscribers (
  id            uuid        primary key default gen_random_uuid(),
  email         text        not null unique,
  name          text        not null,
  token         text        not null,
  subscribed_at timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists subscribers_email_idx on public.subscribers (email);
create index if not exists subscribers_token_idx on public.subscribers (token);

alter table public.subscribers enable row level security;
drop policy if exists "subscribers_service_only" on public.subscribers;
create policy "subscribers_service_only" on public.subscribers for all using (auth.role() = 'service_role');

-- =============================================================================
-- DOWNLOAD LOGS
-- No public read — service role only
-- =============================================================================
create table if not exists public.download_logs (
  id            uuid        primary key default gen_random_uuid(),
  subscriber_id uuid        references public.subscribers (id) on delete set null,
  resource_id   text        not null,
  resource_type text        not null default 'portfolio',
  downloaded_at timestamptz not null default now()
);

create index if not exists download_logs_subscriber_idx   on public.download_logs (subscriber_id);
create index if not exists download_logs_resource_idx     on public.download_logs (resource_id);
create index if not exists download_logs_downloaded_at_idx on public.download_logs (downloaded_at desc);

alter table public.download_logs enable row level security;
drop policy if exists "download_logs_service_only" on public.download_logs;
create policy "download_logs_service_only" on public.download_logs for all using (auth.role() = 'service_role');

-- =============================================================================
-- Done. Tables created:
--   blog_posts, portfolio_projects, tutorials, resources, subscribers, download_logs
-- =============================================================================
