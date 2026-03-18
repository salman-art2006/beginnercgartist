/**
 * Blog Data Types & Service Layer
 *
 * This module defines the blog content structure and provides
 * a service abstraction that can be swapped to any backend:
 *   - Headless CMS (Sanity, Contentful, Strapi)
 *   - Database (Supabase / Lovable Cloud)
 *   - Markdown files (MDX, gray-matter)
 *   - API / webhook-based automation
 *   - AI content pipeline
 *
 * Current implementation: local seed data for development.
 * To connect a real source, replace the methods in blogService.
 */

export const BLOG_CATEGORIES = [
  "Blender",
  "Environment Art",
  "Workflow",
  "Tips",
  "Resources",
  "Project Breakdown",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or markdown — rendered by the detail page
  featuredImage: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string; // ISO date
  author: string;
  readTimeMinutes: number;
}

export interface BlogListParams {
  category?: BlogCategory;
  page?: number;
  perPage?: number;
  search?: string;
}

export interface BlogListResult {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}
