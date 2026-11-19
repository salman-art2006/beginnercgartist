import { Link } from "react-router-dom";
import type { BlogPost } from "@/data/blogTypes";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const BlogCard = ({ post, large = false }: { post: BlogPost; large?: boolean }) => (
  <Link to={`/blog/${post.slug}`} className={`group block ${large ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-10" : ""}`}>
    <div className={`relative overflow-hidden rounded-lg border border-border bg-secondary ${large ? "lg:col-span-7" : ""}`}>
      {post.featuredImage ? (
        <img src={post.featuredImage} alt={post.title} width={1280} height={720} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      ) : (
        <div className="aspect-video w-full" />
      )}
      <span className="chip absolute left-3 top-3">{post.category}</span>
    </div>
    <div className={large ? "mt-6 lg:col-span-5 lg:mt-0" : "mt-4"}>
      <p className="eyebrow">{formatDate(post.publishedAt)} · {post.readTimeMinutes} min read</p>
      <h3 className={`mt-2 font-bold leading-snug text-foreground transition-colors group-hover:text-primary ${large ? "text-2xl md:text-3xl" : "text-lg"}`}>{post.title}</h3>
      {post.excerpt && <p className={`mt-3 leading-relaxed text-muted-foreground font-body ${large ? "text-base" : "line-clamp-2 text-sm"}`}>{post.excerpt}</p>}
    </div>
  </Link>
);

export default BlogCard;
