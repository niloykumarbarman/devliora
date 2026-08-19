import { API_BASE_URL } from "./apiConfig";

export interface TechnologyDetailFeatureItem {
  title: string;
  body: string;
  displayOrder: number;
}

export interface TechnologyDetailFaqItem {
  question: string;
  answer: string;
  displayOrder: number;
}

export interface TechnologyDetailServiceItem {
  title: string;
  description: string;
  displayOrder: number;
}

// Public read model behind /technologies/[slug] — every piece of *text*
// content on that page. Card gradient/brand icon/custom visual (e.g.
// Java's code-editor mockup) aren't here; those are per-slug design
// choices kept in the frontend route's own lookup table, since they're
// not the kind of content admins are expected to author. See
// lib/adminTechnologyDetailPages.ts for the admin-side CRUD.
export interface TechnologyDetailPageDto {
  id: string;
  slug: string;
  technologyName: string;
  metaDescription: string;
  displayOrder: number;

  heroTitle: string;

  overviewHeading: string;
  overviewHeadingAccent: string;
  overviewParagraph: string;

  highlightHeadline: string;
  highlightParagraph: string;

  industriesParagraph: string;
  industriesImageUrl: string;

  servicesHeading: string;
  servicesCardLabel: string;
  servicesParagraph: string;
  servicesCardImageUrl: string;

  features: TechnologyDetailFeatureItem[];
  faqs: TechnologyDetailFaqItem[];
  services: TechnologyDetailServiceItem[];
}

export const TECHNOLOGY_DETAIL_PAGES_API_URL = `${API_BASE_URL}/technology-detail-pages`;

export async function fetchTechnologyDetailPageBySlug(
  slug: string
): Promise<TechnologyDetailPageDto | null> {
  const res = await fetch(`${TECHNOLOGY_DETAIL_PAGES_API_URL}/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch technology detail page: ${res.status}`);
  return res.json();
}
