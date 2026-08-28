import Reveal from "@/components/Reveal";
import { ShieldAlert } from "lucide-react";
import SectionHeading from "./SectionHeading";
import type { ProcessStep, TitlePart } from "./clusterKit";

/**
 * A numbered vertical rail of steps — delivery process, migration
 * phases, engagement flow. Mirrors CiCdPipeline. `tone` switches the
 * band between the light and the dark (bg-grain) treatment.
 */
export default function PhasedProcess({
  id,
  eyebrow,
  titleParts,
  intro,
  steps,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  titleParts: TitlePart[];
  intro?: string;
  steps: ProcessStep[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 overflow-hidden ${
        dark ? "bg-grain bg-ink text-paper" : "bg-paper text-ink"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-[size:56px_56px] ${
          dark
            ? "bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)]"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-[-15%] left-[-8%] h-[420px] w-[420px] rounded-full blur-[130px] animate-ambient-drift ${
          dark ? "bg-signal/15" : "bg-signal/10"
        }`}
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow={eyebrow}
          titleParts={titleParts}
          intro={intro}
          tone={tone}
        />

        <ol className="relative mt-16 pl-10 sm:pl-14">
          <span
            aria-hidden
            className={`absolute left-[15px] top-2 bottom-2 w-px sm:left-[19px] ${
              dark ? "bg-paper/15" : "bg-ink/15"
            }`}
          />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal
                key={step.label}
                as="li"
                delay={i * 0.05}
                className="relative pb-8 last:pb-0"
              >
                <span
                  className={`absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border text-signal sm:-left-14 sm:h-10 sm:w-10 ${
                    dark
                      ? "border-paper/15 bg-ink"
                      : "border-ink/15 bg-paper"
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </span>

                <div
                  className={`group rounded-sm border p-4 transition-colors sm:p-5 ${
                    dark
                      ? "border-paper/10 bg-graphite/30 hover:border-signal/40"
                      : "border-ink/10 bg-white/60 hover:border-signal/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className={`font-mono text-xs ${
                        dark ? "text-paper/50" : "text-graphite/60"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-base font-semibold sm:text-lg">
                      {step.label}
                    </h3>
                    {step.gate && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-ember">
                        <ShieldAlert className="h-3 w-3" strokeWidth={2} />
                        Gate
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1.5 text-sm leading-relaxed ${
                      dark ? "text-paper/70" : "text-graphite/75"
                    }`}
                  >
                    {step.detail}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
