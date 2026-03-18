import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { tutorialService } from "@/services/tutorialService";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BarChart3, Loader2, BookOpen } from "lucide-react";

const TutorialDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: tutorial, isLoading } = useQuery({
    queryKey: ["tutorial", slug],
    queryFn: () => tutorialService.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <Layout><div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div></Layout>;
  }

  if (!tutorial) {
    return (
      <Layout>
        <PageMeta title="Tutorial Not Found" description="" path={`/tutorials/${slug}`} />
        <div className="pt-28 pb-24 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Tutorial Not Found</h1>
          <Link to="/tutorials" className="text-primary font-display hover:underline">← Back to Tutorials</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageMeta title={tutorial.title} description={tutorial.description} path={`/tutorials/${tutorial.slug}`} />

      <article className="pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Link to="/tutorials" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Tutorials
            </Link>
          </motion.div>

          <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/90 text-primary-foreground text-xs font-display tracking-wider uppercase px-3 py-1 rounded-full">{tutorial.category}</span>
              <span className="text-xs text-muted-foreground font-body flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {tutorial.difficulty}</span>
              <span className="text-xs text-muted-foreground font-body flex items-center gap-1"><Clock className="w-3 h-3" /> {tutorial.durationMinutes} min</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{tutorial.title}</h1>
            <p className="text-muted-foreground font-body text-lg mb-8">{tutorial.description}</p>
          </motion.header>

          {tutorial.videoUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-xl overflow-hidden border border-border shadow-card mb-10 aspect-video">
              <iframe src={tutorial.videoUrl} className="w-full h-full" allowFullScreen title={tutorial.title} />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="prose-blog" dangerouslySetInnerHTML={{ __html: tutorial.content }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 bg-card border border-border rounded-xl p-8 text-center shadow-card">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">Keep Learning</h3>
            <p className="text-muted-foreground font-body text-sm mb-4">Explore more tutorials and download project files to practice.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tutorials" className="bg-gradient-gold text-primary-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow inline-block">More Tutorials</Link>
              <Link to="/resources" className="border border-border text-foreground font-display font-medium px-6 py-3 rounded-lg hover:bg-secondary transition-colors inline-block">Get Project Files</Link>
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default TutorialDetail;
