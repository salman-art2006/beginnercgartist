import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import BlogCard from "@/components/BlogCard";
import { FilterChips, PageHeader } from "@/components/PageHeader";
import { YT } from "@/components/home/shared";
import { blogService } from "@/services/blogService";
import type { BlogCategory } from "@/data/blogTypes";

const PER_PAGE = 9;

const Blog = () => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", category, search, page],
    queryFn: () => blogService.list({ category: category === "All" ? undefined : (category as BlogCategory), search: search.trim() || undefined, page, perPage: PER_PAGE }),
  });
  const { data: cats } = useQuery({ queryKey: ["blog-categories"], queryFn: () => blogService.getCategories() });

  const posts = data?.posts ?? [];
  const noPostsAtAll = !isLoading && (data?.total ?? 0) === 0 && category === "All" && !search.trim();
  const showFeatured = page === 1 && category === "All" && !search.trim() && posts.length > 1;
  const [first, ...rest] = posts;

  return (
    <Layout>
      <PageMeta
        title="Blog"
        description="Articles on Blender environment art: workflows, lighting, project breakdowns and tips from Salman."
        path="/blog"
      />
      <PageHeader
        eyebrow="Blog"
        title={<>Notes from <span className="text-primary">the viewport</span></>}
        intro="Workflows, project breakdowns and tips for building realistic environments in Blender."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          {noPostsAtAll ? (
            <div className="rounded-lg border border-dashed border-border px-6 py-20 text-center">
              <h2 className="text-4xl sm:text-5xl">First articles are on the way</h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground font-body md:text-lg">
                Until then, the tutorials and breakdowns on YouTube cover everything I know about building environments.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/tutorials" className="inline-flex items-center rounded-md bg-brand px-6 py-3.5 font-bold text-brand-foreground hover:opacity-90">Browse tutorials</Link>
                <a href={YT} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-foreground/30 px-6 py-3.5 font-bold text-foreground hover:bg-secondary">YouTube channel</a>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <FilterChips options={["All", ...(cats ?? []).map((c) => c.category)]} value={category} onChange={(v) => { setCategory(v); setPage(1); }} />
                <div className="relative w-full lg:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search articles"
                    aria-label="Search articles"
                    className="w-full rounded-md border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : posts.length === 0 ? (
                <p className="py-20 text-center text-muted-foreground font-body">No articles match that.</p>
              ) : (
                <>
                  {showFeatured && (
                    <div className="mb-14"><BlogCard post={first} large /></div>
                  )}
                  <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {(showFeatured ? rest : posts).map((p) => <BlogCard key={p.id} post={p} />)}
                  </div>
                </>
              )}

              {(data?.totalPages ?? 0) > 1 && (
                <div className="mt-14 flex items-center justify-center gap-3">
                  <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-md border border-foreground/30 px-5 py-2.5 text-sm font-bold text-foreground hover:bg-secondary disabled:opacity-30">Previous</button>
                  <span className="text-sm font-semibold text-muted-foreground">Page {page} of {data?.totalPages}</span>
                  <button type="button" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage(page + 1)} className="rounded-md border border-foreground/30 px-5 py-2.5 text-sm font-bold text-foreground hover:bg-secondary disabled:opacity-30">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
