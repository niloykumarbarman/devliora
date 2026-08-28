"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fetchAllTechnologyDetailPages, type TechnologyDetailPageSummaryDto } from "@/lib/technologyDetailPages";
import Reveal from "@/components/Reveal";

// Links every admin-managed detail page (rendered by /technologies/[slug]
// or /solutions/[slug]) from the matching index page, so a page created
// through the Technology/Solution Pages admin panel is actually
// discoverable on the site instead of only reachable by typing its exact
// URL. Fade/slide-up-on-scroll, matching the rest of the site's section
// entrance style (e.g. TechnologiesDetailList.tsx). One component reused
// for both surfaces via `pageType`/`basePath`/copy props.
type TechnologyDetailPagesGridProps = {
  pageType: "technology" | "solution";
  basePath: string;
  heading: string;
  subheading: string;
};

export default function TechnologyDetailPagesGrid({
  pageType,
  basePath,
  heading,
  subheading,
}: TechnologyDetailPagesGridProps) {
  const [pages, setPages] = useState<TechnologyDetailPageSummaryDto[]>([]);

  useEffect(() => {
    fetchAllTechnologyDetailPages().then((all) =>
      setPages(all.filter((p) => (p.pageType || "technology") === pageType))
    );
  }, [pageType]);

  if (pages.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-paper px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="h2"
          className="animate-gradient-text font-display text-2xl font-semibold sm:text-3xl"
        >
          {heading}
        </Reveal>
        <Reveal as="p" delay={0.08} className="mt-2 text-graphite/70">
          {subheading}
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page, idx) => (
            <Reveal key={page.slug} delay={idx * 0.06}>
              <Link
                href={`${basePath}/${page.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-wire/60 bg-paper px-5 py-4 transition-colors hover:border-signal"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-graphite/65">
                    {page.technologyName}
                  </p>
                  <p className="mt-1 font-display text-lg font-medium text-ink">{page.heroTitle}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-graphite/60 transition-colors group-hover:text-signal" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
