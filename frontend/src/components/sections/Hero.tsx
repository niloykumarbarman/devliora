import { fetchHero, type HeroDto } from "@/lib/hero";
import HeroView from "./HeroView";

const FALLBACK_HERO: HeroDto = {
  id: "fallback",
  // Also the page's H1 when the hero API is unavailable. Keep it aligned
  // with the homepage's primary intent ("custom software development
  // company"); the live value is edited in /admin/hero.
  title: "Custom software development for teams that need it built right.",
  subtitle:
    "Devliora designs, builds, and hardens production software for enterprise teams — APIs, platforms, and the infrastructure that keeps them connected under real load.",
  primaryCtaText: "Start a project",
  primaryCtaUrl: "#contact",
  secondaryCtaText: "See our systems",
  secondaryCtaUrl: "#work",
  backgroundImageUrl: "",
  backgroundVideoUrl: "",
  telemetryPills: [
    { id: "fallback-1", label: "deploy → production", accent: "Signal", top: 6, left: 8, displayOrder: 0 },
    { id: "fallback-2", label: "p95 latency 41ms", accent: "Ember", top: 2, left: 52, displayOrder: 1 },
    { id: "fallback-3", label: "tests: 1,204 passed", accent: "Signal", top: 38, left: 62, displayOrder: 2 },
    { id: "fallback-4", label: "zero-downtime migration", accent: "Ember", top: 58, left: 4, displayOrder: 3 },
    { id: "fallback-5", label: "uptime 99.98%", accent: "Signal", top: 78, left: 44, displayOrder: 4 },
  ],
};

export default async function Hero() {
  const data = await fetchHero();
  const hero = data ?? FALLBACK_HERO;
  const pills = hero.telemetryPills && hero.telemetryPills.length > 0 ? hero.telemetryPills : FALLBACK_HERO.telemetryPills;

  return <HeroView hero={{ ...hero, telemetryPills: pills }} />;
}
