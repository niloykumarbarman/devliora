"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  fetchCaseStudies,
  isIllustrativeCaseStudy,
  cleanCaseStudyText,
  type CaseStudy,
} from "@/lib/caseStudies";
import { resolveImageUrl } from "@/lib/hero";
import Reveal from "@/components/Reveal";

export default function CaseStudiesList() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    fetchCaseStudies()
      .then((data) => {
        if (!cancelled) {
          setStudies(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-paper py-24 text-ink md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-ink sm:text-4xl">
          Engagements, <span className="text-signal">start to finish</span>
        </h2>

        <div className="mt-12">
          {status === "loading" && (
            <p className="font-mono text-sm text-graphite">
              Loading case studies...
            </p>
          )}

          {status === "error" && (
            <p className="font-mono text-sm text-graphite">
              We could not load case studies right now. Please try again
              later.
            </p>
          )}

          {status === "success" && studies.length === 0 && (
            <div className="border border-ink/10 bg-ink/[0.02] px-8 py-14 text-center">
              <p className="font-display text-xl text-ink">
                No case studies published yet
              </p>
              <p className="mx-auto mt-3 max-w-md text-graphite">
                We are documenting our first engagements. Check back soon.
              </p>
            </div>
          )}

          {status === "success" && studies.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studies.map((study, i) => {
                const name = cleanCaseStudyText(study.clientName);
                const industry = cleanCaseStudyText(study.industry);
                const isIllustrative = isIllustrativeCaseStudy(study);
                return (
                  <Reveal
                    key={study.id}
                    as="article"
                    delay={(i % 3) * 0.06}
                    className="group flex flex-col overflow-hidden rounded-xl border border-graphite/12 bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(14,20,32,0.35)]"
                  >
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="flex flex-1 flex-col"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink">
                        {study.coverImageUrl ? (
                          <Image
                            src={resolveImageUrl(study.coverImageUrl)}
                            alt={cleanCaseStudyText(study.title)}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          // No cover set in the CMS — branded placeholder
                          // so the card never looks broken.
                          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.28),transparent_60%)]">
                            <span className="font-display text-lg font-medium text-paper/70">
                              Devliora
                            </span>
                          </div>
                        )}
                        <span
                          className={`absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-ink/80 px-3 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-widest text-paper backdrop-blur-sm ${
                            isIllustrative ? "sm:max-w-[55%]" : ""
                          }`}
                        >
                          {industry || "Case Study"}
                        </span>
                        {isIllustrative && (
                          <span className="absolute right-4 top-4 rounded-sm border border-ember/40 bg-ink/70 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ember backdrop-blur-sm">
                            Illustrative
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <p className="font-mono text-xs uppercase tracking-wide text-graphite/70">
                          {name || "Client engagement"}
                        </p>

                        <h3 className="mt-2 font-display text-lg font-medium text-ink transition-colors group-hover:text-signal">
                          {cleanCaseStudyText(study.title)}
                        </h3>

                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-graphite">
                          {cleanCaseStudyText(study.challenge)}
                        </p>

                        <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-graphite/65 transition-colors group-hover:text-signal">
                          Read full case study
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
