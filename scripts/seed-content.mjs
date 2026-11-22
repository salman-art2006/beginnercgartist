// Seeds real content (from the owner's YouTube + Gumroad) into Supabase as the admin user.
// Usage: node scripts/seed-content.mjs <gumroad.json>   (reads .env and ADMIN_CREDENTIALS.local.txt)
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const URL_ = env.VITE_SUPABASE_URL;
const KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;
const pass = fs.readFileSync("ADMIN_CREDENTIALS.local.txt", "utf8").match(/Password:\s*(\S+)/)[1];

const login = await (await fetch(`${URL_}/auth/v1/token?grant_type=password`, {
  method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@beginnercgartist.com", password: pass }),
})).json();
if (!login.access_token) throw new Error("admin login failed");
const H = { apikey: KEY, Authorization: `Bearer ${login.access_token}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" };

const yt = (id) => `https://www.youtube.com/watch?v=${id}`;
const thumb = (id) => `/images/yt/${id}.webp`;
const gr = JSON.parse(fs.readFileSync(process.argv[2], "utf8")).filter((p) => p.permalink !== "uccemb");

const shortTitle = (name) => name.split(/ [–-] /)[0].replace(/ Environment.*$/, "").replace(/\s*\(Blender\)$/, "");

const portfolioBase = [
  { slug: "frog-island", title: "Frog Island", category: "Fantasy", description: "Two giant stone frogs guard a waterfall pond. Viewport to final Cycles render.", long_description: "A fantasy environment built around two giant stone frogs above a waterfall and pond, with scattered trees and rocky foreground framing. Rendered in Cycles. Drag the slider on the home page to compare the viewport with the final render.", image: "/images/hero-render-1280.webp", gallery_images: ["/images/hero-viewport-1280.webp"], video_url: null, featured: true },
  { slug: "abandoned-gas-station", title: "Abandoned Gas Station", category: "Realistic", description: "A realistic roadside gas station, built from scratch with a full tutorial.", long_description: "A realistic abandoned gas station environment made in Blender. The full step-by-step tutorial is on YouTube.", image: thumb("EXmLxHDj9fY"), video_url: yt("EXmLxHDj9fY"), featured: true },
  { slug: "mistwood-giants", title: "Mistwood Giants", category: "Fantasy", description: "A giant fantasy forest environment with a full breakdown.", long_description: "A giant fantasy forest environment. The breakdown video shows how the scene was built in Blender.", image: thumb("QlM7GWLuWHg"), video_url: yt("QlM7GWLuWHg"), featured: true },
  { slug: "fantasy-library", title: "Fantasy Library", category: "Fantasy", description: "An interior fantasy library environment with a full breakdown.", long_description: "A fantasy library interior. The breakdown video explains how the scene was built.", image: thumb("tZMJvOM_V1g"), video_url: yt("tZMJvOM_V1g"), featured: true },
  { slug: "dreamy-sunflower-field", title: "Dreamy Sunflower Field", category: "Dreamy", description: "A sunflower field with a farmhouse, made in Blender 5.2 with Cycles.", long_description: "A dreamy sunflower field environment with a farmhouse, trees and wind. Made in Blender 5.2 and rendered in Cycles. The timelapse is on YouTube.", image: thumb("ghNlJVkQ29w"), video_url: yt("ghNlJVkQ29w"), featured: false },
  { slug: "fantasy-environment-timelapse", title: "Fantasy Environment", category: "Fantasy", description: "A fantasy environment from empty scene to final render, as a timelapse.", long_description: "A timelapse of building a fantasy environment in Blender.", image: thumb("BgSP2-z1EBY"), video_url: yt("BgSP2-z1EBY"), featured: false },
  { slug: "dreamy-hilltop-morning", title: "Dreamy Hilltop Morning", category: "Dreamy", description: "A semi-realistic hilltop morning with a slow cinematic camera move.", long_description: "A semi-realistic Blender animation of a hilltop at morning.", image: thumb("CwL3Nr8OTp0"), video_url: yt("CwL3Nr8OTp0"), featured: false },
];

for (const [pl, slug, category] of [
  ["hqosuz", "abandoned-farm", "Realistic"],
  ["pzvaov", "lakeside-mountain-monastery", "Realistic"],
  ["dyrwjs", "forgotten-tracks", "Realistic"],
  ["zebcj", "dark-fantasy-castle", "Fantasy"],
]) {
  const p = gr.find((x) => x.permalink === pl);
  portfolioBase.push({
    slug, title: shortTitle(p.name), category,
    description: `${p.name}. The scene file is available on Gumroad.`,
    long_description: `${p.name}. A Blender environment by Beginner CG Artist. The project file is available on Gumroad.`,
    image: `/images/gumroad/${pl}.webp`, gallery_images: [], video_url: null, featured: false,
  });
}

const portfolio = portfolioBase.map((r) => ({
  tools: ["Blender", "Cycles"], software: ["Blender"], workflow_steps: [], gallery_images: [], render_time: null, poly_count: null,
  resolution: null, download_file_id: null, download_file_name: null, status: "published", ...r,
}));

const tutorialsBase = [
  ["realistic-abandoned-gas-station", "How to Create a Realistic Abandoned Gas Station in Blender", "A full environment tutorial: build a realistic abandoned gas station from scratch.", "Environment", "Intermediate", "EXmLxHDj9fY", ["Environment", "Realistic", "Full tutorial"]],
  ["giant-fantasy-forest-breakdown", "Mistwood Giants: Giant Fantasy Forest Breakdown", "How the giant fantasy forest environment was made in Blender.", "Breakdown", "Intermediate", "QlM7GWLuWHg", ["Breakdown", "Forest", "Fantasy"]],
  ["fantasy-library-breakdown", "Fantasy Library Environment Breakdown", "A breakdown of how the fantasy library scene was built in Blender.", "Breakdown", "Intermediate", "tZMJvOM_V1g", ["Breakdown", "Interior", "Fantasy"]],
  ["post-process-blender-renders-photopea", "How to Post Process Blender Renders for FREE", "Finish your renders for free using Photopea.", "Post-processing", "Beginner", "ltvXyxY9_Xg", ["Photopea", "Post-processing", "Free"]],
  ["procedural-vine-generator-addon", "Free Procedural Vine Generator Add-on for Blender", "Installation and a tutorial for the free Procedural Vine Generator add-on.", "Add-ons", "Beginner", "PI3nV4OVzVY", ["Add-on", "Vines", "Free"]],
  ["10-blender-tips-for-beginners", "10 Blender Tips & Tricks Every Beginner Should Know", "Ten practical tips that make working in Blender faster.", "Tips", "Beginner", "yU29BsvJpt0", ["Tips", "Beginner"]],
  ["realistic-flag-animation-2-minutes", "How to Make a Realistic Flag Animation in Blender in 2 Minutes", "A quick beginner tutorial for a realistic waving flag.", "Animation", "Beginner", "vNpr1y_aoyA", ["Animation", "Cloth", "Beginner"]],
];
const tutorials = tutorialsBase.map(([slug, title, description, category, difficulty, id, tags], i) => ({
  slug, title, description, content: description, category, difficulty, duration_minutes: 0,
  thumbnail: thumb(id), tags, video_url: yt(id), order_index: i, status: "published",
}));

const resources = gr.map((p) => {
  const dollars = p.price / 100;
  const free = p.price === 0;
  const slug = p.permalink === "hqosuz" ? "abandoned-farm-environment" : p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return {
    slug,
    title: p.name,
    description: free
      ? `${p.name}. Free Blender file by Beginner CG Artist. Subscribe with your email to unlock the download.`
      : `${p.name}. A Blender scene file by Beginner CG Artist, sold on Gumroad. Pay what you want, from $${dollars}.`,
    category: /add-on/i.test(p.name) ? "Add-ons" : "Scenes",
    file_type: /add-on/i.test(p.name) ? ".zip" : ".blend",
    file_size: null,
    thumbnail: `/images/gumroad/${p.permalink}.webp`,
    is_premium: !free,
    price_label: free ? null : `From $${dollars}`,
    buy_url: free ? null : p.url,
    download_url: free ? p.url : null,
    file_path: null,
    tags: free ? ["Blender", "Free"] : ["Blender", "Environment", "Gumroad"],
    status: "published",
  };
});

for (const [table, rows] of [["portfolio_projects", portfolio], ["tutorials", tutorials], ["resources", resources]]) {
  const r = await fetch(`${URL_}/rest/v1/${table}?on_conflict=slug`, { method: "POST", headers: H, body: JSON.stringify(rows) });
  console.log(table, rows.length, r.status, r.ok ? "" : await r.text());
}
