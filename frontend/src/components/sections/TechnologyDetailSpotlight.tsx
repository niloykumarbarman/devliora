"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchPortfolios, Portfolio } from "@/lib/portfolios";
import { resolveImageUrl } from "@/lib/hero";

// Second, full-bleed "spotlight" row for individual technology pages,
// matching kaz.com.bd's per-technology page's two-panel image band
// (their "A large-scale training MIS" / "A first VR shooting game"
// pair). That pair is Kaz's own client work (Swisscontact, an in-house
// VR project) — not Devliora's — so instead of copying it verbatim,
// this shows two more real Devliora portfolio projects (items 3-4, after
// the two already used by TechnologyDetailSelectedWork above) in the
// same edge-to-edge photo + overlay layout.
export default function TechnologyDetailSpotlight() {
  const [projects, setProjects] = useState<Portfolio[]>([]);

  useEffect(() => {
    fetchPortfolios().then((data) => setProjects(data.slice(2, 4)));
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.slug}`}
            className="group relative flex h-[420px] flex-col justify-end overflow-hidden p-8 sm:h-[480px] sm:p-10"
          >
            {project.thumbnailUrl && (
              <Image
                src={resolveImageUrl(project.thumbnailUrl)}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />

            <div className="relative">
              {project.industry && (
                <p className="font-mono text-xs text-ember">· {project.industry.replace(/\.$/, "")}</p>
              )}
              <h3 className="mt-3 max-w-sm text-balance font-display text-2xl font-semibold text-paper sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-wire">{project.summary}</p>
              <span className="mt-4 inline-block font-mono text-sm font-semibold text-ember">
                Read more
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
