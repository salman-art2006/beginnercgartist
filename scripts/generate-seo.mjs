/**
 * Build-time sitemap.xml and llms.txt generator.
 * Reads published content from Supabase and writes public/sitemap.xml and public/llms.txt.
 * Runs before `vite build` (see the "build" npm script).
 */
import fs from "node:fs";
import { SITE_URL, SITE_NAME, loadContent, day } from "./seo-lib.mjs";

const { portfolio, tutorials, resources, posts } = await loadContent();

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/portfolio", priority: "0.9", changefreq: "weekly" },
  { path: "/tutorials", priority: "0.9", changefreq: "weekly" },
  { path: "/library", priority: "0.9", changefreq: "weekly" },
  ...(posts.length ? [{ path: "/blog", priority: "0.8", changefreq: "weekly" }] : []),
  { path: "/workflow", priority: "0.6", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "yearly" },
];

const entry = (path, priority, changefreq, lastmod) =>
  `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${day(lastmod)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

const entries = [
  ...staticRoutes.map((r) => entry(r.path, r.priority, r.changefreq)),
  ...portfolio.map((p) => entry(`/portfolio/${p.slug}`, "0.7", "monthly", p.updated_at || p.created_at)),
  ...tutorials.map((t) => entry(`/tutorials/${t.slug}`, "0.8", "monthly", t.updated_at || t.created_at)),
  ...posts.map((p) => entry(`/blog/${p.slug}`, "0.7", "monthly", p.updated_at || p.published_at)),
];

fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`);
console.log(`[seo] sitemap.xml: ${entries.length} URLs`);

const list = (rows, fn) => (rows.length ? rows.map(fn).join("\n") : "- (none yet)");
const llms = `# ${SITE_NAME}

> Realistic, cinematic Blender environments, and how to build them step by step. Run by Salman, a Blender environment artist with 2+ years of experience. Everything is made by hand in Blender (Cycles), no AI. Tutorials, project files and scene packs.

Site: ${SITE_URL}
YouTube: https://www.youtube.com/@BeginnerCGArtist
Instagram: https://www.instagram.com/beginnercg_artist/
ArtStation: https://www.artstation.com/beginnercgartist
Gumroad: https://beginnercgartist.gumroad.com/

## About
- [About Salman](${SITE_URL}/about): who makes this site, tools used (Blender 5.2, Cycles, Geometry Nodes, DaVinci Resolve, Photopea, OctaSpace cloud rendering) and what the work focuses on.
- [Contact](${SITE_URL}/contact): custom environment work, collaborations, kit requests, Blender help.

## Tutorials
${list(tutorials, (t) => `- [${t.title}](${SITE_URL}/tutorials/${t.slug}): ${t.description}`)}

## Portfolio
${list(portfolio, (p) => `- [${p.title}](${SITE_URL}/portfolio/${p.slug}): ${p.description}`)}

## Library (free and paid Blender files)
${list(resources, (r) => `- [${r.title}](${SITE_URL}/library): ${r.is_premium ? `paid${r.price_label ? ", " + r.price_label : ""}` : "free"}. ${r.description}`)}
${posts.length ? `\n## Blog\n${list(posts, (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`)}\n` : ""}
## Topics
Blender, environment art, realistic environments, Cycles rendering, procedural materials, Geometry Nodes, vegetation scattering, cinematic lighting, volumetrics, post-processing, Blender add-ons, project files.
`;
fs.writeFileSync("public/llms.txt", llms);
console.log("[seo] llms.txt written");
