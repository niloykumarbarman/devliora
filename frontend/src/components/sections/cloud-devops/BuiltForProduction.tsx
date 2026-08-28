import Reveal from "@/components/Reveal";
import { RELIABILITY_CAPABILITIES } from "@/lib/cloudDevops";

export default function BuiltForProduction() {

  return (
    <section
      id="built-for-production"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-14%] left-[-8%] h-[420px] w-[420px] rounded-full bg-ember/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Reliability
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Built for <span className="text-signal">production</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            Nine things that are in place before a system carries real traffic — not
            added after the first incident.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {RELIABILITY_CAPABILITIES.map((capability, i) => {
            const Icon = capability.icon;
            return (
              <Reveal key={capability.name} delay={(i % 3) * 0.06} className="bg-paper p-6 transition-colors hover:bg-white">
                <Icon className="h-5 w-5 text-signal" strokeWidth={1.5} />
                <h3 className="mt-3 font-display text-base font-semibold leading-tight">
                  {capability.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite/75">
                  {capability.detail}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
