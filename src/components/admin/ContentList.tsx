import AdminLayout from "@/components/AdminLayout";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { sb } from "@/lib/db";

type Row = Record<string, unknown> & { id: string; title: string; status?: string };

interface ContentListProps {
  table: string;
  title: string;
  subtitle: string;
  newLabel: string;
  basePath: string;
  orderBy: string;
  ascending?: boolean;
  thumbKey?: string;
  publicPath?: (row: Row) => string;
  subline?: (row: Row) => ReactNode;
  queryKeys: string[][];
  empty: string;
}

const ContentList = ({ table, title, subtitle, newLabel, basePath, orderBy, ascending = false, thumbKey, publicPath, subline, queryKeys, empty }: ContentListProps) => {
  const queryClient = useQueryClient();
  const { data: rows, isLoading } = useQuery({
    queryKey: ["admin-list", table],
    queryFn: async () => ((await sb.from(table).select("*").order(orderBy, { ascending })).data ?? []) as Row[],
  });

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    const { error } = await sb.from(table).delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-list", table] });
    queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">{title}</h1>
          <p className="mt-1 text-muted-foreground font-body">{subtitle}</p>
        </div>
        <Link to={`${basePath}/new`} className="flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> {newLabel}
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <ul className="divide-y divide-border">
          {(rows || []).map((r) => (
            <li key={r.id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50">
              {thumbKey && (
                r[thumbKey] ? <img src={String(r[thumbKey])} alt="" className="h-12 w-20 shrink-0 rounded-md object-cover" /> : <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md bg-secondary"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{r.title}</p>
                <p className="truncate text-xs text-muted-foreground font-body">{subline ? subline(r) : null}</p>
              </div>
              {r.status && (
                <span className={`hidden rounded-full border px-2.5 py-1 text-xs font-semibold sm:inline ${r.status === "published" ? "border-border text-foreground" : "border-primary/30 bg-primary/10 text-primary"}`}>
                  {r.status === "published" ? "Published" : "Draft"}
                </span>
              )}
              <div className="flex shrink-0 items-center gap-1">
                {publicPath && <Link to={publicPath(r)} aria-label="View" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><ExternalLink className="h-4 w-4" /></Link>}
                <Link to={`${basePath}/edit/${r.id}`} aria-label="Edit" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></Link>
                <button type="button" aria-label="Delete" onClick={() => remove(r)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
        {!isLoading && (!rows || rows.length === 0) && <div className="p-12 text-center text-muted-foreground font-body">{empty}</div>}
      </div>
    </AdminLayout>
  );
};

export default ContentList;
