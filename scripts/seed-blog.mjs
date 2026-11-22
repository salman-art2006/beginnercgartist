// Seeds the first blog posts as the admin user. Safe to re-run (upserts on slug).
// Usage: node scripts/seed-blog.mjs
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

const posts = [
  {
    slug: "how-i-started-in-blender-and-where-i-am-now",
    title: "How I Started in Blender, and Where I Am Now",
    excerpt: "A short, honest look at two-plus years of learning Blender, why I focus on environments, and what I am working on today.",
    category: "Journey",
    featured_image: "/images/hero-render-1280.webp",
    read_time_minutes: 4,
    tags: ["Journey", "Blender", "Environment art"],
    content: `
<h2>Where it started</h2>
<p>I have been working in Blender for more than two years. Environments are what kept me interested: terrain, buildings, trees, light and atmosphere. Building a place that feels real, and then lighting it well, is the part I enjoy most.</p>

<h2>Learning in public</h2>
<p>As I learned, I started sharing the process on YouTube. Over time I saw what helps viewers the most: realistic environment tutorials with a clear result, and short, practical tips. Today the channel has more than 140 videos, from full tutorials and breakdowns to timelapses and Shorts.</p>

<h2>What I make now</h2>
<ul>
  <li>Realistic and cinematic environments, rendered in Cycles.</li>
  <li>Step-by-step <a href="/tutorials">tutorials and breakdowns</a> that show how a scene is built.</li>
  <li>Project files and scenes you can open and study, in the <a href="/library">library</a>.</li>
  <li>A free Procedural Vine Generator add-on for Blender.</li>
</ul>

<h2>How I work</h2>
<p>Every scene follows the same steps: references, blockout, assets and scatter, light and atmosphere, then render and finish. I wrote the full process on the <a href="/workflow">workflow page</a>. Everything is made by hand in Blender, with no AI.</p>

<h2>Where I am today</h2>
<p>I am still learning on every project. Right now my focus is on better realistic scenes, clearer tutorials, and organised project files, so that anyone who opens one can follow how it was made.</p>

<h2>Follow along</h2>
<p>The best way to follow the work is the <a href="https://www.youtube.com/@BeginnerCGArtist?sub_confirmation=1">YouTube channel</a>. If you want the free project files and a note when something new is out, <a href="/library#unlock">join the list</a>.</p>
`,
  },
  {
    slug: "whats-next-goals-for-the-channel-and-library",
    title: "What I Am Working On Next: Goals for the Channel and the Library",
    excerpt: "The plan for the coming months: more realistic environments, kits and shader packs, free starter files, and a steady upload schedule.",
    category: "Journey",
    featured_image: "/images/yt/ghNlJVkQ29w.webp",
    read_time_minutes: 4,
    tags: ["Journey", "Plans", "Blender kits"],
    content: `
<p>Here is what I am working towards, so you know what to expect from the channel and the library.</p>

<h2>More realistic environments</h2>
<p>Realistic scenes and the tutorials behind them are what viewers respond to most, so they will be the main focus.</p>

<h2>Kits and shader packs</h2>
<ul>
  <li><strong>Atmosphere and water shaders:</strong> fog and water are two of the topics people ask about most, so I want to package the setups I use.</li>
  <li><strong>One growing collection</strong> rather than many tiny files, so what you buy keeps getting better.</li>
</ul>

<h2>Honest, usable files</h2>
<p>Everything I sell will be built from my own work or from assets that are free to use. Every file page will say what is included, which Blender version was used, and which render engine.</p>

<h2>Free starter files</h2>
<p>I will keep releasing free files, so you can try my work before buying anything. They unlock when you <a href="/library#unlock">join the list</a>.</p>

<h2>A steady schedule</h2>
<p>A new full tutorial about every two weeks, with short tip videos in between. A calmer, steady rhythm means better videos.</p>

<h2>Tell me what to build</h2>
<p>If there is a scene, kit or topic you want, tell me in the YouTube comments or through the <a href="/contact?topic=Kit%20or%20file%20request">contact form</a>. Your requests decide a lot of what comes next.</p>
`,
  },
  {
    slug: "what-you-get-when-you-join-the-list",
    title: "What You Get When You Join the List",
    excerpt: "What the list includes, what it does not, and how your details are handled. Short and clear.",
    category: "Resources",
    featured_image: "/images/yt/PI3nV4OVzVY.webp",
    read_time_minutes: 3,
    tags: ["Free files", "Newsletter"],
    content: `
<p>The list is for people who want the project files and a heads-up when something new is out. Here is exactly what that means.</p>

<h2>What you get</h2>
<ul>
  <li><strong>Free project files and tools</strong> from the <a href="/library">library</a> unlock for you.</li>
  <li><strong>A note when something new is out:</strong> a tutorial, a free file, or a kit.</li>
  <li>From time to time, notes on how a scene was built that do not fit in a video.</li>
</ul>

<h2>What you do not get</h2>
<ul>
  <li>No spam, and no daily emails.</li>
  <li>Your email is never sold or shared.</li>
</ul>

<h2>How it works</h2>
<p>Add your name and email in the <a href="/library#unlock">library</a>. The free downloads unlock right away on that device. You can leave the list at any time.</p>

<h2>Your details</h2>
<p>I only use your name and email to send you what you signed up for. Nothing else is collected.</p>

<p><a href="/library#unlock">Join the list</a> or browse the <a href="/library">library</a> first.</p>
`,
  },
].map((p) => ({ author: "Salman", status: "published", ...p, content: p.content.trim() }));

const r = await fetch(`${URL_}/rest/v1/blog_posts?on_conflict=slug`, { method: "POST", headers: H, body: JSON.stringify(posts) });
console.log("blog_posts", posts.length, r.status, r.ok ? "" : await r.text());
