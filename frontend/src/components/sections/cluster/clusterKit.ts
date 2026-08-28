import type { LucideIcon } from "lucide-react";

/**
 * Shared types for the "Custom Software Development" content-cluster
 * section kit (src/components/sections/cluster/*). The four cluster pages
 * — /custom-software-development (pillar), /web-development,
 * /legacy-modernization and /enterprise-application-development — are
 * built from these data-driven sections plus a per-page data file in
 * src/lib/, mirroring the /cloud-devops pattern (src/lib/cloudDevops.ts).
 *
 * Everything here is a capability statement, never a claim about volume,
 * uptime or named clients — same rule as the cloud-devops content.
 */

/** A run of heading text; `accent` tints the run signal-blue or ember. */
export interface TitlePart {
  text: string;
  accent?: "signal" | "ember";
}

export interface IconItem {
  name: string;
  detail: string;
  icon: LucideIcon;
}

export interface ProcessStep {
  label: string;
  detail: string;
  icon: LucideIcon;
  /** Marks the step as a quality gate (ember "Gate" pill). */
  gate?: boolean;
}

export interface ComparisonRow {
  dimension: string;
  left: string;
  right: string;
}

export interface ClusterTopic {
  label: string;
  summary: string;
  href: string;
}

export interface CtaLink {
  label: string;
  href: string;
}
