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

type TutorialRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: string;
  duration_minutes: number;
  thumbnail: string;
  tags: string[] | null;
  video_url: string | null;
  order_index: number;
};

function mapRow(row: TutorialRow): Tutorial {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    category: row.category,
    difficulty: row.difficulty,
    durationMinutes: row.duration_minutes,
    thumbnail: row.thumbnail,
    tags: row.tags ?? [],
    videoUrl: row.video_url ?? undefined,
    orderIndex: row.order_index,
  };
}

export const tutorialService = {
  async list(): Promise<Tutorial[]> {
    try {
      const { data, error } = await supabase
        .from("tutorials")
        .select("*")
        .order("order_index");
      if (!error && data) return (data as TutorialRow[]).map(mapRow);
    } catch {
      // return empty on failure
    }
    return [];
  },

  async getBySlug(slug: string): Promise<Tutorial | null> {
    try {
      const { data, error } = await supabase
        .from("tutorials")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) return mapRow(data as TutorialRow);
    } catch {
      // fall through
    }
    return null;
  },
};
