import { API_BASE_URL } from "./apiConfig";

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  serviceSlug: string;
}

// The homepage's site-wide FAQ section — only items with no ServiceSlug
// (unaffected by any service-scoped FAQs added via fetchFaqsForService).
export async function fetchFaqs(): Promise<FaqDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as FaqDto[];
  } catch {
    return [];
  }
}

// A single service's own FAQ items (e.g. the AI Development detail
// page), scoped via the backend's ServiceSlug filter.
export async function fetchFaqsForService(slug: string): Promise<FaqDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/faqs?serviceSlug=${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as FaqDto[];
  } catch {
    return [];
  }
}
