import AdminLayout from "@/components/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Trash2 } from "lucide-react";
import { sb } from "@/lib/db";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => ((await sb.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? []) as Message[],
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-unread"] });
  };

  const markRead = async (m: Message) => {
    if (m.is_read) return;
    await sb.from("contact_messages").update({ is_read: true }).eq("id", m.id);
    refresh();
  };

  const remove = async (m: Message) => {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    const { error } = await sb.from("contact_messages").delete().eq("id", m.id);
    if (error) return toast.error(error.message);
    refresh();
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground font-body">Messages sent from the Contact page. Reply from your own email.</p>
      </div>

      <div className="space-y-3">
        {(messages || []).map((m) => (
          <details key={m.id} onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && markRead(m)} className="group rounded-xl border border-border bg-card shadow-card">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.is_read ? "bg-transparent" : "bg-brand"}`} aria-label={m.is_read ? "Read" : "Unread"} />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm text-foreground ${m.is_read ? "font-medium" : "font-bold"}`}>{m.name} <span className="font-normal text-muted-foreground">· {m.subject}</span></p>
                <p className="truncate text-xs text-muted-foreground font-body">{m.message}</p>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">{new Date(m.created_at).toLocaleString()}</span>
            </summary>
            <div className="border-t border-border px-5 py-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-body">{m.message}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`} className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold text-brand-foreground hover:opacity-90">
                  <Mail className="h-4 w-4" /> Reply to {m.email}
                </a>
                <button type="button" onClick={() => remove(m)} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </details>
        ))}
        {!isLoading && (!messages || messages.length === 0) && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground font-body">No messages yet.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
