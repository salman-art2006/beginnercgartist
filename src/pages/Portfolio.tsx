import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import PortfolioCard from "@/components/PortfolioCard";
import { portfolioService } from "@/services/portfolioService";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";

const Portfolio = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: () => portfolioService.list(),
  });

  const categories = ["All", ...new Set((projects || []).map((p) => p.category))];
  const filtered = activeCategory === "All" ? (projects || []) : (projects || []).filter((p) => p.category === activeCategory);

  return (
    <Layout>
      <PageMeta
        title="Portfolio"
        description="Explore cinematic 3D environment art renders created in Blender. Download project files as a subscriber."
        path="/portfolio"
      />

      {/* Section 1: Portfolio Hero */}
      <section className="pt-28 pb-12" ref={heroRef}>
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Portfolio</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Environment <span className="text-gradient-gold">Gallery</span></h1>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
              A curated collection of 3D environment art, from ancient ruins to futuristic cityscapes. Each piece is a full scene built in Blender — click any project for detailed breakdowns, workflow insights, and downloadable files.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Filter + Grid */}
      <section className="pb-20" ref={gridRef}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-display transition-colors border ${
                  activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, i) => (
                <PortfolioCard key={project.id} project={project} index={i} isInView={gridInView} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Locked Resources CTA */}
      <section className="py-20 bg-card/50" ref={ctaRef}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Unlock All Project Files
            </h2>
            <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
              Some projects include downloadable .blend files, texture packs, and workflow documents — available exclusively to subscribers. Subscribe once to unlock everything.
            </p>
            <Link to="/resources" className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-glow inline-block">
              Subscribe to Unlock
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
