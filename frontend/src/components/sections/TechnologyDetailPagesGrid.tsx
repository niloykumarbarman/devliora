"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchAllTechnologyDetailPages, type TechnologyDetailPageSummaryDto } from "@/lib/technologyDetailPages";

// Links every admin-managed technology detail page (/technologies/[slug])
// from the /technologies index, so a page created through the Technology
// Pages admin panel is actually discoverable on the site instead of only
// reachable by typing its exact URL. Fade/slide-up-on-scroll, matching
// the rest of the site's section entrance style (e.g.
// TechnologiesDetailList.tsx).
export default function TechnologyDetailPagesGrid() {
  const [pages, setPages] = useState<TechnologyDetailPageSummaryDto[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    fetchAllTechnologyDetailPages().then(setPages);
  }, []);

  if (pages.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-paper px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="animate-gradient-text font-display text-2xl font-semibold sm:text-3xl"
        >
          Explore our technology pages
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-2 text-graphite/70"
        >
          An in-depth look at how we work with each technology.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page, idx) => (
            <motion.div
              key={page.slug}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
            >
              <Link
                href={`/technologies/${page.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-wire/60 bg-paper px-5 py-4 transition-colors hover:border-signal"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-graphite/50">
                    {page.technologyName}
                  </p>
                  <p className="mt-1 font-display text-lg font-medium text-ink">{page.heroTitle}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-graphite/40 transition-colors group-hover:text-signal" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
