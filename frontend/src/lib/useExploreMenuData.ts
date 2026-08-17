"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "./apiConfig";
import { fetchTechnologies, type TechnologyDto } from "./technologies";
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
 * Shared data source for the navbar mega-menu (desktop hover) and the
 * mobile accordion equivalent, so both surfaces fetch services and
 * technologies exactly once per page load.
 */
export function useExploreMenuData() {
  const [services, setServices] = useState<ExploreService[]>([]);
  // Flat, admin-managed technology list (not grouped into categories) —
  // the mega-menu's "Technologies" column lists each one individually,
  // matching kaz.com.bd's mega-menu.
  const [technologies, setTechnologies] = useState<TechnologyDto[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchServicesForMenu(), fetchTechnologies()]).then(([serviceData, techData]) => {
      if (cancelled) return;
      setServices(serviceData);
      setTechnologies([...techData].sort((a, b) => a.displayOrder - b.displayOrder));
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, technologies, loaded };
}
