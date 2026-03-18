import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import PageMeta from "@/components/PageMeta";
import BlogCard from "@/components/BlogCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { portfolioProjects } from "@/data/portfolioData";
import { blogService } from "@/services/blogService";
import { FileDown, BookOpen, Layers, Eye } from "lucide-react";

const benefits = [
  { icon: FileDown, title: "Free Project Files", desc: "Download Blender project files and assets from featured environments." },
  { icon: BookOpen, title: "Workflow Explanations", desc: "Step-by-step breakdowns of how each environment was created." },
  { icon: Layers, title: "Learning Resources", desc: "Curated tips, tutorials, and techniques for environment art." },
  { icon: Eye, title: "Behind the Scenes", desc: "Exclusive look into the creative process and decision-making." },
];

const Home = () => {
  const benefitsRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-50px" });
  const previewRef = useRef(null);
  const previewInView = useInView(previewRef, { once: true, margin: "-50px" });
  const blogRef = useRef(null);
  const blogInView = useInView(blogRef, { once: true, margin: "-50px" });

  const { data: latestPosts } = useQuery({
    queryKey: ["latest-posts"],
    queryFn: () => blogService.getLatest(3),
  });

  return (
    <Layout>
      <PageMeta
        title="Home"
        description="Independent 3D Environment Artist creating immersive digital worlds in Blender. Get free project files, workflow breakdowns, and learning resources."
        path="/"
      />
      <HeroSection />

      {/* Portfolio Preview */}
      <section className="py-24" ref={previewRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={previewInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Featured Work</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              Environment <span className="text-gradient-gold">Gallery</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioProjects.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                animate={previewInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={`/portfolio/${p.id}`} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-card block">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-primary text-xs font-display tracking-widest uppercase">{p.category}</span>
                    <h3 className="font-display text-lg font-semibold text-foreground mt-1">{p.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/portfolio"
              className="border border-border text-foreground font-display font-medium px-8 py-3 rounded-lg hover:bg-secondary transition-colors inline-block"
            >
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="py-24" ref={blogRef}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={blogInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Latest Posts</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold">
                Art &amp; <span className="text-gradient-gold">Insights</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} isInView={blogInView} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/blog"
                className="border border-border text-foreground font-display font-medium px-8 py-3 rounded-lg hover:bg-secondary transition-colors inline-block"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="py-24 bg-card/50" ref={benefitsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Subscriber Benefits</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              What You <span className="text-gradient-gold">Get</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 40 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center shadow-card hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-shadow">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/resources"
              className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow inline-block"
            >
              Get Free Project Files
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
