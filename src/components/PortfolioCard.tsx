import { motion } from "framer-motion";
import { Lock, Download, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSubscriber } from "@/contexts/SubscriberContext";
import { useNavigate, Link } from "react-router-dom";
import type { PortfolioProject } from "@/data/portfolioData";
import { toast } from "sonner";

interface Props {
  project: PortfolioProject;
  index: number;
  isInView: boolean;
}

const PortfolioCard = ({ project, index, isInView }: Props) => {
  const { isSubscribed, requestDownload } = useSubscriber();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const hasFile = !!project.downloadFileId;

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
      // In production, this would open the signed URL
      // window.open(url, "_blank");
    } else {
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:border-primary/30 transition-colors flex flex-col"
    >
      {/* Image — links to detail */}
      <Link to={`/portfolio/${project.id}`} className="relative aspect-[4/3] overflow-hidden block">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

        {/* Category badge */}
        <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-primary text-xs font-display tracking-widest uppercase px-3 py-1 rounded-full border border-border">
          {project.category}
        </span>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link to={`/portfolio/${project.id}`} className="block mb-2">
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="text-xs font-body text-secondary-foreground bg-secondary px-2.5 py-1 rounded-md border border-border"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* View Details */}
        <Link to={`/portfolio/${project.id}`} className="flex items-center gap-1.5 text-primary text-sm font-display font-medium hover:gap-3 transition-all mb-4">
          View Details <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Download / Lock */}
        {hasFile && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-display font-semibold text-sm transition-all ${
              isSubscribed
                ? "bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow"
                : "bg-secondary text-muted-foreground border border-border hover:border-primary/30"
            }`}
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSubscribed ? (
              <>
                <Download className="w-4 h-4" />
                Download {project.downloadFileName}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Subscribe to Unlock Download
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
