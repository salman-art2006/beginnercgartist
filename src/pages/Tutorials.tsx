import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { tutorialService, type Tutorial } from "@/services/tutorialService";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, BarChart3, Loader2 } from "lucide-react";

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-primary/10 text-primary border-primary/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Tutorials = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: tutorials, isLoading } = useQuery({
    queryKey: ["tutorials"],
    queryFn: () => tutorialService.list(),
  });

  const categories = ["All", ...Array.from(new Set((tutorials || []).map(t => t.category)))];
  const filtered = activeCategory === "All" ? (tutorials || []) : (tutorials || []).filter(t => t.category === activeCategory);

  return (
    <Layout>
      <PageMeta title="Tutorials" description="Step-by-step Blender tutorials for environment art — from beginner fundamentals to advanced techniques." path="/tutorials" />

      <section className="pt-28 pb-12" ref={heroRef}>
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Learn</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Blender <span className="text-gradient-gold">Tutorials</span></h1>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
              Step-by-step guides covering environment art fundamentals, advanced techniques, and professional workflows in Blender.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20" ref={gridRef}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-display transition-colors border ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/30"}`}>
                {cat}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((tut, i) => (
                <motion.article key={tut.id} initial={{ opacity: 0, y: 40 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:border-primary/30 transition-colors flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-xs font-display px-3 py-1 rounded-full border ${difficultyColor[tut.difficulty] || difficultyColor.Beginner}`}>
                        {tut.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tut.durationMinutes} min
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{tut.title}</h3>
                    <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4 flex-1">{tut.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tut.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs font-body text-secondary-foreground bg-secondary px-2 py-0.5 rounded border border-border">{tag}</span>
                      ))}
                    </div>
                    <Link to={`/tutorials/${tut.slug}`} className="flex items-center gap-1.5 text-primary text-sm font-display font-medium hover:gap-3 transition-all">
                      Start Tutorial <BarChart3 className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Tutorials;
