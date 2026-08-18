// Intro + feature-grid body for individual technology pages (e.g.
// /technologies/dot-net-development), matching kaz.com.bd's per-technology
// page layout: a two-tone heading + paragraph pair, followed by a
// two-column-per-row grid of short capability write-ups (ember heading,
// underline rule, supporting copy). Kept generic/prop-driven so the next
// technology page (Java, PHP, Node.js, ...) can reuse it instead of
// duplicating the layout.
type TechnologyFeature = {
  title: string;
  body: string;
};

type TechnologyDetailOverviewProps = {
  heading: string;
  headingAccent: string;
  paragraph: string;
  features: TechnologyFeature[];
};

export default function TechnologyDetailOverview({
  heading,
  headingAccent,
  paragraph,
  features,
}: TechnologyDetailOverviewProps) {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 sm:py-24">
      <div className="bg-grain absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
        <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
          {heading} <span className="text-ember">{headingAccent}</span>
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
