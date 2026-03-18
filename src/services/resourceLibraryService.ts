import { supabase } from "@/integrations/supabase/client";

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
  tags: string[];
}

const SEED_RESOURCES: Resource[] = [
  { id: "r1", slug: "weathered-stone-material", title: "Weathered Stone Material Pack", description: "5 tileable stone materials with PBR maps — albedo, normal, roughness, displacement.", category: "Materials", fileType: ".zip", fileSize: "45 MB", thumbnail: "/placeholder.svg", downloadCount: 234, isPremium: false, tags: ["Stone", "PBR", "Tileable"] },
  { id: "r2", slug: "forest-hdri-collection", title: "Forest HDRI Collection", description: "8 high-resolution forest HDRIs shot at golden hour for environment lighting.", category: "HDRIs", fileType: ".exr", fileSize: "320 MB", thumbnail: "/placeholder.svg", downloadCount: 189, isPremium: false, tags: ["HDRI", "Forest", "Lighting"] },
  { id: "r3", slug: "blender-env-starter-template", title: "Environment Starter Template", description: "Pre-configured Blender file with camera, lighting, and render settings for environment art.", category: "Templates", fileType: ".blend", fileSize: "12 MB", thumbnail: "/placeholder.svg", downloadCount: 412, isPremium: false, tags: ["Blender", "Template", "Starter"] },
  { id: "r4", slug: "moss-vegetation-kit", title: "Moss & Vegetation Kit", description: "30+ moss, vine, and small plant models with materials — ready for environment scenes.", category: "3D Assets", fileType: ".blend", fileSize: "78 MB", thumbnail: "/placeholder.svg", downloadCount: 156, isPremium: true, tags: ["Vegetation", "Moss", "Plants"] },
  { id: "r5", slug: "procedural-shader-library", title: "Procedural Shader Library", description: "20 node-group shaders for stone, metal, wood, fabric — fully procedural, no textures needed.", category: "Materials", fileType: ".blend", fileSize: "8 MB", thumbnail: "/placeholder.svg", downloadCount: 298, isPremium: false, tags: ["Shaders", "Procedural", "Nodes"] },
  { id: "r6", slug: "reference-photo-pack-ruins", title: "Reference Photo Pack: Ruins", description: "200+ high-res photos of ancient ruins, temples, and abandoned structures for reference.", category: "References", fileType: ".zip", fileSize: "1.2 GB", thumbnail: "/placeholder.svg", downloadCount: 87, isPremium: true, tags: ["Reference", "Ruins", "Photography"] },
];

function mapRow(row: any): Resource {
  return {
    id: row.id, slug: row.slug, title: row.title, description: row.description,
    category: row.category, fileType: row.file_type, fileSize: row.file_size,
    thumbnail: row.thumbnail, downloadCount: row.download_count,
    isPremium: row.is_premium, tags: row.tags || [],
  };
}

export const resourceLibraryService = {
  async list(): Promise<Resource[]> {
    try {
      const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        const dbRes = data.map(mapRow);
        const dbSlugs = new Set(dbRes.map(r => r.slug));
        return [...dbRes, ...SEED_RESOURCES.filter(r => !dbSlugs.has(r.slug))];
      }
    } catch {}
    return [...SEED_RESOURCES];
  },

  async getCategories(): Promise<string[]> {
    const resources = await this.list();
    return Array.from(new Set(resources.map(r => r.category)));
  },
};
