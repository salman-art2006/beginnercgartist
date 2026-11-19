import ContentForm, { type FieldSpec } from "@/components/admin/ContentForm";
import { BLOG_CATEGORIES } from "@/data/blogTypes";

const fields: FieldSpec[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "excerpt", label: "Summary", type: "textarea", rows: 2, hint: "One or two sentences shown on the blog list and in search results." },
  { key: "content", label: "Article", type: "textarea", rows: 14, required: true, hint: "Basic HTML works: <h2>, <h3>, <p>, <ul><li>, <a href>, <strong>, <img src>. Scripts are removed." },
  { key: "featured_image", label: "Featured image", type: "image", side: true },
  { key: "category", label: "Category", type: "select", side: true, options: [...BLOG_CATEGORIES] },
  { key: "read_time_minutes", label: "Read time (min)", type: "number", side: true, half: true },
  { key: "tags", label: "Tags", type: "tags", placeholder: "Blender, Lighting", hint: "Comma separated" },
  { key: "author", label: "Author", type: "text", side: true, half: true },
  { key: "status", label: "Status", type: "select", side: true, options: ["published", "draft"] },
];

const defaults = {
  title: "", slug: "", excerpt: "", content: "", featured_image: "", category: "Blender",
  read_time_minutes: 5, tags: "", author: "Salman", status: "published",
};

const AdminBlogForm = () => (
  <ContentForm
    table="blog_posts"
    title="post"
    backTo="/admin/blog"
    backLabel="Back to blog"
    fields={fields}
    defaults={defaults}
    queryKeys={[["admin-list", "blog_posts"], ["blog-posts"], ["latest-posts"], ["blog-nav"]]}
    mediaFolder="blog"
    publicPath={(s) => `/blog/${s}`}
  />
);

export default AdminBlogForm;
