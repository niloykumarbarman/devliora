"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { CICD_PIPELINE } from "@/lib/cloudDevops";

export default function CiCdPipeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="cicd-pipeline"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-15%] left-[-8%] h-[420px] w-[420px] rounded-full bg-signal/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 md:py-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            CI/CD Pipeline
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            From commit to production, <span className="text-signal">one path</span>.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-graphite/75">
            Every change follows the same automated route. Three stages are quality
            gates — a failure there stops the release before it ships.
          </p>
        </motion.div>

        <ol className="relative mt-16 pl-10 sm:pl-14">
          {/* Rail */}
          <span
            aria-hidden
            className="absolute left-[15px] top-2 bottom-2 w-px bg-ink/15 sm:left-[19px]"
          />
          {/* Animated flow pulse travelling down the rail */}
          <span
            aria-hidden
            className="absolute left-[13px] top-2 bottom-2 w-[5px] rounded-full bg-gradient-to-b from-signal/0 via-signal to-signal/0 bg-[length:100%_45%] bg-no-repeat animate-pipeline-stream sm:left-[17px]"
          />

          {CICD_PIPELINE.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.li
                key={stage.id}
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
                className="relative pb-8 last:pb-0"
              >
                <span
                  className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 bg-paper text-signal sm:-left-14 sm:h-10 sm:w-10"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </span>

                <div className="group rounded-sm border border-ink/10 bg-white/60 p-4 transition-colors hover:border-signal/40 sm:p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-xs text-graphite/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-base font-semibold sm:text-lg">
                      {stage.label}
                    </h3>
                    {stage.gate && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-ember">
                        <ShieldAlert className="h-3 w-3" strokeWidth={2} />
                        Gate
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite/75">
                    {stage.detail}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
