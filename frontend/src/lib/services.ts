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
// Everything else links to the #slug anchor on the /services listing page.
const DETAIL_PAGE_SLUGS = new Set(["software-engineering", "digital-design"]);

export function hasDetailPage(slug: string): boolean {
  return DETAIL_PAGE_SLUGS.has(slug);
}

export function serviceHref(slug: string): string {
  return hasDetailPage(slug) ? `/services/${slug}` : `/services#${slug}`;
}

