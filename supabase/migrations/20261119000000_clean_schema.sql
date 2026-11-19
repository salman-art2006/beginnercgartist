-- Beginner CG Artist: single clean schema (replaces the 6 old overlapping migrations,
-- which are archived in supabase/legacy-migrations/).
-- Safe to run on an empty project. Admin = a row in public.admin_users.

-- ── Helpers ──────────────────────────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "admins read admin list" on public.admin_users
  for select to authenticated using (public.is_admin());

-- ── Blog ─────────────────────────────────────────────────────────────────────
create table public.blog_posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  excerpt           text not null default '',
  content           text not null default '',
  featured_image    text not null default '',
  category          text not null default 'Blender',
  tags              text[] not null default '{}',
  author            text not null default 'Salman',
  read_time_minutes integer not null default 5,
  status            text not null default 'published' check (status in ('draft', 'published')),
  published_at      timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index blog_posts_published_idx on public.blog_posts (published_at desc);
create index blog_posts_category_idx on public.blog_posts (category);
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.update_updated_at();

-- ── Portfolio ────────────────────────────────────────────────────────────────
create table public.portfolio_projects (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  title              text not null,
  category           text not null default 'Environment',
  description        text not null default '',
  long_description   text not null default '',
  tools              text[] not null default '{}',
  software           text[] not null default '{}',
  image              text not null default '',
  gallery_images     text[] not null default '{}',
  workflow_steps     jsonb not null default '[]',
  render_time        text,
  poly_count         text,
  resolution         text,
  video_url          text,
  featured           boolean not null default false,
  download_file_id   text,
  download_file_name text,
  status             text not null default 'published' check (status in ('draft', 'published')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index portfolio_created_idx on public.portfolio_projects (created_at desc);
create trigger portfolio_updated_at before update on public.portfolio_projects
  for each row execute function public.update_updated_at();

-- ── Tutorials ────────────────────────────────────────────────────────────────
create table public.tutorials (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  description      text not null default '',
  content          text not null default '',
  category         text not null default 'Blender',
  difficulty       text not null default 'Beginner',
  duration_minutes integer not null default 0,
  thumbnail        text not null default '',
  tags             text[] not null default '{}',
  video_url        text,
  order_index      integer not null default 0,
  status           text not null default 'published' check (status in ('draft', 'published')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index tutorials_order_idx on public.tutorials (order_index);
create trigger tutorials_updated_at before update on public.tutorials
  for each row execute function public.update_updated_at();

-- ── Resources (free and paid store items) ────────────────────────────────────
-- is_premium = paid. Free items: email-gated download. Paid items: buy_url (e.g. Gumroad)
-- or "email me" via contact. file_path points into the private 'files' bucket;
-- download_url is for files hosted elsewhere (Drive, Gumroad, etc.).
create table public.resources (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  description    text not null default '',
  category       text not null default 'Scenes',
  file_type      text not null default '.blend',
  file_size      text,
  thumbnail      text not null default '',
  download_count integer not null default 0,
  is_premium     boolean not null default false,
  price_label    text,
  buy_url        text,
  download_url   text,
  file_path      text,
  tags           text[] not null default '{}',
  status         text not null default 'published' check (status in ('draft', 'published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index resources_category_idx on public.resources (category);
create trigger resources_updated_at before update on public.resources
  for each row execute function public.update_updated_at();

-- ── Subscribers / downloads / messages / settings ────────────────────────────
-- Subscribers are inserted only by the `subscribe` edge function (service role).
create table public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null,
  token         text not null,
  subscribed_at timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index subscribers_token_idx on public.subscribers (token);

create table public.download_logs (
  id            uuid primary key default gen_random_uuid(),
  subscriber_id uuid references public.subscribers (id) on delete set null,
  resource_id   text not null,
  resource_type text not null default 'resource',
  downloaded_at timestamptz not null default now()
);
create index download_logs_resource_idx on public.download_logs (resource_id);
create index download_logs_time_idx on public.download_logs (downloaded_at desc);

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  subject    text not null default '' check (char_length(subject) <= 200),
  message    text not null check (char_length(message) between 1 and 5000),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.update_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.blog_posts         enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.tutorials          enable row level security;
alter table public.resources          enable row level security;
alter table public.subscribers        enable row level security;
alter table public.download_logs      enable row level security;
alter table public.contact_messages   enable row level security;
alter table public.site_settings      enable row level security;

-- Public content: visitors see published rows, admin sees everything and can write.
create policy "read published" on public.blog_posts         for select using (status = 'published' or public.is_admin());
create policy "read published" on public.portfolio_projects for select using (status = 'published' or public.is_admin());
create policy "read published" on public.tutorials          for select using (status = 'published' or public.is_admin());
create policy "read published" on public.resources          for select using (status = 'published' or public.is_admin());
create policy "admin write"    on public.blog_posts         for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write"    on public.portfolio_projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write"    on public.tutorials          for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write"    on public.resources          for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Private data: admin only.
create policy "admin all" on public.subscribers   for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.download_logs for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Contact form: anyone can send, only admin can read/manage.
create policy "anyone can send" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "admin read"      on public.contact_messages for select to authenticated using (public.is_admin());
create policy "admin update"    on public.contact_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete"    on public.contact_messages for delete to authenticated using (public.is_admin());

-- Site settings (contact email, social links, etc.): public read, admin write.
create policy "public read" on public.site_settings for select using (true);
create policy "admin write" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Storage ──────────────────────────────────────────────────────────────────
-- media = public images. files = private downloads (served via signed URLs).
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 10485760), ('files', 'files', false, null)
on conflict (id) do nothing;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "admin manage media and files" on storage.objects
  for all to authenticated
  using (bucket_id in ('media', 'files') and public.is_admin())
  with check (bucket_id in ('media', 'files') and public.is_admin());

-- ── Defaults for site settings ───────────────────────────────────────────────
insert into public.site_settings (key, value) values
  ('contact', jsonb_build_object('email', '', 'gumroad', 'https://beginnercgartist.gumroad.com/',
     'artstation', 'https://www.artstation.com/beginnercgartist',
     'youtube', 'https://www.youtube.com/@BeginnerCGArtist',
     'instagram', 'https://www.instagram.com/beginnercg_artist/'))
on conflict (key) do nothing;
