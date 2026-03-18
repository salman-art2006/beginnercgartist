import type { BlogPost } from "./blogTypes";

import blogEnvArt from "@/assets/blog-env-art-beginner.jpg";
import blogLighting from "@/assets/blog-lighting-tips.jpg";
import blogTexturing from "@/assets/blog-texturing-workflow.jpg";
import blogTemple from "@/assets/blog-temple-breakdown.jpg";
import blogAddons from "@/assets/blog-addons.jpg";
import blogPortfolio from "@/assets/blog-portfolio-tips.jpg";

/**
 * Seed blog posts for development.
 * In production, these come from a CMS, database, or API.
 * Each post has a unique slug for SEO-friendly URLs.
 */
export const seedBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-environment-art-in-blender",
    title: "Getting Started with Environment Art in Blender",
    excerpt: "A beginner-friendly guide to creating your first 3D environment scene in Blender, from blockout to final render.",
    content: `
      <h2>Why Environment Art?</h2>
      <p>Environment art is one of the most rewarding disciplines in 3D. You're not just modeling objects — you're building entire worlds that tell stories. In this post, I'll walk you through how I approach a new environment scene from scratch.</p>
      <h2>Step 1: Gather References</h2>
      <p>Before opening Blender, I spend time collecting reference images. PureRef is my go-to tool for organizing mood boards. I look for lighting, color palettes, architectural details, and atmospheric cues.</p>
      <h2>Step 2: Blockout</h2>
      <p>The blockout phase is about establishing scale and composition using simple shapes. Don't worry about details yet — focus on the camera angle and overall silhouette of the scene.</p>
      <h2>Step 3: Detailing</h2>
      <p>Once the composition feels right, I start adding geometric detail. This is where subdivision modeling, boolean operations, and kitbashing come into play.</p>
      <h2>Step 4: Materials & Texturing</h2>
      <p>I use a combination of procedural materials in Blender's shader editor and texture maps from Quixel Megascans. UV unwrapping is essential for custom textures.</p>
      <h2>Step 5: Lighting & Rendering</h2>
      <p>Lighting makes or breaks an environment. I typically use HDRI for base illumination plus area lights or sun lamps for key lighting. Cycles gives the best results for final renders.</p>
    `,
    featuredImage: blogEnvArt,
    category: "Environment Art",
    tags: ["Blender", "Beginner", "Workflow"],
    publishedAt: "2026-03-13T08:00:00Z",
    author: "ENV.ART",
    readTimeMinutes: 6,
  },
  {
    id: "2",
    slug: "5-blender-lighting-tips-for-cinematic-renders",
    title: "5 Blender Lighting Tips for Cinematic Renders",
    excerpt: "Transform flat scenes into cinematic masterpieces with these essential lighting techniques in Blender Cycles.",
    content: `
      <h2>1. Use Three-Point Lighting as a Starting Point</h2>
      <p>Even in 3D, the classic three-point lighting setup (key, fill, rim) gives you a solid foundation. Place your key light at 45 degrees, add a softer fill on the opposite side, and use a rim light to separate the subject from the background.</p>
      <h2>2. HDRI for Realistic Ambient Light</h2>
      <p>High Dynamic Range Images provide natural-looking ambient illumination. Sites like Poly Haven offer free HDRIs. Rotate them to find the best angle for your scene.</p>
      <h2>3. Volumetrics Add Atmosphere</h2>
      <p>A subtle volume scatter in your world settings or a cube volume object can add god rays and atmospheric haze that make renders feel alive.</p>
      <h2>4. Color Temperature Contrast</h2>
      <p>Mix warm and cool light sources for visual interest. A warm key light with cool fill creates depth and mood naturally.</p>
      <h2>5. Post-Processing in the Compositor</h2>
      <p>Use Blender's compositor for glare, color grading, and vignette. These finishing touches elevate a good render to a great one.</p>
    `,
    featuredImage: blogLighting,
    category: "Tips",
    tags: ["Lighting", "Cycles", "Rendering"],
    publishedAt: "2026-03-12T08:00:00Z",
    author: "ENV.ART",
    readTimeMinutes: 4,
  },
  {
    id: "3",
    slug: "my-texturing-workflow-for-environment-scenes",
    title: "My Texturing Workflow for Environment Scenes",
    excerpt: "How I combine procedural shaders and texture maps to create believable surfaces for 3D environments.",
    content: `
      <h2>Procedural vs. Image-Based Textures</h2>
      <p>I use a hybrid approach. Procedural noise textures in Blender are great for large-scale variation (weathering, dirt), while image textures from Megascans handle fine surface detail.</p>
      <h2>UV Unwrapping Strategy</h2>
      <p>For environment art, I use smart UV project for background props and manual unwrapping for hero assets. Consistent texel density is key.</p>
      <h2>Material Layering</h2>
      <p>Using the Mix Shader node, I layer materials — base stone, moss overlay, edge wear — controlled by ambient occlusion or curvature maps generated from the geometry.</p>
      <h2>Texture Painting</h2>
      <p>Sometimes I paint directly in Blender's texture paint mode to add unique details like graffiti, stains, or custom patterns that make a surface feel hand-crafted.</p>
    `,
    featuredImage: blogTexturing,
    category: "Workflow",
    tags: ["Texturing", "Materials", "Blender"],
    publishedAt: "2026-03-11T08:00:00Z",
    author: "ENV.ART",
    readTimeMinutes: 5,
  },
  {
    id: "4",
    slug: "breaking-down-the-ancient-temple-scene",
    title: "Breaking Down the Ancient Temple Scene",
    excerpt: "A detailed look at how I built the Ancient Temple Ruins environment — from concept to final render.",
    content: `
      <h2>The Concept</h2>
      <p>I wanted to create a scene that combined architectural grandeur with organic overgrowth. The temple needed to feel ancient, partially reclaimed by nature, with dramatic god-ray lighting.</p>
      <h2>Modeling Approach</h2>
      <p>The temple structure was modeled with hard-surface techniques — clean edge loops, bevels for wear, and boolean cuts for damaged sections. Vegetation was placed using particle systems and the Scatter add-on.</p>
      <h2>Lighting Setup</h2>
      <p>A single sun lamp angled through the temple opening creates the volumetric god rays. I added a volume cube with low density for the atmospheric effect. Fill light comes from an HDRI.</p>
      <h2>Final Render</h2>
      <p>Rendered in Cycles at 2K resolution with 512 samples and OptiX denoising. Post-processing added color grading and a subtle vignette.</p>
    `,
    featuredImage: blogTemple,
    category: "Project Breakdown",
    tags: ["Temple", "Scene Breakdown", "Cycles"],
    publishedAt: "2026-03-10T08:00:00Z",
    author: "ENV.ART",
    readTimeMinutes: 7,
  },
  {
    id: "5",
    slug: "essential-blender-addons-for-environment-artists",
    title: "Essential Blender Add-ons for Environment Artists",
    excerpt: "My top recommended Blender add-ons that speed up environment art creation and improve quality.",
    content: `
      <h2>1. Scatter (Geo-Scatter)</h2>
      <p>The best tool for distributing vegetation, rocks, and debris across your environment. Saves hours compared to manual placement.</p>
      <h2>2. Botaniq</h2>
      <p>A library of ready-to-use trees, plants, and grass optimized for Blender. Great for populating outdoor scenes quickly.</p>
      <h2>3. Hard Ops / BoxCutter</h2>
      <p>Essential for hard-surface modeling. BoxCutter's boolean workflow is perfect for creating architectural damage and mechanical details.</p>
      <h2>4. Node Wrangler</h2>
      <p>Built into Blender but often overlooked. Ctrl+Shift+Click to preview any node, lazy connect, and quick texture setup make shader work much faster.</p>
      <h2>5. Physical Starlight and Atmosphere</h2>
      <p>Creates physically accurate sky and atmosphere setups. Perfect for outdoor environment scenes with realistic time-of-day lighting.</p>
    `,
    featuredImage: blogAddons,
    category: "Resources",
    tags: ["Add-ons", "Tools", "Blender"],
    publishedAt: "2026-03-09T08:00:00Z",
    author: "ENV.ART",
    readTimeMinutes: 4,
  },
  {
    id: "6",
    slug: "building-a-portfolio-as-a-3d-environment-artist",
    title: "Building a Portfolio as a 3D Environment Artist",
    excerpt: "Practical tips for creating a portfolio that showcases your environment art skills and attracts opportunities.",
    content: `
      <h2>Quality Over Quantity</h2>
      <p>Three polished environment scenes are better than ten mediocre ones. Each piece should demonstrate different skills — lighting, composition, texturing, and storytelling.</p>
      <h2>Show Your Process</h2>
      <p>Include breakdowns alongside final renders. Wireframes, clay renders, and lighting passes show employers and clients that you understand the full pipeline.</p>
      <h2>Choose a Platform</h2>
      <p>ArtStation is the industry standard for 3D art portfolios. Complement it with a personal website for SEO and branding. Instagram and YouTube help build community.</p>
      <h2>Tell a Story</h2>
      <p>The best environment art portfolios have a narrative thread. Each scene should make the viewer want to explore the world you've created.</p>
    `,
    featuredImage: blogPortfolio,
    category: "Tips",
    tags: ["Portfolio", "Career", "Advice"],
    publishedAt: "2026-03-08T08:00:00Z",
    author: "ENV.ART",
    readTimeMinutes: 5,
  },
];
