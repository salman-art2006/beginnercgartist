import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Download, Loader2, Lock, Search } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import SubscribeForm from "@/components/SubscribeForm";
import { EmptyState, FilterChips, PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/home/shared";
import JoinButton from "@/components/JoinButton";
import { useSubscribeModal } from "@/contexts/SubscribeModalContext";
import { useSubscriber } from "@/contexts/SubscriberContext";
import { resourceLibraryService, type Resource } from "@/services/resourceLibraryService";

const ResourceLibrary = () => {
  const queryClient = useQueryClient();
  const { isSubscribed, subscriber } = useSubscriber();
  const { open: openJoin } = useSubscribeModal();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const { data: resources, isLoading } = useQuery({ queryKey: ["resources"], queryFn: () => resourceLibraryService.list() });

  const list = resources || [];
  const categories = Array.from(new Set(list.map((r) => r.category)));
  const q = search.trim().toLowerCase();
  const filtered = list
    .filter((r) => {
      if (filter === "All") return true;
      if (filter === "Free") return !r.isPremium;
      if (filter === "Paid") return r.isPremium;
      return r.category === filter;
    })
    .filter((r) => !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)));

  const download = async (r: Resource) => {
    if (!subscriber) return;
    setBusy(r.slug);
    const res = await resourceLibraryService.requestDownload(r.slug, subscriber.token);
    setBusy(null);
    if (res.url) {
      window.open(res.url, "_blank", "noopener,noreferrer");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    } else {
      toast.error(res.error || "Download failed");
    }
  };

  return (
    <Layout>
      <PageMeta
        title="Library: Blender project files and scenes"
        description="Free Blender project files and downloadable environment scenes by Salman. Open a scene, see how it is built and learn faster."
        path="/library"
      />
      <PageHeader
        eyebrow="Library"
        title={<>Project files <span className="text-primary">and scenes</span></>}
        intro="Free tools and full Blender scene files. Open them, click through them and see exactly how they are built."
      />

      <section className="pb-24">
        <div className="container mx-auto px-6">
          {!isSubscribed && (
            <div className="mb-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center">
              <div>
                <p className="text-lg font-bold text-foreground">Free files are one step away</p>
                <p className="text-sm text-muted-foreground font-body">Join the list to unlock the free downloads. It takes ten seconds.</p>
              </div>
              <JoinButton />
            </div>
          )}
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <FilterChips options={["All", "Free", "Paid", ...categories]} value={filter} onChange={setFilter} />
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files"
                aria-label="Search files"
                className="w-full rounded-md border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState>
              {filter === "Free" ? "No free files yet. New free files are added regularly, subscribe below to get a note." : "Nothing matches your search."}
            </EmptyState>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <article key={r.id} className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
                  <div className="relative overflow-hidden">
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt={r.title} width={1280} height={960} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-secondary" />
                    )}
                    <span className={`absolute left-3 top-3 ${r.isPremium ? "chip" : "chip-brand"}`}>
                      {r.isPremium ? r.priceLabel || "Paid" : "Free"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow mb-2">{r.category} · {r.fileType}{r.fileSize ? ` · ${r.fileSize}` : ""}</p>
                    <h3 className="text-lg font-bold leading-snug text-foreground">{r.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground font-body">{r.description}</p>

                    <div className="mt-5">
                      {r.isPremium ? (
                        r.buyUrl && (
                          <a href={r.buyUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-3 font-bold text-brand-foreground transition-opacity hover:opacity-90">
                            Get it on Gumroad <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )
                      ) : !r.hasDownload ? (
                        <p className="py-3 text-center text-sm font-semibold text-muted-foreground">Download coming soon</p>
                      ) : isSubscribed ? (
                        <button type="button" onClick={() => download(r)} disabled={busy === r.slug} className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-3 font-bold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                          {busy === r.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download
                        </button>
                      ) : (
                        <button type="button" onClick={openJoin} className="flex w-full items-center justify-center gap-2 rounded-md border border-foreground/30 py-3 font-bold text-foreground transition-colors hover:bg-secondary"><Lock className="h-4 w-4" /> Join the list to download</button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Section tone="alt" id="unlock">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">Free files</p>
            <h2 className="text-4xl sm:text-5xl">Unlock the <span className="text-primary">free downloads</span></h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground font-body md:text-lg">
              Join with your email to download free project files and get a note when new ones are out. Unsubscribe any time.
            </p>
          </div>
          <SubscribeForm />
        </div>
      </Section>
    </Layout>
  );
};

export default ResourceLibrary;
