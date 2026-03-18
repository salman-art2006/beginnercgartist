import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import SubscribeForm from "@/components/SubscribeForm";
import { useSubscriber } from "@/contexts/SubscriberContext";
import { portfolioProjects } from "@/data/portfolioData";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Download, Shield, Zap, Lock, HelpCircle, FileDown, BookOpen, Eye, Layers } from "lucide-react";

const perks = [
  { icon: Download, title: "Blender Project Files", desc: "Full .blend scenes ready to explore, learn from, and use as reference for your own work." },
  { icon: Shield, title: "Exclusive Resources", desc: "Texture packs, workflow PDFs, reference sheets, and material libraries curated for environment art." },
  { icon: Zap, title: "Early Access", desc: "Be the first to get new project files, tutorials, and announcements before anyone else." },
];

const benefits = [
  { icon: FileDown, title: "Free Project Files", desc: "Download Blender project files and assets from featured environments." },
  { icon: BookOpen, title: "Workflow Explanations", desc: "Step-by-step breakdowns of how each environment was created." },
  { icon: Layers, title: "Learning Resources", desc: "Curated tips, tutorials, and techniques for environment art." },
  { icon: Eye, title: "Behind the Scenes", desc: "Exclusive look into the creative process and decision-making." },
];

const faqs = [
  { q: "What do I get when I subscribe?", a: "Instant access to all downloadable project files across the portfolio. This includes .blend files, texture packs, and workflow breakdown documents." },
  { q: "Is it really free?", a: "Yes, completely free. I share project files to build community and help other artists learn. No hidden costs." },
  { q: "How do downloads work?", a: "After subscribing with your name and email, locked download buttons across the portfolio will become available. Click any download button to get the file." },
  { q: "Will I get spam?", a: "No. I only send occasional updates about new project files and tutorials. You can unsubscribe anytime." },
  { q: "What software do I need?", a: "Project files are created in Blender (free software). Most files work with Blender 3.6+. Specific requirements are noted on each project page." },
];

const Resources = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-50px" });
  const lockedRef = useRef(null);
  const lockedInView = useInView(lockedRef, { once: true, margin: "-50px" });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-50px" });

  const { isSubscribed } = useSubscriber();
  const downloadableProjects = portfolioProjects.filter((p) => p.downloadFileId);

  return (
    <Layout>
      <PageMeta
        title="Resources"
        description="Subscribe to get free 3D environment art project files, Blender scenes, texture packs, and workflow breakdowns."
        path="/resources"
      />

      {/* Section 1: Hero + Benefits */}
      <section className="pt-28 pb-16" ref={heroRef}>
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-14">
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Resources</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Get <span className="text-gradient-gold">Project Files</span></h1>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
              Subscribe with your name and email to unlock downloadable Blender project files, texture packs, and workflow breakdowns — completely free.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-6 text-center shadow-card hover:border-primary/30 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-shadow">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm font-body">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Subscribe Form + Perks */}
      <section className="py-16 bg-card/50" ref={formRef}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={formInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                {isSubscribed ? "You're Subscribed!" : "Subscribe to Unlock"}
              </h2>
              <SubscribeForm />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={formInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">What You'll Get</h3>
              {perks.map((p) => (
                <div key={p.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-foreground">{p.title}</h4>
                    <p className="text-muted-foreground text-sm font-body">{p.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Locked Resources Preview */}
      <section className="py-16" ref={lockedRef}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={lockedInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Available <span className="text-gradient-gold">Downloads</span></h2>
            <p className="text-muted-foreground font-body mt-2">Projects with downloadable files</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {downloadableProjects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={lockedInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <Link to={`/portfolio/${p.id}`} className="block bg-card border border-border rounded-xl overflow-hidden shadow-card hover:border-primary/30 transition-colors group">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    {!isSubscribed && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-display text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">{p.downloadFileName}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: FAQ */}
      <section className="py-16 bg-card/50" ref={faqRef}>
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={faqInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-10">
            <HelpCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Frequently <span className="text-gradient-gold">Asked</span></h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={faqInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;
