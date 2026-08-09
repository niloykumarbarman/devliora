"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/lib/hero";

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
  roadmap?: ServiceTabRoadmap;
  scope?: ServiceScope;
  essentials?: ServiceEssentials;
};

// Six evenly spaced points around the decorative ring (top, then
// clockwise), as percentages of the ring's own box.
const RING_DOT_POSITIONS = [
  { top: "0%", left: "50%" },
  { top: "25%", left: "93.3%" },
  { top: "75%", left: "93.3%" },
  { top: "100%", left: "50%" },
  { top: "75%", left: "6.7%" },
  { top: "25%", left: "6.7%" },
];

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
}: {
  tabs: ServiceTab[];
  heroImageUrl?: string;
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

      {current.essentials && current.essentials.items.length === 6 && (
        <div className="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
          <h3 className="font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
            Our {current.label.toLowerCase()} app essentials
          </h3>
          <p className="mt-3 inline-block border-b border-paper/20 pb-3 italic text-paper/60">
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
                <p className="font-display text-sm font-bold leading-snug text-paper">
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
    </section>
  );
}
