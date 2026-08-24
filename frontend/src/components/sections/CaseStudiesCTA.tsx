"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function CaseStudiesCTA() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 sm:py-28">
      <div className="bg-grain pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-signal/15 blur-[120px] animate-ambient-drift" />

      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-2xl text-center"
      >

        <h2 className="mt-6 text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
          Have a problem worth{" "}
          <span className="text-signal">a case study of its own?</span>
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-wire">
          Tell us what you are working with and we will tell you honestly
          whether we are the right fit.
        </p>

        <Link
          href="/contact"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 font-medium text-paper shadow-[0_0_40px_-10px_var(--color-signal)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Start a conversation
          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </motion.div>
    </section>
  );
}
