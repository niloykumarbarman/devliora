import type { Metadata } from "next";

/**
 * Central site configuration used to build consistent metadata across
 * every page — canonical URLs, sitemap, OG tags, and JSON-LD all derive
 * from it.
 */
export const siteConfig = {
  name: "Devliora",
  url: "https://devliora.com",
  description:
    "Devliora designs and builds production-grade software systems for enterprise teams: APIs, platforms, and the infrastructure that holds them together.",
  // Drop a real logo/brand image at this path (frontend/public/og-image.png,
  // 1200x630px) to replace the generated placeholder.
  ogImage: "/og-image.png",
  contactEmail: "devliora74@gmail.com",
  contactPhone: "+8801766644823",
};

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/about". Use "" for the homepage. */
  path?: string;
  image?: string;
  type?: "website" | "article";
}

/**
 * Builds a full Next.js Metadata object (title, description, canonical,
 * Open Graph, Twitter card) from a page's title/description so every page
 * gets consistent, correct social-preview tags without repeating
 * boilerplate.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Sitewide Organization structured data, rendered once in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    // Static favicon asset rather than the admin-managed logo in
    // SiteSettings, so this doesn't require an API call from the root
    // layout (which renders on every page) and can't go stale/broken if
    // that upload is ever cleared.
    logo: `${siteConfig.url}/favicon-512.png`,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhone,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      telephone: siteConfig.contactPhone,
      contactType: "customer service",
    },
  };
}

/**
 * WebSite structured data (separate from Organization) — helps Google
 * associate the "Devliora" brand query directly with this domain for
 * brand-name search results.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

interface ArticleJsonLdOptions {
  title: string;
  description: string;
  slug: string;
  authorName: string;
  publishedAt: string | null;
  imageUrl?: string;
}

/** Article structured data for a single blog post detail page. */
export function articleJsonLd({
  title,
  description,
  slug,
  authorName,
  publishedAt,
  imageUrl,
}: ArticleJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${siteConfig.url}/blog/${slug}`,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}
