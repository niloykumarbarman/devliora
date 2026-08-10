"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";

export type FeaturedWorkSplitItem = {
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  industry: string;
};

type FeaturedWorkSplitProps = {
  items: FeaturedWorkSplitItem[];
};

// Alternating accent tints for the text panel, so two cards side by side
// read as distinct without needing per-item color data.
const PANEL_TINTS = [
  "linear-gradient(135deg, color-mix(in srgb, var(--color-signal) 22%, var(--color-ink)), var(--color-ink))",
  "linear-gradient(135deg, color-mix(in srgb, var(--color-ember) 20%, var(--color-ink)), var(--color-ink))",
];

// Real, admin-managed featured work (same Portfolio data /portfolio pulls
// from), shown full-bleed as image/text split cards — a second, visually
// distinct take on the same "proof of work" idea as ClientSpotlight.
export default function FeaturedWorkSplit({ items }: FeaturedWorkSplitProps) {
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-paper/10">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {items.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: i % 2 === 0 ? -32 : 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex min-h-[420px] overflow-hidden"
          >
            <Link href={`/portfolio/${item.slug}`} className="relative w-[45%] shrink-0 overflow-hidden sm:w-1/2">
              {item.thumbnailUrl && (
                <motion.img
                  src={resolveImageUrl(item.thumbnailUrl)}
                  alt=""
                  initial={shouldReduceMotion ? undefined : { scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </Link>

            <div
              className="flex flex-1 flex-col justify-center gap-3 p-8 sm:p-10"
              style={{ backgroundImage: PANEL_TINTS[i % PANEL_TINTS.length] }}
            >
              {item.industry && (
                <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-paper/70">
                  <span className="text-ember">&middot;</span>
                  {item.industry}
                </span>
              )}
              <h3 className="text-balance font-display text-2xl font-semibold leading-snug text-paper">
                {item.title}
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-paper/70">{item.summary}</p>
              <Link
                href={`/portfolio/${item.slug}`}
                className="group/link mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-ember transition-colors hover:text-paper"
              >
                Read more
                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
