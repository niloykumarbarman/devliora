"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CloudDevOpsCTA() {
  const reduceMotion = useReducedMotion();

  // initial={false} (not undefined) so a reduced-motion visitor never
  // gets a section left stuck at the server-rendered opacity:0 — it
  // renders visible immediately, with no enter animation.
  const fade = reduceMotion
    ? { initial: false as const, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5 },
      };

  return (
    <section className="bg-grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-signal/12 blur-[120px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <motion.div {...fade} className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
          Build a More Reliable <span className="text-signal">Cloud Infrastructure</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
          From cloud architecture and CI/CD automation to monitoring, security and
          scalable production infrastructure, Devliora helps businesses build and
          operate reliable software systems.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="btn-3d inline-flex items-center gap-2 rounded-lg bg-signal px-7 py-3.5 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-colors hover:bg-signal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Talk to a Cloud Engineer
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/book-consultation"
            className="inline-flex items-center gap-2 rounded-lg border border-paper/20 px-7 py-3.5 font-medium text-paper transition-colors hover:border-paper/50 hover:bg-paper/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/30"
          >
            Discuss Your Infrastructure
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
