"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { CLOUD_PLATFORMS } from "@/lib/cloudDevops";
import { getTechIcon } from "@/lib/techIcons";
import TechBrandIcon from "@/components/TechBrandIcon";

export default function CloudPlatforms() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="cloud-technologies"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Cloud Technologies
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Five clouds we run <span className="text-signal">production workloads on</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            The right platform depends on the workload, the existing estate and the
            budget model. Here is where each one earns its place.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLOUD_PLATFORMS.map((platform, i) => {
            const Icon = platform.icon;
            const hasBrandIcon = Boolean(getTechIcon(platform.name));
            return (
              <motion.article
                key={platform.name}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.07 }}
                className="tilt-3d group flex flex-col rounded-sm border border-ink/10 bg-white/60 p-6 transition-colors hover:border-ink/25"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-ink/10"
                    style={{ backgroundColor: `${platform.color}14` }}
                  >
                    {hasBrandIcon ? (
                      <TechBrandIcon name={platform.name} className="h-[1.15rem] w-[1.15rem]" />
                    ) : (
                      <Icon className="h-5 w-5" style={{ color: platform.color }} strokeWidth={1.75} />
                    )}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-tight">
                      {platform.name}
                    </h3>
                    <p className="font-mono text-[0.7rem] uppercase tracking-wide text-graphite/50">
                      {platform.tagline}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-graphite/75">
                  {platform.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-ink/10 pt-4">
                  {platform.useCases.map((useCase) => (
                    <li key={useCase} className="flex items-start gap-2 text-sm text-graphite/80">
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal"
                        strokeWidth={2}
                      />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
