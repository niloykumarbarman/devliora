"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ContactHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink py-32 sm:py-40">
      <div className="bg-grain absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h1
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-balance font-display text-4xl font-semibold text-paper sm:text-5xl md:text-6xl"
        >
          Tell us what you are building.{" "}
          <span className="text-signal">We will tell you how.</span>
        </motion.h1>
        <motion.p
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-wire"
        >
          Share a few details about your project and one of our engineers
          will respond within 48 hours with a clear, honest read on scope,
          timeline, and approach.
        </motion.p>
      </div>
    </section>
  );
}
