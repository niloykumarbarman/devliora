import type { Metadata } from "next";

/**
 * Central site configuration used to build consistent metadata across
 * every page — canonical URLs, sitemap, OG tags, and JSON-LD all derive
 * from it.
 */
export const siteConfig = {
  name: "Devliora",
  url: "https://devliora.com",
  // Brand-level description. Feeds the Organization schema and is the
  // fallback OG/Twitter description for any page that doesn't set its
  // own. The framing matches the markets Devliora sells into; the real
  // office locations are expressed as structured data instead
  // (Organization `address` / `areaServed` in this file), which is the
  // correct place for a location signal.
  description:
    "Devliora is a custom software development company building AI, cloud, DevOps and enterprise software engineering for growing businesses across the US, UK, Canada, Australia and Europe.",
  // Drop a real logo/brand image at this path (frontend/public/og-image.png,
  // 1200x630px) to replace the generated placeholder.
  ogImage: "/og-image.png",
  contactEmail: "info@devliora.com",
  // One canonical phone number for the whole site. `contactPhone` is the
  // E.164 form used in `tel:` links and structured data; `contactPhoneDisplay`
  // is the human-readable form shown in the UI. Change both here — never
  // hard-code a number in a component — so the site's NAP (name / address /
  // phone) never disagrees with what search engines read from the schema.
  contactPhone: "+8801766644823",
  contactPhoneDisplay: "+880 1766-644823",
  // X/Twitter handle, used for the twitter:site and twitter:creator
  // card tags.
  twitterHandle: "@Devliora",
  // Real social profiles (also linked in the footer) — feeds
  // Organization schema's `sameAs`, which is how Google ties this
  // domain to those profiles as the same entity for its knowledge graph.
  socialProfiles: [
    "https://www.facebook.com/profile.php?id=61593049053860",
    "https://www.linkedin.com/company/141053921/",
    "https://x.com/Devliora",
    "https://www.instagram.com/devliora",
  ],
};

const DEFAULT_OG_LOCALE = "en_US";
// Devliora sells into these English-speaking markets. Listing them as
// alternate OG locales is a light, honest signal — not a stand-in for
// genuinely localized pages, which don't exist.
const ALTERNATE_OG_LOCALES = ["en_GB", "en_CA", "en_AU", "en_IE"];

interface BuildMetadataOptions {
  /**
   * Bare page title with no brand suffix, e.g. "Custom Software
   * Development Services". `buildMetadata` appends " | Devliora" unless
   * `absoluteTitle` is set.
   */
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/about". Use "" for the homepage. */
  path?: string;
  image?: string;
  type?: "website" | "article";
  /** Use `title` verbatim as the document title (the homepage does this). */
  absoluteTitle?: boolean;
  /**
   * Thin utility pages and not-found responses: emit
   * `robots: noindex, nofollow` instead of the default indexable rules.
   */
  noindex?: boolean;
  /** Extra Open Graph fields, only used when `type` is "article". */
  article?: {
    publishedTime?: string | null;
    modifiedTime?: string | null;
    authors?: string[];
  };
}

/**
 * Builds a full Next.js Metadata object (title, description, canonical,
 * robots, Open Graph, Twitter card) from a page's title/description so
 * every page gets consistent, correct tags without repeating
 * boilerplate. The " | Devliora" suffix, card handles, OG locales and
 * robots directives are all decided here so individual pages can't
 * drift.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  absoluteTitle = false,
  noindex = false,
  article,
}: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const ogImage = image ?? siteConfig.ogImage;

  const robots: Metadata["robots"] = noindex
    ? {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      };

  const ogImages = [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }];
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          title: fullTitle,
          description,
          url,
          siteName: siteConfig.name,
          images: ogImages,
          locale: DEFAULT_OG_LOCALE,
          alternateLocale: ALTERNATE_OG_LOCALES,
          type: "article",
          publishedTime: article?.publishedTime ?? undefined,
          modifiedTime: article?.modifiedTime ?? undefined,
          authors: article?.authors,
        }
      : {
          title: fullTitle,
          description,
          url,
          siteName: siteConfig.name,
          images: ogImages,
          locale: DEFAULT_OG_LOCALE,
          alternateLocale: ALTERNATE_OG_LOCALES,
          type: "website",
        };

  return {
    // `absolute` opts this title out of the root layout's
    // `title.template` — buildMetadata already includes " | Devliora"
    // (or is the homepage), so the template must not append it again.
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
    },
    robots,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
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

/** Stable @id for the sitewide Organization node, referenced from other
 *  schema (WebSite.publisher, Service.provider, etc.). */
export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;
/** Stable @id for the founder Person node. Referenced from the
 *  Organization's `founder` and from blog Article `author` where a post
 *  is by-lined to him — so search engines resolve one person entity
 *  across the site rather than a name string repeated in isolation. */
export const FOUNDER_ID = `${siteConfig.url}/about#founder`;
export const FOUNDER_NAME = "Niloy Kumar Barman";

/** The markets Devliora sells into. Used for `areaServed` across the
 *  Organization and Service schema. Office locations are expressed
 *  separately via `address`. */
const AREA_SERVED = [
  { "@type": "Country", name: "United States" },
  { "@type": "Country", name: "United Kingdom" },
  { "@type": "Country", name: "Canada" },
  { "@type": "Country", name: "Australia" },
  { "@type": "Place", name: "Europe" },
];

/**
 * Sitewide Organization structured data, rendered once in the root
 * layout. Plain `Organization` (not a LocalBusiness subtype) — Devliora
 * is a remote-first software company, not a walk-in business; the one
 * genuine local presence gets a `LocalBusiness` node only on
 * /locations/australia. No `aggregateRating` or `review` — there are no
 * verified public reviews to cite.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    // The trading name that appears in the site footer copyright. Not a
    // registered-entity claim — just the fuller form of the brand.
    legalName: "Devliora Systems",
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
    founder: {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: FOUNDER_NAME,
    },
    address: OFFICE_ADDRESSES,
    areaServed: AREA_SERVED,
    knowsAbout: [
      "Custom software development",
      "Enterprise software engineering",
      "AI development",
      "Cloud infrastructure and DevOps",
      "Web application development",
      "Software testing and QA",
      "IT consulting",
      "Staff augmentation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contactEmail,
      telephone: siteConfig.contactPhone,
      contactType: "sales",
    },
    sameAs: siteConfig.socialProfiles,
  };
}

/**
 * The founder as a `Person` entity, emitted on the About page (which is
 * where FOUNDER_ID resolves). Only fields that are true and verifiable
 * from the site itself: the name, the role, the company, and the page
 * that describes him. No `sameAs`, `alumniOf`, `award` or `hasCredential`
 * — those would need real external profiles / credentials to cite, and
 * there are none to invent.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER_NAME,
    jobTitle: "Founder & Software Engineer",
    description:
      "Software engineer and founder of Devliora, responsible for the architecture and engineering standards behind the company's work.",
    worksFor: { "@id": ORGANIZATION_ID },
    url: `${siteConfig.url}/about`,
    knowsAbout: [
      "Software architecture",
      "Backend and API engineering",
      "Application security",
      "Cloud infrastructure and DevOps",
    ],
  };
}

/**
 * WebSite structured data (separate from Organization) — helps Google
 * associate the "Devliora" brand query directly with this domain.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * WebPage node for a given route, tying the page to the WebSite and (when
 * present) its BreadcrumbList. Pass a more specific `type` where it fits
 * ("CollectionPage", "AboutPage", "ContactPage").
 */
export function webPageJsonLd(opts: {
  path: string;
  name: string;
  description?: string;
  type?: string;
  primaryImage?: string;
  /** Set false on pages that render no BreadcrumbList (e.g. the homepage). */
  hasBreadcrumb?: boolean;
}) {
  const url = `${siteConfig.url}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
    ...(opts.hasBreadcrumb === false
      ? {}
      : { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    ...(opts.primaryImage
      ? { primaryImageOfPage: { "@type": "ImageObject", url: opts.primaryImage } }
      : {}),
  };
}

/**
 * FAQPage structured data. Only call this with real, on-page Q&A pairs —
 * the questions and answers must be visibly rendered on the same page.
 * Returns null for an empty list so callers can `&&` it.
 */
export function faqPageJsonLd(
  faqs: { question: string; answer: string }[],
  path?: string
) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path ? { "@id": `${siteConfig.url}${path}#faq` } : {}),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * BreadcrumbList structured data for a detail page — mirrors the visible
 * "Home / Category / Item" trail already rendered on these pages, so
 * Google can show the same trail as breadcrumb rich results in search.
 * Pass site-relative paths (e.g. "/services"); "" means the homepage.
 * The `@id` is derived from the last item's URL so a WebPage node on the
 * same page can reference it.
 */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const last = items[items.length - 1];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(last ? { "@id": `${siteConfig.url}${last.path}#breadcrumb` } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

/**
 * LocalBusiness node for Devliora's one genuine physical office
 * (Melbourne). Only used on /locations/australia — everywhere else the
 * plain Organization node applies.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/locations/australia#localbusiness`,
    name: `${siteConfig.name} (Australia)`,
    url: `${siteConfig.url}/locations/australia`,
    parentOrganization: { "@id": ORGANIZATION_ID },
    image: `${siteConfig.url}/favicon-512.png`,
    email: siteConfig.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "34 Featherbrook",
      addressLocality: "Point Cook",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
    areaServed: { "@type": "Country", name: "Australia" },
  };
}

/**
 * Service structured data for a service / technology / solution detail
 * page — ties the page's offering to the Devliora Organization node (by
 * @id) as the provider, and to the same `areaServed` markets used
 * sitewide, so a query naming a specific service has an explicit
 * structured signal to match against, not just body text.
 */
export function serviceJsonLd(opts: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteConfig.url}${opts.path}#service`,
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: `${siteConfig.url}${opts.path}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: AREA_SERVED,
  };
}

interface ArticleJsonLdOptions {
  title: string;
  description: string;
  slug: string;
  authorName: string;
  publishedAt: string | null;
  /** Last-modified timestamp; falls back to publishedAt. */
  modifiedAt?: string | null;
  imageUrl?: string;
  /** Category name, e.g. "AI" or "Cloud & DevOps". */
  section?: string;
  /** Tag list, emitted as schema `keywords`. */
  tags?: string[];
}

/** Article structured data for a single blog post detail page. */
export function articleJsonLd({
  title,
  description,
  slug,
  authorName,
  publishedAt,
  modifiedAt,
  imageUrl,
  section,
  tags,
}: ArticleJsonLdOptions) {
  const url = `${siteConfig.url}/blog/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title.slice(0, 110),
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    // Always emit an image — an absolute URL, falling back to the site
    // OG image — so the article stays eligible for image-rich results.
    image: [
      imageUrl
        ? imageUrl.startsWith("http")
          ? imageUrl
          : `${siteConfig.url}${imageUrl}`
        : `${siteConfig.url}${siteConfig.ogImage}`,
    ],
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    dateModified: modifiedAt ?? publishedAt ?? undefined,
    ...(section ? { articleSection: section } : {}),
    ...(tags && tags.length ? { keywords: tags.join(", ") } : {}),
    // A by-lined post is written by a person, so attribute it to a
    // `Person` (linked to the founder's entity when it's his name) rather
    // than to an Organization named after a person. Falls back to the
    // company only when no author name is set.
    author: authorName
      ? authorName === FOUNDER_NAME
        ? { "@type": "Person", "@id": FOUNDER_ID, name: FOUNDER_NAME }
        : { "@type": "Person", name: authorName }
      : { "@type": "Organization", "@id": ORGANIZATION_ID, name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/favicon-512.png`,
      },
    },
  };
}
