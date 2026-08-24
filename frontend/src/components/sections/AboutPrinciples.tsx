"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, GitCommitHorizontal, Gauge, MessageSquareText } from "lucide-react";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Security by default",
    detail:
      "Password hashing, short-lived access tokens, rotating and revocable refresh tokens, per-IP rate limiting on auth endpoints — configured before a single feature is built.",
  },
  {
    icon: GitCommitHorizontal,
    title: "Transparent history",
    detail:
      "Every feature ships as a reviewable commit on a public, linear history. No squashed mystery commits, no hidden branches.",
  },
  {
    icon: Gauge,
    title: "Performance as a requirement",
    detail:
      "Redis cache-aside on every domain entity from day one, not bolted on after a client complains about load times.",
  },
  {
    icon: MessageSquareText,
    title: "Direct communication",
    detail:
      "One engineer, one point of contact. Questions get a real answer within 48 hours, not routed through account managers.",
  },
];

export default function AboutPrinciples() {
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
    <section className="bg-grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-[480px] w-[480px] rounded-full opacity-[0.1] blur-[120px] animate-ambient-drift"
        style={{ backgroundColor: "var(--color-ember)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">

        <motion.h2
          {...fadeUp(1)}
          className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight md:text-4xl"
        >
          How Devliora <span className="text-signal">actually works.</span>
        </motion.h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-paper/10 sm:grid-cols-2">
          {PRINCIPLES.map((principle, i) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                {...fadeUp(i + 2)}
                className="bg-ink p-8"
              >
                <Icon className="h-6 w-6 text-signal" strokeWidth={1.75} />
                <h3 className="mt-5 text-lg font-semibold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">
                  {principle.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
