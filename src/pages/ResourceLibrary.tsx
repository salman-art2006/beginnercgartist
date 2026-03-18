import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { resourceLibraryService, type Resource } from "@/services/resourceLibraryService";
import { useSubscriber } from "@/contexts/SubscriberContext";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Lock, Package, Loader2, Search } from "lucide-react";

const ResourceLibrary = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { isSubscribed } = useSubscriber();

  const { data: resources, isLoading } = useQuery({
    queryKey: ["resource-library"],
    queryFn: () => resourceLibraryService.list(),
  });

  const categories = ["All", ...Array.from(new Set((resources || []).map(r => r.category)))];

  let filtered = activeCategory === "All" ? (resources || []) : (resources || []).filter(r => r.category === activeCategory);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q)));
  }

  return (
    <Layout>
      <PageMeta title="Resource Library" description="Download free Blender assets, materials, HDRIs, templates, and reference packs for environment art." path="/library" />

      <section className="pt-28 pb-12" ref={heroRef}>
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Library</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Resource <span className="text-gradient-gold">Library</span></h1>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
              Free and premium assets for environment artists — materials, HDRIs, templates, 3D models, and reference packs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20" ref={gridRef}>
        <div className="container mx-auto px-6">
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..."
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm" />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-display transition-colors border ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/30"}`}>
                {cat}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((res, i) => (
                <motion.div key={res.id} initial={{ opacity: 0, y: 30 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="bg-card border border-border rounded-xl p-6 shadow-card hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    {res.isPremium && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-display border border-primary/20">Premium</span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4">{res.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-body mb-4">
                    <span className="bg-secondary px-2 py-0.5 rounded border border-border">{res.fileType}</span>
                    {res.fileSize && <span>{res.fileSize}</span>}
                    <span>{res.downloadCount} downloads</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {res.tags.map(tag => (
                      <span key={tag} className="text-xs font-body text-secondary-foreground bg-secondary px-2 py-0.5 rounded border border-border">{tag}</span>
                    ))}
                  </div>
                  {isSubscribed ? (
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-gold text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity shadow-glow">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  ) : (
                    <Link to="/resources" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-muted-foreground font-display font-medium text-sm border border-border hover:border-primary/30 transition-colors">
                      <Lock className="w-4 h-4" /> Subscribe to Download
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground font-body py-20">No resources found.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ResourceLibrary;
