import type { ReactNode } from "react";

// Intro + feature-grid body for individual solution pages (e.g.
// /solutions/furniture-ecommerce-software), matching kaz.com.bd's
// per-solution page layout — same two-tone-heading + paragraph pair and
// feature grid as TechnologyDetailOverview.tsx, but takes a fully custom
// `heading` node instead of a single trailing accent span, since these
// reference headings put the accent color in the *middle* of the
// sentence (e.g. "Benefits of [Furniture eCommerce] Software") rather
// than at the end.
type SolutionFeature = {
  title: string;
  body: string;
};

type SolutionDetailOverviewProps = {
  heading: ReactNode;
  paragraph: string;
  features: SolutionFeature[];
};

export default function SolutionDetailOverview({ heading, paragraph, features }: SolutionDetailOverviewProps) {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 sm:py-24">
      <div className="bg-grain absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
        <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
          {heading}
        </h2>
        <p className="text-lg leading-relaxed text-wire">{paragraph}</p>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title}>
            <h3 className="font-display text-lg font-semibold text-ember">{feature.title}</h3>
            <div className="mt-3 border-t border-paper/15" />
            <p className="mt-4 text-sm leading-relaxed text-wire">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
