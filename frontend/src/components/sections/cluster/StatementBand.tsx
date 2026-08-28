import Reveal from "@/components/Reveal";
import { Check } from "lucide-react";
import AccentedTitle from "./AccentedTitle";
import type { TitlePart } from "./clusterKit";

/**
 * A short dark conviction band — a claim plus a few supporting points.
 * Breaks up the light sections without a full capability grid.
 */
export default function StatementBand({
  id,
  titleParts,
  body,
  points,
}: {
  id?: string;
  titleParts: TitlePart[];
  body: string;
  points?: string[];
}) {
  return (
    <section
      id={id}
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink py-24 text-paper md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-20%] right-[-10%] h-[420px] w-[420px] rounded-full bg-ember/12 blur-[130px] animate-ambient-drift"
      />

      <Reveal className="relative mx-auto max-w-3xl px-6">
        <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
          <AccentedTitle parts={titleParts} />
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-paper/70">{body}</p>

        {points && points.length > 0 && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-paper/75"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-signal"
                  strokeWidth={2.25}
                />
                {point}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
