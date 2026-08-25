import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";

// Qualitative stand-in for kaz.com.bd's per-technology page's "84% of
// Fortune 500 companies... platforms like LinkedIn trust it" stat
// banner. That claim names a specific real company (LinkedIn) Devliora
// has no relationship with and a specific percentage that can't be
// verified — same problem as the Walmart stat on the .NET page, so
// instead of inventing a number, this keeps the banner's visual weight
// (bold headline + supporting copy, bg-signal) with an honest,
// technology-level statement instead of a company-specific claim.
type TechnologyDetailHighlightProps = {
  headline: string;
  paragraph: string;
  icon: LucideIcon;
};

export default function TechnologyDetailHighlight({
  headline,
  paragraph,
  icon: Icon,
}: TechnologyDetailHighlightProps) {
  return (
    <Reveal><section className="border-t border-paper/10 bg-signal">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between md:py-20">
        <div className="max-w-2xl">
          <p className="font-display text-4xl font-bold leading-tight text-ember sm:text-5xl">{headline}</p>
          <p className="mt-4 max-w-xl text-lg text-paper/85">{paragraph}</p>
        </div>
        <Icon className="h-16 w-16 shrink-0 text-paper/25" strokeWidth={1.25} />
      </div>
    </section></Reveal>
  );
}
