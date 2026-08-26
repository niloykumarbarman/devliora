"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DEVOPS_SERVICES } from "@/lib/cloudDevops";

export default function DevOpsServices() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="devops-services"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-12%] right-[-8%] h-[420px] w-[420px] rounded-full bg-ember/10 blur-[130px] animate-ambient-drift"
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
            DevOps Services
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Eight engagements, <span className="text-signal">scoped concretely</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            Most projects combine two or three of these. Each one is deliverable on
            its own, with a clear definition of done.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {DEVOPS_SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
                className="group flex flex-col bg-paper p-6 transition-colors hover:bg-white"
              >
                <Icon className="h-6 w-6 text-signal" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold leading-tight">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite/75">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-1.5 border-t border-ink/10 pt-4">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 font-mono text-xs text-graphite/70"
                    >
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ember" />
                      {point}
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
