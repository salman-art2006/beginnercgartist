import { supabase } from "@/integrations/supabase/client";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  tools: string[];
  software: string[];
  image: string;
  galleryImages: string[];
  workflowSteps: { title: string; description: string }[];
  renderTime?: string;
  polyCount?: string;
  resolution?: string;
  downloadFileId?: string;
  downloadFileName?: string;
}

type PortfolioRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  long_description: string;
  tools: string[];
  software: string[];
  image: string;
  gallery_images: string[];
  workflow_steps: unknown;
  render_time: string | null;
  poly_count: string | null;
  resolution: string | null;
  download_file_id: string | null;
  download_file_name: string | null;
};

type WorkflowStep = { title: string; description: string };

function mapRow(row: PortfolioRow): PortfolioProject {
  return {
    id: row.slug || row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    longDescription: row.long_description ?? "",
    tools: row.tools ?? [],
    software: row.software ?? [],
    image: row.image ?? "/placeholder.svg",
    galleryImages: row.gallery_images ?? [],
    workflowSteps: (row.workflow_steps as WorkflowStep[]) ?? [],
    renderTime: row.render_time ?? undefined,
    polyCount: row.poly_count ?? undefined,
    resolution: row.resolution ?? undefined,
    downloadFileId: row.download_file_id ?? undefined,
    downloadFileName: row.download_file_name ?? undefined,
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
      return (data as PortfolioRow[]).map(mapRow);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<PortfolioProject | null> {
    try {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("slug", id)
        .maybeSingle();

      if (!error && data) return mapRow(data as PortfolioRow);
    } catch {
      // fall through
    }
    return null;
  },

  async create(project: PortfolioProject): Promise<PortfolioProject> {
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
      workflow_steps: project.workflowSteps,
      render_time: project.renderTime ?? null,
      poly_count: project.polyCount ?? null,
      resolution: project.resolution ?? null,
      download_file_id: project.downloadFileId ?? null,
      download_file_name: project.downloadFileName ?? null,
    });
    if (error) throw new Error(error.message);
    return project;
  },

  async update(id: string, data: Partial<PortfolioProject>): Promise<PortfolioProject | null> {
    const updateData: Record<string, unknown> = {};
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
    if (error) throw new Error(error.message);
    return this.getById(id);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("slug", id);
    return !error;
  },

  async triggerAutoGenerate(): Promise<{ success: boolean; project?: PortfolioProject; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke("auto-generate-portfolio");
      if (error) return { success: false, error: error.message };
      const result = data as { error?: string; project?: PortfolioProject };
      if (result?.error) return { success: false, error: result.error };
      return { success: true, project: result?.project };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  },
};
