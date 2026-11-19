import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { EmptyState, FilterChips, PageHeader } from "@/components/PageHeader";
import { portfolioService } from "@/services/portfolioService";

const Portfolio = () => {
  const [category, setCategory] = useState("All");
  const { data: projects, isLoading } = useQuery({ queryKey: ["portfolio-projects"], queryFn: () => portfolioService.list() });

  const list = projects || [];
  const categories = ["All", ...Array.from(new Set(list.map((p) => p.category)))];
  const filtered = category === "All" ? list : list.filter((p) => p.category === category);

  return (
    <Layout>
      <PageMeta
        title="Portfolio"
        description="Realistic and cinematic Blender environments by Salman: abandoned places, fantasy worlds and dreamy landscapes, each with a breakdown or tutorial."
        path="/portfolio"
      />
      <PageHeader
        eyebrow="Portfolio"
        title={<>Environments <span className="text-primary">I built</span></>}
        intro="Every scene is modelled, lit and rendered by me in Blender. Open one to see the details."
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
            <EmptyState>No projects yet.</EmptyState>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <Link key={p.id} to={`/portfolio/${p.id}`} className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-card">
                  <img src={p.image} alt={`${p.title}, Blender environment`} width={1280} height={960} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  <span className="chip absolute left-3 top-3">{p.category}</span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-20">
                    <p className="font-anton text-2xl leading-tight text-white">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
