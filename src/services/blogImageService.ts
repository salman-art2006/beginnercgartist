/**
 * Blog Image Service
 *
 * Generates featured images for blog posts using AI via an edge function.
 * The edge function calls the Lovable AI Gateway with the Gemini image model.
 */

import { supabase } from "@/integrations/supabase/client";

export interface GenerateImageParams {
  title: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
}

export const blogImageService = {
  /**
   * Generate a featured image for a blog post based on its content.
   * Returns a base64 data URL that can be used directly as an image src.
   */
  async generate(params: GenerateImageParams): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-blog-image",
        { body: params }
      );

      if (error || data?.error) return null;

      return data?.imageUrl || null;
    } catch {
      return null;
    }
  },
};
