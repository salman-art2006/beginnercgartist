import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_CONTACT, siteSettingsService, useContactSettings, type ContactSettings } from "@/services/siteSettingsService";

const inputCls =
  "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

const fields: { key: keyof ContactSettings; label: string; placeholder: string; hint?: string }[] = [
  { key: "email", label: "Contact email", placeholder: "you@example.com", hint: "Shown on the Contact page. Leave empty to hide it." },
  { key: "youtube", label: "YouTube", placeholder: "https://www.youtube.com/@…" },
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/…" },
  { key: "artstation", label: "ArtStation", placeholder: "https://www.artstation.com/…" },
  { key: "gumroad", label: "Gumroad", placeholder: "https://….gumroad.com/" },
];

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const { data } = useContactSettings();
  const [form, setForm] = useState<ContactSettings>(DEFAULT_CONTACT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 10) return toast.error("Use at least 10 characters");
    if (pw !== pw2) return toast.error("The two passwords do not match");
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setPwSaving(false);
    if (error) return toast.error(error.message);
    setPw("");
    setPw2("");
    toast.success("Password changed. Use the new one next time you sign in.");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await siteSettingsService.saveContact(form);
      queryClient.invalidateQueries({ queryKey: ["site-contact"] });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-xl">
        <h1 className="text-3xl text-foreground">Settings</h1>
        <p className="mb-8 mt-1 text-muted-foreground font-body">Contact details and social links used across the site.</p>
        <form onSubmit={save} className="space-y-6">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-2 block text-sm font-bold text-foreground">{f.label}</label>
              <input className={inputCls} value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
              {f.hint && <p className="mt-1.5 text-xs text-muted-foreground font-body">{f.hint}</p>}
            </div>
          ))}
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-bold text-brand-foreground hover:opacity-90 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
          </button>
        </form>

        <form onSubmit={changePassword} className="mt-14 space-y-6 border-t border-border pt-10">
          <div>
            <h2 className="text-3xl text-foreground">Admin password</h2>
            <p className="mt-1 text-sm text-muted-foreground font-body">Change the password you use to sign in to this panel.</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-foreground">New password</label>
            <input type="password" autoComplete="new-password" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 10 characters" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-foreground">Confirm new password</label>
            <input type="password" autoComplete="new-password" className={inputCls} value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </div>
          <button type="submit" disabled={pwSaving} className="flex items-center gap-2 rounded-lg border border-foreground/30 px-6 py-3 font-bold text-foreground hover:bg-secondary disabled:opacity-60">
            {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Change password
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
