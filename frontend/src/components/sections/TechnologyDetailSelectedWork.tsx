"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchPortfolios, Portfolio } from "@/lib/portfolios";
import { resolveImageUrl } from "@/lib/hero";

// "Selected work" block for individual technology pages, matching
// kaz.com.bd's per-technology page's "Client spotlight: selected work"
// layout (image + label, title, summary, Read more) — which some
// reference pages (e.g. Java's) repeat twice with a different project
// pair each time, hence `start` to page through Devliora's real
// portfolio instead of showing the same two projects again. Unlike the
// reference, this pulls real featured projects from Devliora's own
// admin-managed Portfolio list (same source as /portfolio) rather than
// naming a specific client's tech stack that wasn't actually built with
// this technology — none of Devliora's real portfolio entries are
// tagged .NET/ASP.NET Core or Java today, so the projects shown here are
// general "work we've shipped" examples, not claims that they used this
// specific technology. No stat callout (kaz's "3mn transactions
// processed", "500,000+ direct online buyers served" etc.) since
// Portfolio metrics aren't populated for these entries yet — showing an
// invented number isn't an option.
type TechnologyDetailSelectedWorkProps = {
  heading?: string;
  start?: number;
};

export default function TechnologyDetailSelectedWork({
  heading = "Selected work",
  start = 0,
}: TechnologyDetailSelectedWorkProps) {
  const [projects, setProjects] = useState<Portfolio[]>([]);

  useEffect(() => {
    fetchPortfolios().then((data) => setProjects(data.slice(start, start + 2)));
  }, [start]);

  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 sm:py-24">
      <div className="bg-grain absolute inset-0" />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-balance font-display text-3xl font-semibold text-paper sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`} className="tilt-3d group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-graphite">
                {project.thumbnailUrl ? (
                  <Image
                    src={resolveImageUrl(project.thumbnailUrl)}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
                {project.industry && (
                  <span className="absolute left-4 top-4 rounded-sm bg-ink/80 px-3 py-1 font-mono text-xs text-paper">
                    {project.industry.replace(/\.$/, "")}
                  </span>
                )}
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-paper">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-wire">{project.summary}</p>
              <span className="mt-3 inline-block font-mono text-sm font-semibold text-ember">
                Read more
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
