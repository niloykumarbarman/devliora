import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { fetchBlogPosts } from "@/lib/blogPosts";
import { fetchServices, serviceHref, NON_CANONICAL_SERVICE_SLUGS } from "@/lib/services";
import { fetchCaseStudies } from "@/lib/caseStudies";
import { fetchPortfolios } from "@/lib/portfolios";
import { fetchIndustries } from "@/lib/industries";
import { fetchAllTechnologyDetailPages } from "@/lib/technologyDetailPages";

/**
 * XML sitemap for devliora.com, served at /sitemap.xml and referenced
 * from /robots.txt.
 *
 * Scope: every indexable, canonical, public URL — nothing else. Admin
 * (/admin/*) and the login page are never emitted here; they're also
 * disallowed in robots.txt and carry X-Robots-Tag: noindex. No URL with
 * a query string is ever produced. Detail routes are read from the live
 * API so the sitemap tracks content published through the admin panel
 * without a code change.
 *
 * Every URL is built from `siteConfig.url` (https://devliora.com, no
 * trailing slash), so each entry matches that page's own
 * <link rel="canonical"> exactly.
 */

// Captured once when the server module loads — i.e. roughly the last
// deploy — and reused for every entry that has no more specific date.
// Stable across requests on purpose: emitting a fresh `new Date()` per
// request made every URL look permanently "just modified", which trains
// crawlers to ignore <lastmod> altogether.
const LAST_DEPLOY = new Date();

const abs = (path: string) => `${siteConfig.url}${path}`;

// Homepage + section landing pages + standalone landing pages. The
// dynamic detail routes below hang off several of these.
const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  // Phase 21 "Custom Software Development" content cluster: the pillar
  // page and its three net-new supporting topic pages. The other cluster
  // topics are existing routes already listed here or emitted from the
  // services API below.
  { path: "/custom-software-development", priority: 0.9, changeFrequency: "monthly" },
  { path: "/web-development", priority: 0.8, changeFrequency: "monthly" },
  { path: "/legacy-modernization", priority: 0.8, changeFrequency: "monthly" },
  { path: "/enterprise-application-development", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cloud-devops", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries", priority: 0.7, changeFrequency: "monthly" },
  { path: "/technologies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/locations", priority: 0.5, changeFrequency: "monthly" },
  { path: "/locations/usa", priority: 0.7, changeFrequency: "monthly" },
  { path: "/locations/uk", priority: 0.7, changeFrequency: "monthly" },
  { path: "/locations/canada", priority: 0.7, changeFrequency: "monthly" },
  { path: "/locations/australia", priority: 0.7, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.5, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/book-consultation", priority: 0.6, changeFrequency: "yearly" },
  { path: "/security", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

// Each fetch is independently try/caught so one API endpoint being slow
// or briefly down drops only its own section, never the whole sitemap.
async function detailRouteEntries<T>(
  fetcher: () => Promise<T[]>,
  toEntry: (item: T) => MetadataRoute.Sitemap[number] | null
): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await fetcher();
    return items
      .map(toEntry)
      .filter((entry): entry is MetadataRoute.Sitemap[number] => entry !== null);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: abs(path),
      lastModified: LAST_DEPLOY,
      changeFrequency,
      priority,
    })
  );

  const [
    blogEntries,
    serviceEntries,
    caseStudyEntries,
    portfolioEntries,
    industryEntries,
    techDetailEntries,
  ] = await Promise.all([
    // Blog posts — the one collection with a real publish date to report.
    detailRouteEntries(fetchBlogPosts, (post) => ({
      url: abs(`/blog/${post.slug}`),
      lastModified:
        (post.updatedAt && new Date(post.updatedAt)) ||
        (post.publishedAt && new Date(post.publishedAt)) ||
        LAST_DEPLOY,
      changeFrequency: "yearly",
      priority: 0.5,
    })),
    // Individual services. serviceHref() returns "/services" for a
    // service with no dedicated page and "/cloud-devops" for the one
    // served by that custom route (already a static entry above) — emit
    // an entry only when the service genuinely owns /services/<slug>, so
    // the sitemap never lists a URL that 301s or soft-404s.
    detailRouteEntries(fetchServices, (service) => {
      if (NON_CANONICAL_SERVICE_SLUGS.has(service.slug)) return null;
      const href = serviceHref(service.slug);
      if (href !== `/services/${service.slug}`) return null;
      return {
        url: abs(href),
        lastModified: LAST_DEPLOY,
        changeFrequency: "monthly",
        priority: 0.8,
      };
    }),
    detailRouteEntries(fetchCaseStudies, (study) => ({
      url: abs(`/case-studies/${study.slug}`),
      lastModified: LAST_DEPLOY,
      changeFrequency: "yearly",
      priority: 0.6,
    })),
    detailRouteEntries(fetchPortfolios, (project) => ({
      url: abs(`/portfolio/${project.slug}`),
      lastModified: LAST_DEPLOY,
      changeFrequency: "yearly",
      priority: 0.5,
    })),
    detailRouteEntries(fetchIndustries, (industry) => ({
      url: abs(`/industries/${industry.slug}`),
      lastModified: LAST_DEPLOY,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    // /technologies/[slug] and /solutions/[slug] share one API model;
    // `pageType` ("solution" | "technology") decides the route.
    detailRouteEntries(fetchAllTechnologyDetailPages, (page) => ({
      url: abs(
        `/${page.pageType === "solution" ? "solutions" : "technologies"}/${page.slug}`
      ),
      lastModified: LAST_DEPLOY,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ]);

  const all = [
    ...staticEntries,
    ...blogEntries,
    ...serviceEntries,
    ...caseStudyEntries,
    ...portfolioEntries,
    ...industryEntries,
    ...techDetailEntries,
  ];

  // Final guarantee of no duplicate <loc>: if an API ever returns a slug
  // that collides with a static route or another collection, the first
  // occurrence wins.
  const seen = new Set<string>();
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
