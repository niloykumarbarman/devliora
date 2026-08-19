import TechBrandIcon from "@/components/TechBrandIcon";
import ExpandableServiceCards, {
  type ExpandableServiceCard,
} from "@/components/sections/ExpandableServiceCards";

// "<Technology> Development Services" block for individual technology
// pages, matching kaz.com.bd's per-technology page: a decorative brand-
// colored image card + intro copy, followed by a grid of expandable
// service cards (reusing ExpandableServiceCards, already built for the
// Staff Augmentation page). The image card uses .NET's own real brand
// purple (#512BD4, same hex already used for its icon in lib/techIcons.ts)
// rather than an invented color or a stock photo standing in for one.
type TechnologyDetailServicesProps = {
  heading: string;
  cardLabel: string;
  paragraph: string;
  services: ExpandableServiceCard[];
};

export default function TechnologyDetailServices({
  heading,
  cardLabel,
  paragraph,
  services,
}: TechnologyDetailServicesProps) {
  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-lg"
            style={{ background: "linear-gradient(135deg, #241056 0%, #512BD4 55%, #8b6cf0 100%)" }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex h-full items-center justify-between px-8">
              <span className="font-display text-2xl font-medium text-paper/90 sm:text-3xl">
                {cardLabel}
              </span>
              <TechBrandIcon name=".NET" color="#fff" className="h-16 w-16 shrink-0 opacity-90 sm:h-20 sm:w-20" />
            </div>
          </div>

          <div>
            <h2 className="text-balance font-display text-3xl font-bold uppercase leading-tight text-paper sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-5 text-paper/70">{paragraph}</p>
          </div>
        </div>

        <ExpandableServiceCards cards={services} />
      </div>
    </section>
  );
}
