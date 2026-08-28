import Reveal from "@/components/Reveal";
import { SITE_STACK } from "@/lib/cloudDevops";

export default function SiteTechArchitecture() {

  return (
    <section
      id="site-architecture"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-12%] right-[-10%] h-[460px] w-[460px] rounded-full bg-signal/15 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Technology Architecture
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The stack <span className="text-signal">this page runs on</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            Not a hypothetical reference architecture — the same choices we apply to
            client work, applied here.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_STACK.map((group, i) => {
            const Icon = group.icon;
            return (
              <Reveal key={group.category} delay={(i % 3) * 0.06} className="flex flex-col rounded-sm border border-paper/10 bg-graphite/30 p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-paper/10 bg-paper/[0.04]">
                    <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-base font-semibold text-paper">
                    {group.category}
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-paper/55">{group.note}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-paper/15 bg-paper/[0.04] px-2.5 py-1 font-mono text-[0.7rem] text-paper/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
