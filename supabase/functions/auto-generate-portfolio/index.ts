import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PORTFOLIO_TOPICS = [
  {
    category: "Exterior",
    themes: [
      "Ancient Mayan pyramid overgrown with jungle vines at sunset",
      "Abandoned lighthouse on a stormy cliff coast",
      "Frozen Viking village under northern lights",
      "Crumbling Roman aqueduct in a misty valley",
      "Volcanic island with lava flows and obsidian cliffs",
      "Enchanted forest clearing with fairy ring mushrooms",
      "Desert oasis with palm trees and ancient well",
      "Mountain monastery perched on impossible cliffs",
    ],
  },
  {
    category: "Interior",
    themes: [
      "Alchemist's workshop with bubbling potions and glowing runes",
      "Abandoned space station control room with flickering monitors",
      "Victorian library with spiral staircase and candlelight",
      "Underground dwarven forge with molten metal",
      "Art deco hotel lobby from the 1920s",
      "Witch's cottage kitchen with hanging herbs",
      "Futuristic medical bay with holographic displays",
      "Ancient Egyptian tomb chamber with golden artifacts",
    ],
  },
  {
    category: "Urban",
    themes: [
      "Rainy Tokyo back-alley with vending machines and neon",
      "Steampunk airship dock above Victorian rooftops",
      "Post-apocalyptic gas station reclaimed by nature",
      "Floating market on a canal in a fantasy city",
      "Brutalist concrete megastructure at golden hour",
      "Underground hacker den with server racks and monitors",
      "Rooftop garden above a dystopian cityscape",
      "Art nouveau metro station with ornate ironwork",
    ],
  },
  {
    category: "Underwater",
    themes: [
      "Sunken pirate shipwreck with coral growth and treasure",
      "Deep sea thermal vent with bioluminescent creatures",
      "Underwater alien ruins with glowing crystal architecture",
      "Kelp forest with filtering sunlight and sea life",
    ],
  },
  {
    category: "Sci-Fi",
    themes: [
      "Mars colony habitat with red dust storm outside",
      "Space elevator terminal orbiting Earth",
      "Derelict generation ship overgrown with alien flora",
      "Cyberpunk night market with holographic vendors",
      "Terraforming station on an alien desert planet",
      "Zero-gravity space garden in a rotating station",
    ],
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Pick a random topic
    const catGroup = PORTFOLIO_TOPICS[Math.floor(Math.random() * PORTFOLIO_TOPICS.length)];
    const theme = catGroup.themes[Math.floor(Math.random() * catGroup.themes.length)];
    const category = catGroup.category;

    console.log(`Generating portfolio project: "${theme}" [${category}]`);

    // Step 1: Generate project content
    const contentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a professional 3D environment artist who creates portfolio case studies for Blender projects. Write detailed, technical, and visually descriptive content.",
          },
          {
            role: "user",
            content: `Create a portfolio project case study for: "${theme}"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "Project title (3-5 words)",
  "description": "One sentence summary of the scene",
  "longDescription": "2-3 paragraph detailed description of the scene, artistic vision, and technical approach",
  "tools": ["Blender", "tool2", "tool3"],
  "software": ["Blender 4.0", "software2"],
  "workflowSteps": [
    {"title": "Step name", "description": "What was done in this step"}
  ],
  "renderTime": "~X minutes per frame",
  "polyCount": "X.XM triangles",
  "resolution": "2560 × 1440"
}

Requirements:
- 5-6 workflow steps with practical Blender techniques
- Tools should be realistic 3D art tools
- Long description should be evocative and detailed
- Do NOT wrap in code blocks`,
          },
        ],
      }),
    });

    if (!contentResponse.ok) {
      const errText = await contentResponse.text();
      if (contentResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (contentResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Content generation failed [${contentResponse.status}]: ${errText}`);
    }

    const contentData = await contentResponse.json();
    let rawContent = contentData.choices?.[0]?.message?.content || "";
    rawContent = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let projectContent;
    try {
      projectContent = JSON.parse(rawContent);
    } catch {
      console.error("Failed to parse AI content:", rawContent.slice(0, 500));
      throw new Error("AI returned invalid JSON for portfolio content");
    }

    const slug = projectContent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);

    // Check duplicate
    const { data: existing } = await supabase
      .from("portfolio_projects")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      console.log(`Project "${slug}" already exists, skipping.`);
      return new Response(
        JSON.stringify({ skipped: true, message: "Project with similar title already exists" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Generate featured image
    const imagePrompt = `Cinematic 3D environment art render: ${projectContent.title}. ${projectContent.description}. Style: dark moody atmosphere, volumetric lighting, Blender Cycles render quality, professional environment art, cinematic composition, ultra detailed, no text or typography.`;

    console.log("Generating featured image...");

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: imagePrompt }],
        modalities: ["image", "text"],
      }),
    });

    let featuredImage = "/placeholder.svg";
    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const generatedUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (generatedUrl) {
        featuredImage = generatedUrl;
        console.log("Image generated successfully");
      } else {
        console.warn("No image in response, using placeholder");
      }
    } else {
      console.warn(`Image generation failed [${imageResponse.status}], using placeholder`);
    }

    // Step 3: Insert into database
    const { data: newProject, error: insertError } = await supabase
      .from("portfolio_projects")
      .insert({
        slug,
        title: projectContent.title,
        category,
        description: projectContent.description,
        long_description: projectContent.longDescription || "",
        tools: projectContent.tools || ["Blender"],
        software: projectContent.software || ["Blender 4.0"],
        image: featuredImage,
        gallery_images: [featuredImage],
        workflow_steps: projectContent.workflowSteps || [],
        render_time: projectContent.renderTime || null,
        poly_count: projectContent.polyCount || null,
        resolution: projectContent.resolution || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Failed to insert portfolio project: ${insertError.message}`);
    }

    console.log(`Portfolio project created: "${newProject.title}" (${newProject.id})`);

    return new Response(
      JSON.stringify({
        success: true,
        project: {
          id: newProject.id,
          slug: newProject.slug,
          title: newProject.title,
          category: newProject.category,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("auto-generate-portfolio error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
