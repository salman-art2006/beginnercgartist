import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BLOG_TOPICS = [
  {
    category: "Tips",
    themes: [
      "Blender keyboard shortcuts that save hours",
      "Color grading tips for 3D renders",
      "How to achieve photorealism in Blender",
      "Optimizing render times in Cycles",
      "Compositing tricks for better final images",
      "Camera angles that make environments dramatic",
      "How to create realistic water in Blender",
      "Fog and atmosphere techniques in 3D scenes",
    ],
  },
  {
    category: "Environment Art",
    themes: [
      "Creating believable forest environments",
      "Desert landscape modeling techniques",
      "Building sci-fi corridors in Blender",
      "Medieval village environment design",
      "Post-apocalyptic scene creation guide",
      "Underwater environment art in Blender",
      "Snow and ice environment techniques",
      "Creating vast open world landscapes",
    ],
  },
  {
    category: "Workflow",
    themes: [
      "My daily 3D art practice routine",
      "Organizing Blender projects efficiently",
      "Version control for 3D artists",
      "Reference gathering workflow for environments",
      "From blockout to final render pipeline",
      "Asset library management for environment art",
      "Texture baking workflow for game environments",
      "Collaborative 3D art project management",
    ],
  },
  {
    category: "Blender",
    themes: [
      "Geometry Nodes for environment scattering",
      "Blender's shader editor deep dive",
      "EEVEE vs Cycles comparison for environments",
      "Custom Blender add-on recommendations",
      "Blender 4.0 features for environment artists",
      "Sculpting terrain in Blender",
      "Particle systems for vegetation",
      "Procedural material creation masterclass",
    ],
  },
  {
    category: "Resources",
    themes: [
      "Free texture resources for 3D artists",
      "Best HDRI libraries for environment renders",
      "Community platforms for 3D environment artists",
      "Books every environment artist should read",
      "Online courses for Blender environment art",
      "Free 3D model libraries worth exploring",
      "Hardware recommendations for 3D rendering",
      "Software tools that complement Blender",
    ],
  },
  {
    category: "Project Breakdown",
    themes: [
      "How I built a cyberpunk street scene",
      "Creating a haunted mansion environment",
      "Tropical island scene breakdown",
      "Space station interior walkthrough",
      "Gothic cathedral environment process",
      "Japanese garden scene creation",
      "Industrial factory environment design",
      "Fantasy floating islands breakdown",
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
    const categoryGroup = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    const theme = categoryGroup.themes[Math.floor(Math.random() * categoryGroup.themes.length)];
    const category = categoryGroup.category;

    console.log(`Generating blog post about: "${theme}" in category "${category}"`);

    // Step 1: Generate blog content using AI
    const contentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a 3D environment artist who creates blog posts about Blender, environment art, and 3D workflows. Write engaging, practical content that helps other artists improve their craft. Always write in first person as an independent artist sharing knowledge.`,
          },
          {
            role: "user",
            content: `Write a blog post about: "${theme}"

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{"title":"Blog post title","excerpt":"2-3 sentence summary","content":"<h2>Section 1</h2><p>paragraph</p><h2>Section 2</h2><p>paragraph</p><h2>Section 3</h2><p>paragraph</p><h2>Section 4</h2><p>paragraph</p>","tags":["tag1","tag2","tag3"],"readTimeMinutes":5}

Requirements:
- Title should be compelling and SEO-friendly
- Content must be valid HTML with h2 headers and p tags
- Include 4-6 sections with practical advice
- Tags should be relevant to 3D art and Blender
- Read time should be realistic (3-8 minutes)
- Do NOT wrap in markdown code blocks`,
          },
        ],
      }),
    });

    if (!contentResponse.ok) {
      const errText = await contentResponse.text();
      if (contentResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (contentResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Content generation failed [${contentResponse.status}]: ${errText}`);
    }

    const contentData = await contentResponse.json();
    let rawContent = contentData.choices?.[0]?.message?.content || "";

    // Clean up markdown code blocks if present
    rawContent = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let blogContent;
    try {
      blogContent = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error("Failed to parse AI content:", rawContent.slice(0, 500));
      throw new Error("AI returned invalid JSON for blog content");
    }

    const slug = blogContent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      console.log(`Post with slug "${slug}" already exists, skipping.`);
      return new Response(
        JSON.stringify({ skipped: true, message: "Post with similar topic already exists" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Generate featured image
    const imagePrompt = `Cinematic 3D environment art render related to: ${blogContent.title}. ${blogContent.excerpt}. Style: dark moody atmosphere, volumetric lighting, Blender Cycles render quality, professional environment art, cinematic composition, no text or typography.`;

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
    const { data: newPost, error: insertError } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title: blogContent.title,
        excerpt: blogContent.excerpt,
        content: blogContent.content,
        featured_image: featuredImage,
        category,
        tags: blogContent.tags || [],
        author: "ENV.ART",
        read_time_minutes: blogContent.readTimeMinutes || 5,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Failed to insert blog post: ${insertError.message}`);
    }

    console.log(`Blog post created: "${newPost.title}" (${newPost.id})`);

    return new Response(
      JSON.stringify({
        success: true,
        post: {
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          category: newPost.category,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("auto-generate-blog error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
