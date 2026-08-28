import Reveal from "@/components/Reveal";
import { ChevronDown } from "lucide-react";
import { ARCH_FLOW, ARCH_CROSSCUTTING } from "@/lib/cloudDevops";

export default function CloudArchitecture() {

  return (
    <section
      id="cloud-architecture"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-12%] left-[-10%] h-[460px] w-[460px] rounded-full bg-signal/15 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Cloud Architecture
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A production topology, <span className="text-signal">not a diagram</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            The request path from user to datastore, and the six concerns that wrap
            every layer of it.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16">
          {/* Request path */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-paper/50">
              Request path
            </h3>
            <ol className="mt-6 space-y-0">
              {ARCH_FLOW.map((node, i) => {
                const Icon = node.icon;
                return (
                  <Reveal key={node.id} as="li" delay={i * 0.06}>
                    <div className="flex items-center gap-4 rounded-sm border border-paper/10 bg-graphite/30 p-4 transition-colors hover:border-signal/45">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-paper/10 bg-paper/[0.04]">
                        <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="font-display text-sm font-semibold text-paper sm:text-base">
                          {node.label}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-paper/60 sm:text-sm">
                          {node.detail}
                        </p>
                      </div>
                    </div>
                    {i < ARCH_FLOW.length - 1 && (
                      <div className="flex justify-center py-1.5" aria-hidden>
                        <ChevronDown className="h-4 w-4 text-paper/30" />
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </ol>
          </div>

          {/* Cross-cutting concerns */}
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-paper/50">
              Applied at every layer
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {ARCH_CROSSCUTTING.map((concern, i) => {
                const Icon = concern.icon;
                return (
                  <Reveal key={concern.label} delay={i * 0.05} className="rounded-sm border border-ember/20 bg-ember/[0.06] p-4">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-ember" strokeWidth={1.75} />
                      <p className="font-display text-sm font-semibold text-paper">
                        {concern.label}
                      </p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-paper/60">
                      {concern.detail}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
