import { API_BASE_URL } from "./apiConfig";

export interface IndustryDto {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}

export interface IndustryStat {
  value: string;
  label: string;
  source: string;
  displayOrder: number;
}

export interface IndustryDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  stats: IndustryStat[];
}

export async function fetchIndustries(): Promise<IndustryDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/industries`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as IndustryDto[];
  } catch {
    return [];
  }
}

export async function fetchIndustryBySlug(slug: string): Promise<IndustryDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/industries/${slug}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as IndustryDetail;
  } catch {
    return null;
  }
}
