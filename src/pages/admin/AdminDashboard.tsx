import AdminLayout from "@/components/AdminLayout";
import { analyticsService } from "@/services/analyticsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolioService";
import { blogService } from "@/services/blogService";
import { FolderOpen, FileText, Users, TrendingUp, Download, Mail, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { data: projects } = useQuery({ queryKey: ["admin-projects"], queryFn: () => portfolioService.list() });
  const { data: blogData } = useQuery({ queryKey: ["admin-blog"], queryFn: () => blogService.list({ perPage: 100 }) });
  const { data: subStats } = useQuery({ queryKey: ["admin-sub-stats"], queryFn: () => analyticsService.getSubscriberStats() });
  const { data: dlStats } = useQuery({ queryKey: ["admin-dl-stats"], queryFn: () => analyticsService.getDownloadStats() });
  const [notifying, setNotifying] = useState(false);

  const handleNotifySubscribers = async () => {
    const latestPost = blogData?.posts?.[0];
    if (!latestPost) { toast.error("No posts to notify about"); return; }
    setNotifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: { type: "new_post", data: { title: latestPost.title, slug: latestPost.slug } },
      });
      if (error) throw error;
      toast.success(data?.message || "Notifications sent");
    } catch (err: any) {
      toast.error(err.message || "Failed to send");
    }
    setNotifying(false);
  };

  const stats = [
    { icon: FolderOpen, label: "Portfolio Projects", value: projects?.length || 0 },
    { icon: FileText, label: "Blog Posts", value: blogData?.total || 0 },
    { icon: Users, label: "Subscribers", value: subStats?.total || 0 },
    { icon: Download, label: "Total Downloads", value: dlStats?.totalDownloads || 0 },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Manage your content and resources</p>
        </div>
        <button onClick={handleNotifySubscribers} disabled={notifying}
          className="bg-primary/10 text-primary font-display font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm border border-primary/20">
          {notifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Notify Subscribers
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm font-body">{s.label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Subscriber Growth */}
      {subStats && subStats.total > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Subscriber Growth</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-muted-foreground text-xs font-body mb-1">This Week</p>
              <p className="font-display text-xl font-bold text-primary">+{subStats.thisWeek}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-body mb-1">This Month</p>
              <p className="font-display text-xl font-bold text-primary">+{subStats.thisMonth}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-body mb-1">All Time</p>
              <p className="font-display text-xl font-bold text-foreground">{subStats.total}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Subscribers */}
        <div className="bg-card border border-border rounded-xl shadow-card">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Subscribers</h2>
            <span className="text-xs text-muted-foreground font-body">{subStats?.total || 0} total</span>
          </div>
          <div className="divide-y divide-border">
            {(subStats?.recentSubscribers || []).slice(0, 5).map((sub, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-display text-xs font-bold">{sub.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-medium text-foreground truncate">{sub.name}</p>
                  <p className="text-muted-foreground text-xs font-body truncate">{sub.email}</p>
                </div>
                <span className="text-xs text-muted-foreground font-body">{new Date(sub.subscribedAt).toLocaleDateString()}</span>
              </div>
            ))}
            {(!subStats?.recentSubscribers || subStats.recentSubscribers.length === 0) && (
              <div className="p-8 text-center text-muted-foreground font-body text-sm">No subscribers yet</div>
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-card border border-border rounded-xl shadow-card">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Blog Posts</h2>
            <a href="/admin/blog" className="text-primary text-sm font-body hover:underline">View All</a>
          </div>
          <div className="divide-y divide-border">
            {(blogData?.posts || []).slice(0, 5).map(post => (
              <div key={post.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-medium text-foreground truncate">{post.title}</p>
                  <p className="text-muted-foreground text-xs font-body">{post.category} · {new Date(post.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
