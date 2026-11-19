import { ReactNode } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/contexts/AdminContext";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { sb } from "@/lib/db";
import { LayoutDashboard, FolderOpen, FileText, Package, Users, Mail, BookOpen, Settings, LogOut, ArrowLeft } from "lucide-react";

const groups = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    label: "Content",
    items: [
      { label: "Portfolio", href: "/admin/portfolio", icon: FolderOpen },
      { label: "Tutorials", href: "/admin/tutorials", icon: BookOpen },
      { label: "Project files", href: "/admin/resources", icon: Package },
      { label: "Blog", href: "/admin/blog", icon: FileText },
    ],
  },
  {
    label: "Audience",
    items: [
      { label: "Messages", href: "/admin/messages", icon: Mail },
      { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    ],
  },
  { label: "Site", items: [{ label: "Settings", href: "/admin/settings", icon: Settings }] },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading, logout } = useAdmin();
  const location = useLocation();
  const { data: unread } = useQuery({
    queryKey: ["admin-unread"],
    queryFn: async () => (await sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false)).count ?? 0,
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const isActive = (href: string) => (href === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(href));
  const all = groups.flatMap((g) => g.items);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Admin | Beginner CG Artist</title>
      </Helmet>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-[#141414] text-white lg:flex">
        <div className="border-b border-white/10 px-7 py-5">
          <Logo onDark />
          <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#FFD23F]">Admin panel</p>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Admin">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="mb-2 px-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/40">{g.label}</p>
              <div className="space-y-1">
                {g.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold transition-colors ${active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                    >
                      {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-[#FFD23F]" />}
                      <item.icon className={`h-[18px] w-[18px] ${active ? "text-[#FFD23F]" : ""}`} />
                      {item.label}
                      {item.href === "/admin/messages" && !!unread && (
                        <span className="ml-auto rounded-full bg-[#FFD23F] px-2 py-0.5 text-[11px] font-extrabold text-[#141414]">{unread}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-white/10 px-4 py-3">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-sm font-semibold text-white/70">Theme</span>
            <ThemeToggle onDark />
          </div>
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white">
            <ArrowLeft className="h-[18px] w-[18px]" /> View site
          </Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white">
            <LogOut className="h-[18px] w-[18px]" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-5 py-3">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button type="button" onClick={logout} aria-label="Sign out" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-5 pb-3" aria-label="Admin">
            {all.map((item) => (
              <Link key={item.href} to={item.href} className={`shrink-0 rounded-md border px-3.5 py-2 text-sm font-bold ${isActive(item.href) ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-8 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
