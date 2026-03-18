import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import BlogCard from "@/components/BlogCard";
import { blogService } from "@/services/blogService";
import { BLOG_CATEGORIES, type BlogCategory } from "@/data/blogTypes";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Rss } from "lucide-react";

const Blog = () => {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });
  const [activeCategory, setActiveCategory] = useState<BlogCategory | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", activeCategory],
    queryFn: () => blogService.list({ category: activeCategory, perPage: 12 }),
  });

  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => blogService.getCategories(),
  });

  return (
    <Layout>
      <PageMeta
        title="Blog"
        description="Blender tips, environment art workflows, scene breakdowns, and 3D artist resources. New posts daily."
        path="/blog"
      />

      {/* Section 1: Blog Hero */}
      <section className="pt-28 pb-12" ref={heroRef}>
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Blog</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Art &amp; <span className="text-gradient-gold">Insights</span></h1>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
              Deep dives into Blender techniques, environment art theory, scene breakdowns, and the creative journey of building a personal brand as a 3D artist. New content published regularly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Categories + Posts Grid */}
      <section className="pb-16" ref={gridRef}>
        <div className="container mx-auto px-6">
          {/* Category Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-display transition-colors border ${
                !activeCategory ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((cat) => {
              const count = categories?.find((c) => c.category === cat)?.count || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-display transition-colors border ${
                    activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {cat}{count > 0 && <span className="ml-1 opacity-60">({count})</span>}
                </button>
              );
            })}
          </motion.div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : data && data.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.posts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} isInView={gridInView} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground font-body py-20">No posts found in this category yet.</p>
          )}
        </div>
      </section>

      {/* Section 3: Subscribe CTA */}
      <section className="py-20 bg-card/50" ref={ctaRef}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <Rss className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Stay Updated</h2>
            <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
              Subscribe to get notified about new blog posts, project file releases, and exclusive content for the 3D art community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resources" className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow inline-block">Subscribe for Free</Link>
              <Link to="/portfolio" className="border border-border text-foreground font-display font-medium px-8 py-3 rounded-lg hover:bg-secondary transition-colors inline-block">Explore Portfolio</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
