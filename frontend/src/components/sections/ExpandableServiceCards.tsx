"use client";

import { useState } from "react";

export type ExpandableServiceCard = {
  title: string;
  description: string;
};

// Single "Show more"/"Show less" card — same interaction pattern as
// ServiceTabs.tsx's ScopeCard (line-clamp + font-mono uppercase ember
// toggle button), just with the divider above the title instead of
// below, to match this section's reference layout.
function Card({ card }: { card: ExpandableServiceCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t-2 border-ember pt-6">
      <h3 className="font-display text-xl font-bold leading-snug text-paper">{card.title}</h3>
      <p className={`mt-3 text-paper/70 ${expanded ? "" : "line-clamp-2"}`}>{card.description}</p>
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

// Used by the Staff Augmentation page's "Our Staff Augmentation
// Services" section — a 3-column grid of expandable cards (the last row
// naturally leaves a gap when the card count isn't a multiple of 3).
export default function ExpandableServiceCards({ cards }: { cards: ExpandableServiceCard[] }) {
  return (
    <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} card={card} />
      ))}
    </div>
  );
}
