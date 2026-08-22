"use client";

import { useEffect, useState } from "react";
import TechBrandIcon from "@/components/TechBrandIcon";
import { getTechIcon } from "@/lib/techIcons";
import { fetchTechnologies, TechnologyDto } from "@/lib/technologies";

// "Technologies" logo-cloud block for individual solution pages (e.g.
// /solutions/furniture-ecommerce-software), matching kaz.com.bd's
// per-solution page's flat tech-logo grid. Unlike the reference (a
// mix of Kotlin, Laravel, Rails, Xamarin, etc. not all confirmed part
// of Devliora's real stack), this pulls Devliora's actual admin-managed
// Technologies list (same source as /technologies) so it never shows a
// capability Devliora doesn't really have. Entries without a compliant
// brand icon in lib/techIcons.ts (e.g. Java, Azure — see that file's
// notes on trademark-holder takedown requests) fall back to a plain dot,
// same convention as TechnologiesDetailList.tsx.
export default function SolutionDetailTechnologies() {
  const [technologies, setTechnologies] = useState<TechnologyDto[]>([]);

  useEffect(() => {
    fetchTechnologies().then(setTechnologies);
  }, []);

  if (technologies.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
        <h2 className="font-display text-3xl font-semibold text-paper sm:text-4xl">Technologies</h2>
        <p className="text-lg leading-relaxed text-wire">
          Devliora works with a full spectrum of modern technologies to build scalable, secure,
          and future-ready solutions. From frontend to backend, mobile to cloud, we use the stacks
          that power reliable digital products.
        </p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 md:grid-cols-6">
        {technologies.map((tech) => {
          const hasIcon = !!getTechIcon(tech.name);
          return (
            <div key={tech.id} className="flex flex-col items-center gap-2 text-center">
              {hasIcon ? (
                <TechBrandIcon name={tech.name} className="h-9 w-9" />
              ) : (
                <span className="h-9 w-9 rounded-full bg-signal/20" />
              )}
              <p className="text-xs text-wire">{tech.displayName.trim()}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
