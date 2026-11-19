import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

// Returns a short-lived download URL for a FREE resource, only to a verified subscriber.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { slug, token } = await req.json();
    if (!slug || !token || typeof slug !== "string" || typeof token !== "string") {
      return json({ error: "Missing slug or token" }, 400);
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: subscriber } = await supabase.from("subscribers").select("id").eq("token", token).maybeSingle();
    if (!subscriber) return json({ error: "Please subscribe to unlock downloads" }, 401);

    const { data: resource } = await supabase
      .from("resources")
      .select("id, slug, is_premium, status, file_path, download_url, download_count")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!resource) return json({ error: "File not found" }, 404);
    if (resource.is_premium) return json({ error: "This is a paid item. Use the buy link." }, 403);

    let url: string | null = resource.download_url;
    if (resource.file_path) {
      const { data, error } = await supabase.storage.from("files").createSignedUrl(resource.file_path, 120);
      if (error || !data) return json({ error: "Could not prepare the file" }, 500);
      url = data.signedUrl;
    }
    if (!url) return json({ error: "No file is attached to this item yet" }, 404);

    await supabase.from("download_logs").insert({ subscriber_id: subscriber.id, resource_id: resource.slug, resource_type: "resource" });
    await supabase.from("resources").update({ download_count: (resource.download_count ?? 0) + 1 }).eq("id", resource.id);

    return json({ success: true, url });
  } catch (error: unknown) {
    console.error("get-download error:", error);
    return json({ error: "Server error" }, 500);
  }
});
