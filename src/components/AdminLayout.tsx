import { ReactNode } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { LayoutDashboard, FolderOpen, FileText, Package, Users, Mail, BookOpen, Settings, LogOut, ArrowLeft } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderOpen },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Tutorials", href: "/admin/tutorials", icon: BookOpen },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Resources", href: "/admin/resources", icon: Package },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, logout } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-display text-lg font-bold text-gradient-gold">ENV.ART</Link>
          <p className="text-muted-foreground text-xs font-body mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors w-full text-left">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
