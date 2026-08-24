"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";

export type ClientSpotlightItem = {
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  industry: string;
  metricValue: string | null;
  metricLabel: string | null;
};

type ClientSpotlightProps = {
  items: ClientSpotlightItem[];
};

// Real, admin-managed featured work (same Portfolio data /portfolio pulls
// from) — not written for any one service page, so this renders the same
// on every /services/[slug] detail page that has featured portfolios.
export default function ClientSpotlight({ items }: ClientSpotlightProps) {
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-bold text-paper sm:text-4xl"
        >
          Client spotlight: selected work
        </motion.h2>

        <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group border-b border-paper/10 pb-12"
            >
              {/* tilt-3d on this inner Link, not the motion.div above: once
                  that div's own whileInView settles, Framer Motion leaves a
                  permanent inline `transform` on it, which would silently
                  beat a CSS :hover transform every time. */}
              <Link href={`/portfolio/${item.slug}`} className="tilt-3d block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-graphite">
                  {item.thumbnailUrl && (
                    <motion.img
                      src={resolveImageUrl(item.thumbnailUrl)}
                      alt=""
                      initial={shouldReduceMotion ? undefined : { scale: 1.12 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {item.industry && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-paper backdrop-blur-sm">
                      <span className="text-ember">&middot;</span>
                      {item.industry}
                    </span>
                  )}
                </div>
              </Link>

              {item.metricValue && (
                <p className="mt-6 font-display text-4xl font-bold tabular-nums text-paper">
                  {item.metricValue}
                </p>
              )}
              {item.metricLabel && (
                <p className="mt-1 text-sm text-paper/60">{item.metricLabel}</p>
              )}
              <h3 className="mt-3 font-display text-xl font-semibold text-paper">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">{item.summary}</p>

              <Link
                href={`/portfolio/${item.slug}`}
                className="group/link mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ember transition-colors hover:text-paper"
              >
                Read more
                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
