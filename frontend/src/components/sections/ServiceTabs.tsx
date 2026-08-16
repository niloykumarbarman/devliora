"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Database,
  Lightbulb,
  MonitorSmartphone,
  Package,
  Rows3,
  Search,
  Star,
} from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";
import type { TechnologyDto } from "@/lib/technologies";
import type { CaseStudy } from "@/lib/caseStudies";
import type { ServiceTabCaseStudy } from "@/lib/services";
import { getTechIcon } from "@/lib/techIcons";
import TechBrandIcon from "@/components/TechBrandIcon";

export type ServiceTabCard = {
  title: string;
  body: string;
};

// Six evenly spaced points around the "essentials" decorative ring
// (top, then clockwise), as percentages of the ring's own box — same
// geometry as page.tsx's RING_DOT_POSITIONS (page-level "Our software
// essentials" section), duplicated here since it's a small, purely
// visual constant and this component can't import from the route file.
const RING_DOT_POSITIONS = [
  { top: "0%", left: "50%" },
  { top: "25%", left: "93.3%" },
  { top: "75%", left: "93.3%" },
  { top: "100%", left: "50%" },
  { top: "75%", left: "6.7%" },
  { top: "25%", left: "6.7%" },
];

// Desktop's own delivery framework carries a full bullet list per step
// (unlike Web/Mobile's single short checkpoint), so it needs more
// horizontal room per item. Rather than squeeze all 6 into one row, the
// reference wraps them 4-per-row, each row getting its own connecting
// line. Every row still lays out on a 4-column grid — even the last,
// partly-empty one — so dots stay aligned column-for-column across rows.
const FRAMEWORK_ROW_SIZE = 4;

function chunkIntoRows<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

// React components (including icon components) can't be passed as
// props from a Server Component (this data is defined in page.tsx)
// into a Client Component like this one — only serializable data
// crosses that boundary. So each step carries a string key instead,
// and the actual icon component is looked up here, client-side.
const APPROACH_ICONS = {
  lightbulb: Lightbulb,
  wireframe: Rows3,
  prototype: MonitorSmartphone,
  code: Code2,
  database: Database,
  search: Search,
  package: Package,
} as const;

export type ServiceApproachIconKey = keyof typeof APPROACH_ICONS;

export type ServiceApproachStep = {
  iconKey: ServiceApproachIconKey;
  title: string;
};

export type ServiceApproach = {
  tagline: string;
  steps: ServiceApproachStep[];
};

export type ServiceTabRoadmapStep = {
  title: string;
  body: string;
  bullets?: string[];
};

export type ServiceTabRoadmap = {
  tagline: string;
  // Intro paragraph shown beside the heading, same two-column layout as
  // ServiceTechIntro below.
  body: string;
  steps: ServiceTabRoadmapStep[];
};

export type ServiceScopeItem = {
  title: string;
  body: string;
};

export type ServiceScope = {
  intro: string;
  items: ServiceScopeItem[];
  // Optional recurring CTA banner shown right above this section, same
  // bg-signal pattern as the other CTA banners in this file — only
  // Desktop's reference page has one preceding this particular section.
  ctaText?: string;
};

export type ServiceTechIntro = {
  heading: string;
  tagline: string;
  body: string;
  // Optional recurring CTA banner shown right above this section, same
  // bg-signal pattern as the other CTA banners in this file.
  ctaText?: string;
  // The reference has a Web/Mobile/Desktop pill toggle here that swaps
  // the icon grid per platform — we don't have per-platform-tagged
  // technology data to back that, and Devliora doesn't offer a Desktop
  // track at all, so instead of a fake/non-functional toggle, this
  // reuses the site's own real tabs: clicking a pill actually switches
  // the active tab above, same tech list, honest interaction.
  showTabToggle?: boolean;
  // Real language/framework names actually relevant to this platform
  // (e.g. Kotlin/Swift/Dart for Mobile) — takes priority over the
  // site-wide `technologies` list below when set, since a generic
  // full-stack tech grid (Python, Kubernetes, TensorFlow, ...) doesn't
  // read as "Mobile Application Development" tech. Looked up through
  // the same getTechIcon() brand-icon table; a name with no matching
  // icon (e.g. "Java", "C#" — see techIcons.ts) falls back to a plain
  // colored dot, same as the site-wide grid does.
  curatedTechNames?: string[];
};

export type ServiceReviewQuote = {
  text: string;
  source: string;
};

// A real, third-party-attributed statistic (e.g. Cloudflare's own bot
// traffic research) supporting a security narrative — not a Devliora
// claim, so it's fine to cite verbatim as long as the source is named,
// same as the Accenture research citation used elsewhere on this site.
export type ServiceSecurityStat = {
  value: string;
  percent: number;
  description: string;
  source: string;
};

export type ServiceSecuritySection = {
  heading: string;
  body: string;
  checklist: string[];
  stat: ServiceSecurityStat;
  ctaText: string;
};

export type ServiceTargetUsersGroup = {
  heading: string;
  items: string[];
};

export type ServiceTargetUsersSection = {
  heading: string;
  tagline: string;
  body: string;
  groups: ServiceTargetUsersGroup[];
  ctaText: string;
};

// Purely descriptive, generic engineering-capability copy — no client
// facts or figures involved, so unlike ServiceImpact this can be
// adapted closely from the reference without a fabrication concern.
export type ServiceCapability = {
  title: string;
  body: string;
};

// Heading highlights one word/phrase in the middle ("Reliable
// Solutions with **Thoughtful** Engineering"), so it's split into
// three parts instead of a highlight-prefix pattern like
// ServiceCaseStudiesIntro.
export type ServiceCapabilitiesIntro = {
  before: string;
  highlight: string;
  after: string;
  body: string;
  items: ServiceCapability[];
};

// Minimal shape of the real, admin-entered testimonial fetched in
// page.tsx (kept local instead of importing the page's own type, since
// route files aren't meant to be imported from).
export type ServiceTestimonial = {
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientPhotoUrl: string;
  quote: string;
};

export type ServiceWhyChooseUsReason = {
  title: string;
  body: string;
};

// The reference's "Customer Voice" card quotes a named, real person
// (with photo) who is that company's own client — copying it verbatim
// would misattribute a real person's words to Devliora. This renders
// the site's actual admin-entered testimonial in that slot instead.
export type ServiceClosingCta = {
  text: string;
  buttonText: string;
  href: string;
};

export type ServiceWhyChooseUs = {
  ctaText: string;
  heading: string;
  tagline: string;
  reasons: ServiceWhyChooseUsReason[];
  // Extra 4-card row below the reasons list — same title/body pattern
  // as ServiceTabCard, but rendered here since it belongs to this
  // section's own layout, not the top-of-tab intro cards.
  extraCards?: ServiceCapability[];
  closingCta?: ServiceClosingCta;
};

// A step's checkpoint is optional (the reference only drops a
// sub-label under 4 of its 6 steps — Development and Support get none)
// unlike the page-level "Delivery framework" section further down,
// where every step shares the same checkpoints-or-none toggle.
export type ServiceDeliveryFrameworkStep = {
  title: string;
  // A step carries either a single short checkpoint label (Web/Mobile's
  // "Requirements Testing" style) or a full bullet list (Desktop's own
  // delivery framework) — never both.
  checkpoint?: string;
  checkpoints?: string[];
};

export type ServiceDeliveryFramework = {
  highlight: string;
  rest: string;
  tagline: string;
  body: string;
  steps: ServiceDeliveryFrameworkStep[];
};

// Only "Years in Operation" is a real, verified Devliora figure. The
// rest of the KAZ reference's stats (countries, savings, launches,
// company count) are that company's own claims, not something we can
// state about Devliora — so this stays a single honest stat rather
// than the reference's full 5-stat grid. See ServiceImpactStat.
export type ServiceImpactStat = {
  value: string;
  label: string;
  tagline?: string;
};

export type ServiceImpact = {
  ctaText: string;
  heading: string;
  tagline: string;
  stats: ServiceImpactStat[];
};

// Heading is two-tone in the reference ("Success Stats" in ember,
// "That Speak Volumes" in white) — split into two strings instead of
// one so ServiceTabs can render the color split without parsing markup.
export type ServiceCaseStudiesIntro = {
  highlight: string;
  rest: string;
  tagline: string;
  body: string;
  // Reference has a closing CTA banner right after this grid ("Ready
  // to elevate your app game?") — same bg-signal banner pattern as
  // the other recurring CTAs on this page (impact, techIntro), rather
  // than the reference's own rotating per-section colors. Optional
  // because it's skipped when whyChooseUs (which opens with its own
  // identical-looking CTA banner) follows directly with nothing in
  // between — e.g. Desktop, which has no capabilities section to
  // separate them — to avoid two duplicate banners back to back.
  ctaText?: string;
};

// "Our {label} app essentials" ring diagram — same generic,
// non-platform-specific engineering copy already used in the
// page-level "Our software essentials" section (SOFTWARE_ESSENTIALS
// in page.tsx, hidden on this slug in favor of this per-tab version),
// reused here rather than duplicated content per tab.
export type ServiceEssentialItem = {
  title: string;
  body: string;
};

export type ServiceEssentials = {
  tagline: string;
  items: ServiceEssentialItem[];
};

export type ServiceTab = {
  label: string;
  heading: string;
  body: string;
  cards?: ServiceTabCard[];
  security?: ServiceSecuritySection;
  targetUsers?: ServiceTargetUsersSection;
  approach?: ServiceApproach;
  roadmap?: ServiceTabRoadmap;
  reviewQuote?: ServiceReviewQuote;
  scope?: ServiceScope;
  impact?: ServiceImpact;
  caseStudiesIntro?: ServiceCaseStudiesIntro;
  capabilities?: ServiceCapabilitiesIntro;
  whyChooseUs?: ServiceWhyChooseUs;
  deliveryFramework?: ServiceDeliveryFramework;
  techIntro?: ServiceTechIntro;
  essentials?: ServiceEssentials;
};

function ScopeCard({ item }: { item: ServiceScopeItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <h4 className="font-display text-lg font-semibold leading-snug text-paper">{item.title}</h4>
      <div className="mt-3 border-t border-paper/15" />
      <p className={`mt-4 text-sm leading-relaxed text-paper/70 ${expanded ? "" : "line-clamp-3"}`}>
        {item.body}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-3 font-mono text-xs font-semibold uppercase tracking-wide text-ember transition-colors hover:text-paper"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

export default function ServiceTabs({
  tabs,
  baseSlug,
  initialActiveLabel = null,
  heroImageUrl,
  technologies = [],
  caseStudies = [],
  tabCaseStudies = [],
  testimonial = null,
}: {
  tabs: ServiceTab[];
  // Slug + label are used to give each tab its own URL — "Web" is the
  // bare slug, other tabs get a "-mobile"/"-enterprise" suffix — same
  // as the reference's separate per-platform pages, instead of a
  // client-only toggle that always lives at one URL.
  baseSlug?: string;
  initialActiveLabel?: string | null;
  heroImageUrl?: string;
  technologies?: TechnologyDto[];
  caseStudies?: CaseStudy[];
  tabCaseStudies?: ServiceTabCaseStudy[];
  testimonial?: ServiceTestimonial | null;
}) {
  const findTabIndex = (label: string | null) => {
    const idx = tabs.findIndex((t) => t.label === label);
    return idx >= 0 ? idx : 0;
  };

  const [active, setActive] = useState(() => findTabIndex(initialActiveLabel));
  const router = useRouter();

  // Resyncs the active tab when the URL's tab changes without a click
  // here — direct navigation, a shared link, or browser back/forward.
  // Adjusting state during render (React's documented pattern for
  // "reset state when a prop changes") rather than in an effect, so
  // there's no extra render showing the stale tab first.
  const [syncedLabel, setSyncedLabel] = useState(initialActiveLabel);
  if (initialActiveLabel !== syncedLabel) {
    setSyncedLabel(initialActiveLabel);
    setActive(findTabIndex(initialActiveLabel));
  }

  const current = tabs[active];

  // Desktop's own delivery framework (full bullet-list steps) uses the
  // reference Figma file's gold/amber accent for its numerals, dots,
  // and tagline underline instead of the site's own ember brand color
  // — an explicit, requested exception scoped to this one section via
  // arbitrary-value classes, not a change to the shared "ember" token
  // used everywhere else on the site. Web/Mobile's short-checkpoint
  // layout is unaffected and keeps ember.
  const isDesktopChecklistFramework = current.deliveryFramework?.steps.some((step) => step.checkpoints) ?? false;
  const frameworkAccentText = isDesktopChecklistFramework ? "text-[#F5A623]" : "text-ember";
  const frameworkAccentBg = isDesktopChecklistFramework ? "bg-[#F5A623]" : "bg-ember";
  const frameworkAccentBorder = isDesktopChecklistFramework ? "border-[#F5A623]" : "border-ember";

  function goToTab(i: number) {
    setActive(i);
    if (!baseSlug) return;
    const label = tabs[i].label;
    const path = label === "Web" ? `/services/${baseSlug}` : `/services/${baseSlug}-${label.toLowerCase()}`;
    router.push(path, { scroll: false });
  }

  // Admin-curated picks for this tab (see ServiceTabCaseStudy) take
  // priority; if none were picked for this tab, fall back to the
  // site's newest 4 published case studies — same as before this was
  // admin-controllable.
  const curatedForTab = tabCaseStudies
    .filter((t) => t.tab === current.label)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const displayedCaseStudies =
    curatedForTab.length > 0
      ? curatedForTab.map((t) => ({
          id: t.caseStudyId,
          slug: t.caseStudySlug,
          industry: t.caseStudyIndustry,
          results: t.caseStudyResults,
          coverImageUrl: t.caseStudyCoverImageUrl,
        }))
      : caseStudies.slice(0, 4).map((s) => ({
          id: s.id,
          slug: s.slug,
          industry: s.industry,
          results: s.results,
          coverImageUrl: s.coverImageUrl,
        }));

  // A platform-curated name list (see ServiceTechIntro.curatedTechNames)
  // takes priority over the site-wide `technologies` list.
  const displayTechs = current.techIntro?.curatedTechNames
    ? current.techIntro.curatedTechNames.map((name) => ({ key: name, name, displayName: name }))
    : technologies.map((t) => ({ key: t.id, name: t.name, displayName: t.displayName }));

  return (
    <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => goToTab(i)}
              aria-pressed={i === active}
              className={`rounded-full px-6 py-2.5 font-mono text-sm font-semibold transition-colors ${
                i === active ? "bg-ember text-ink" : "text-paper/60 hover:text-paper"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-start">
          <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
            {current.heading}
          </h2>
          <p className="text-lg leading-relaxed text-paper/70">{current.body}</p>
        </div>

        {current.cards && current.cards.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {current.cards.map((card) => (
              <div key={card.title}>
                <h3 className="font-display text-lg font-semibold leading-snug text-paper">
                  {card.title}
                </h3>
                <div className="mt-3 border-t border-paper/15" />
                <p className="mt-4 text-sm leading-relaxed text-paper/70">{card.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {current.security && (() => {
        const security = current.security;
        const sourceIcon = getTechIcon(security.stat.source);
        return (
        <>
          <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                  {security.heading}
                </h3>

                <div className="mt-10 flex items-center gap-6">
                  <div className="relative h-28 w-28 shrink-0">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <defs>
                        <linearGradient id="securityStatRing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-paper)" />
                          <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#securityStatRing)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(security.stat.percent / 100) * 282.7} 282.7`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-paper">
                      {security.stat.value}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-paper/70">{security.stat.description}</p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  {sourceIcon && (
                    <TechBrandIcon name={security.stat.source} color={`#${sourceIcon.hex}`} className="h-6 w-6" />
                  )}
                  <span className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                    {security.stat.source}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-lg leading-relaxed text-paper/70">{security.body}</p>
                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {security.checklist.map((item) => (
                    <p key={item} className="text-sm font-semibold text-paper">
                      <span className="text-ember">&middot; </span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 bg-signal md:mt-28">
            <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
              <div className="flex-1 px-6 py-8 sm:py-10">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">{security.ctaText}</p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
              >
                Find Out More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </>
        );
      })()}

      {current.targetUsers && (
        <>
          <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                  {current.targetUsers.heading}
                </h3>
                <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                  {current.targetUsers.tagline}
                </p>
              </div>
              <p className="text-lg leading-relaxed text-paper/70">{current.targetUsers.body}</p>
            </div>

            {current.targetUsers.groups.map((group) => (
              <div key={group.heading} className="mt-14">
                <h4 className="font-display text-xl font-bold text-ember">{group.heading}</h4>
                {/* Padded to a full row with "-" placeholders, same as
                    the reference's grid and the tech-list table above. */}
                <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                  {Array.from({ length: Math.ceil(group.items.length / 4) * 4 }).map((_, i) => (
                    <p key={i} className="text-sm font-semibold text-paper">
                      {group.items[i] ?? "-"}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-signal md:mt-28">
            <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
              <div className="flex-1 px-6 py-8 sm:py-10">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  {current.targetUsers.ctaText}
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </>
      )}

      {current.approach && current.approach.steps.length > 1 && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          <h3 className="text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Our approach to exceptional {current.label.toLowerCase()} development
          </h3>
          <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
            {current.approach.tagline}
          </p>

          {/* Desktop: zigzag icon timeline. Points and the connecting
              polyline share the same 0-100 coordinate space (viewBox
              "0 0 100 100" with preserveAspectRatio="none" stretches to
              fill the container exactly like the % positions below), so
              the line always meets the circles regardless of container
              width. */}
          <div className="relative mt-28 hidden h-64 md:block">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                points={current.approach.steps
                  .map((_, i) => {
                    const x = (i / (current.approach!.steps.length - 1)) * 100;
                    const y = i % 2 === 0 ? 78 : 22;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="var(--color-paper)"
                strokeOpacity="0.7"
                strokeWidth="0.6"
              />
            </svg>

            {current.approach.steps.map((step, i) => {
              const isHigh = i % 2 === 1;
              const x = (i / (current.approach!.steps.length - 1)) * 100;
              const y = isHigh ? 22 : 78;
              const Icon = APPROACH_ICONS[step.iconKey];
              const label = (
                <div className="max-w-[7rem] text-center">
                  <p className="font-mono text-xs font-semibold tabular-nums text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold uppercase leading-snug tracking-wide text-paper">
                    {step.title}
                  </p>
                </div>
              );
              return (
                <div
                  key={step.title}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {isHigh && <div className="mb-3">{label}</div>}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-paper bg-ink">
                    <Icon className="h-6 w-6 text-ember" strokeWidth={1.5} />
                  </div>
                  {!isHigh && <div className="mt-3">{label}</div>}
                </div>
              );
            })}
          </div>

          {/* Mobile: plain vertical list */}
          <div className="mt-14 space-y-6 md:hidden">
            {current.approach.steps.map((step, i) => {
              const Icon = APPROACH_ICONS[step.iconKey];
              return (
                <div key={step.title} className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-paper bg-ink">
                    <Icon className="h-5 w-5 text-ember" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-mono text-xs font-semibold tabular-nums text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="text-sm font-semibold text-paper">{step.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {current.roadmap && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h3 className="text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
                Full-cycle {current.label.toLowerCase()} development roadmap
              </h3>
              <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                {current.roadmap.tagline}
              </p>
            </div>
            <p className="text-lg leading-relaxed text-paper/70">{current.roadmap.body}</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {current.roadmap.steps.map((step, i) => (
              <div key={step.title}>
                <p className="font-display text-4xl font-extrabold tabular-nums text-ember">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-2 font-display text-xl font-bold text-ember">{step.title}</h4>
                <div className="mt-3 border-t border-paper/15" />
                <p className="mt-4 text-sm leading-relaxed text-paper/70">{step.body}</p>
                {step.bullets && step.bullets.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="text-sm leading-relaxed text-paper/70">
                        &middot; {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {current.reviewQuote && (
        <div className="mt-20 bg-graphite py-16 md:mt-28">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-balance text-xl font-medium leading-snug text-paper sm:text-2xl">
                &ldquo;{current.reviewQuote.text}&rdquo;
              </p>
              <div className="mt-4 flex gap-1 text-green-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
            </div>
            <p className="shrink-0 font-display text-2xl font-bold uppercase tracking-wide text-paper/60">
              &lsquo;{current.reviewQuote.source}&rsquo;
            </p>
          </div>
        </div>
      )}

      {current.scope && (
        <>
          {current.scope.ctaText && (
            <div className="mt-20 bg-signal md:mt-28">
              <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
                <div className="flex-1 px-6 py-8 sm:py-10">
                  <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                    {current.scope.ctaText}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          )}
          <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              {heroImageUrl && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={resolveImageUrl(heroImageUrl)}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                  Comprehensive Scope of Our {current.label} Application Development
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-paper/70">{current.scope.intro}</p>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-3">
              {current.scope.items.map((item) => (
                <ScopeCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </>
      )}

      {current.impact && (
        <>
          {/* CTA banner — generic, no factual claims, so it's kept
              verbatim from the reference like the site's other
              bg-signal CTA banners. */}
          <div className="mt-20 bg-signal md:mt-28">
            <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
              <div className="flex-1 px-6 py-8 sm:py-10">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  {current.impact.ctaText}
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-6xl px-6 text-center md:mt-28">
            <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
              {current.impact.heading}
            </h3>
            <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
              {current.impact.tagline}
            </p>

            <div className="mt-14 flex flex-wrap justify-center gap-x-16 gap-y-10">
              {current.impact.stats.map((stat) => (
                <div key={stat.label} className="max-w-[14rem]">
                  <p className="font-display text-5xl font-extrabold tabular-nums text-ember">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-semibold text-paper">{stat.label}</p>
                  {stat.tagline && (
                    <>
                      <div className="mx-auto mt-3 w-10 border-t border-paper/20" />
                      <p className="mt-3 text-sm italic text-paper/60">{stat.tagline}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {current.caseStudiesIntro && displayedCaseStudies.length > 0 && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          <h3 className="text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
            <span className="text-ember">{current.caseStudiesIntro.highlight}</span>{" "}
            <span className="text-paper">{current.caseStudiesIntro.rest}</span>
          </h3>
          <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
            {current.caseStudiesIntro.tagline}
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
            {current.caseStudiesIntro.body}
          </p>

          {/* Same card treatment as the page-level "Real results, real
              impact" case studies grid — real Devliora case studies
              (image, industry, results), not the reference's
              per-card claims. Admin-curated per tab when picks exist
              (see ServiceTabCaseStudy), else the newest 4 published
              case studies site-wide. */}
          <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {displayedCaseStudies.map((study) => (
              <Link
                key={study.id}
                href={`/case-studies/${study.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-ink"
              >
                {study.coverImageUrl && (
                  <Image
                    src={resolveImageUrl(study.coverImageUrl)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-ink/90 p-4">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ember">
                    &middot; {study.industry}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-paper/80">
                    {study.results}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {current.caseStudiesIntro && current.caseStudiesIntro.ctaText && displayedCaseStudies.length > 0 && (
        <div className="mt-20 bg-signal md:mt-28">
          <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
            <div className="flex-1 px-6 py-8 sm:py-10">
              <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                {current.caseStudiesIntro.ctaText}
              </p>
            </div>
            <Link
              href="/contact"
              className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}

      {current.capabilities && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
              {current.capabilities.before} <span className="text-ember">{current.capabilities.highlight}</span>{" "}
              {current.capabilities.after}
            </h3>
            <p className="text-lg leading-relaxed text-paper/70">{current.capabilities.body}</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-3">
            {current.capabilities.items.map((item) => (
              <div key={item.title}>
                <h4 className="font-display text-lg font-semibold leading-snug text-ember">
                  {item.title}
                </h4>
                <div className="mt-3 border-t border-paper/15" />
                <p className="mt-4 text-sm leading-relaxed text-paper/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {current.whyChooseUs && (
        <>
          <div className="mt-20 bg-signal md:mt-28">
            <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
              <div className="flex-1 px-6 py-8 sm:py-10">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  {current.whyChooseUs.ctaText}
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-6xl gap-16 px-6 md:mt-28 md:grid-cols-2">
            <div>
              <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                {current.whyChooseUs.heading}
              </h3>
              <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                {current.whyChooseUs.tagline}
              </p>

              {testimonial && (
                <div className="mt-12 rounded-2xl border border-ember/20 bg-ember/10 p-8">
                  <h4 className="font-display text-xl font-semibold text-paper">Customer Voice</h4>
                  <p className="mt-4 text-lg leading-relaxed text-paper/80">
                    &ldquo;{testimonial.quote.replace(/^[“"]|[”"]$/g, "")}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    {testimonial.clientPhotoUrl ? (
                      <Image
                        src={resolveImageUrl(testimonial.clientPhotoUrl)}
                        alt=""
                        width={44}
                        height={44}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember/20 text-ember">
                        <Star className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-paper">{testimonial.clientName}</p>
                      <p className="text-sm text-paper/60">
                        {testimonial.clientTitle}
                        {testimonial.clientCompany && (
                          <>
                            , <span className="text-ember">{testimonial.clientCompany}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ul className="space-y-8">
              {current.whyChooseUs.reasons.map((item) => (
                <li key={item.title}>
                  <span className="font-semibold text-ember">{item.title}:</span>{" "}
                  <span className="text-paper/80">{item.body}</span>
                </li>
              ))}
            </ul>
          </div>

          {current.whyChooseUs.extraCards && current.whyChooseUs.extraCards.length > 0 && (
            <div className="mx-auto mt-16 max-w-6xl px-6">
              <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {current.whyChooseUs.extraCards.map((item) => (
                  <div key={item.title}>
                    <h4 className="font-display text-lg font-semibold leading-snug text-paper">
                      {item.title}
                    </h4>
                    <div className="mt-3 border-t border-paper/15" />
                    <p className="mt-4 text-sm leading-relaxed text-paper/70">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {current.whyChooseUs.closingCta && (
            <div className="mt-16 bg-signal md:mt-20">
              <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
                <div className="flex-1 px-6 py-8 sm:py-10">
                  <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                    {current.whyChooseUs.closingCta.text}
                  </p>
                </div>
                <Link
                  href={current.whyChooseUs.closingCta.href}
                  className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
                >
                  {current.whyChooseUs.closingCta.buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {current.essentials && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
            Our {current.label.toLowerCase()} app essentials
          </h3>
          <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
            {current.essentials.tagline}
          </p>

          <div className="relative mt-16 grid grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-[1fr_14rem_1fr]">
            <div className="space-y-10 md:text-right">
              {current.essentials.items.slice(0, 3).map((item) => (
                <div key={item.title}>
                  <h4 className="font-display text-lg font-semibold text-ember">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="relative mx-auto hidden h-56 w-56 shrink-0 md:block">
              <div className="absolute inset-0 rounded-full border border-dashed border-paper/30" />
              {RING_DOT_POSITIONS.map((pos, i) => (
                <span
                  key={i}
                  className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
                  style={{ top: pos.top, left: pos.left }}
                />
              ))}
              <div className="absolute inset-8 flex items-center justify-center rounded-full border-2 border-ember text-center">
                <p className="font-display text-sm font-bold capitalize leading-snug text-paper">
                  Our {current.label.toLowerCase()}
                  <br />
                  app essentials
                </p>
              </div>
            </div>

            <div className="space-y-10">
              {current.essentials.items.slice(3, 6).map((item) => (
                <div key={item.title}>
                  <h4 className="font-display text-lg font-semibold text-ember">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {current.deliveryFramework && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h3 className="text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
                <span className="text-ember">{current.deliveryFramework.highlight}</span>
                <br />
                <span className="text-paper">{current.deliveryFramework.rest}</span>
              </h3>
              <p className={`mt-3 inline-block border-b ${frameworkAccentBorder}/40 pb-3 italic text-paper/60`}>
                {current.deliveryFramework.tagline}
              </p>
            </div>
            <p className="text-lg leading-relaxed text-paper/70">{current.deliveryFramework.body}</p>
          </div>

          {/* Desktop: bullet-list steps (Desktop tab's own delivery
              framework) wrap 4-per-row, each row with its own dashed
              /solid/dashed line — matches the reference's kaz.com.bd
              layout instead of squeezing 6 wide, checklist-heavy steps
              into one row. Steps with only a short checkpoint label
              (Web/Mobile) are narrower and keep the original single-row
              timeline, which already has room for all of them. */}
          {current.deliveryFramework.steps.some((step) => step.checkpoints) ? (
            <div className="relative mt-28 hidden md:block">
              {chunkIntoRows(current.deliveryFramework.steps, FRAMEWORK_ROW_SIZE).map((rowSteps, rowIndex) => {
                const firstCenter = 50 / FRAMEWORK_ROW_SIZE;
                const lastCenter = (rowSteps.length - 0.5) * (100 / FRAMEWORK_ROW_SIZE);
                // Only the very first row gets a dashed lead-in before its
                // first dot (marking the start of the whole timeline);
                // later rows read as a continuation, so their line is
                // solid from the row's left edge. Every row ends with a
                // dashed run-out filling the rest of the (always
                // 4-column) row, whether or not more steps follow.
                const solidLeft = rowIndex === 0 ? firstCenter : 0;
                const gridCols = { gridTemplateColumns: `repeat(${FRAMEWORK_ROW_SIZE}, minmax(0, 1fr))` };
                return (
                  <div key={rowIndex} className={rowIndex === 0 ? "" : "mt-14"}>
                    {/* Numerals/titles, dots, and checklists are three
                        separate stacked grids (sharing the same column
                        template, so columns still line up) instead of
                        one flex column per step. The line's top-1/2
                        wrapper holds ONLY the dot row, whose height is
                        just the dot's own height — identical for every
                        column — so the line always lands exactly on the
                        dot. Wrapping title+dot together (an earlier
                        version of this) made the wrapper's height
                        title-row + dot, and top-1/2 of that lands
                        mid-title instead; wrapping the whole row
                        (title + dot + checklist) made it track whichever
                        column had the longest checklist instead. */}
                    <div
                      className="grid"
                      style={gridCols}
                    >
                      {rowSteps.map((step, i) => (
                        <p key={step.title} className="flex items-baseline gap-2 whitespace-nowrap pr-4 text-left">
                          <span className={`font-display text-3xl font-extrabold ${frameworkAccentText}`}>
                            {rowIndex * FRAMEWORK_ROW_SIZE + i + 1}
                          </span>
                          <span className="text-lg font-semibold leading-snug text-paper">{step.title}</span>
                        </p>
                      ))}
                    </div>
                    <div className="relative mt-4">
                      {rowIndex === 0 && (
                        <div
                          className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-paper/30"
                          style={{ left: 0, width: `${firstCenter}%` }}
                        />
                      )}
                      <div
                        className="absolute top-1/2 h-px -translate-y-1/2 bg-paper/30"
                        style={{ left: `${solidLeft}%`, width: `${lastCenter - solidLeft}%` }}
                      />
                      <div
                        className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-paper/30"
                        style={{ left: `${lastCenter}%`, right: 0 }}
                      />
                      <div className="relative grid" style={gridCols}>
                        {rowSteps.map((step) => (
                          <div key={step.title} className="flex pr-4">
                            <span
                              className={`h-3.5 w-3.5 shrink-0 rounded-full ${frameworkAccentBg} ring-4 ring-ink`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 grid" style={gridCols}>
                      {rowSteps.map((step) => (
                        <div key={step.title} className="pr-4">
                          {step.checkpoints && step.checkpoints.length > 0 && (
                            <ul className="space-y-2">
                              {step.checkpoints.map((item) => (
                                <li key={item} className="max-w-[11rem] text-left text-sm leading-snug text-paper/70">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative mt-28 hidden md:block">
              <div
                className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-paper/30"
                style={{ left: 0, width: `${50 / current.deliveryFramework.steps.length}%` }}
              />
              <div
                className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-paper/30"
                style={{ right: 0, width: `${50 / current.deliveryFramework.steps.length}%` }}
              />
              <div
                className="absolute top-1/2 h-px -translate-y-1/2 bg-paper/30"
                style={{
                  left: `${50 / current.deliveryFramework.steps.length}%`,
                  right: `${50 / current.deliveryFramework.steps.length}%`,
                }}
              />
              <div
                className="relative grid"
                style={{ gridTemplateColumns: `repeat(${current.deliveryFramework.steps.length}, minmax(0, 1fr))` }}
              >
                {current.deliveryFramework.steps.map((step) => (
                  <div key={step.title} className="flex flex-col items-center">
                    <p className="max-w-[9.5rem] text-center text-sm font-semibold leading-snug text-paper">
                      {step.title}
                    </p>
                    <span className="mt-4 h-3.5 w-3.5 shrink-0 rounded-full bg-ember ring-4 ring-ink" />
                    {step.checkpoint && (
                      <>
                        <span className="mt-3 h-8 w-px border-l border-dashed border-paper/30" />
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ember bg-ink" />
                        <p className="mt-3 max-w-[8rem] text-center text-xs text-paper/50">{step.checkpoint}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile: vertical timeline */}
          <div className="relative mt-14 space-y-8 border-l border-paper/15 pl-8 md:hidden">
            {current.deliveryFramework.steps.map((step, i) => (
              <div key={step.title} className="relative">
                <span
                  className={`absolute -left-[2.05rem] top-1 h-3 w-3 rounded-full ${frameworkAccentBg} ring-4 ring-ink`}
                />
                <p className="text-sm font-semibold leading-snug text-paper">
                  {step.checkpoints ? (
                    <>
                      <span className={frameworkAccentText}>{i + 1}</span> {step.title}
                    </>
                  ) : (
                    step.title
                  )}
                </p>
                {step.checkpoint && (
                  <p className="mt-1.5 font-mono text-xs uppercase tracking-wide text-paper/50">
                    {step.checkpoint}
                  </p>
                )}
                {step.checkpoints && step.checkpoints.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {step.checkpoints.map((item) => (
                      <li key={item} className="text-sm leading-snug text-paper/70">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Web/Mobile carry this same Web/Mobile/Desktop pill toggle
              inside their techIntro ("Technologies we work with")
              section below. Desktop has no techIntro of its own, so
              without this it would be the only tab that never offers a
              way to jump straight to the other two platforms from its
              framework section — matching the reference, which shows
              the toggle here regardless of tab. */}
          {!current.techIntro && tabs.length > 1 && (
            <div className="mt-16 flex flex-wrap gap-2">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => goToTab(i)}
                  aria-pressed={i === active}
                  className={`rounded-full px-6 py-2.5 font-mono text-sm font-semibold transition-colors ${
                    i === active ? "bg-ember text-ink" : "text-paper/60 hover:text-paper"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {current.techIntro && (
        <>
          {current.techIntro.ctaText && (
            <div className="mt-20 bg-signal md:mt-28">
              <div className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:items-center">
                <div className="flex-1 px-6 py-8 sm:py-10">
                  <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                    {current.techIntro.ctaText}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          )}

          <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                  {current.techIntro.heading}
                </h3>
                <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                  {current.techIntro.tagline}
                </p>
              </div>
              <p className="text-lg leading-relaxed text-paper/70">{current.techIntro.body}</p>
            </div>

            {displayTechs.length > 0 && (
              <>
                <h4 className="mt-16 font-display text-2xl font-bold leading-tight text-paper">
                  Quality Management
                </h4>
                <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                  {displayTechs.map((tech) => {
                    const icon = getTechIcon(tech.name);
                    return (
                      <div key={tech.key} className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: icon ? `#${icon.hex}` : "var(--color-ember)" }}
                        >
                          {icon ? (
                            <TechBrandIcon name={tech.name} color="#fff" className="h-5 w-5" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-paper" />
                          )}
                        </div>
                        <span className="font-mono text-sm font-semibold text-paper">
                          {tech.displayName.trim()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Reference repeats this exact heading/tagline/body block
                    a second time right below the tech icons — matched
                    verbatim per explicit request. */}
                <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-start">
                  <div>
                    <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                      {current.techIntro.heading}
                    </h3>
                    <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                      {current.techIntro.tagline}
                    </p>
                  </div>
                  <p className="text-lg leading-relaxed text-paper/70">{current.techIntro.body}</p>
                </div>

                {/* Reference also repeats the tech list a third time as a
                    plain text table (no icons), padded to a full row
                    with "-" placeholders — matched verbatim per explicit
                    request, same as the heading duplication above. */}
                <h4 className="mt-16 font-display text-2xl font-bold leading-tight text-paper">
                  Quality Management
                </h4>
                <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                  {Array.from({ length: Math.ceil(displayTechs.length / 4) * 4 }).map((_, i) => (
                    <span key={i} className="font-mono text-sm font-semibold text-paper">
                      {displayTechs[i]?.displayName.trim() ?? "-"}
                    </span>
                  ))}
                </div>
              </>
            )}

            {current.techIntro.showTabToggle && tabs.length > 1 && (
              <div className="mt-16 flex flex-wrap gap-2">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => goToTab(i)}
                    aria-pressed={i === active}
                    className={`rounded-full px-6 py-2.5 font-mono text-sm font-semibold transition-colors ${
                      i === active ? "bg-ember text-ink" : "text-paper/60 hover:text-paper"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
