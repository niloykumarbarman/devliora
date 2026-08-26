"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { DEPLOY_WORKFLOW, ZERO_DOWNTIME_POINTS } from "@/lib/cloudDevops";

export default function ProductionDeployment() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="production-deployment"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-14%] right-[-8%] h-[420px] w-[420px] rounded-full bg-signal/10 blur-[130px] animate-ambient-drift"
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
            Production Deployment
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A release path with <span className="text-signal">one human decision</span> in it.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            Everything up to staging is automated. A person approves the promotion to
            production; everything after it is automated again.
          </p>
        </motion.div>

        {/* Workflow chips */}
        <motion.ol
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-14 flex flex-wrap items-stretch gap-2"
        >
          {DEPLOY_WORKFLOW.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className="flex items-stretch gap-2">
                <span
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${
                    step.approval
                      ? "border-ember/40 bg-ember/10 text-ember"
                      : "border-ink/12 bg-white/60 text-graphite/80"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {step.label}
                  {step.approval && (
                    <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-wide">
                      · manual
                    </span>
                  )}
                </span>
                {i < DEPLOY_WORKFLOW.length - 1 && (
                  <ChevronRight
                    className="my-auto h-4 w-4 shrink-0 text-graphite/30"
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </motion.ol>

        {/* Zero-downtime concept */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-16 rounded-lg border border-signal/20 bg-signal/[0.05] p-6 sm:p-8"
        >
          <h3 className="font-display text-xl font-semibold">
            Zero-downtime deployment
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite/75">
            The promotion to production never takes the service offline. Four
            mechanisms make that hold:
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {ZERO_DOWNTIME_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-signal" strokeWidth={1.75} />
                  <div>
                    <p className="font-display text-sm font-semibold">{point.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-graphite/70">
                      {point.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
