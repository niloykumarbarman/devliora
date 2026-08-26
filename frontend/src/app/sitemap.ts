import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { fetchBlogPosts } from "@/lib/blogPosts";
import { fetchServices } from "@/lib/services";
import { fetchCaseStudies } from "@/lib/caseStudies";
import { fetchPortfolios } from "@/lib/portfolios";
import { fetchIndustries } from "@/lib/industries";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/about", priority: 0.7 },
  { path: "/services", priority: 0.8 },
  { path: "/cloud-devops", priority: 0.8 },
  { path: "/solutions", priority: 0.8 },
  { path: "/industries", priority: 0.6 },
  { path: "/technologies", priority: 0.6 },
  { path: "/portfolio", priority: 0.7 },
  { path: "/case-studies", priority: 0.7 },
  { path: "/blog", priority: 0.7 },
  { path: "/careers", priority: 0.5 },
  { path: "/contact", priority: 0.6 },
  { path: "/book-consultation", priority: 0.6 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

// Every dynamic detail route is fetched from the live API rather than
// hardcoded, so the sitemap stays correct as content is added via the
// admin panel. Each fetch is independently try/caught so one API being
// slow or briefly down doesn't drop the rest of the sitemap.
async function detailRouteEntries<T>(
  fetcher: () => Promise<T[]>,
  toEntry: (item: T) => MetadataRoute.Sitemap[number]
): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await fetcher();
    return items.map(toEntry);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority,
    })
  );

  const [blogEntries, serviceEntries, caseStudyEntries, portfolioEntries, industryEntries] =
    await Promise.all([
      detailRouteEntries(fetchBlogPosts, (post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
      })),
      detailRouteEntries(fetchServices, (service) => ({
        url: `${siteConfig.url}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      })),
      detailRouteEntries(fetchCaseStudies, (study) => ({
        url: `${siteConfig.url}/case-studies/${study.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
      })),
      detailRouteEntries(fetchPortfolios, (project) => ({
        url: `${siteConfig.url}/portfolio/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.5,
      })),
      detailRouteEntries(fetchIndustries, (industry) => ({
        url: `${siteConfig.url}/industries/${industry.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      })),
    ]);

  return [
    ...staticEntries,
    ...blogEntries,
    ...serviceEntries,
    ...caseStudyEntries,
    ...portfolioEntries,
    ...industryEntries,
  ];
}
