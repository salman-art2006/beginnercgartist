import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// The generated DB types predate the clean schema, so app code uses an untyped client.
export const sb = supabase as unknown as SupabaseClient;

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export const safeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, "_");

/** Uploads an image to the public `media` bucket and returns its public URL. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10 MB");
  const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`;
  const { error } = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export const friendlyError = (err: { code?: string; message: string }) =>
  err.code === "23505" ? "That slug is already used. Change the title or slug." : err.message;
