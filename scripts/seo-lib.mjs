// Shared helpers for build-time SEO scripts (sitemap, llms.txt, per-page HTML).
import fs from "node:fs";

export function loadEnv() {
  const env = { ...process.env };
  if (fs.existsSync(".env")) {
    for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const i = line.indexOf("=");
      const k = line.slice(0, i).trim();
      if (!(k in env) || env[k] === "") env[k] = line.slice(i + 1).trim();
    }
  }
  return env;
}

const env = loadEnv();
export const SITE_URL = (env.VITE_SITE_URL || "https://beginnercgartist.com").replace(/\/$/, "");
export const SITE_NAME = "Beginner CG Artist";

/** Public (anon) read of a table. RLS only returns published rows. */
export async function fetchTable(table, select, order) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const r = await fetch(`${url}/rest/v1/${table}?select=${encodeURIComponent(select)}${order ? `&order=${order}` : ""}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn(`[seo] could not read ${table}:`, e.message);
    return [];
  }
}

export async function loadContent() {
  const [portfolio, tutorials, resources, posts] = await Promise.all([
    fetchTable("portfolio_projects", "slug,title,category,description,long_description,image,video_url,created_at,updated_at", "created_at.desc"),
    fetchTable("tutorials", "slug,title,category,difficulty,description,content,thumbnail,video_url,created_at,updated_at", "order_index.asc"),
    fetchTable("resources", "slug,title,category,description,thumbnail,is_premium,price_label,buy_url,created_at,updated_at", "created_at.desc"),
    fetchTable("blog_posts", "slug,title,category,excerpt,content,featured_image,author,published_at,updated_at", "published_at.desc"),
  ]);
  return { portfolio, tutorials, resources, posts };
}

export const abs = (u) => (!u ? `${SITE_URL}/og-default.jpg` : /^https?:/.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);
export const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const day = (d) => (d ? String(d).slice(0, 10) : new Date().toISOString().slice(0, 10));
export const youtubeId = (url) => url?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
export const priceNumber = (label) => label?.match(/(\d+(?:\.\d+)?)/)?.[1];
