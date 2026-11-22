/**
 * Post-build static HTML per page.
 * For every public route this writes dist/<route>/index.html: the built index.html with that page's
 * own <title>, description, canonical, Open Graph / Twitter tags, JSON-LD, and a visually hidden
 * text version of the content. Search engines and AI crawlers that do not run JavaScript can read it;
 * React replaces the fallback as soon as the app loads.
 */
import fs from "node:fs";
import path from "node:path";
import { SITE_URL, SITE_NAME, abs, esc, loadContent, priceNumber, youtubeId } from "./seo-lib.mjs";

const DIST = "dist";
const TITLE_SUFFIX = `${SITE_NAME} — 3D Environment Artist`;
const tpl = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const { portfolio, tutorials, resources, posts } = await loadContent();

const nav = [
  ["/portfolio", "Portfolio"], ["/tutorials", "Tutorials"], ["/library", "Library"],
  ...(posts.length ? [["/blog", "Blog"]] : []), ["/about", "About"], ["/contact", "Contact"],
];

const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const person = { "@type": "Person", name: "Salman", url: `${SITE_URL}/about` };
const crumb = (pairs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: pairs.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${url}` })),
});

const pages = [];
const add = (p) => pages.push({ type: "website", ld: [], image: null, ...p });

add({
  route: "/", title: "Realistic Blender Environments",
  desc: "Realistic, cinematic Blender environments and how to build them step by step. Tutorials, free project files, scene packs and custom environment work by Salman.",
  h1: "Realistic Blender Environments",
  body: `<p>Learn to build the exact scene you see, step by step, then download the files. Made in Blender, no AI.</p>
    <h2>Tutorials</h2>${ul(tutorials.slice(0, 7).map((t) => link(`/tutorials/${t.slug}`, t.title)))}
    <h2>Portfolio</h2>${ul(portfolio.slice(0, 8).map((p) => link(`/portfolio/${p.slug}`, p.title)))}
    <h2>Library</h2><p>${link("/library", "Free and paid Blender project files and scenes")}</p>`,
});

add({
  route: "/portfolio", title: "Portfolio",
  desc: "Realistic and cinematic Blender environments by Salman: abandoned places, fantasy worlds and dreamy landscapes, each with a breakdown or tutorial.",
  h1: "Environments I built",
  body: ul(portfolio.map((p) => `${link(`/portfolio/${p.slug}`, p.title)}: ${esc(p.description)}`)),
  ld: [crumb([["Home", "/"], ["Portfolio", "/portfolio"]])],
});

add({
  route: "/tutorials", title: "Blender Tutorials",
  desc: "Step-by-step Blender environment tutorials and breakdowns in simple English: realistic scenes, fantasy worlds, post-processing and beginner tips.",
  h1: "Learn it step by step",
  body: ul(tutorials.map((t) => `${link(`/tutorials/${t.slug}`, t.title)}: ${esc(t.description)}`)),
  ld: [crumb([["Home", "/"], ["Tutorials", "/tutorials"]])],
});

add({
  route: "/library", title: "Library: Blender project files and scenes",
  desc: "Free Blender project files and downloadable environment scenes by Salman. Open a scene, see how it is built and learn faster.",
  h1: "Project files and scenes",
  image: resources[0]?.thumbnail,
  body: ul(resources.map((r) => `${esc(r.title)} (${r.is_premium ? `paid${r.price_label ? ", " + esc(r.price_label) : ""}` : "free"}): ${esc(r.description)}`)),
  ld: [
    crumb([["Home", "/"], ["Library", "/library"]]),
    {
      "@context": "https://schema.org", "@type": "ItemList", name: "Blender project files and scenes",
      itemListElement: resources.map((r, i) => ({
        "@type": "ListItem", position: i + 1,
        item: {
          "@type": "Product", name: r.title, description: r.description, image: abs(r.thumbnail), brand: { "@type": "Brand", name: SITE_NAME },
          offers: { "@type": "Offer", url: r.buy_url || `${SITE_URL}/library`, priceCurrency: "USD", price: r.is_premium ? priceNumber(r.price_label) || "0" : "0", availability: "https://schema.org/InStock" },
        },
      })),
    },
  ],
});

add({
  route: "/about", title: "About Salman",
  desc: "Salman is a Blender environment artist with 2+ years of experience. He builds realistic, cinematic environments and teaches the full process on YouTube.",
  h1: "Hi, I'm Salman",
  body: `<p>I'm a Blender environment artist with 2+ years of experience. I build realistic and cinematic scenes, then explain the whole process step by step so you can build them too. Tools: Blender 5.2, Cycles, Geometry Nodes, DaVinci Resolve Studio, Photopea. Everything is made by hand in Blender, no AI.</p>`,
  ld: [crumb([["Home", "/"], ["About", "/about"]]), { "@context": "https://schema.org", ...person, alternateName: SITE_NAME, jobTitle: "Blender Environment Artist" }],
});

add({
  route: "/contact", title: "Contact",
  desc: "Contact Salman about custom Blender environment work, collaborations, kit requests or Blender questions.",
  h1: "Let's talk",
  body: `<p>Custom environment work, a kit you want to see, a collaboration or a Blender question. Use the contact form to send a message.</p>`,
  ld: [crumb([["Home", "/"], ["Contact", "/contact"]])],
});

if (posts.length) {
  add({
    route: "/blog", title: "Blog",
    desc: "Articles on Blender environment art: workflows, lighting, project breakdowns and tips from Salman.",
    h1: "Notes from the viewport",
    body: ul(posts.map((p) => `${link(`/blog/${p.slug}`, p.title)}: ${esc(p.excerpt)}`)),
    ld: [crumb([["Home", "/"], ["Blog", "/blog"]])],
  });
}

for (const p of portfolio) {
  add({
    route: `/portfolio/${p.slug}`, title: p.title, desc: p.description || p.long_description?.slice(0, 160) || p.title, h1: p.title, image: p.image,
    body: `<p>${esc(p.long_description || p.description)}</p>${p.video_url ? `<p>${link(p.video_url, "Watch the video on YouTube")}</p>` : ""}`,
    ld: [
      crumb([["Home", "/"], ["Portfolio", "/portfolio"], [p.title, `/portfolio/${p.slug}`]]),
      { "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: p.description, image: abs(p.image), creator: person, genre: p.category },
    ],
  });
}

for (const t of tutorials) {
  const vid = youtubeId(t.video_url);
  add({
    route: `/tutorials/${t.slug}`, title: t.title, desc: t.description || t.title, h1: t.title, image: t.thumbnail,
    body: `<p>${esc(t.description)}</p>${t.content && t.content !== t.description ? `<p>${esc(t.content)}</p>` : ""}${t.video_url ? `<p>${link(t.video_url, "Watch on YouTube")}</p>` : ""}`,
    ld: [
      crumb([["Home", "/"], ["Tutorials", "/tutorials"], [t.title, `/tutorials/${t.slug}`]]),
      ...(vid ? [{
        "@context": "https://schema.org", "@type": "VideoObject", name: t.title, description: t.description,
        thumbnailUrl: `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`, uploadDate: String(t.created_at).slice(0, 10),
        embedUrl: `https://www.youtube.com/embed/${vid}`, contentUrl: t.video_url, publisher: { "@type": "Organization", name: SITE_NAME },
      }] : []),
    ],
  });
}

for (const b of posts) {
  add({
    route: `/blog/${b.slug}`, title: b.title, desc: b.excerpt || b.title, h1: b.title, image: b.featured_image, type: "article",
    body: `<p>${esc(b.excerpt)}</p>${b.content.replace(/<[^>]+>/g, " ").slice(0, 4000) ? `<p>${esc(b.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 4000))}</p>` : ""}`,
    ld: [
      crumb([["Home", "/"], ["Blog", "/blog"], [b.title, `/blog/${b.slug}`]]),
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: b.title, description: b.excerpt, datePublished: b.published_at, image: abs(b.featured_image), author: { "@type": "Person", name: b.author } },
    ],
  });
}

const set = (html, re, replacement) => (re.test(html) ? html.replace(re, () => replacement) : html);

function render(p) {
  const url = `${SITE_URL}${p.route === "/" ? "/" : p.route}`;
  const fullTitle = `${p.title} | ${TITLE_SUFFIX}`;
  const img = abs(p.image);
  let h = tpl;
  h = set(h, /<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`);
  h = set(h, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(p.desc)}" />`);
  h = set(h, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  h = set(h, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(fullTitle)}" />`);
  h = set(h, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(p.desc)}" />`);
  h = set(h, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`);
  h = set(h, /<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${p.type}" />`);
  h = set(h, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${esc(img)}" />`);
  h = set(h, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`);
  h = set(h, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${esc(p.desc)}" />`);
  h = set(h, /<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${esc(img)}" />`);

  const ld = p.ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n");
  h = h.replace("</head>", `${ld}\n</head>`);

  const fallback = `<div class="seo-fallback"><header>${link("/", SITE_NAME)}<nav>${nav.map(([href, t]) => link(href, t)).join(" ")}</nav></header><main><h1>${esc(p.h1)}</h1>${p.body}</main></div>`;
  return h.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

let written = 0;
for (const p of pages) {
  const dir = p.route === "/" ? DIST : path.join(DIST, p.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(p));
  written++;
}
console.log(`[prerender] wrote ${written} pages`);
