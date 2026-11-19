import AdminLayout from "@/components/AdminLayout";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Pencil, Plus, Save, Upload, X } from "lucide-react";
import { friendlyError, sb, slugify, uploadMedia } from "@/lib/db";

export type FieldType = "text" | "textarea" | "select" | "image" | "images" | "tags" | "number" | "checkbox" | "url";

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  options?: string[];
  rows?: number;
  required?: boolean;
  half?: boolean;
  /** Show in the narrow right-hand column (status, cover image, category…). */
  side?: boolean;
}

interface ContentFormProps {
  table: string;
  title: string;
  backTo: string;
  backLabel: string;
  fields: FieldSpec[];
  defaults: Record<string, unknown>;
  queryKeys: string[][];
  slugField?: string;
  mediaFolder: string;
  publicPath?: (slug: string) => string;
}

export const inputCls =
  "w-full bg-card border border-border rounded-lg px-4 py-2.5 text-[15px] text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow";

const ytId = (url: string) => url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];

const ImageUpload = ({ value, onChange, folder }: { value: string; onChange: (v: string) => void; folder: string }) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState(false);
  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadMedia(file, folder));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
    setBusy(false);
  };
  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img src={value} alt="Preview" className="aspect-video w-full object-cover" />
          <button type="button" aria-label="Remove image" onClick={() => onChange("")} className="absolute right-2 top-2 rounded-md bg-black/70 p-1.5 text-white hover:bg-black"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/30 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {busy ? "Uploading…" : "Click to upload"}
        </button>
      )}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
      {link ? (
        <input autoFocus className={`${inputCls} mt-2 text-sm`} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image link or /images/… path" />
      ) : (
        <button type="button" onClick={() => setLink(true)} className="mt-2 text-xs font-bold text-muted-foreground hover:text-foreground">Or paste a link instead</button>
      )}
    </div>
  );
};

const ImageList = ({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(Array.from(files).map((f) => uploadMedia(f, folder)));
      onChange([...value, ...urls]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
    setBusy(false);
  };
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((u, i) => (
          <div key={u + i} className="relative h-20 w-32 overflow-hidden rounded-md border border-border">
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded bg-black/70 p-1 text-white hover:bg-black"><X className="h-3 w-3" /></button>
          </div>
        ))}
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="flex h-20 w-32 items-center justify-center rounded-md border border-dashed border-foreground/30 text-foreground hover:bg-secondary">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
    </div>
  );
};

const ContentForm = ({ table, title, backTo, backLabel, fields, defaults, queryKeys, slugField = "slug", mediaFolder, publicPath }: ContentFormProps) => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editSlug, setEditSlug] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: existing } = useQuery({
    queryKey: ["admin-row", table, id],
    queryFn: async () => (await sb.from(table).select("*").eq("id", id!).maybeSingle()).data as Record<string, unknown> | null,
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && existing) {
      const next: Record<string, unknown> = { ...defaults };
      for (const f of fields) {
        const v = existing[f.key];
        if (v !== undefined && v !== null) next[f.key] = f.type === "tags" ? (v as string[]).join(", ") : v;
      }
      next[slugField] = existing[slugField];
      setValues(next);
      setSlugTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing, isEdit]);

  const set = (key: string, value: unknown) => setValues((p) => ({ ...p, [key]: value }));
  const imageKey = fields.find((f) => f.type === "image")?.key;

  const onText = (key: string, v: string) => {
    setValues((p) => ({ ...p, [key]: v, ...(key === "title" && !slugTouched ? { [slugField]: slugify(v) } : {}) }));
  };

  // Paste a YouTube link: fill the thumbnail and (best effort) the title automatically.
  const onVideoUrl = (url: string) => {
    set("video_url", url);
    const vid = ytId(url);
    if (!vid) return;
    if (imageKey) setValues((p) => (p[imageKey] ? p : { ...p, [imageKey]: `https://img.youtube.com/vi/${vid}/maxresdefault.jpg` }));
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.title) setValues((p) => (p.title ? p : { ...p, title: j.title, ...(slugTouched ? {} : { [slugField]: slugify(j.title) }) }));
      })
      .catch(() => undefined);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !String(values[f.key] ?? "").trim()) return toast.error(`${f.label} is required`);
    }
    const row: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.key];
      if (f.type === "tags") row[f.key] = String(v ?? "").split(",").map((t) => t.trim()).filter(Boolean);
      else if (f.type === "number") row[f.key] = Number(v) || 0;
      else if (f.type === "url" || f.type === "image") row[f.key] = typeof v === "string" && v.trim() ? v.trim() : f.type === "url" ? null : "";
      else row[f.key] = v;
    }
    row[slugField] = slugify(String(values[slugField] ?? values.title ?? ""));
    if (!row[slugField]) return toast.error("Please add a title");

    setSaving(true);
    const q = isEdit ? sb.from(table).update(row).eq("id", id!) : sb.from(table).insert(row);
    const { error } = await q;
    setSaving(false);
    if (error) return toast.error(friendlyError(error));
    toast.success(isEdit ? "Saved" : "Created");
    queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
    navigate(backTo);
  };

  const renderField = (f: FieldSpec) => {
    const v = values[f.key];
    switch (f.type) {
      case "textarea":
        return <textarea className={`${inputCls} resize-y`} rows={f.rows ?? 4} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />;
      case "select":
        return (
          <select className={inputCls} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}>
            {f.options!.map((o) => <option key={o} value={o}>{o === "published" ? "Published" : o === "draft" ? "Draft (hidden)" : o}</option>)}
          </select>
        );
      case "image":
        return <ImageUpload value={String(v ?? "")} onChange={(x) => set(f.key, x)} folder={mediaFolder} />;
      case "images":
        return <ImageList value={(v as string[]) ?? []} onChange={(x) => set(f.key, x)} folder={mediaFolder} />;
      case "checkbox":
        return (
          <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
            <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--brand))]" checked={!!v} onChange={(e) => set(f.key, e.target.checked)} />
            {f.placeholder || f.label}
          </label>
        );
      case "number":
        return <input type="number" min={0} className={inputCls} value={String(v ?? 0)} onChange={(e) => set(f.key, e.target.value)} />;
      default:
        return (
          <input
            type={f.type === "url" ? "url" : "text"}
            className={inputCls}
            value={String(v ?? "")}
            onChange={(e) => (f.key === "video_url" ? onVideoUrl(e.target.value) : onText(f.key, e.target.value))}
            placeholder={f.placeholder}
          />
        );
    }
  };

  const block = (f: FieldSpec) => (
    <div key={f.key} className={f.half ? "" : "col-span-2"}>
      {f.type !== "checkbox" && (
        <label className="mb-1.5 block text-sm font-bold text-foreground">
          {f.label}{f.required ? " *" : ""}
        </label>
      )}
      {renderField(f)}
      {f.hint && <p className="mt-1.5 text-xs leading-snug text-muted-foreground font-body">{f.hint}</p>}
    </div>
  );

  const main = fields.filter((f) => !f.side);
  const side = fields.filter((f) => f.side);
  const slug = String(values[slugField] ?? "");

  return (
    <AdminLayout>
      <form id="content-form" onSubmit={submit}>
        <div className="sticky top-[108px] z-20 -mx-5 mb-8 border-b border-border bg-background/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:top-0 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link to={backTo} className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
              </Link>
              <h1 className="truncate text-3xl leading-none text-foreground">{isEdit ? `Edit ${title}` : `New ${title}`}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link to={backTo} className="hidden rounded-md px-4 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground sm:block">Cancel</Link>
              <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid grid-cols-2 content-start gap-x-5 gap-y-5">
            {main.flatMap((f, i) => {
              const el = block(f);
              if (i !== 0) return [el];
              return [
                el,
                <div key="slug" className="col-span-2 -mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  {editSlug ? (
                    <input autoFocus className={`${inputCls} max-w-md py-1.5 text-sm`} value={slug} onChange={(e) => { setSlugTouched(true); set(slugField, e.target.value); }} onBlur={() => setEditSlug(false)} />
                  ) : (
                    <>
                      <span>Page address: <span className="font-semibold text-foreground">{publicPath ? publicPath(slug || "…") : `/${slug || "…"}`}</span></span>
                      <button type="button" onClick={() => setEditSlug(true)} className="inline-flex items-center gap-1 text-xs font-bold hover:text-foreground"><Pencil className="h-3 w-3" /> Edit</button>
                    </>
                  )}
                </div>,
              ];
            })}
          </div>

          {side.length > 0 && (
            <aside className="grid grid-cols-2 content-start gap-x-4 gap-y-5 self-start rounded-xl border border-border bg-secondary/40 p-5 xl:sticky xl:top-28">
              {side.map(block)}
            </aside>
          )}
        </div>
      </form>
    </AdminLayout>
  );
};

export default ContentForm;
