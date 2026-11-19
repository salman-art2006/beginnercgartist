import AdminLayout from "@/components/AdminLayout";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink, Package } from "lucide-react";
import { resourceLibraryService } from "@/services/resourceLibraryService";

const AdminResources = () => {
  const queryClient = useQueryClient();
  const { data: resources, isLoading } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: () => resourceLibraryService.list(),
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await resourceLibraryService.remove(id);
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success(`"${title}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Project files</h1>
          <p className="mt-1 text-muted-foreground font-body">Free and paid files, kits and add-ons shown in the Library</p>
        </div>
        <Link to="/admin/resources/new" className="flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> New project file
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">File</th>
              <th className="hidden px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground md:table-cell">Type</th>
              <th className="hidden px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground md:table-cell">Status</th>
              <th className="hidden px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground lg:table-cell">Downloads</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(resources || []).map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-secondary/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt="" className="h-10 w-16 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-10 w-16 items-center justify-center rounded-md bg-secondary"><Package className="h-4 w-4 text-muted-foreground" /></div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.title}</p>
                      <p className="max-w-[260px] truncate text-xs text-muted-foreground font-body">{r.category} · {r.fileType}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${r.isPremium ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-secondary text-secondary-foreground"}`}>
                    {r.isPremium ? `Paid${r.priceLabel ? " · " + r.priceLabel : ""}` : "Free"}
                  </span>
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  <span className={`text-xs font-semibold ${r.status === "published" ? "text-foreground" : "text-muted-foreground"}`}>
                    {r.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="hidden px-6 py-4 text-sm text-muted-foreground lg:table-cell">{r.downloadCount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link to="/library" aria-label="View library" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><ExternalLink className="h-4 w-4" /></Link>
                    <Link to={`/admin/resources/edit/${r.id}`} aria-label="Edit" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></Link>
                    <button type="button" aria-label="Delete" onClick={() => handleDelete(r.id, r.title)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && (!resources || resources.length === 0) && (
          <div className="p-12 text-center text-muted-foreground font-body">No project files yet. Click "New project file" to add your first one.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminResources;
