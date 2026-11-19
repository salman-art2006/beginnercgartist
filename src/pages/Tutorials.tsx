import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Play } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { EmptyState, FilterChips, PageHeader } from "@/components/PageHeader";
import { tutorialService } from "@/services/tutorialService";

const Tutorials = () => {
  const [category, setCategory] = useState("All");
  const { data: tutorials, isLoading } = useQuery({ queryKey: ["tutorials"], queryFn: () => tutorialService.list() });

  const list = tutorials || [];
  const categories = ["All", ...Array.from(new Set(list.map((t) => t.category)))];
  const filtered = category === "All" ? list : list.filter((t) => t.category === category);

  return (
    <Layout>
      <PageMeta
        title="Blender Tutorials"
        description="Step-by-step Blender environment tutorials and breakdowns in simple English: realistic scenes, fantasy worlds, post-processing and beginner tips."
        path="/tutorials"
      />
      <PageHeader
        eyebrow="Tutorials"
        title={<>Learn it <span className="text-primary">step by step</span></>}
        intro="Real projects, explained in simple English. The result comes first, then we build it together."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          {categories.length > 2 && (
            <div className="mb-10">
              <FilterChips options={categories} value={category} onChange={setCategory} />
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState>No tutorials yet.</EmptyState>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => (
                <Link key={t.id} to={`/tutorials/${t.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg border border-border">
                    <img src={t.thumbnail} alt={t.title} width={1280} height={720} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span className="chip absolute left-3 top-3">{t.difficulty}</span>
                    <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
                      <Play className="h-4 w-4 fill-current" />
                    </span>
                  </div>
                  <p className="eyebrow mt-4">{t.category}{t.durationMinutes > 0 ? ` · ${t.durationMinutes} min` : ""}</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {t.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground font-body">{t.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Tutorials;
