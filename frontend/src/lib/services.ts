import { API_BASE_URL } from "./apiConfig";

export interface ServiceHighlight {
  label: string;
  description: string;
  displayOrder: number;
}

export interface ServiceIndustryCard {
  imageUrl: string;
  title: string;
  description: string;
  displayOrder: number;
}

// Admin-curated case studies for a service's per-tab (Web/Mobile/
// Enterprise) "Success Stats" grid — see ServiceTabs.tsx.
export interface ServiceTabCaseStudy {
  tab: string;
  caseStudyId: string;
  displayOrder: number;
  caseStudyTitle: string;
  caseStudySlug: string;
  caseStudyIndustry: string;
  caseStudyResults: string;
  caseStudyCoverImageUrl: string;
}

export interface ServiceDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  iconUrl: string;
  heroImageUrl: string;
  displayOrder: number;
  highlights: ServiceHighlight[];
  toolsHeading: string;
  toolsDescription: string;
  toolsTagline: string;
  toolNames: string[];
  processSteps: string[];
  processGroupStart: number;
  processGroupCount: number;
  processGroupLabel: string;
  industriesHeading: string;
  industriesTagline: string;
  industriesDescription: string;
  industryCards: ServiceIndustryCard[];
  tabCaseStudies: ServiceTabCaseStudy[];
}

export async function fetchServices(): Promise<ServiceDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/services`, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }
    return (await res.json()) as ServiceDto[];
  } catch {
    return [];
  }
}

// There's no GET /api/services/{slug} endpoint, so the single-service
// lookup filters the full list rather than requiring a backend change.
export async function fetchServiceBySlug(slug: string): Promise<ServiceDto | null> {
  const services = await fetchServices();
  return services.find((service) => service.slug === slug) ?? null;
}

// Services with a full dedicated /services/[slug] breakdown page.
// Everything else links to the /services listing page itself — it used to
// link to a #slug anchor on that page, but the section with those anchor
// targets (ServicesDetailList) was removed, so linking to #slug would just
// silently fail to scroll. Plain /services is the correct fallback now.
const DETAIL_PAGE_SLUGS = new Set([
  "software-engineering",
  "digital-design",
  "digital-marketing",
  "it-consulting",
  "it-maintenance-support",
  "staff-augmentation",
  "software-quality-assurance",
  "performance-reliability-engineering",
  "software-resource-rental",
]);

export function hasDetailPage(slug: string): boolean {
  return DETAIL_PAGE_SLUGS.has(slug);
}

export function serviceHref(slug: string): string {
  return hasDetailPage(slug) ? `/services/${slug}` : "/services";
}

// Static snapshot of the site's real services (name + slug), split into two
// columns — used by the "Engineering Services"-style hero (both the
// /services listing page and the Digital Design detail page reuse this
// same list rather than duplicating it).
export const STATIC_SERVICE_LINKS: { title: string; slug: string }[][] = [
  [
    { title: "Software Engineering", slug: "software-engineering" },
    { title: "API Design & Integration", slug: "api-design-integration" },
    { title: "Cloud Infrastructure & DevOps", slug: "cloud-infrastructure-devops" },
    { title: "Performance & Reliability Engineering", slug: "performance-reliability-engineering" },
    { title: "Software Resource Rental", slug: "software-resource-rental" },
    { title: "Software Quality Assurance", slug: "software-quality-assurance" },
  ],
  [
    { title: "Digital Design", slug: "digital-design" },
    { title: "IT Consulting", slug: "it-consulting" },
    { title: "Digital Marketing", slug: "digital-marketing" },
    { title: "IT Maintenance & Support", slug: "it-maintenance-support" },
    { title: "Staff Augmentation", slug: "staff-augmentation" },
  ],
];

