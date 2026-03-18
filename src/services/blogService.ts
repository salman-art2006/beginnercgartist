/**
 * Blog Service — reads from Supabase database, falls back to seed data.
 * Edge functions handle writes (auto-generation).
 */

import { supabase } from "@/integrations/supabase/client";
import { seedBlogPosts } from "@/data/blogSeedData";
import type { BlogPost, BlogListParams, BlogListResult, BlogCategory } from "@/data/blogTypes";

/** Map a database row to the BlogPost interface */
function mapRow(row: any): BlogPost {
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

    let dbPosts: BlogPost[] = [];
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data) {
        dbPosts = data.map(mapRow);
      }
    } catch (err) {
      console.warn("Blog DB query failed, using seed data:", err);
    }

    // Merge: DB posts first, then seed posts not already in DB
    const dbSlugs = new Set(dbPosts.map((p) => p.slug));
    const seedOnly = seedBlogPosts.filter((p) => !dbSlugs.has(p.slug));
    let allPosts = [...dbPosts, ...seedOnly];

    // Apply filters
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
      if (data) return mapRow(data);
    } catch (err) {
      console.warn("Blog DB slug query failed, using seed data:", err);
    }

    return seedBlogPosts.find((p) => p.slug === slug) || null;
  },

  async getLatest(count: number = 3): Promise<BlogPost[]> {
    const result = await this.list({ perPage: count });
    return result.posts;
  },

  async getCategories(): Promise<{ category: BlogCategory; count: number }[]> {
    // Use the merged list to get accurate counts
    const result = await this.list({ perPage: 1000 });
    const counts = new Map<string, number>();
    for (const post of result.posts) {
      counts.set(post.category, (counts.get(post.category) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([category, count]) => ({
      category: category as BlogCategory,
      count,
    }));
  },

  /** Trigger the auto-generate-blog edge function */
  async triggerAutoGenerate(): Promise<{ success: boolean; post?: any; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke("auto-generate-blog");
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Auto-generate failed:", err);
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  },
};
