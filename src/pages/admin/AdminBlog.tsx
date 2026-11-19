import ContentList from "@/components/admin/ContentList";

const AdminBlog = () => (
  <ContentList
    table="blog_posts"
    title="Blog"
    subtitle="Articles. The Blog link appears in the menu once you publish your first post."
    newLabel="New post"
    basePath="/admin/blog"
    orderBy="published_at"
    thumbKey="featured_image"
    publicPath={(r) => `/blog/${r.slug}`}
    subline={(r) => `${r.category} · ${new Date(String(r.published_at)).toLocaleDateString()}`}
    queryKeys={[["blog-posts"], ["latest-posts"], ["blog-nav"]]}
    empty='No posts yet. Click "New post" to write your first one.'
  />
);

export default AdminBlog;
