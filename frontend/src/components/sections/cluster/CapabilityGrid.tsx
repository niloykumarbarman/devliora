import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import type { IconItem, TitlePart } from "./clusterKit";

/**
 * A titled grid of icon + name + detail cards. Light band. Used for
 * "capability pillars", "app types", "what counts as enterprise", etc.
 */
export default function CapabilityGrid({
  id,
  eyebrow,
  titleParts,
  intro,
  items,
  columns = 3,
}: {
  id: string;
  eyebrow: string;
  titleParts: TitlePart[];
  intro?: string;
  items: IconItem[];
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-14%] left-[-8%] h-[420px] w-[420px] rounded-full bg-signal/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionHeading eyebrow={eyebrow} titleParts={titleParts} intro={intro} />

        <div
          className={`mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 ${colClass}`}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.name}
                delay={(i % columns) * 0.06}
                className="bg-paper p-6 transition-colors hover:bg-white"
              >
                <Icon className="h-5 w-5 text-signal" strokeWidth={1.5} />
                <h3 className="mt-3 font-display text-base font-semibold leading-tight">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite/75">
                  {item.detail}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
