"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { fetchCaseStudies, type CaseStudy } from "@/lib/caseStudies";
import { resolveImageUrl } from "@/lib/hero";

const ILLUSTRATIVE_SUFFIX = " (Illustrative Example)";

function splitClientName(clientName: string): {
  name: string;
  isIllustrative: boolean;
} {
  if (clientName.endsWith(ILLUSTRATIVE_SUFFIX)) {
    return {
      name: clientName.slice(0, -ILLUSTRATIVE_SUFFIX.length),
      isIllustrative: true,
    };
  }
  return { name: clientName, isIllustrative: false };
}

export default function CaseStudiesList() {
  const shouldReduceMotion = useReducedMotion();
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

  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, delay: (i % 4) * 0.08 },
        };

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
            <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10">
              {studies.map((study, i) => {
                const { name, isIllustrative } = splitClientName(
                  study.clientName
                );
                return (
                  <motion.article
                    key={study.id}
                    {...fadeUp(i)}
                    className="group bg-paper p-8 transition-colors duration-300 hover:bg-ink/[0.02] md:p-12"
                  >
                    {/* Scale-only (no translate/rotate/tilt-3d): the
                        grandparent list is `overflow-hidden` (it relies on
                        that for the gap-px hairline mosaic trick), which
                        would clip a bigger lift at the row edges. */}
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="relative z-0 block transition-transform duration-300 hover:z-10 hover:scale-[1.02]"
                    >
                      {study.coverImageUrl && (
                        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg">
                          <Image
                            src={resolveImageUrl(study.coverImageUrl)}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 800px, 100vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-signal">
                        {study.industry} — {name}
                      </p>
                      {isIllustrative && (
                        <span className="rounded-sm border border-ember/30 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ember">
                          Illustrative Example
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-graphite sm:text-3xl">
                      {study.title}
                    </h3>

                    <div className="mt-8 grid gap-6 sm:grid-cols-3">
                      <div>
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                          Challenge
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-graphite/70">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                          Solution
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-graphite/70">
                          {study.solution}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                          Results
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-graphite/70">
                          {study.results}
                        </p>
                      </div>
                    </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-graphite/50 transition-colors group-hover:text-ember">
                        Read full case study
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                      </Link>
                    </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
