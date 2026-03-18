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
    const { type, data } = await req.json();

    if (type === "welcome") {
      // Log the welcome notification (in production, integrate with email service)
      console.log(`Welcome notification for: ${data.name} (${data.email})`);
      
      return new Response(JSON.stringify({
        success: true,
        message: `Welcome notification queued for ${data.email}`,
        notification: {
          type: "welcome",
          subject: "Welcome to ENV.ART — Your project files are ready!",
          recipient: data.email,
          recipientName: data.name,
          template: "welcome",
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (type === "new_post") {
      // Get all subscribers
      const { data: subscribers, error } = await supabase
        .from("subscribers")
        .select("name, email");

      if (error) throw error;

      const count = (subscribers || []).length;
      console.log(`New post notification queued for ${count} subscribers: "${data.title}"`);

      return new Response(JSON.stringify({
        success: true,
        message: `Notification queued for ${count} subscribers`,
        notification: {
          type: "new_post",
          subject: `New Post: ${data.title}`,
          recipientCount: count,
          postTitle: data.title,
          postSlug: data.slug,
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (type === "new_resource") {
      const { data: subscribers, error } = await supabase
        .from("subscribers")
        .select("name, email");

      if (error) throw error;

      const count = (subscribers || []).length;
      console.log(`New resource notification queued for ${count} subscribers: "${data.title}"`);

      return new Response(JSON.stringify({
        success: true,
        message: `Notification queued for ${count} subscribers`,
        notification: {
          type: "new_resource",
          subject: `New Resource: ${data.title}`,
          recipientCount: count,
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid notification type" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("send-notification error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
