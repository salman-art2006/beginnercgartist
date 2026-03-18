import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing credentials");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { type } = await req.json();

    if (type === "subscribers") {
      const { data: allSubs, error } = await supabase
        .from("subscribers")
        .select("name, email, subscribed_at")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      const subs = allSubs || [];
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      return new Response(JSON.stringify({
        total: subs.length,
        thisWeek: subs.filter(s => new Date(s.subscribed_at) >= weekAgo).length,
        thisMonth: subs.filter(s => new Date(s.subscribed_at) >= monthAgo).length,
        recentSubscribers: subs.slice(0, 10).map(s => ({
          name: s.name,
          email: s.email,
          subscribedAt: s.subscribed_at,
        })),
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (type === "downloads") {
      const { data: logs, error } = await supabase
        .from("download_logs")
        .select("resource_id, resource_type")
        .order("downloaded_at", { ascending: false });

      if (error) throw error;
      const allLogs = logs || [];

      const counts = new Map<string, { resourceId: string; resourceType: string; count: number }>();
      for (const log of allLogs) {
        const key = `${log.resource_type}:${log.resource_id}`;
        const entry = counts.get(key) || { resourceId: log.resource_id, resourceType: log.resource_type, count: 0 };
        entry.count++;
        counts.set(key, entry);
      }

      const topResources = Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 10);

      return new Response(JSON.stringify({
        totalDownloads: allLogs.length,
        topResources,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("admin-analytics error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
