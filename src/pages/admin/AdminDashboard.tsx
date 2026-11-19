import AdminLayout from "@/components/AdminLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, Download, FileText, FolderOpen, Mail, Package, Users } from "lucide-react";
import { sb } from "@/lib/db";

const DAYS = 30;
const dayKey = (d: Date) => d.toISOString().slice(0, 10);

async function load() {
  const count = async (table: string, filter?: (q: any) => any) => {
    let q = sb.from(table).select("id", { count: "exact", head: true });
    if (filter) q = filter(q);
    return (await q).count ?? 0;
  };
  const [portfolio, tutorials, blog, unread, resRows, subs, logs, msgs] = await Promise.all([
    count("portfolio_projects"),
    count("tutorials"),
    count("blog_posts"),
    count("contact_messages", (q) => q.eq("is_read", false)),
    sb.from("resources").select("slug,title,is_premium"),
    sb.from("subscribers").select("name,email,subscribed_at").order("subscribed_at", { ascending: false }).limit(2000),
    sb.from("download_logs").select("resource_id,downloaded_at").order("downloaded_at", { ascending: false }).limit(5000),
    sb.from("contact_messages").select("id,name,subject,is_read,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const resources = (resRows.data ?? []) as { slug: string; title: string; is_premium: boolean }[];
  const subscribers = (subs.data ?? []) as { name: string; email: string; subscribed_at: string }[];
  const downloads = (logs.data ?? []) as { resource_id: string; downloaded_at: string }[];

  const today = new Date();
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (DAYS - 1 - i));
    return { key: dayKey(d), label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });
  const firstDay = days[0].key;

  let running = subscribers.filter((s) => dayKey(new Date(s.subscribed_at)) < firstDay).length;
  const subSeries = days.map((d) => {
    running += subscribers.filter((s) => dayKey(new Date(s.subscribed_at)) === d.key).length;
    return { label: d.label, total: running };
  });
  const dlSeries = days.map((d) => ({ label: d.label, downloads: downloads.filter((x) => dayKey(new Date(x.downloaded_at)) === d.key).length }));

  const titleOf = new Map(resources.map((r) => [r.slug, r.title]));
  const perFile = new Map<string, number>();
  downloads.forEach((d) => perFile.set(d.resource_id, (perFile.get(d.resource_id) ?? 0) + 1));
  const topFiles = [...perFile.entries()]
    .map(([slug, n]) => ({ name: (titleOf.get(slug) ?? slug).replace(/ [–-] .*$/, "").slice(0, 28), downloads: n }))
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 6);

  const free = resources.filter((r) => !r.is_premium).length;

  return {
    counts: { portfolio, tutorials, blog, files: resources.length, subscribers: subscribers.length, downloads: downloads.length, unread },
    subSeries, dlSeries, topFiles,
    mix: [{ name: "Free", value: free }, { name: "Paid", value: resources.length - free }],
    recentSubs: subscribers.slice(0, 5),
    recentMsgs: (msgs.data ?? []) as { id: string; name: string; subject: string; is_read: boolean; created_at: string }[],
    newThisWeek: subscribers.filter((s) => Date.now() - new Date(s.subscribed_at).getTime() < 7 * 86400000).length,
  };
}

const Card = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <section className={`relative overflow-hidden rounded-xl border border-border bg-card p-7 shadow-card ${className}`}>
    <span className="absolute inset-x-0 top-0 h-[3px] bg-brand" aria-hidden="true" />
    <h2 className="mb-6 text-lg font-bold normal-case leading-tight tracking-normal text-foreground" style={{ fontFamily: "var(--font-display)", textTransform: "none" }}>{title}</h2>
    {children}
  </section>
);

const Empty = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-48 items-center justify-center text-center text-sm text-muted-foreground font-body">{children}</div>
);

const AdminDashboard = () => {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const c = dark
    ? { accent: "#FFD23F", text: "#CFCFCF", grid: "#333333", tipBg: "#1F1F1F", tipBorder: "#444", alt: "#6B6B6B" }
    : { accent: "#8F6600", text: "#3A3A3A", grid: "#D6D1C6", tipBg: "#FFFFFF", tipBorder: "#D6D1C6", alt: "#A9A396" };

  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: load, refetchInterval: 60000 });

  const tip = { contentStyle: { background: c.tipBg, border: `1px solid ${c.tipBorder}`, borderRadius: 8, fontSize: 13 }, labelStyle: { color: c.text } };
  const axis = { tick: { fill: c.text, fontSize: 12 }, tickLine: false, axisLine: false } as const;

  const stats = data
    ? [
        { label: "Subscribers", value: data.counts.subscribers, sub: `+${data.newThisWeek} this week`, icon: Users, to: "/admin/subscribers" },
        { label: "Downloads", value: data.counts.downloads, sub: "all time", icon: Download, to: "/admin/resources" },
        { label: "Project files", value: data.counts.files, sub: `${data.mix[0].value} free · ${data.mix[1].value} paid`, icon: Package, to: "/admin/resources" },
        { label: "Portfolio", value: data.counts.portfolio, sub: "projects", icon: FolderOpen, to: "/admin/portfolio" },
        { label: "Tutorials", value: data.counts.tutorials, sub: "videos", icon: BookOpen, to: "/admin/tutorials" },
        { label: "Blog posts", value: data.counts.blog, sub: "articles", icon: FileText, to: "/admin/blog" },
        { label: "Unread messages", value: data.counts.unread, sub: "from Contact", icon: Mail, to: "/admin/messages" },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-3">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="text-5xl leading-none text-foreground sm:text-6xl">Welcome back</h1>
          <p className="mt-3 text-base text-muted-foreground font-body">Here is how your site and list are doing.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/resources/new" className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-brand-foreground hover:opacity-90">New project file</Link>
          <Link to="/admin/tutorials/new" className="rounded-md border border-foreground/30 px-5 py-3 text-sm font-bold text-foreground hover:bg-secondary">New tutorial</Link>
          <Link to="/admin/blog/new" className="rounded-md border border-foreground/30 px-5 py-3 text-sm font-bold text-foreground hover:bg-secondary">New post</Link>
        </div>
      </div>

      {isLoading || !data ? (
        <p className="text-muted-foreground font-body">Loading…</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((s) => (
              <Link key={s.label} to={s.to} className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-foreground/40">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-brand text-brand-foreground"><s.icon className="h-5 w-5" /></div>
                <p className="font-anton text-5xl leading-none text-foreground">{s.value}</p>
                <p className="mt-3 text-base font-bold text-foreground">{s.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground font-body">{s.sub}</p>
              </Link>
            ))}
          </div>

          <div className="mb-6 grid gap-6 xl:grid-cols-2">
            <Card title="Subscribers, last 30 days">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.subSeries} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="subFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c.accent} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={c.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={c.grid} vertical={false} />
                    <XAxis dataKey="label" {...axis} interval={6} />
                    <YAxis {...axis} allowDecimals={false} />
                    <Tooltip {...tip} />
                    <Area type="monotone" dataKey="total" name="Subscribers" stroke={c.accent} strokeWidth={2} fill="url(#subFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Downloads, last 30 days">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.dlSeries} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke={c.grid} vertical={false} />
                    <XAxis dataKey="label" {...axis} interval={6} />
                    <YAxis {...axis} allowDecimals={false} />
                    <Tooltip {...tip} cursor={{ fill: c.grid, opacity: 0.4 }} />
                    <Bar dataKey="downloads" name="Downloads" fill={c.accent} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            <Card title="Most downloaded files" className="lg:col-span-2">
              {data.topFiles.length === 0 ? (
                <Empty>No downloads yet. Free files appear here once visitors download them.</Empty>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topFiles} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                      <CartesianGrid stroke={c.grid} horizontal={false} />
                      <XAxis type="number" {...axis} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" {...axis} width={150} />
                      <Tooltip {...tip} cursor={{ fill: c.grid, opacity: 0.4 }} />
                      <Bar dataKey="downloads" name="Downloads" fill={c.accent} radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <Card title="Library: free vs paid">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.mix} dataKey="value" nameKey="name" innerRadius={44} outerRadius={70} paddingAngle={3} stroke="none">
                      <Cell fill={c.accent} />
                      <Cell fill={c.alt} />
                    </Pie>
                    <Tooltip {...tip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 flex justify-center gap-5 text-xs font-semibold text-muted-foreground">
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.accent }} /> Free {data.mix[0].value}</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.alt }} /> Paid {data.mix[1].value}</li>
              </ul>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Newest subscribers">
              {data.recentSubs.length === 0 ? (
                <Empty>No subscribers yet.</Empty>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentSubs.map((s) => (
                    <li key={s.email} className="flex items-center justify-between py-3 text-base">
                      <div className="min-w-0"><p className="truncate font-semibold text-foreground">{s.name}</p><p className="truncate text-sm text-muted-foreground">{s.email}</p></div>
                      <span className="shrink-0 text-xs text-muted-foreground">{new Date(s.subscribed_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Latest messages">
              {data.recentMsgs.length === 0 ? (
                <Empty>No messages yet.</Empty>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentMsgs.map((m) => (
                    <li key={m.id}>
                      <Link to="/admin/messages" className="flex items-center justify-between gap-3 py-3 text-sm">
                        <span className="flex min-w-0 items-center gap-3">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${m.is_read ? "bg-transparent" : "bg-brand"}`} />
                          <span className="truncate"><span className={m.is_read ? "font-medium" : "font-bold"}>{m.name}</span> <span className="text-muted-foreground">· {m.subject}</span></span>
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <p className="mt-10 text-sm leading-relaxed text-muted-foreground font-body">
            Website visits are not tracked here. To see traffic, add a Google Analytics 4 ID as <code className="rounded bg-secondary px-1.5 py-0.5">VITE_GA4_ID</code> in the deploy settings.
          </p>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
