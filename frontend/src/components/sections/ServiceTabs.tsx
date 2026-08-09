"use client";

import { useState } from "react";

export type ServiceTabCard = {
  title: string;
  body: string;
};

export type ServiceTab = {
  label: string;
  heading: string;
  body: string;
  cards?: ServiceTabCard[];
};

export default function ServiceTabs({ tabs }: { tabs: ServiceTab[] }) {
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
    </section>
  );
}
