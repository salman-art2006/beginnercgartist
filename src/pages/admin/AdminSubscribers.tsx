import AdminLayout from "@/components/AdminLayout";
import { analyticsService } from "@/services/analyticsService";
import { useQuery } from "@tanstack/react-query";
import { Users, Download, Mail, TrendingUp } from "lucide-react";

const AdminSubscribers = () => {
  const { data: subStats } = useQuery({ queryKey: ["admin-sub-stats"], queryFn: () => analyticsService.getSubscriberStats() });
  const { data: dlStats } = useQuery({ queryKey: ["admin-dl-stats"], queryFn: () => analyticsService.getDownloadStats() });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Subscriber Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Track subscriber growth and engagement</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <Users className="w-5 h-5 text-primary mb-3" />
          <p className="text-muted-foreground text-xs font-body">Total Subscribers</p>
          <p className="font-display text-2xl font-bold text-foreground">{subStats?.total || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <TrendingUp className="w-5 h-5 text-primary mb-3" />
          <p className="text-muted-foreground text-xs font-body">This Week</p>
          <p className="font-display text-2xl font-bold text-primary">+{subStats?.thisWeek || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <Mail className="w-5 h-5 text-primary mb-3" />
          <p className="text-muted-foreground text-xs font-body">This Month</p>
          <p className="font-display text-2xl font-bold text-primary">+{subStats?.thisMonth || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <Download className="w-5 h-5 text-primary mb-3" />
          <p className="text-muted-foreground text-xs font-body">Total Downloads</p>
          <p className="font-display text-2xl font-bold text-foreground">{dlStats?.totalDownloads || 0}</p>
        </div>
      </div>

      {/* Subscriber List */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent Subscribers</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(subStats?.recentSubscribers || []).map((sub, i) => (
              <tr key={i} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-display text-xs font-bold">{sub.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-display text-sm font-medium text-foreground">{sub.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground font-body">{sub.email}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground font-body">{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!subStats?.recentSubscribers || subStats.recentSubscribers.length === 0) && (
          <div className="p-12 text-center text-muted-foreground font-body">No subscribers yet.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSubscribers;
