import Reveal from "@/components/Reveal";
import { SECURITY_CONTROLS } from "@/lib/cloudDevops";

export default function CloudSecurity() {

  return (
    <section
      id="cloud-security"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12%] left-[-10%] h-[460px] w-[460px] rounded-full bg-signal/15 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Cloud Security
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Security is <span className="text-signal">a property of the platform</span>,
            not a checklist at the end.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            Ten controls that are wired into the infrastructure and the pipeline from
            the first commit.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {SECURITY_CONTROLS.map((control, i) => {
            const Icon = control.icon;
            return (
              <Reveal key={control.name} delay={(i % 2) * 0.06} className="flex gap-4 rounded-sm border border-paper/10 bg-graphite/30 p-5 transition-colors hover:border-signal/40">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-paper/10 bg-paper/[0.04]">
                  <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-paper">
                    {control.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper/65">
                    {control.detail}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
