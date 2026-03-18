import { supabase } from "@/integrations/supabase/client";

export interface SubscriberStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  recentSubscribers: { name: string; email: string; subscribedAt: string }[];
}

export interface DownloadStats {
  totalDownloads: number;
  topResources: { resourceId: string; resourceType: string; count: number }[];
}

export const analyticsService = {
  async getSubscriberStats(): Promise<SubscriberStats> {
    try {
      // Use edge function to get stats since subscribers table is service-role only
      const { data, error } = await supabase.functions.invoke("admin-analytics", {
        body: { type: "subscribers" },
      });
      if (!error && data) return data;
    } catch {}
    return { total: 0, thisWeek: 0, thisMonth: 0, recentSubscribers: [] };
  },

  async getDownloadStats(): Promise<DownloadStats> {
    try {
      const { data, error } = await supabase.functions.invoke("admin-analytics", {
        body: { type: "downloads" },
      });
      if (!error && data) return data;
    } catch {}
    return { totalDownloads: 0, topResources: [] };
  },
};
