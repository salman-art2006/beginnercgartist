import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, BlogListParams, BlogListResult, BlogCategory } from "@/data/blogTypes";

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  published_at: string;
  author: string;
  read_time_minutes: number;
};

function mapRow(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featured_image,
    category: row.category as BlogPost["category"],
    tags: row.tags || [],
    publishedAt: row.published_at,
    author: row.author,
    readTimeMinutes: row.read_time_minutes,
  };
}

export const blogService = {
  async list(params: BlogListParams = {}): Promise<BlogListResult> {
    const { category, page = 1, perPage = 9, search } = params;

    let allPosts: BlogPost[] = [];
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data) {
        allPosts = (data as BlogRow[]).map(mapRow);
      }
    } catch {
      // return empty on failure
    }

    if (category) allPosts = allPosts.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      allPosts = allPosts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const total = allPosts.length;
    const totalPages = Math.ceil(total / perPage);
    const startIdx = (page - 1) * perPage;
    return { posts: allPosts.slice(startIdx, startIdx + perPage), total, page, totalPages };
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (data) return mapRow(data as BlogRow);
    } catch {
      // fall through
    }
    return null;
  },

  async getLatest(count: number = 3): Promise<BlogPost[]> {
    const result = await this.list({ perPage: count });
    return result.posts;
  },

  async getCategories(): Promise<{ category: BlogCategory; count: number }[]> {
    const result = await this.list({ perPage: 1000 });
    const counts = new Map<string, number>();
    for (const post of result.posts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([category, count]) => ({
      category: category as BlogCategory,
      count,
    }));
  },

  async triggerAutoGenerate(): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke("auto-generate-blog");
      if (error) throw error;
      return data as { success: boolean; post?: BlogPost; error?: string };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  },
};
