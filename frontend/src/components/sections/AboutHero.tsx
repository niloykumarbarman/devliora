"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AboutHero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: i * 0.08 },
        };

  return (
    <section className="bg-grain relative overflow-hidden bg-ink py-28 text-paper md:py-36">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px] animate-ambient-drift"
        style={{ backgroundColor: "var(--color-signal)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">

        <motion.h1
          {...fadeUp(1)}
          className="mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl"
        >
          Founder-led. <span className="text-signal">Production-grade.</span>{" "}
          No shortcuts.
        </motion.h1>

        <motion.p
          {...fadeUp(2)}
          className="mx-auto mt-6 max-w-2xl text-lg text-paper/70"
        >
          Devliora is built and led by Niloy Kumar Barman — a software
          engineer who believes enterprise clients deserve the same security,
          transparency, and engineering rigor that large teams promise but
          rarely deliver in full.
        </motion.p>
      </div>
    </section>
  );
}
