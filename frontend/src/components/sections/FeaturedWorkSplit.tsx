import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";
import Reveal from "@/components/Reveal";

export type FeaturedWorkSplitItem = {
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  industry: string;
};

type FeaturedWorkSplitProps = {
  items: FeaturedWorkSplitItem[];
};

// Alternating accent tints for the text panel, so two cards side by side
// read as distinct without needing per-item color data.
const PANEL_TINTS = [
  "linear-gradient(135deg, color-mix(in srgb, var(--color-signal) 22%, var(--color-ink)), var(--color-ink))",
  "linear-gradient(135deg, color-mix(in srgb, var(--color-ember) 20%, var(--color-ink)), var(--color-ink))",
];

// Real, admin-managed featured work (same Portfolio data /portfolio pulls
// from), shown full-bleed as image/text split cards — a second, visually
// distinct take on the same "proof of work" idea as ClientSpotlight.
export default function FeaturedWorkSplit({ items }: FeaturedWorkSplitProps) {
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-paper/10">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal
            key={item.slug}
            className={`group relative flex flex-col overflow-hidden sm:min-h-[420px] sm:flex-row ${
              i % 2 === 0 ? "reveal-from-left" : "reveal-from-right"
            }`}
          >
            <Link
              href={`/portfolio/${item.slug}`}
              className="relative h-56 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[45%] lg:w-1/2"
            >
              {item.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImageUrl(item.thumbnailUrl)}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </Link>

            <div
              className="flex flex-1 flex-col justify-center gap-3 p-8 sm:p-10"
              style={{ backgroundImage: PANEL_TINTS[i % PANEL_TINTS.length] }}
            >
              {item.industry && (
                <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-paper/70">
                  <span className="text-ember">&middot;</span>
                  {item.industry}
                </span>
              )}
              <h3 className="text-balance font-display text-2xl font-semibold leading-snug text-paper">
                {item.title}
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-paper/70">{item.summary}</p>
              <Link
                href={`/portfolio/${item.slug}`}
                className="group/link mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ember transition-colors hover:text-paper"
              >
                Read more
                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
