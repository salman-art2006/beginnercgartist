import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import BlogCard from "@/components/BlogCard";
import { blogService } from "@/services/blogService";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { useRef } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const relatedRef = useRef(null);
  const relatedInView = useInView(relatedRef, { once: true, margin: "-50px" });

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogService.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: allPosts } = useQuery({
    queryKey: ["blog-related", slug],
    queryFn: () => blogService.list({ perPage: 100 }),
    enabled: !!post,
  });

  const relatedPosts = allPosts?.posts.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <PageMeta title="Post Not Found" description="This blog post could not be found." path={`/blog/${slug}`} />
        <div className="pt-28 pb-24 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary font-display hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Layout>
      <PageMeta title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />

      {/* Section 1: Hero / Header */}
      <article className="pt-28 pb-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </motion.div>

          <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="bg-primary/90 text-primary-foreground text-xs font-display tracking-wider uppercase px-3 py-1 rounded-full">{post.category}</span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-body mb-8">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTimeMinutes} min read</span>
              <span>By {post.author}</span>
            </div>
          </motion.header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-xl overflow-hidden border border-border shadow-card mb-10">
            <img src={post.featuredImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
          </motion.div>

          {/* Section 2: Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="prose-blog" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Tags */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-body text-secondary-foreground bg-secondary px-3 py-1 rounded-full border border-border">{tag}</span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12 bg-card border border-border rounded-xl p-8 text-center shadow-card">
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">Want the project files?</h3>
            <p className="text-muted-foreground font-body text-sm mb-4">Subscribe to get free Blender scenes, textures, and workflow breakdowns.</p>
            <Link to="/resources" className="bg-gradient-gold text-primary-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow inline-block">Get Free Files</Link>
          </motion.div>
        </div>
      </article>

      {/* Section 3: Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-card/50" ref={relatedRef}>
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={relatedInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground">Related <span className="text-gradient-gold">Posts</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedPosts.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} isInView={relatedInView} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPost;
