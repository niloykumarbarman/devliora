import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";
import Reveal from "@/components/Reveal";

export type ClientSpotlightItem = {
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  industry: string;
  metricValue: string | null;
  metricLabel: string | null;
};

type ClientSpotlightProps = {
  items: ClientSpotlightItem[];
};

// Real, admin-managed featured work (same Portfolio data /portfolio pulls
// from) — not written for any one service page, so this renders the same
// on every /services/[slug] detail page that has featured portfolios.
export default function ClientSpotlight({ items }: ClientSpotlightProps) {
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal
          as="h2"
          className="font-display text-3xl font-bold text-paper sm:text-4xl"
        >
          Client spotlight: selected work
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal
              key={item.slug}
              delay={i * 0.15}
              className="group border-b border-paper/10 pb-12"
            >
              <Link href={`/portfolio/${item.slug}`} className="tilt-3d block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-graphite">
                  {item.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveImageUrl(item.thumbnailUrl)}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {item.industry && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-paper backdrop-blur-sm">
                      <span className="text-ember">&middot;</span>
                      {item.industry}
                    </span>
                  )}
                </div>
              </Link>

              {item.metricValue && (
                <p className="mt-6 font-display text-4xl font-bold tabular-nums text-paper">
                  {item.metricValue}
                </p>
              )}
              {item.metricLabel && (
                <p className="mt-1 text-sm text-paper/60">{item.metricLabel}</p>
              )}
              <h3 className="mt-3 font-display text-xl font-semibold text-paper">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">{item.summary}</p>

              <Link
                href={`/portfolio/${item.slug}`}
                className="group/link mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ember transition-colors hover:text-paper"
              >
                Read more
                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
