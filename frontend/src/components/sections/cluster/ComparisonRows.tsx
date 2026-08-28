import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import type { ComparisonRow, TitlePart } from "./clusterKit";

/**
 * A two-option comparison table (custom vs off-the-shelf, monolith vs
 * modernised, …). Light band. Scrolls horizontally on narrow screens.
 */
export default function ComparisonRows({
  id,
  eyebrow,
  titleParts,
  intro,
  leftHeading,
  rightHeading,
  rows,
}: {
  id: string;
  eyebrow: string;
  titleParts: TitlePart[];
  intro?: string;
  leftHeading: string;
  rightHeading: string;
  rows: ComparisonRow[];
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
        <SectionHeading eyebrow={eyebrow} titleParts={titleParts} intro={intro} />

        <Reveal className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/15">
                <th className="py-4 pr-4 font-mono text-xs font-semibold uppercase tracking-widest text-graphite/60">
                  Dimension
                </th>
                <th className="py-4 px-4 font-display text-sm font-semibold text-graphite/70">
                  {leftHeading}
                </th>
                <th className="py-4 pl-4 font-display text-sm font-semibold text-signal">
                  {rightHeading}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.dimension} className="border-b border-ink/10 align-top">
                  <th
                    scope="row"
                    className="py-4 pr-4 font-display text-sm font-semibold"
                  >
                    {row.dimension}
                  </th>
                  <td className="py-4 px-4 text-sm leading-relaxed text-graphite/70">
                    {row.left}
                  </td>
                  <td className="py-4 pl-4 text-sm leading-relaxed text-ink">
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
