"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function CaseStudiesHero() {
  const reducedMotion = useReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: reducedMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-28 sm:py-32">
      <div className="bg-grain pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-ember/10 blur-[120px] animate-ambient-drift" />

      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-6 text-balance font-display text-4xl font-medium text-paper sm:text-5xl md:text-6xl"
        >
          Real problems, <span className="text-signal">real systems</span>,
          real outcomes
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-wire"
        >
          A closer look at how we approach hard engineering problems, from
          the constraint we started with to the system running in production
          today.
        </motion.p>
      </div>
    </section>
  );
}
