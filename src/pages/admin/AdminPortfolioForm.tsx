import ContentForm, { type FieldSpec } from "@/components/admin/ContentForm";

const fields: FieldSpec[] = [
  { key: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Abandoned Gas Station" },
  { key: "status", label: "Status", type: "select", side: true, options: ["published", "draft"], hint: "Draft is hidden from visitors." },
  { key: "category", label: "Category", type: "select", side: true, options: ["Realistic", "Fantasy", "Dreamy", "Sci-fi", "Other"] },
  { key: "description", label: "Short description", type: "textarea", rows: 2, hint: "One or two lines shown on cards and in search results." },
  { key: "long_description", label: "Full description", type: "textarea", rows: 5, hint: "What the scene is, how it was made, Blender version, render engine." },
  { key: "image", label: "Cover image", type: "image", side: true },
  { key: "gallery_images", label: "More images", type: "images", hint: "Extra renders, breakdown shots, the viewport view." },
  { key: "video_url", label: "YouTube video link", type: "url", placeholder: "https://www.youtube.com/watch?v=…" },
  { key: "tools", label: "Tools", type: "tags", half: true, placeholder: "Blender, Cycles", hint: "Comma separated" },
  { key: "software", label: "Software / version", type: "tags", half: true, placeholder: "Blender 5.2, DaVinci Resolve", hint: "Comma separated" },
  { key: "render_time", label: "Render time", type: "text", half: true, placeholder: "e.g. 4 min per frame" },
  { key: "resolution", label: "Resolution", type: "text", half: true, placeholder: "e.g. 3840x2160" },
  { key: "featured", label: "Featured", type: "checkbox", side: true, placeholder: "Show as a featured project" },
];

const defaults = {
  title: "", slug: "", category: "Realistic", status: "published", description: "", long_description: "",
  image: "", gallery_images: [], video_url: "", tools: "Blender, Cycles", software: "Blender", render_time: "", resolution: "", featured: false,
};

const AdminPortfolioForm = () => (
  <ContentForm
    table="portfolio_projects"
    title="project"
    backTo="/admin/portfolio"
    backLabel="Back to portfolio"
    fields={fields}
    defaults={defaults}
    queryKeys={[["admin-list", "portfolio_projects"], ["portfolio-projects"]]}
    mediaFolder="portfolio"
    publicPath={(s) => `/portfolio/${s}`}
  />
);

export default AdminPortfolioForm;
