import Reveal from "@/components/Reveal";
import { ChevronRight } from "lucide-react";
import SectionHeading from "@/components/sections/cluster/SectionHeading";
import * as C from "@/lib/legacyModernization";

/**
 * Bespoke "the approach" section for /legacy-modernization: a compact
 * old-system → routing-layer → new-services flow, then the three
 * migration strategies. Dark band.
 */
export default function ModernizationApproach() {
  return (
    <section
      id="approach"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-14%] right-[-10%] h-[440px] w-[440px] rounded-full bg-ember/14 blur-[140px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow={C.APPROACH_EYEBROW}
          titleParts={C.APPROACH_TITLE}
          intro={C.APPROACH_INTRO}
          tone="dark"
        />

        {/* Flow */}
        <ol className="mt-14 grid gap-3 md:grid-cols-[repeat(4,minmax(0,1fr))] md:items-stretch">
          {C.APPROACH_FLOW.map((node, i) => {
            const Icon = node.icon;
            return (
              <Reveal
                key={node.name}
                as="li"
                delay={i * 0.07}
                className="relative flex flex-col rounded-sm border border-paper/10 bg-graphite/30 p-4"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-signal" strokeWidth={1.75} />
                  <span className="font-display text-sm font-semibold text-paper">
                    {node.name}
                  </span>
                </span>
                <span className="mt-1.5 text-xs leading-relaxed text-paper/60">
                  {node.detail}
                </span>
                {i < C.APPROACH_FLOW.length - 1 && (
                  <ChevronRight
                    aria-hidden
                    className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-paper/30 md:block"
                  />
                )}
              </Reveal>
            );
          })}
        </ol>

        {/* Strategies */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-paper/10 bg-paper/10 md:grid-cols-3">
          {C.APPROACH_STRATEGIES.map((strategy, i) => {
            const Icon = strategy.icon;
            return (
              <Reveal
                key={strategy.name}
                as="article"
                delay={i * 0.08}
                className="bg-ink p-6"
              >
                <Icon className="h-6 w-6 text-ember" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold leading-tight">
                  {strategy.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/70">
                  {strategy.detail}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
