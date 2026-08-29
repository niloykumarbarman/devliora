"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "./apiConfig";
import { SERVICE_TITLE_OVERRIDES } from "./services";
import {
  fetchAllTechnologyDetailPages,
  type TechnologyDetailPageSummaryDto,
} from "./technologyDetailPages";

export type ExploreService = {
  id: string;
  title: string;
  slug: string;
  iconUrl: string;
  displayOrder: number;
};

/** A menu row: a label plus the route it links to. */
export type ExploreLink = { label: string; href: string };

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

const toLinks = (
  pages: TechnologyDetailPageSummaryDto[],
  type: "technology" | "solution"
): ExploreLink[] =>
  pages
    .filter((p) => (p.pageType || "technology") === type)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((p) => ({
      label: p.heroTitle || p.technologyName || p.slug,
      href: `/${type === "solution" ? "solutions" : "technologies"}/${p.slug}`,
    }));

/**
 * Data source for the navbar mega-menu (desktop hover) and the mobile
 * accordion equivalent. All three columns — Services, Technologies and
 * Solutions — come from the admin-managed API now (Services from
 * /services, Technologies and Solutions from /technology-detail-pages
 * split by pageType), so the menu always reflects what's published in
 * the admin panel. The menu panel scrolls internally, so long lists are
 * fully reachable rather than clipped.
 */
export function useExploreMenuData() {
  const [services, setServices] = useState<ExploreService[]>([]);
  const [technologies, setTechnologies] = useState<ExploreLink[]>([]);
  const [solutions, setSolutions] = useState<ExploreLink[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchServicesForMenu(), fetchAllTechnologyDetailPages()]).then(
      ([serviceData, detailPages]) => {
        if (cancelled) return;
        setServices(serviceData);
        setTechnologies(toLinks(detailPages, "technology"));
        setSolutions(toLinks(detailPages, "solution"));
        setLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, technologies, solutions, loaded };
}
