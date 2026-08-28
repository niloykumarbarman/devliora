import Reveal from "@/components/Reveal";
import DraggableMarquee from "@/components/DraggableMarquee";

const CLIENTS = [
  "Meridian Logistics",
  "Northbridge Health",
  "Verity Payments",
  "Devliora",
  "Solstice Analytics",
  "Kestrel Freight Networks",
  "Bramwell & Cole Financial",
];

export default function ClientShowcase() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal className="text-center">
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Representative engagements
          </h2>
          <p className="mt-2 text-sm text-graphite/60">
            Illustrative client examples — public case studies are in progress.
          </p>
        </Reveal>

        <div className="relative mt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-paper to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-paper to-transparent" />

          <DraggableMarquee trackClassName="items-center gap-3">
            {[...CLIENTS, ...CLIENTS].map((name, i) => {
              const isSignal = i % 2 === 0;
              return (
                <div
                  key={`${name}-${i}`}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-sm border bg-paper px-5 py-3 font-mono text-xs text-graphite/70 shadow-sm transition-colors hover:text-ink ${
                    isSignal
                      ? "border-signal/30 hover:border-signal/60"
                      : "border-ember/30 hover:border-ember/60"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isSignal ? "bg-signal" : "bg-ember"}`}
                  />
                  {name}
                </div>
              );
            })}
          </DraggableMarquee>
        </div>
      </div>

    </section>
  );
}
