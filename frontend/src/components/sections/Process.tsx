"use client";

import { motion, useReducedMotion } from "framer-motion";

type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Discover",
    description:
      "We map the domain, the constraints, and the failure modes before writing a line of code. Assumptions get tested, not inherited.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Architecture, data model, and API contracts are drafted and reviewed together, so the system is coherent before it exists.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Small, verifiable increments ship on a visible cadence. Every change is tested, reviewed, and deployable on its own.",
  },
  {
    number: "04",
    title: "Operate",
    description:
      "We stay through launch and beyond, monitoring, hardening, and handing off documentation your team can actually use.",
  },
];

export default function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="process" className="relative scroll-mt-24 overflow-hidden bg-paper text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-15%] right-[-8%] h-[420px] w-[420px] rounded-full bg-ember/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A sequence we{" "}
            <span className="text-signal">don&apos;t skip steps in</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            Four stages, applied in order, every time. Predictability is
            part of what we are selling.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={
                reduceMotion
                  ? { duration: 0.3 }
                  : { duration: 0.5, ease: "easeOut", delay: i * 0.08 }
              }
              className="relative bg-paper p-8"
            >
              <span className="font-mono text-sm tabular-nums text-ember">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite/75">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
