import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blogTypes";

interface Props {
  post: BlogPost;
  index: number;
  isInView: boolean;
}

const BlogCard = ({ post, index, isInView }: Props) => {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:border-primary/30 transition-colors flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-display tracking-wider uppercase px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-muted-foreground text-xs font-body mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTimeMinutes} min read
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-body text-secondary-foreground bg-secondary px-2 py-0.5 rounded border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/blog/${post.slug}`}
          className="flex items-center gap-1.5 text-primary text-sm font-display font-medium hover:gap-3 transition-all"
        >
          Read More <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
