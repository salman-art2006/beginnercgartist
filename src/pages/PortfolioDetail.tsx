import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { portfolioService } from "@/services/portfolioService";
import { useSubscriber } from "@/contexts/SubscriberContext";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Download, Loader2, Cpu, Clock, Box, Maximize } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import ProtectedImage from "@/components/ProtectedImage";

const Scene3DViewer = lazy(() => import("@/components/Scene3DViewer"));

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSubscribed, requestDownload } = useSubscriber();
  const [downloading, setDownloading] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["portfolio-project", id],
    queryFn: () => portfolioService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <PageMeta title="Project Not Found" description="" path={`/portfolio/${id}`} />
        <div className="pt-28 pb-24 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Link to="/portfolio" className="text-primary font-display hover:underline">← Back to Portfolio</Link>
        </div>
      </Layout>
    );
  }

  const handleDownload = async () => {
    if (!isSubscribed) {
      navigate("/resources");
      return;
    }
    if (!project.downloadFileId) return;
    setDownloading(true);
    const url = await requestDownload(project.downloadFileId);
    setDownloading(false);
    if (url) {
      toast.success(`Download ready: ${project.downloadFileName}`);
    } else {
      toast.error("Download failed. Please try again.");
    }
  };

  const stats = [
    project.renderTime && { icon: Clock, label: "Render Time", value: project.renderTime },
    project.polyCount && { icon: Box, label: "Poly Count", value: project.polyCount },
    project.resolution && { icon: Maximize, label: "Resolution", value: project.resolution },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <Layout>
      <PageMeta title={project.title} description={project.description} path={`/portfolio/${project.id}`} />

      {/* Hero Banner */}
      <section className="relative pt-20">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <ProtectedImage src={project.image} alt={project.title} className="w-full h-full object-cover" watermark />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-30" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-40">
            <div className="container mx-auto">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>
                <span className="block text-primary text-xs font-display tracking-widest uppercase mb-2">{project.category}</span>
                <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">{project.title}</h1>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Stats */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Project Overview</h2>
              <p className="text-muted-foreground font-body leading-relaxed text-lg">{project.longDescription}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h3 className="font-display text-sm tracking-widest uppercase text-primary mb-3">Tools & Software</h3>
                <div className="flex flex-wrap gap-2">
                  {project.software.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-xs font-body text-secondary-foreground bg-secondary px-3 py-1.5 rounded-lg border border-border">
                      <Cpu className="w-3 h-3 text-primary" />{s}
                    </span>
                  ))}
                </div>
              </div>
              {stats.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-4">
                  <h3 className="font-display text-sm tracking-widest uppercase text-primary mb-1">Technical Details</h3>
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <s.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground font-body">{s.label}</p>
                        <p className="text-sm text-foreground font-display font-medium">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Viewer */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              Interactive <span className="text-gradient-gold">3D Preview</span>
            </h2>
            <Suspense fallback={<div className="aspect-[4/3] rounded-xl bg-secondary border border-border flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}>
              <Scene3DViewer />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Workflow / Case Study */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
              Creation <span className="text-gradient-gold">Process</span>
            </h2>
          </motion.div>
          <div className="space-y-8">
            {project.workflowSteps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <span className="text-primary font-display text-sm font-bold">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery with Protected Images */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Image <span className="text-gradient-gold">Gallery</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.galleryImages.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * i }}
                className="aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-card">
                <ProtectedImage src={img} alt={`${project.title} gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" watermark />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download / CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            {project.downloadFileId ? (
              <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">Download Project Files</h3>
                <p className="text-muted-foreground font-body mb-6">
                  {isSubscribed
                    ? `Get the complete ${project.downloadFileName} file to explore and learn from.`
                    : "Subscribe with your name and email to unlock this project file and all other resources."}
                </p>
                <button onClick={handleDownload} disabled={downloading}
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-display font-semibold transition-all ${
                    isSubscribed ? "bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow" : "bg-secondary text-muted-foreground border border-border hover:border-primary/30"
                  }`}>
                  {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSubscribed ? <Download className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  {isSubscribed ? `Download ${project.downloadFileName}` : "Subscribe to Unlock"}
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">Want More Project Files?</h3>
                <p className="text-muted-foreground font-body mb-6">Subscribe to get access to downloadable Blender scenes, textures, and workflow breakdowns.</p>
                <Link to="/resources" className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-glow inline-block">
                  Get Free Files
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PortfolioDetail;
