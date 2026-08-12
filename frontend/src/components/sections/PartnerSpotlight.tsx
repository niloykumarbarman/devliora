"use client";

import TechBrandIcon from "@/components/TechBrandIcon";
import { getTechIcon } from "@/lib/techIcons";

type PartnerSpotlightProps = {
  quote: string;
  description: string;
  name: string;
  /**
   * key: techIcons.ts key (e.g. "facebook", "accenture"). label: shown as
   * a text-badge fallback when that key has no verified icon (e.g. "ibm"
   * — same trademark-pull pattern as Java/Marketo elsewhere on the site).
   */
  icons: { key: string; label: string }[];
};

// Shared "third-party platform/partner" spotlight — first used for the
// Digital Marketing page's "Meta" block, now also IT Consulting's
// "Accenture" and IT Maintenance & Support's "IBM" blocks. Extracted once
// a second near-identical instance showed up, rather than duplicating
// the JSX a third time.
export default function PartnerSpotlight({ quote, description, name, icons }: PartnerSpotlightProps) {
  return (
    <section className="relative overflow-hidden border-t border-paper/10 bg-graphite/20 py-16 md:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-balance text-xl font-semibold leading-snug text-ember sm:text-2xl">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="mt-4 max-w-lg text-paper/70">{description}</p>
          <p className="mt-4 font-display text-2xl font-bold text-paper">{name}</p>
        </div>
        <div className="flex shrink-0 gap-4">
          {icons.map((icon) => (
            <div
              key={icon.key}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-paper/95 shadow-sm"
            >
              {getTechIcon(icon.key) ? (
                <TechBrandIcon name={icon.key} className="h-8 w-8" />
              ) : (
                <span className="px-1 text-center text-[0.65rem] font-semibold leading-tight text-ink/70">
                  {icon.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
