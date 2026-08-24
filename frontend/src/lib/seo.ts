import type { Metadata } from "next";

/**
 * Central site configuration used to build consistent metadata across
 * every page — canonical URLs, sitemap, OG tags, and JSON-LD all derive
 * from it.
 */
export const siteConfig = {
  name: "Devliora",
  url: "https://devliora.com",
  // Names Bangladesh and Australia explicitly (both real Devliora
  // offices — see /admin/office-locations) since this description feeds
  // the homepage meta description, Organization schema, and every page's
  // OG/Twitter fallback: an honest, concrete location signal here helps
  // local-intent searches ("software company in Bangladesh") without
  // resorting to keyword-stuffed location spam elsewhere on the site.
  description:
    "Devliora builds production-grade software systems for enterprise teams — APIs, platforms, and infrastructure — with engineering teams in Bangladesh and Australia.",
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

/**
 * Devliora's two real offices — kept as a static list here rather than
 * fetched from the admin-managed OfficeLocations API, same reasoning as
 * the `logo` field below: this renders in the root layout on every page,
 * so it can't depend on an API call or go blank if that endpoint is ever
 * briefly down. Update this if an office is added/moved/removed via the
 * admin panel (see /admin/office-locations for the current source of
 * truth).
 */
const OFFICE_ADDRESSES = [
  {
    "@type": "PostalAddress",
    streetAddress: "34 Featherbrook",
    addressLocality: "Point Cook",
    addressRegion: "VIC",
    addressCountry: "AU",
  },
  {
    "@type": "PostalAddress",
    streetAddress: "Sundor Jahan Mor",
    addressLocality: "Gaibandha",
    postalCode: "5700",
    addressCountry: "BD",
  },
];

/**
 * Sitewide Organization structured data, rendered once in the root
 * layout. Includes both real office addresses and areaServed so Google
 * has an explicit signal for local relevance in Bangladesh and Australia
 * specifically, not just a generic global company — this is the single
 * biggest on-page lever for local search visibility; it does not by
 * itself produce a ranking (see the caveat given alongside this change).
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    // Static favicon asset rather than the admin-managed logo in
    // SiteSettings, so this doesn't require an API call from the root
    // layout (which renders on every page) and can't go stale/broken if
    // that upload is ever cleared.
    logo: `${siteConfig.url}/favicon-512.png`,
    image: `${siteConfig.url}/favicon-512.png`,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhone,
    address: OFFICE_ADDRESSES,
    areaServed: [
      { "@type": "Country", name: "Bangladesh" },
      { "@type": "Country", name: "Australia" },
      // Also serves clients globally — Devliora isn't only pitching
      // local Bangladeshi/Australian clients — without this a strict
      // areaServed could actually work against ranking for broader,
      // non-local searches.
      { "@type": "Place", name: "Worldwide" },
    ],
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

/**
 * BreadcrumbList structured data for a detail page — mirrors the visible
 * "Home / Category / Item" trail already rendered on these pages, so
 * Google can show the same trail as breadcrumb rich results in search.
 * Pass site-relative paths (e.g. "/services"); "" means the homepage.
 */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

/**
 * Service structured data for an individual service detail page
 * (/services/<slug>) — ties the page's actual offering to Devliora as
 * the provider and to the same Bangladesh/Australia/worldwide areaServed
 * used sitewide, so a query naming this specific service (e.g. "AI
 * development company Bangladesh") has an explicit structured signal to
 * match against, not just body text.
 */
export function serviceJsonLd(opts: { name: string; description: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: `${siteConfig.url}/services/${opts.slug}`,
    provider: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: [
      { "@type": "Country", name: "Bangladesh" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Place", name: "Worldwide" },
    ],
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
