import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Globe, Send, MessageSquare, Handshake, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const ArtStationIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.164-1.333H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z" />
  </svg>
);

const GumroadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.2c-3.978 0-7.2-3.222-7.2-7.2S8.022 4.8 12 4.8c2.467 0 4.64 1.24 5.94 3.13l-2.07 1.16A3.84 3.84 0 0 0 12 7.68c-2.386 0-4.32 1.934-4.32 4.32S9.614 16.32 12 16.32c1.813 0 3.368-1.115 4.03-2.7H12v-2.4h6.48c.048.348.072.703.072 1.06 0 3.977-3.222 6.92-6.552 6.92z" />
  </svg>
);

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/beginnercg_artist/", handle: "@beginnercg_artist", desc: "Behind-the-scenes and WIP renders" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/channel/UC7CvfvvGI6ipO3rMd3dlX9Q", handle: "@BeginnerCGArtist", desc: "Timelapse and tutorial videos" },
  { icon: ArtStationIcon, label: "ArtStation", href: "https://www.artstation.com/beginnercgartist", handle: "@beginnercgartist", desc: "High-res portfolio and breakdowns" },
  { icon: GumroadIcon, label: "Gumroad", href: "https://beginnercgartist.gumroad.com/", handle: "beginnercgartist", desc: "Project files and resources" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

const Contact = () => {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-50px" });
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-50px" });
  const socialRef = useRef(null);
  const socialInView = useInView(socialRef, { once: true, margin: "-50px" });
  const collabRef = useRef(null);
  const collabInView = useInView(collabRef, { once: true, margin: "-50px" });

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSending(true);
    // --- REPLACE WITH REAL API ---
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Layout>
      <PageMeta title="Contact" description="Get in touch with a 3D Environment Artist. Collaboration inquiries, questions, and social links." path="/contact" />

      {/* Section 1: Contact Intro */}
      <section className="pt-28 pb-12" ref={introRef}>
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={introInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Connect</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Let's <span className="text-gradient-gold">Create</span></h1>
            <p className="text-muted-foreground font-body text-lg">
              Whether you have a question about my work, want to collaborate on a project, or just want to say hi — I'd love to hear from you. Drop me a message or find me on social media.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Contact Form */}
      <section className="py-12" ref={formRef}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-5 gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={formInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="lg:col-span-3">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-display text-foreground mb-2">Name</label>
                    <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Your name" maxLength={100} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-display text-foreground mb-2">Email</label>
                    <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="your@email.com" maxLength={255} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-display text-foreground mb-2">Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} placeholder="What's this about?" maxLength={200} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-display text-foreground mb-2">Message</label>
                  <textarea value={form.message} onChange={(e) => handleChange("message", e.target.value)} placeholder="Tell me more..." rows={5} maxLength={2000} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
                <button type="submit" disabled={sending} className="bg-gradient-gold text-primary-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow flex items-center gap-2">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Message
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={formInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Quick Info</h2>
              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <div className="flex items-start gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">Response Time</p>
                    <p className="text-muted-foreground text-sm font-body">Usually within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">Location</p>
                    <p className="text-muted-foreground text-sm font-body">Working remotely, worldwide</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h3 className="font-display text-sm font-semibold text-foreground mb-3">Best For</h3>
                <ul className="space-y-2 text-muted-foreground text-sm font-body">
                  <li>• Collaboration inquiries</li>
                  <li>• Commission requests</li>
                  <li>• Speaking / workshop invitations</li>
                  <li>• General questions about 3D art</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Social Links */}
      <section className="py-16 bg-card/50" ref={socialRef}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={socialInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Find Me <span className="text-gradient-gold">Online</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {socials.map((s, i) => (
              <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} animate={socialInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group shadow-card text-center">
                <s.icon className="w-7 h-7 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-display text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-primary text-xs mt-1 font-body">{s.handle}</p>
                <p className="text-muted-foreground text-xs mt-2 font-body">{s.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Collaboration */}
      <section className="py-16" ref={collabRef}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={collabInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <Handshake className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Open to Collaboration</h2>
            <p className="text-muted-foreground font-body text-lg mb-4 leading-relaxed">
              I'm always interested in creative collaborations — whether it's contributing environment art to a game project, creating visuals for a film, or co-creating educational content with fellow artists. If you have an idea, let's talk.
            </p>
            <p className="text-muted-foreground/50 text-sm font-body">© {new Date().getFullYear()} Beginner CG Artist. Built with passion.</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
