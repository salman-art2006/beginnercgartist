import AdminLayout from "@/components/AdminLayout";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Pencil, Save, Upload, X } from "lucide-react";
import {
  RESOURCE_CATEGORIES,
  MAX_UPLOAD_MB,
  formatBytes,
  resourceLibraryService,
  slugify,
  type ResourceInput,
} from "@/services/resourceLibraryService";

const inputCls =
  "w-full bg-card border border-border rounded-lg px-4 py-2.5 text-[15px] text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow";

const Field = ({ label, hint, children, className = "" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <label className="mb-1.5 block text-sm font-bold text-foreground">{label}</label>
    {children}
    {hint && <p className="mt-1.5 text-xs leading-snug text-muted-foreground font-body">{hint}</p>}
  </div>
);

const emptyForm: ResourceInput = {
  slug: "", title: "", description: "", category: "Scenes", fileType: ".blend", fileSize: "", thumbnail: "",
  isPremium: false, priceLabel: "", buyUrl: "", downloadUrl: "", filePath: "", tags: [], status: "published",
};

const AdminResourceForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ["admin-resource", id],
    queryFn: () => resourceLibraryService.getById(id!),
    enabled: isEdit,
  });

  const [form, setForm] = useState<ResourceInput>(emptyForm);
  const [tagsText, setTagsText] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [editSlug, setEditSlug] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const imgInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && existing) {
      const { id: _id, downloadCount: _dc, createdAt: _ca, ...rest } = existing;
      setForm({ ...emptyForm, ...rest, priceLabel: rest.priceLabel ?? "", buyUrl: rest.buyUrl ?? "", downloadUrl: rest.downloadUrl ?? "", filePath: rest.filePath ?? "", fileSize: rest.fileSize ?? "" });
      setTagsText(rest.tags.join(", "));
      setSlugTouched(true);
      if (rest.filePath) setFileName(rest.filePath.split("/").pop() || "");
    }
  }, [existing, isEdit]);

  const set = <K extends keyof ResourceInput>(key: K, value: ResourceInput[K]) => setForm((p) => ({ ...p, [key]: value }));
  const onTitle = (title: string) => setForm((p) => ({ ...p, title, slug: slugTouched ? p.slug : slugify(title) }));

  const onImage = async (file?: File) => {
    if (!file) return;
    setUploadingImg(true);
    try {
      set("thumbnail", await resourceLibraryService.uploadMedia(file));
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
    setUploadingImg(false);
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    setUploadingFile(true);
    try {
      const path = await resourceLibraryService.uploadFile(file, form.slug || slugify(form.title));
      const ext = file.name.includes(".") ? "." + file.name.split(".").pop()!.toLowerCase() : form.fileType;
      setForm((p) => ({ ...p, filePath: path, fileSize: formatBytes(file.size), fileType: ext }));
      setFileName(file.name);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
    setUploadingFile(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.slug.trim()) return toast.error("Slug is required");
    if (form.isPremium && !form.buyUrl?.trim()) return toast.error("Paid items need a buy link (for example your Gumroad page)");
    if (!form.isPremium && !form.filePath && !form.downloadUrl?.trim()) return toast.error("Free items need a file upload or a download link");

    const payload: ResourceInput = { ...form, title: form.title.trim(), slug: slugify(form.slug), tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean) };
    setSaving(true);
    try {
      if (isEdit) await resourceLibraryService.update(id!, payload);
      else await resourceLibraryService.create(payload);
      toast.success(isEdit ? "Saved" : "Created");
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      navigate("/admin/resources");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit}>
        <div className="sticky top-[108px] z-20 -mx-5 mb-8 border-b border-border bg-background/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:top-0 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link to="/admin/resources" className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to project files
              </Link>
              <h1 className="text-3xl leading-none text-foreground">{isEdit ? "Edit project file" : "New project file"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/resources" className="hidden rounded-md px-4 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground sm:block">Cancel</Link>
              <button type="submit" disabled={saving || uploadingImg || uploadingFile} className="flex items-center gap-2 rounded-md bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground hover:opacity-90 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <Field label="Title">
              <input className={inputCls} value={form.title} onChange={(e) => onTitle(e.target.value)} placeholder="e.g. Abandoned Gas Station (Blender scene)" />
            </Field>
            <div className="-mt-2 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
              {editSlug ? (
                <input autoFocus className={`${inputCls} max-w-md py-1.5 text-sm`} value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} onBlur={() => setEditSlug(false)} />
              ) : (
                <>
                  <span>Slug: <span className="font-semibold text-foreground">{form.slug || "…"}</span></span>
                  <button type="button" onClick={() => setEditSlug(true)} className="inline-flex items-center gap-1 text-xs font-bold hover:text-foreground"><Pencil className="h-3 w-3" /> Edit</button>
                </>
              )}
            </div>

            <Field label="Description" hint="What the buyer gets: what is in the file, Blender version, render engine, what they can learn.">
              <textarea className={`${inputCls} resize-y`} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Full realistic gas station scene made in Blender 5.2 with Cycles. Includes the .blend file with textures packed…" />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Tags" hint="Comma separated" className="sm:col-span-3">
                <input className={inputCls} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Blender 5.2, Cycles, Realistic" />
              </Field>
            </div>

            <fieldset className="rounded-xl border border-border bg-secondary/40 p-5">
              <legend className="px-2 text-sm font-bold text-foreground">Access</legend>
              <div className="mb-5 grid grid-cols-2 gap-3">
                {[{ v: false, l: "Free", d: "email unlocks download" }, { v: true, l: "Paid", d: "buy link on Gumroad" }].map((o) => (
                  <button key={o.l} type="button" onClick={() => set("isPremium", o.v)} className={`rounded-lg border px-4 py-3 text-left transition-colors ${form.isPremium === o.v ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card text-foreground hover:bg-secondary"}`}>
                    <span className="block text-sm font-bold">{o.l}</span>
                    <span className="block text-xs opacity-80">{o.d}</span>
                  </button>
                ))}
              </div>

              {form.isPremium ? (
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Price label" hint='Like "$12".'>
                    <input className={inputCls} value={form.priceLabel} onChange={(e) => set("priceLabel", e.target.value)} placeholder="$12" />
                  </Field>
                  <Field label="Buy link" hint="Your Gumroad product page." className="sm:col-span-2">
                    <input className={inputCls} value={form.buyUrl} onChange={(e) => set("buyUrl", e.target.value)} placeholder="https://….gumroad.com/l/…" />
                  </Field>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={`Upload file (max ${MAX_UPLOAD_MB} MB)`} hint="Private. Only subscribers can download it.">
                    <button type="button" onClick={() => fileInput.current?.click()} disabled={uploadingFile} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/30 bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary">
                      {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadingFile ? "Uploading…" : fileName ? "Replace file" : "Choose file"}
                    </button>
                    {fileName && <p className="mt-1.5 truncate text-xs text-muted-foreground">{fileName} {form.fileSize && `· ${form.fileSize}`}</p>}
                    <input ref={fileInput} type="file" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
                  </Field>
                  <Field label="Or paste a link" hint="For files over 50 MB: Drive, Dropbox, Gumroad.">
                    <input className={inputCls} value={form.downloadUrl} onChange={(e) => set("downloadUrl", e.target.value)} placeholder="https://drive.google.com/…" />
                  </Field>
                </div>
              )}

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="File type"><input className={inputCls} value={form.fileType} onChange={(e) => set("fileType", e.target.value)} placeholder=".blend" /></Field>
                <Field label="File size (optional)"><input className={inputCls} value={form.fileSize} onChange={(e) => set("fileSize", e.target.value)} placeholder="320 MB" /></Field>
              </div>
            </fieldset>
          </div>

          <aside className="space-y-5 self-start rounded-xl border border-border bg-secondary/40 p-5 xl:sticky xl:top-28">
            <Field label="Status" hint="Draft is hidden from visitors.">
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as "draft" | "published")}>
                <option value="published">Published</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </Field>
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {RESOURCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Cover image">
              {form.thumbnail ? (
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <img src={form.thumbnail} alt="Cover preview" className="aspect-video w-full object-cover" />
                  <button type="button" aria-label="Remove cover" onClick={() => set("thumbnail", "")} className="absolute right-2 top-2 rounded-md bg-black/70 p-1.5 text-white hover:bg-black"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <button type="button" onClick={() => imgInput.current?.click()} disabled={uploadingImg} className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/30 bg-card text-sm font-semibold text-foreground hover:bg-secondary">
                  {uploadingImg ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                  {uploadingImg ? "Uploading…" : "Click to upload"}
                </button>
              )}
              <input ref={imgInput} type="file" accept="image/*" className="hidden" onChange={(e) => { onImage(e.target.files?.[0]); e.target.value = ""; }} />
            </Field>
          </aside>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminResourceForm;
