/**
 * Build-time sitemap generator.
 * Fetches blog posts, portfolio projects, and tutorials from Supabase
 * and writes public/sitemap.xml with all static and dynamic URLs.
 * Run automatically before vite build via the "build" npm script.
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const SITE_URL = "https://beginnercgartist.com";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const staticRoutes = [
  { path: "/",          priority: "1.0", changefreq: "weekly"  },
  { path: "/portfolio", priority: "0.9", changefreq: "weekly"  },
  { path: "/blog",      priority: "0.9", changefreq: "daily"   },
  { path: "/tutorials", priority: "0.8", changefreq: "weekly"  },
  { path: "/resources", priority: "0.8", changefreq: "weekly"  },
  { path: "/workflow",  priority: "0.7", changefreq: "monthly" },
  { path: "/about",     priority: "0.7", changefreq: "monthly" },
  { path: "/contact",   priority: "0.6", changefreq: "monthly" },
];

function urlEntry(loc, priority, changefreq, lastmod) {
  const today = lastmod || new Date().toISOString().split("T")[0];
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  const entries = staticRoutes.map((r) =>
    urlEntry(`${SITE_URL}${r.path}`, r.priority, r.changefreq)
  );

  if (SUPABASE_URL && SUPABASE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at");
    for (const post of posts ?? []) {
      const lastmod = (post.updated_at || post.published_at || "").split("T")[0];
      entries.push(urlEntry(`${SITE_URL}/blog/${post.slug}`, "0.7", "monthly", lastmod));
    }

    // Portfolio projects
    const { data: projects } = await supabase
      .from("portfolio_projects")
      .select("slug, updated_at");
    for (const p of projects ?? []) {
      const lastmod = (p.updated_at || "").split("T")[0];
      entries.push(urlEntry(`${SITE_URL}/portfolio/${p.slug}`, "0.8", "monthly", lastmod));
    }

    // Tutorials
    const { data: tutorials } = await supabase
      .from("tutorials")
      .select("slug");
    for (const t of tutorials ?? []) {
      entries.push(urlEntry(`${SITE_URL}/tutorials/${t.slug}`, "0.7", "monthly"));
    }
  } else {
    console.warn("[sitemap] Supabase env vars not found — generating static-only sitemap.");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.join("\n")}
</urlset>`;

  writeFileSync("public/sitemap.xml", xml, "utf-8");
  console.log(`[sitemap] Generated ${entries.length} URLs → public/sitemap.xml`);
}

generate().catch((err) => {
  console.error("[sitemap] Generation failed:", err.message);
  process.exit(1);
});
