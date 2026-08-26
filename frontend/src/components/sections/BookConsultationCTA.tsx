"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

export default function BookConsultationCTA() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, delay: i * 0.08 },
        };

  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="bg-grain absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <motion.h2
          {...fadeUp(1)}
          className="mt-6 text-balance font-display text-3xl font-semibold text-paper sm:text-4xl"
        >
          Not ready to fill out a form?
        </motion.h2>
        <motion.p {...fadeUp(2)} className="mx-auto mt-4 max-w-lg text-wire">
          Reach out directly and one of our engineers will get back to you
          the same way you contacted us.
        </motion.p>

        <motion.div
          {...fadeUp(3)}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="mailto:info@devliora.com"
            className="group inline-flex items-center gap-2 rounded-lg border border-wire/30 bg-paper/5 px-6 py-3 font-medium text-paper transition-all hover:-translate-y-0.5 hover:border-signal/50 hover:bg-paper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <Mail className="h-4 w-4 text-signal" />
            info@devliora.com
          </a>
          <a
            href="tel:+8801606479801"
            className="group inline-flex items-center gap-2 rounded-lg border border-wire/30 bg-paper/5 px-6 py-3 font-medium text-paper transition-all hover:-translate-y-0.5 hover:border-signal/50 hover:bg-paper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <Phone className="h-4 w-4 text-signal" />
            +880 1606-479801
          </a>
        </motion.div>
      </div>
    </section>
  );
}
