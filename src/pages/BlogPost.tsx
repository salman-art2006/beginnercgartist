import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import BlogCard, { formatDate } from "@/components/BlogCard";
import { blogService } from "@/services/blogService";
import { sanitizeHtml } from "@/lib/sanitize";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogService.getBySlug(slug!),
    enabled: !!slug,
  });
  const { data: latest } = useQuery({ queryKey: ["latest-posts"], queryFn: () => blogService.getLatest(4) });

  const html = useMemo(() => (post ? sanitizeHtml(post.content) : ""), [post]);
  const more = (latest ?? []).filter((p) => p.slug !== slug).slice(0, 3);

  if (isLoading) {
    return <Layout><div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!post) {
    return (
      <Layout>
        <PageMeta title="Article not found" description="This article does not exist." path={`/blog/${slug}`} />
        <div className="pt-44 pb-32 text-center">
          <h1 className="text-5xl">Article not found</h1>
          <Link to="/blog" className="mt-6 inline-block font-bold text-primary hover:underline">Back to the blog</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageMeta
        title={post.title}
        description={post.excerpt || post.title}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.featuredImage?.startsWith("http") ? post.featuredImage : undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          image: post.featuredImage || undefined,
          author: { "@type": "Person", name: post.author },
          keywords: post.tags.join(", "),
        }}
      />
      <article className="pt-36 pb-20 lg:pt-44">
        <div className="container mx-auto max-w-3xl px-6">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <p className="eyebrow mb-4">{post.category} · {formatDate(post.publishedAt)} · {post.readTimeMinutes} min read</p>
          <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98]">{post.title}</h1>
          {post.excerpt && <p className="mt-6 text-lg leading-relaxed text-muted-foreground font-body md:text-xl">{post.excerpt}</p>}
          <p className="mt-6 text-sm font-semibold text-muted-foreground">By {post.author}</p>
        </div>

        {post.featuredImage && (
          <div className="container mx-auto mt-10 max-w-5xl px-6">
            <img src={post.featuredImage} alt={post.title} width={1280} height={720} className="aspect-video w-full rounded-lg border border-border object-cover" />
          </div>
        )}

        <div className="container mx-auto mt-12 max-w-3xl px-6">
          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: html }} />

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
              {post.tags.map((t) => (
                <li key={t} className="rounded-md border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground">{t}</li>
              ))}
            </ul>
          )}

          <div className="mt-12 rounded-lg border border-border bg-card p-8 text-center shadow-card">
            <h2 className="text-3xl sm:text-4xl">Want the project files?</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground font-body">Free files and full Blender scenes are in the library.</p>
            <Link to="/library" className="mt-6 inline-flex items-center rounded-md bg-brand px-6 py-3.5 font-bold text-brand-foreground hover:opacity-90">Open the library</Link>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-border bg-card/50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="mb-10 text-4xl">Keep reading</h2>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPost;
