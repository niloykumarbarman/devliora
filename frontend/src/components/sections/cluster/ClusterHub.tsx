import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "./SectionHeading";
import type { ClusterTopic, TitlePart } from "./clusterKit";

/**
 * The pillar page's hub grid — every supporting topic in the cluster as
 * a descriptive link with a one-line summary. This is the visible
 * counterpart of the ItemList JSON-LD emitted on /custom-software-development.
 */
export default function ClusterHub({
  eyebrow,
  titleParts,
  intro,
  topics,
}: {
  eyebrow: string;
  titleParts: TitlePart[];
  intro?: string;
  topics: ClusterTopic[];
}) {
  return (
    <section
      id="the-cluster"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-12%] right-[-8%] h-[420px] w-[420px] rounded-full bg-ember/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionHeading eyebrow={eyebrow} titleParts={titleParts} intro={intro} />

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <Reveal
              key={topic.href}
              as="article"
              delay={(i % 3) * 0.06}
              className="bg-paper transition-colors hover:bg-white"
            >
              <Link
                href={topic.href}
                className="group flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-semibold leading-tight text-ink group-hover:text-signal">
                    {topic.label}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-graphite/40 transition-colors group-hover:text-signal"
                    strokeWidth={2}
                  />
                </span>
                <span className="mt-2 text-sm leading-relaxed text-graphite/75">
                  {topic.summary}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
