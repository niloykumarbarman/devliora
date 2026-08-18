import { adminFetch } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export interface SiteSettingsDto {
  id: string;
  logoUrl: string;
  siteName: string;
  portfolioHeroImageUrl: string;
  industriesImageUrl: string;
  servicesImageUrl: string;
  servicesBannerImageUrl: string;
  servicesEngineeringImageUrl: string;
  servicesTechImageUrl: string;
  servicesSolutionsImageUrl: string;
  technologiesHeroImageUrl: string;
  technologiesBackendImageUrl: string;
  technologiesFrontendImageUrl: string;
  technologiesCloudImageUrl: string;
  technologiesDatabaseImageUrl: string;
  technologiesDevOpsImageUrl: string;
  technologiesAiMlImageUrl: string;
  technologiesMobileImageUrl: string;
}

export const SITE_SETTINGS_API_URL = `${API_BASE_URL}/site-settings`;

export async function fetchSiteSettings(): Promise<SiteSettingsDto | null> {
  try {
    const response = await fetch(SITE_SETTINGS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as SiteSettingsDto;
  } catch {
    return null;
  }
}

export async function updateSiteSettings(
  payload: SiteSettingsDto
): Promise<void> {
  const res = await adminFetch(SITE_SETTINGS_API_URL, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to update site settings: ${res.status}`);
  }
}
