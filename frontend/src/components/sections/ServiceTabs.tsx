"use client";

import { useState } from "react";
import Image from "next/image";
import { Code2, Database, Lightbulb, MonitorSmartphone, Package, Rows3, Search } from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";
import type { TechnologyDto } from "@/lib/technologies";
import { getTechIcon } from "@/lib/techIcons";
import TechBrandIcon from "@/components/TechBrandIcon";

export type ServiceTabCard = {
  title: string;
  body: string;
};

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
  steps: ServiceTabRoadmapStep[];
};

export type ServiceScopeItem = {
  title: string;
  body: string;
};

export type ServiceScope = {
  intro: string;
  items: ServiceScopeItem[];
};

export type ServiceTechIntro = {
  heading: string;
  tagline: string;
  body: string;
};

export type ServiceTab = {
  label: string;
  heading: string;
  body: string;
  cards?: ServiceTabCard[];
  approach?: ServiceApproach;
  roadmap?: ServiceTabRoadmap;
  scope?: ServiceScope;
  techIntro?: ServiceTechIntro;
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
  heroImageUrl,
  technologies = [],
}: {
  tabs: ServiceTab[];
  heroImageUrl?: string;
  technologies?: TechnologyDto[];
}) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(i)}
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
          <h3 className="text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Full-cycle {current.label.toLowerCase()} development roadmap
          </h3>
          <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
            {current.roadmap.tagline}
          </p>

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

      {current.scope && (
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
      )}

      {current.techIntro && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          {technologies.length > 0 && (
            <div className="mb-16">
              <h3 className="font-display text-2xl font-semibold text-paper">
                Technologies we work with
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {technologies.map((tech) => {
                  const icon = getTechIcon(tech.name);
                  return (
                    <div key={tech.id} className="flex items-center gap-3">
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
            </div>
          )}

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
        </div>
      )}
    </section>
  );
}
