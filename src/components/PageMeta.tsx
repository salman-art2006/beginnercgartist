import { Helmet } from "react-helmet-async";

interface Props {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

const SITE_NAME = "ENV.ART — 3D Environment Artist";
const BASE_URL = "https://envart.com";

const PageMeta = ({ title, description, path, image, type = "website", jsonLd }: Props) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/og-default.jpg`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebPage",
    name: fullTitle,
    description,
    url,
    ...(type === "article" && {
      author: { "@type": "Person", name: "ENV.ART" },
      publisher: { "@type": "Organization", name: "ENV.ART", logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.ico` } },
    }),
    ...jsonLd,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="robots" content="index, follow" />
      <script type="application/ld+json">{JSON.stringify(defaultJsonLd)}</script>
    </Helmet>
  );
};

export default PageMeta;
