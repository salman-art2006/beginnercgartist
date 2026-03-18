import { supabase } from "@/integrations/supabase/client";

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  thumbnail: string;
  tags: string[];
  videoUrl?: string;
  orderIndex: number;
}

const SEED_TUTORIALS: Tutorial[] = [
  {
    id: "tut-1", slug: "getting-started-blender-environments",
    title: "Getting Started with Environment Art in Blender",
    description: "Learn the fundamentals of environment art — from scene setup to your first render.",
    content: `<h2>Setting Up Your Scene</h2><p>Open Blender and create a new file. Delete the default cube and set up a camera with a 35mm focal length for cinematic framing.</p><h2>Building the Blockout</h2><p>Start with simple shapes to establish scale and composition. Use reference images pinned to the viewport.</p><h2>Adding Materials</h2><p>Create basic PBR materials with roughness and metalness maps. Use nodes for procedural details.</p><h2>Lighting Basics</h2><p>Add a sun lamp for key light, an HDRI for fill, and a point light for accents. Adjust intensity for mood.</p><h2>Your First Render</h2><p>Set render engine to Cycles, configure sampling, and hit F12. Experiment with denoising for cleaner results.</p>`,
    category: "Beginner", difficulty: "Beginner", durationMinutes: 20,
    thumbnail: "/placeholder.svg", tags: ["Blender", "Beginner", "Environment Art"], orderIndex: 0,
  },
  {
    id: "tut-2", slug: "procedural-materials-masterclass",
    title: "Procedural Materials Masterclass",
    description: "Create stunning materials using only Blender's shader nodes — no textures needed.",
    content: `<h2>Understanding Shader Nodes</h2><p>The Principled BSDF is your foundation. Connect noise, voronoi, and wave textures for infinite variety.</p><h2>Weathered Stone</h2><p>Layer noise textures at different scales for base color variation. Use a color ramp to map warm/cool tones.</p><h2>Rust & Decay</h2><p>Mix clean and rusty shaders using a noise-driven factor. Add bump mapping for surface detail.</p><h2>Mossy Surfaces</h2><p>Use the Geometry node's Pointiness output to drive moss placement on convex surfaces.</p>`,
    category: "Materials", difficulty: "Intermediate", durationMinutes: 35,
    thumbnail: "/placeholder.svg", tags: ["Materials", "Shader Nodes", "Procedural"], orderIndex: 1,
  },
  {
    id: "tut-3", slug: "cinematic-lighting-techniques",
    title: "Cinematic Lighting for 3D Scenes",
    description: "Master three-point lighting, volumetrics, and color grading for dramatic renders.",
    content: `<h2>Three-Point Lighting</h2><p>Key light establishes the mood. Fill light reduces shadows. Rim light separates subjects from background.</p><h2>Volumetric Lighting</h2><p>Add a Volume Scatter node to your world shader. Use density and anisotropy for god rays.</p><h2>Color Temperature</h2><p>Warm lights (3000K) feel cozy. Cool lights (7000K) feel clinical. Mix for contrast and depth.</p><h2>Post-Processing</h2><p>Use the compositor for bloom, vignette, and color grading to finalize the cinematic look.</p>`,
    category: "Lighting", difficulty: "Intermediate", durationMinutes: 25,
    thumbnail: "/placeholder.svg", tags: ["Lighting", "Cinematography", "Rendering"], orderIndex: 2,
  },
  {
    id: "tut-4", slug: "vegetation-scattering-geo-nodes",
    title: "Vegetation Scattering with Geometry Nodes",
    description: "Distribute trees, grass, and rocks across landscapes using Blender's Geometry Nodes.",
    content: `<h2>Point Distribution</h2><p>Use Distribute Points on Faces to scatter instances across terrain surfaces.</p><h2>Weight Painting</h2><p>Paint vertex groups to control where vegetation appears. Dense near water, sparse on rocks.</p><h2>Instance Variation</h2><p>Randomize scale, rotation, and which asset is instanced for natural-looking distribution.</p><h2>Performance Tips</h2><p>Use Realize Instances sparingly. Keep viewport at low density and render at full.</p>`,
    category: "Geometry Nodes", difficulty: "Advanced", durationMinutes: 40,
    thumbnail: "/placeholder.svg", tags: ["Geometry Nodes", "Vegetation", "Scattering"], orderIndex: 3,
  },
];

function mapRow(row: any): Tutorial {
  return {
    id: row.id, slug: row.slug, title: row.title, description: row.description,
    content: row.content, category: row.category, difficulty: row.difficulty,
    durationMinutes: row.duration_minutes, thumbnail: row.thumbnail,
    tags: row.tags || [], videoUrl: row.video_url || undefined, orderIndex: row.order_index,
  };
}

export const tutorialService = {
  async list(): Promise<Tutorial[]> {
    try {
      const { data, error } = await supabase.from("tutorials").select("*").order("order_index");
      if (!error && data && data.length > 0) {
        const dbTuts = data.map(mapRow);
        const dbSlugs = new Set(dbTuts.map(t => t.slug));
        return [...dbTuts, ...SEED_TUTORIALS.filter(t => !dbSlugs.has(t.slug))];
      }
    } catch {}
    return [...SEED_TUTORIALS];
  },

  async getBySlug(slug: string): Promise<Tutorial | null> {
    try {
      const { data, error } = await supabase.from("tutorials").select("*").eq("slug", slug).maybeSingle();
      if (!error && data) return mapRow(data);
    } catch {}
    return SEED_TUTORIALS.find(t => t.slug === slug) || null;
  },
};
