"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/lib/hero";
import type { TechnologyDto } from "@/lib/technologies";
import { getTechIcon } from "@/lib/techIcons";
import TechBrandIcon from "@/components/TechBrandIcon";

export type ServiceTabCard = {
  title: string;
  body: string;
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageUrl(heroImageUrl)}
                  alt=""
                  className="h-full w-full object-cover"
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
              <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
                {technologies.map((tech) => {
                  const hasIcon = !!getTechIcon(tech.name);
                  return (
                    <div key={tech.id} className="flex items-center gap-2.5">
                      {hasIcon ? (
                        <TechBrandIcon name={tech.name} className="h-6 w-6 shrink-0" />
                      ) : (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-ember" />
                      )}
                      <span className="font-mono text-sm font-semibold text-ember">
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
