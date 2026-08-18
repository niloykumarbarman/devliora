import { API_BASE_URL } from "./apiConfig";

export interface TechnologyDto {
  id: string;
  name: string;
  displayName: string;
  category: number;
  displayOrder: number;
  frameworks: string;
}

export async function fetchTechnologies(): Promise<TechnologyDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/technologies`, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as TechnologyDto[];
  } catch {
    return [];
  }
}
