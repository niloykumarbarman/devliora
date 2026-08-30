"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  ShieldCheck,
  GitBranch,
  GitCommitHorizontal,
  Gauge,
  MessageSquareText,
  Lock,
  Code2,
  Cloud,
  Layers,
  Zap,
  CheckCircle2,
  Users,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { adminFetch } from "@/lib/adminAuth";
import { API_BASE_URL } from "./apiConfig";

export interface AboutCard {
  id?: string;
  iconName: string;
  title: string;
  body: string;
  displayOrder: number;
}

export interface AboutContent {
  id: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroHeadingSuffix: string;
  heroSubtitle: string;
  heroImageUrl: string;
  missionHeading: string;
  missionHeadingAccent: string;
  missionBody: string;
  missionCardLabel: string;
  missionCardBody: string;
  visionCardLabel: string;
  visionCardBody: string;
  founderEyebrow: string;
  founderName: string;
  founderRole: string;
  founderBody: string;
  founderCtaText: string;
  founderCtaUrl: string;
  principlesHeading: string;
  principlesHeadingAccent: string;
  ctaHeading: string;
  ctaHeadingAccent: string;
  ctaBody: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  founderCards: AboutCard[];
  principles: AboutCard[];
}

export const ABOUT_API_URL = `${API_BASE_URL}/about`;

/** kebab-case name (stored in the DB) -> lucide component, for the two
 *  card grids. Unknown names fall back to Sparkles. The admin form
 *  offers exactly these keys. */
export const ABOUT_ICONS: Record<string, LucideIcon> = {
  boxes: Boxes,
  "shield-check": ShieldCheck,
  "git-branch": GitBranch,
  "git-commit": GitCommitHorizontal,
  gauge: Gauge,
  "message-square": MessageSquareText,
  lock: Lock,
  code: Code2,
  cloud: Cloud,
  layers: Layers,
  zap: Zap,
  "check-circle": CheckCircle2,
  users: Users,
  rocket: Rocket,
  sparkles: Sparkles,
};

export const ABOUT_ICON_NAMES = Object.keys(ABOUT_ICONS);

export function aboutIcon(name: string): LucideIcon {
  return ABOUT_ICONS[name] ?? Sparkles;
}

/** Split a stored multi-paragraph string into paragraphs (blank line or
 *  single newline separated). */
export function toParagraphs(text: string): string[] {
  return (text || "")
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// One in-flight request shared by every About section component so a
// page render triggers a single /about fetch, not one per section.
let inflight: Promise<AboutContent | null> | null = null;

export function fetchAbout(): Promise<AboutContent | null> {
  if (!inflight) {
    inflight = fetch(ABOUT_API_URL, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<AboutContent>) : null))
      .catch(() => null);
  }
  return inflight;
}

export function useAbout(): { about: AboutContent | null; loaded: boolean } {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAbout().then((data) => {
      if (cancelled) return;
      setAbout(data);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { about, loaded };
}

export async function updateAbout(payload: AboutContent): Promise<void> {
  const res = await adminFetch(ABOUT_API_URL, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to update About content: ${res.status}`);
  }
}
