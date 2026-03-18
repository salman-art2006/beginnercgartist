import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolioService";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPortfolioForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: () => portfolioService.getById(id!),
    enabled: isEdit,
  });

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    longDescription: "",
    tools: "",
    software: "",
    downloadFileName: "",
  });

  // Populate form when editing
  const populated = isEdit && existing && form.title === "";
  if (populated && existing) {
    setForm({
      title: existing.title,
      category: existing.category,
      description: existing.description,
      longDescription: existing.longDescription,
      tools: existing.tools.join(", "),
      software: existing.software.join(", "),
      downloadFileName: existing.downloadFileName || "",
    });
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    setSaving(true);
    const projectData = {
      id: isEdit ? id! : form.title.toLowerCase().replace(/\s+/g, "-"),
      title: form.title,
      category: form.category,
      description: form.description,
      longDescription: form.longDescription,
      tools: form.tools.split(",").map((t) => t.trim()).filter(Boolean),
      software: form.software.split(",").map((s) => s.trim()).filter(Boolean),
      image: existing?.image || "/placeholder.svg",
      galleryImages: existing?.galleryImages || [],
      workflowSteps: existing?.workflowSteps || [],
      downloadFileId: form.downloadFileName ? form.title.toLowerCase().replace(/\s+/g, "-") + "-file" : undefined,
      downloadFileName: form.downloadFileName || undefined,
    };

    if (isEdit) {
      await portfolioService.update(id!, projectData);
      toast.success("Project updated");
    } else {
      await portfolioService.create(projectData);
      toast.success("Project created");
    }

    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    setSaving(false);
    navigate("/admin/portfolio");
  };

  const fields = [
    { key: "title", label: "Title", type: "text", placeholder: "e.g. Ancient Temple Ruins" },
    { key: "category", label: "Category", type: "text", placeholder: "e.g. Exterior, Interior, Urban" },
    { key: "description", label: "Short Description", type: "textarea", placeholder: "Brief project summary..." },
    { key: "longDescription", label: "Full Description", type: "textarea", placeholder: "Detailed project overview..." },
    { key: "tools", label: "Tools (comma-separated)", type: "text", placeholder: "Blender, Substance Painter" },
    { key: "software", label: "Software (comma-separated)", type: "text", placeholder: "Blender 3.6, Photoshop" },
    { key: "downloadFileName", label: "Download File Name (optional)", type: "text", placeholder: "e.g. ProjectFile_v2.blend" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <Link to="/admin/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          {isEdit ? "Edit Project" : "New Project"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-display text-foreground mb-2">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  value={(form as any)[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={4}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={(form as any)[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-gold text-primary-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Update Project" : "Create Project"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolioForm;
