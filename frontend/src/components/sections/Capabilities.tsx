import {
  Compass,
  Hammer,
  FlaskConical,
  Rocket,
  Activity,
  ShieldCheck,
  TrendingUp,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import DraggableMarquee from "@/components/DraggableMarquee";

type Capability = {
  label: string;
  detail: string;
  icon: LucideIcon;
};

const CAPABILITIES: Capability[] = [
  { label: "Design", detail: "Architecture & contracts", icon: Compass },
  { label: "Build", detail: "Services & platforms", icon: Hammer },
  { label: "Test", detail: "Coverage that holds", icon: FlaskConical },
  { label: "Ship", detail: "Reversible deploys", icon: Rocket },
  { label: "Monitor", detail: "Telemetry & alerting", icon: Activity },
  { label: "Harden", detail: "Security & resilience", icon: ShieldCheck },
  { label: "Scale", detail: "Load-tested growth", icon: TrendingUp },
  { label: "Support", detail: "On-call ownership", icon: LifeBuoy },
];

export default function Capabilities() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal className="text-center">
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
            The engineering lifecycle, end to end.
          </h2>
          <p className="mt-2 text-sm text-paper/50">
            Every engagement moves through the same disciplined stages — nothing skipped, nothing improvised.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-ember">
            Built by people who get paged when it breaks.
          </p>
        </Reveal>

        <div className="relative mt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent" />
          <DraggableMarquee speed={45} trackClassName="items-stretch gap-4">
            {[...CAPABILITIES, ...CAPABILITIES].map((cap, i) => {
              const isSignal = i % 2 === 0;
              const Icon = cap.icon;
              return (
                <div
                  key={`${cap.label}-${i}`}
                  className={`flex w-[168px] shrink-0 flex-col gap-4 whitespace-nowrap rounded-sm border bg-graphite/40 px-5 py-6 shadow-sm transition-colors ${
                    isSignal
                      ? "border-signal/25 hover:border-signal/60"
                      : "border-ember/25 hover:border-ember/60"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-sm ${
                      isSignal ? "bg-signal/15 text-signal" : "bg-ember/15 text-ember"
                    }`}
                  >
                    <Icon className="h-5.5 w-5.5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-paper">
                      {cap.label}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-paper/55">
                      {cap.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </DraggableMarquee>
        </div>
      </div>
    </section>
  );
}
