"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "./apiConfig";
import { SERVICE_TITLE_OVERRIDES } from "./services";

export type ExploreService = {
  id: string;
  title: string;
  slug: string;
  iconUrl: string;
  displayOrder: number;
};

async function fetchServicesForMenu(): Promise<ExploreService[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/services`, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }
    const services = (await res.json()) as ExploreService[];
    // Same rename applied in lib/services.ts's fetchServices — this hook
    // hits the API directly rather than reusing that function, so the
    // override is applied here too to stay consistent.
    return services.map((service) =>
      SERVICE_TITLE_OVERRIDES[service.slug]
        ? { ...service, title: SERVICE_TITLE_OVERRIDES[service.slug] }
        : service
    );
  } catch {
    return [];
  }
}

/**
 * Data source for the navbar mega-menu (desktop hover) and the mobile
 * accordion equivalent. Technologies isn't fetched here — the mega-menu's
 * "Technologies" column is a static list (see lib/megaMenuTechnologies.ts)
 * matching kaz.com.bd's mega-menu, not the admin-managed data.
 */
export function useExploreMenuData() {
  const [services, setServices] = useState<ExploreService[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchServicesForMenu().then((serviceData) => {
      if (cancelled) return;
      setServices(serviceData);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loaded };
}
