import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Search, Trash2 } from "lucide-react";
import { sb } from "@/lib/db";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscribed_at: string;
}

const AdminSubscribers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: subs, isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => ((await sb.from("subscribers").select("id,name,email,subscribed_at").order("subscribed_at", { ascending: false })).data ?? []) as Subscriber[],
  });
  const { data: downloads } = useQuery({
    queryKey: ["admin-download-count"],
    queryFn: async () => (await sb.from("download_logs").select("id", { count: "exact", head: true })).count ?? 0,
  });

  const list = subs || [];
  const q = search.trim().toLowerCase();
  const filtered = q ? list.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) : list;
  const now = Date.now();
  const since = (days: number) => list.filter((s) => now - new Date(s.subscribed_at).getTime() < days * 86400000).length;

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = ["name,email,subscribed_at", ...list.map((s) => [esc(s.name), esc(s.email), s.subscribed_at].join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const remove = async (s: Subscriber) => {
    if (!confirm(`Remove ${s.email} from the list?`)) return;
    const { error } = await sb.from("subscribers").delete().eq("id", s.id);
    if (error) return toast.error(error.message);
    queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
  };

  const stats = [
    { label: "Total", value: list.length },
    { label: "Last 7 days", value: since(7) },
    { label: "Last 30 days", value: since(30) },
    { label: "Downloads", value: downloads ?? 0 },
  ];

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground">Subscribers</h1>
          <p className="mt-1 text-muted-foreground font-body">People who joined to unlock free files</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={list.length === 0} className="flex items-center gap-2 rounded-md border border-foreground/30 px-4 py-2.5 text-sm font-bold text-foreground hover:bg-secondary disabled:opacity-40">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-anton text-4xl text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" aria-label="Search subscribers" className="w-full rounded-md border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="hidden px-5 py-4 md:table-cell">Joined</th>
              <th className="px-5 py-4 text-right">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/50">
                <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{s.name}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.email}</td>
                <td className="hidden px-5 py-3.5 text-sm text-muted-foreground md:table-cell">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                <td className="px-5 py-3.5 text-right">
                  <button type="button" aria-label={`Remove ${s.email}`} onClick={() => remove(s)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && <div className="p-12 text-center text-muted-foreground font-body">{list.length === 0 ? "No subscribers yet." : "No matches."}</div>}
      </div>
    </AdminLayout>
  );
};

export default AdminSubscribers;
