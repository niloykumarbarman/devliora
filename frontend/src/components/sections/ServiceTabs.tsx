"use client";

import { useState } from "react";

export type ServiceTab = {
  label: string;
  heading: string;
  body: string;
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
      </div>
    </section>
  );
}
