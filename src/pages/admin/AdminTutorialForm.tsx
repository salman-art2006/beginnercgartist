import ContentForm, { type FieldSpec } from "@/components/admin/ContentForm";

const fields: FieldSpec[] = [
  { key: "title", label: "Title", type: "text", required: true, placeholder: "How to Create a Realistic … in Blender" },
  { key: "description", label: "Short description", type: "textarea", rows: 2, hint: "Shown on the card and in search results." },
  { key: "video_url", label: "YouTube video link", type: "url", required: true, placeholder: "https://www.youtube.com/watch?v=…", hint: "Paste the link: the thumbnail and title fill in automatically." },
  { key: "thumbnail", label: "Thumbnail", type: "image", side: true },
  { key: "content", label: "Notes (optional)", type: "textarea", rows: 5, hint: "Steps, shortcuts, links or resources shown under the video." },
  { key: "category", label: "Category", type: "select", side: true, options: ["Environment", "Breakdown", "Add-ons", "Post-processing", "Tips", "Animation", "Other"] },
  { key: "difficulty", label: "Level", type: "select", side: true, options: ["Beginner", "Intermediate", "Advanced"] },
  { key: "duration_minutes", label: "Minutes", type: "number", side: true, half: true, hint: "0 hides it." },
  { key: "order_index", label: "Order", type: "number", side: true, half: true, hint: "Lower shows first." },
  { key: "tags", label: "Tags", type: "tags", placeholder: "Blender, Environment, Free", hint: "Comma separated" },
  { key: "status", label: "Status", type: "select", side: true, options: ["published", "draft"] },
];

const defaults = {
  title: "", slug: "", description: "", video_url: "", thumbnail: "", content: "", category: "Environment",
  difficulty: "Beginner", duration_minutes: 0, order_index: 0, tags: "", status: "published",
};

const AdminTutorialForm = () => (
  <ContentForm
    table="tutorials"
    title="tutorial"
    backTo="/admin/tutorials"
    backLabel="Back to tutorials"
    fields={fields}
    defaults={defaults}
    queryKeys={[["admin-list", "tutorials"], ["tutorials"]]}
    mediaFolder="tutorials"
    publicPath={(s) => `/tutorials/${s}`}
  />
);

export default AdminTutorialForm;
