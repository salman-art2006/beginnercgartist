import ContentList from "@/components/admin/ContentList";

const AdminPortfolio = () => (
  <ContentList
    table="portfolio_projects"
    title="Portfolio"
    subtitle="Your environment art projects"
    newLabel="New project"
    basePath="/admin/portfolio"
    orderBy="created_at"
    thumbKey="image"
    publicPath={(r) => `/portfolio/${r.slug}`}
    subline={(r) => `${r.category}${r.featured ? " · Featured" : ""}`}
    queryKeys={[["portfolio-projects"]]}
    empty='No projects yet. Click "New project" to add one.'
  />
);

export default AdminPortfolio;
