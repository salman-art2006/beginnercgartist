import ContentList from "@/components/admin/ContentList";

const AdminTutorials = () => (
  <ContentList
    table="tutorials"
    title="Tutorials"
    subtitle="Videos and step-by-step guides"
    newLabel="New tutorial"
    basePath="/admin/tutorials"
    orderBy="order_index"
    ascending
    thumbKey="thumbnail"
    publicPath={(r) => `/tutorials/${r.slug}`}
    subline={(r) => `${r.category} · ${r.difficulty}`}
    queryKeys={[["tutorials"]]}
    empty='No tutorials yet. Click "New tutorial" to add one.'
  />
);

export default AdminTutorials;
