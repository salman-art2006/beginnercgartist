import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Instagram, Youtube, Globe, Mail, Send, MessageSquare, Handshake, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#", handle: "@artist", desc: "Behind-the-scenes and WIP renders" },
  { icon: Youtube, label: "YouTube", href: "#", handle: "3D Artist", desc: "Timelapse and tutorial videos" },
  { icon: Globe, label: "ArtStation", href: "#", handle: "artist", desc: "High-res portfolio and breakdowns" },
  { icon: Mail, label: "Email", href: "mailto:hello@artist.com", handle: "hello@artist.com", desc: "Direct communication" },
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
            <p className="text-muted-foreground/50 text-sm font-body">© {new Date().getFullYear()} ENV.ART. Built with passion.</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
