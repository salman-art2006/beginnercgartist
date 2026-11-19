import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// The generated DB types predate the new schema, so resources use an untyped client.
const sb = supabase as unknown as SupabaseClient;

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize?: string;
  thumbnail: string;
  downloadCount: number;
  isPremium: boolean;
  priceLabel?: string;
  buyUrl?: string;
  downloadUrl?: string;
  filePath?: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  hasDownload?: boolean;
}

export type ResourceInput = Omit<Resource, "id" | "downloadCount" | "createdAt" | "hasDownload">;

export const RESOURCE_CATEGORIES = ["Scenes", "Kits", "Add-ons", "Shaders", "Materials", "Textures", "Other"];
export const MAX_UPLOAD_MB = 50;

type Row = {
  id: string; slug: string; title: string; description: string; category: string;
  file_type: string; file_size: string | null; thumbnail: string; download_count: number;
  is_premium: boolean; price_label: string | null; buy_url: string | null;
  download_url: string | null; file_path: string | null; tags: string[] | null;
  status: "draft" | "published"; created_at: string; has_download?: boolean;
};

const mapRow = (r: Row): Resource => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  description: r.description,
  category: r.category,
  fileType: r.file_type,
  fileSize: r.file_size ?? undefined,
  thumbnail: r.thumbnail,
  downloadCount: r.download_count,
  isPremium: r.is_premium,
  priceLabel: r.price_label ?? undefined,
  buyUrl: r.buy_url ?? undefined,
  downloadUrl: r.download_url ?? undefined,
  filePath: r.file_path ?? undefined,
  tags: r.tags ?? [],
  status: r.status,
  createdAt: r.created_at,
  hasDownload: r.has_download ?? !r.is_premium,
});

const toRow = (i: ResourceInput) => ({
  slug: i.slug,
  title: i.title,
  description: i.description,
  category: i.category,
  file_type: i.fileType,
  file_size: i.fileSize || null,
  thumbnail: i.thumbnail,
  is_premium: i.isPremium,
  price_label: i.priceLabel || null,
  buy_url: i.buyUrl || null,
  download_url: i.downloadUrl || null,
  file_path: i.filePath || null,
  tags: i.tags,
  status: i.status,
});

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, "_");

export const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(bytes >= 100 * 1024 * 1024 ? 0 : 1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const resourceLibraryService = {
  /** Public library: RLS only returns published rows to visitors. */
  async list(): Promise<Resource[]> {
    // Explicit columns: download_url and file_path are hidden from visitors (see the harden_resources migration).
    const base = "id,slug,title,description,category,file_type,file_size,thumbnail,download_count,is_premium,price_label,buy_url,tags,status,created_at";
    const query = (cols: string) => sb.from("resources").select(cols).order("created_at", { ascending: false });
    let { data, error } = await query(base + ",has_download");
    if (error) ({ data, error } = await query(base));
    if (error || !data) return [];
    return (data as unknown as Row[]).map(mapRow);
  },

  async getCategories(): Promise<string[]> {
    const resources = await this.list();
    return Array.from(new Set(resources.map((r) => r.category)));
  },

  /** Admin: drafts are visible to the admin through RLS. */
  async getById(id: string): Promise<Resource | null> {
    const { data, error } = await sb.from("resources").select("*").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return mapRow(data as Row);
  },

  async create(input: ResourceInput): Promise<void> {
    const { error } = await sb.from("resources").insert(toRow(input));
    if (error) throw new Error(error.code === "23505" ? "That slug is already used. Change the title or slug." : error.message);
  },

  async update(id: string, input: ResourceInput): Promise<void> {
    const { error } = await sb.from("resources").update(toRow(input)).eq("id", id);
    if (error) throw new Error(error.code === "23505" ? "That slug is already used. Change the title or slug." : error.message);
  },

  async remove(id: string): Promise<void> {
    const { error } = await sb.from("resources").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  /** Free items only: asks the get-download edge function for a short-lived URL. */
  async requestDownload(slug: string, token: string): Promise<{ url?: string; error?: string }> {
    const { data, error } = await sb.functions.invoke("get-download", { body: { slug, token } });
    if (error) return { error: "Download service is not available yet. Please try again later." };
    if (data?.error) return { error: data.error as string };
    return { url: data?.url as string };
  },

  /** Cover images and screenshots go to the public `media` bucket. Returns the public URL. */
  async uploadMedia(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
    if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10 MB");
    const path = `resources/${Date.now()}-${safeName(file.name)}`;
    const { error } = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) throw new Error(error.message);
    return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
  },

  /** Project files go to the private `files` bucket. Returns the storage path. */
  async uploadFile(file: File, slug: string): Promise<string> {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      throw new Error(`File is over ${MAX_UPLOAD_MB} MB. Upload it to Drive or Gumroad and paste the link instead.`);
    }
    const path = `resources/${slug || "file"}/${Date.now()}-${safeName(file.name)}`;
    const { error } = await sb.storage.from("files").upload(path, file, { upsert: false });
    if (error) throw new Error(error.message);
    return path;
  },
};
