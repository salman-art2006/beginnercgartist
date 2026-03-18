import AdminLayout from "@/components/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolioService";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const AdminPortfolio = () => {
  const queryClient = useQueryClient();
  const { data: projects } = useQuery({ queryKey: ["admin-projects"], queryFn: () => portfolioService.list() });
  const [generating, setGenerating] = useState(false);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await portfolioService.delete(id);
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
    toast.success(`"${title}" deleted`);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    toast.info("Generating portfolio project with AI...");
    const result = await portfolioService.triggerAutoGenerate();
    setGenerating(false);
    if (result.success) {
      toast.success(`New project created: "${result.project?.title}"`);
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-projects"] });
    } else {
      toast.error(result.error || "Generation failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground font-body mt-1">Manage your environment art projects</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-primary/10 text-primary font-display font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm border border-primary/20"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating..." : "Generate Project"}
          </button>
          <Link
            to="/admin/portfolio/new"
            className="bg-gradient-gold text-primary-foreground font-display font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider">Project</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Tools</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Source</th>
              <th className="text-right px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(projects || []).map((p) => (
              <tr key={p.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-display text-sm font-medium text-foreground">{p.title}</p>
                      <p className="text-muted-foreground text-xs font-body truncate max-w-[200px]">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border font-body">{p.category}</span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {p.tools.slice(0, 2).map((t) => (
                      <span key={t} className="text-xs text-muted-foreground font-body">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded font-body ${
                    p.image.startsWith("data:") || p.image.startsWith("http")
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {p.image.startsWith("data:") || p.image.startsWith("http") ? "AI Generated" : "Static"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/portfolio/${p.id}`} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link to={`/admin/portfolio/edit/${p.id}`} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title)} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!projects || projects.length === 0) && (
          <div className="p-12 text-center text-muted-foreground font-body">No projects yet. Create your first one.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
