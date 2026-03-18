/**
 * Portfolio Service
 *
 * Reads from database with seed-data fallback.
 * Supports AI auto-generation via edge function.
 */

import { supabase } from "@/integrations/supabase/client";
import { portfolioProjects, type PortfolioProject } from "@/data/portfolioData";

// Map DB row to PortfolioProject
function mapRow(row: any): PortfolioProject {
  return {
    id: row.slug || row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    longDescription: row.long_description || "",
    tools: row.tools || [],
    software: row.software || [],
    image: row.image || "/placeholder.svg",
    galleryImages: row.gallery_images || [],
    workflowSteps: (row.workflow_steps || []) as { title: string; description: string }[],
    renderTime: row.render_time || undefined,
    polyCount: row.poly_count || undefined,
    resolution: row.resolution || undefined,
    downloadFileId: row.download_file_id || undefined,
    downloadFileName: row.download_file_name || undefined,
  };
}

export const portfolioService = {
  async list(): Promise<PortfolioProject[]> {
    try {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const dbProjects = (data || []).map(mapRow);
      // Merge: DB projects first, then seed data
      const dbSlugs = new Set(dbProjects.map((p) => p.id));
      const seedOnly = portfolioProjects.filter((p) => !dbSlugs.has(p.id));
      return [...dbProjects, ...seedOnly];
    } catch (err) {
      console.error("portfolioService.list error:", err);
      return [...portfolioProjects];
    }
  },

  async getById(id: string): Promise<PortfolioProject | null> {
    try {
      // Try DB first
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("slug", id)
        .maybeSingle();

      if (!error && data) return mapRow(data);
    } catch {
      // fall through to seed
    }
    return portfolioProjects.find((p) => p.id === id) || null;
  },

  async create(project: PortfolioProject): Promise<PortfolioProject> {
    // For manually created projects, insert into DB
    const { error } = await supabase.from("portfolio_projects").insert({
      slug: project.id,
      title: project.title,
      category: project.category,
      description: project.description,
      long_description: project.longDescription,
      tools: project.tools,
      software: project.software,
      image: project.image,
      gallery_images: project.galleryImages,
      workflow_steps: project.workflowSteps as any,
      render_time: project.renderTime || null,
      poly_count: project.polyCount || null,
      resolution: project.resolution || null,
      download_file_id: project.downloadFileId || null,
      download_file_name: project.downloadFileName || null,
    });
    if (error) console.error("portfolioService.create error:", error);
    return project;
  },

  async update(id: string, data: Partial<PortfolioProject>): Promise<PortfolioProject | null> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.longDescription !== undefined) updateData.long_description = data.longDescription;
    if (data.tools !== undefined) updateData.tools = data.tools;
    if (data.software !== undefined) updateData.software = data.software;
    if (data.image !== undefined) updateData.image = data.image;

    const { error } = await supabase
      .from("portfolio_projects")
      .update(updateData)
      .eq("slug", id);
    if (error) console.error("portfolioService.update error:", error);
    return this.getById(id);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("slug", id);
    return !error;
  },

  /** Trigger AI auto-generation of a new portfolio project */
  async triggerAutoGenerate(): Promise<{ success: boolean; project?: any; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke("auto-generate-portfolio");
      if (error) return { success: false, error: error.message };
      if (data?.error) return { success: false, error: data.error };
      return { success: true, project: data?.project };
    } catch (err: any) {
      return { success: false, error: err.message || "Unknown error" };
    }
  },
};
