import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { tutorialService } from "@/services/tutorialService";

const youtubeId = (url?: string) => url?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];

const TutorialDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: tutorial, isLoading } = useQuery({
    queryKey: ["tutorial", slug],
    queryFn: () => tutorialService.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <Layout><div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (!tutorial) {
    return (
      <Layout>
        <PageMeta title="Tutorial not found" description="This tutorial does not exist." path={`/tutorials/${slug}`} />
        <div className="pt-44 pb-32 text-center">
          <h1 className="text-5xl">Tutorial not found</h1>
          <Link to="/tutorials" className="mt-6 inline-block font-bold text-primary hover:underline">Back to tutorials</Link>
        </div>
      </Layout>
    );
  }

  const vid = youtubeId(tutorial.videoUrl);

  return (
    <Layout>
      <PageMeta
        title={tutorial.title}
        description={tutorial.description}
        path={`/tutorials/${tutorial.slug}`}
        image={tutorial.thumbnail.startsWith("http") ? tutorial.thumbnail : undefined}
        jsonLd={
          vid
            ? {
                "@context": "https://schema.org",
                "@type": "VideoObject",
                name: tutorial.title,
                description: tutorial.description,
                thumbnailUrl: `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`,
                embedUrl: `https://www.youtube.com/embed/${vid}`,
              }
            : undefined
        }
      />
      <article className="pt-36 pb-24 lg:pt-44">
        <div className="container mx-auto max-w-4xl px-6">
          <Link to="/tutorials" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All tutorials
          </Link>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="chip">{tutorial.difficulty}</span>
            <span className="eyebrow">{tutorial.category}{tutorial.durationMinutes > 0 ? ` · ${tutorial.durationMinutes} min` : ""}</span>
          </div>
          <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98]">{tutorial.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground font-body">{tutorial.description}</p>

          {vid && (
            <div className="mt-10 aspect-video overflow-hidden rounded-lg border border-border bg-black shadow-card">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${vid}`}
                title={tutorial.title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}

          {tutorial.content && tutorial.content !== tutorial.description && (
            <div className="prose-blog mt-10 whitespace-pre-line">{tutorial.content}</div>
          )}

          {tutorial.tags.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {tutorial.tags.map((t) => (
                <li key={t} className="rounded-md border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground">{t}</li>
              ))}
            </ul>
          )}

          <div className="mt-14 flex flex-col gap-3 border-t border-border pt-10 sm:flex-row">
            {tutorial.videoUrl && (
              <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3.5 font-bold text-brand-foreground hover:opacity-90">
                Watch on YouTube <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <Link to="/library" className="inline-flex items-center justify-center rounded-md border border-foreground/30 px-6 py-3.5 font-bold text-foreground hover:bg-secondary">
              Get project files
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default TutorialDetail;
