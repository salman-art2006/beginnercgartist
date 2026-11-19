import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle, Instagram, Loader2, Mail, Youtube } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { PageHeader } from "@/components/PageHeader";
import { contactSchema, contactService, TOPICS } from "@/services/contactService";
import { useContactSettings } from "@/services/siteSettingsService";

const inputCls =
  "w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

const Contact = () => {
  const [params] = useSearchParams();
  const { data: settings } = useContactSettings();
  const [form, setForm] = useState({ name: "", email: "", subject: params.get("topic") && TOPICS.includes(params.get("topic")!) ? params.get("topic")! : TOPICS[0], message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return setSent(true); // honeypot: bots fill the hidden field
    const parsed = contactSchema.safeParse({ name: form.name, email: form.email, subject: form.subject, message: form.message });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setSending(true);
    try {
      await contactService.send(parsed.data);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message");
    }
    setSending(false);
  };

  const links = [
    { label: "YouTube", href: settings?.youtube, icon: Youtube },
    { label: "Instagram", href: settings?.instagram, icon: Instagram },
  ].filter((l) => l.href);

  return (
    <Layout>
      <PageMeta
        title="Contact"
        description="Contact Salman about custom Blender environment work, collaborations, kit requests or Blender questions."
        path="/contact"
      />
      <PageHeader
        eyebrow="Contact"
        title={<>Let's <span className="text-primary">talk</span></>}
        intro="Custom environment work, a kit you want to see, a collaboration or a Blender question. Send a message and I will get back to you."
      />

      <section className="pb-24">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {sent ? (
              <div className="rounded-lg border border-border bg-card p-10 text-center shadow-card">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h2 className="text-3xl">Message sent</h2>
                <p className="mt-3 text-muted-foreground font-body">Thanks for reaching out. I will reply to the email you gave.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="mb-2 block text-sm font-bold">Name</label>
                    <input id="c-name" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="mb-2 block text-sm font-bold">Email</label>
                    <input id="c-email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-topic" className="mb-2 block text-sm font-bold">Topic</label>
                  <select id="c-topic" className={inputCls} value={form.subject} onChange={(e) => set("subject", e.target.value)}>
                    {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-message" className="mb-2 block text-sm font-bold">Message</label>
                  <textarea id="c-message" rows={7} className={`${inputCls} resize-y`} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell me what you need, and for custom work, the style, size and deadline." />
                </div>
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} /></label>
                </div>
                <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-md bg-brand px-8 py-4 font-bold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send message
                </button>
              </form>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-lg border border-border bg-card p-8 shadow-card">
              <p className="eyebrow mb-5">Elsewhere</p>
              <ul className="space-y-4">
                {settings?.email && (
                  <li>
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-3 font-bold text-foreground hover:text-primary transition-colors">
                      <Mail className="h-5 w-5" /> {settings.email}
                    </a>
                  </li>
                )}
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 font-bold text-foreground hover:text-primary transition-colors">
                      <span className="flex items-center gap-3"><l.icon className="h-5 w-5" /> {l.label}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground font-body">
                For comments about a specific video, the YouTube comments are the fastest place. For custom work, use this form.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
