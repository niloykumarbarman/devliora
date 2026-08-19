import { adminFetch } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export interface AdminTechnologyDetailFeature {
  title: string;
  body: string;
  displayOrder: number;
}

export interface AdminTechnologyDetailFaq {
  question: string;
  answer: string;
  displayOrder: number;
}

export interface AdminTechnologyDetailServiceCard {
  title: string;
  description: string;
  displayOrder: number;
}

export interface AdminTechnologyDetailPage {
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
  servicesHeading: string;
  servicesCardLabel: string;
  servicesParagraph: string;
  features: AdminTechnologyDetailFeature[];
  faqs: AdminTechnologyDetailFaq[];
  services: AdminTechnologyDetailServiceCard[];
}

export type TechnologyDetailPageFormPayload = Omit<AdminTechnologyDetailPage, "id">;

export const TECHNOLOGY_DETAIL_PAGES_ADMIN_API_URL = `${API_BASE_URL}/technology-detail-pages`;

export async function fetchAdminTechnologyDetailPages() {
  const res = await adminFetch(`${TECHNOLOGY_DETAIL_PAGES_ADMIN_API_URL}/admin`);
  if (!res.ok) {
    throw new Error(`Failed to fetch technology detail pages: ${res.status}`);
  }
  return res.json() as Promise<AdminTechnologyDetailPage[]>;
}

export async function createTechnologyDetailPage(payload: TechnologyDetailPageFormPayload) {
  const res = await adminFetch(TECHNOLOGY_DETAIL_PAGES_ADMIN_API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to create technology detail page: ${res.status}`);
  }
  return res.json() as Promise<string>;
}

export async function updateTechnologyDetailPage(id: string, payload: TechnologyDetailPageFormPayload) {
  const res = await adminFetch(`${TECHNOLOGY_DETAIL_PAGES_ADMIN_API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...payload }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update technology detail page: ${res.status}`);
  }
}

export async function deleteTechnologyDetailPage(id: string) {
  const res = await adminFetch(`${TECHNOLOGY_DETAIL_PAGES_ADMIN_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete technology detail page: ${res.status}`);
  }
}
