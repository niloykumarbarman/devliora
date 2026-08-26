"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SOLUTIONS } from "@/lib/solutions";
import { slugify } from "@/lib/slugify";

export default function SolutionsDetailList() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    document
      .getElementById(hash)
      ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
  }, [shouldReduceMotion]);

  return (
    <section className="relative bg-paper py-24">
      <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(14,20,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,20,32,0.04)_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold text-ink md:text-4xl">
          Six ways we help teams move forward
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-2">
          {SOLUTIONS.map((solution, i) => (
            <motion.div
              key={solution.id}
              id={slugify(solution.title)}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              // whileHover, not a CSS :hover class: once this motion.div's
              // own whileInView settles, Framer Motion leaves a permanent
              // inline `transform` on it that would beat a CSS transform.
              // Plain scale (no translate/rotate) — the parent grid relies
              // on its own overflow-hidden for the gap-px hairline mosaic
              // trick, which would clip a bigger lift.
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03, zIndex: 10 }}
              className="relative z-0 scroll-mt-24 bg-paper p-8"
            >
              <span className="font-mono text-sm tabular-nums text-signal">
                {solution.id}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                {solution.title}
              </h3>
              <p className="mt-3 text-graphite">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
