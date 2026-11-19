-- Hide download links from the public API.
-- Visitors can still see every public column of `resources` (title, cover, price, buy link...),
-- but NOT `download_url` or `file_path`. Those are only returned by the `get-download`
-- edge function, to a verified subscriber. The signed-in admin keeps full access.

alter table public.resources
  add column if not exists has_download boolean
  generated always as (file_path is not null or (download_url is not null and download_url <> '')) stored;

revoke select on public.resources from anon;
grant select (
  id, slug, title, description, category, file_type, file_size, thumbnail,
  download_count, is_premium, price_label, buy_url, tags, status, created_at, updated_at, has_download
) on public.resources to anon;

revoke select on public.resources from authenticated;
grant select on public.resources to authenticated;
