"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { fetchPortfolios, type Portfolio } from "@/lib/portfolios";
import { resolveImageUrl } from "@/lib/hero";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

const CARD_THEMES = [
  {
    bg: "bg-signal",
    text: "text-paper",
    sub: "text-paper/70",
    label: "text-paper/60",
  },
  {
    bg: "bg-ember",
    text: "text-paper",
    sub: "text-paper/80",
    label: "text-paper/65",
  },
  {
    bg: "bg-graphite",
    text: "text-paper",
    sub: "text-paper/70",
    label: "text-paper/60",
  },
];

export default function PortfolioGrid() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [activeIndustry, setActiveIndustry] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;

    fetchPortfolios()
      .then((data) => {
        if (!cancelled) {
          setItems(data);
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

  const industries = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => item.industry).filter(Boolean))
    );
    return ["All", ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeIndustry === "All") return items;
    return items.filter((item) => item.industry === activeIndustry);
  }, [items, activeIndustry]);

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
        {status === "loading" && (
          <p className="font-mono text-sm text-graphite">
            Loading portfolio...
          </p>
        )}

        {status === "error" && (
          <p className="font-mono text-sm text-graphite">
            We could not load the portfolio right now. Please try again
            later.
          </p>
        )}

        {status === "success" && items.length === 0 && (
          <div className="border border-ink/10 bg-ink/[0.02] px-8 py-14 text-center">
            <p className="font-display text-xl text-ink">
              No projects published yet
            </p>
            <p className="mx-auto mt-3 max-w-md text-graphite">
              We are documenting our first engagements. Check back soon.
            </p>
          </div>
        )}

        {status === "success" && items.length > 0 && (
          <>
            <div className="mb-14 max-w-2xl">
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-graphite md:text-4xl">
                Our work &mdash; drawn from{" "}
                <span className="text-signal">1 year</span> of projects
              </h2>
              <p className="mt-4 text-lg text-graphite/70">
                Success is reflected in the outcomes achieved by our
                clients. Below is a selection of stories that highlight the
                results delivered through close collaboration.
              </p>
            </div>

            {industries.length > 2 && (
              <div className="mb-12 flex flex-wrap gap-x-6 gap-y-3">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => setActiveIndustry(industry)}
                    className={`font-mono text-sm font-medium uppercase tracking-[0.08em] transition-colors ${
                      activeIndustry === industry
                        ? "text-ember"
                        : "text-graphite/60 hover:text-ink"
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {filteredItems.map((item, i) => {
                const theme = CARD_THEMES[i % CARD_THEMES.length];
                return (
                  <Reveal
                    key={item.id}
                    as="article"
                    delay={(i % 6) * 0.08}
                    className="overflow-hidden rounded-xl"
                  >
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="tilt-3d group flex h-full flex-col sm:flex-row"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-graphite/10 sm:aspect-auto sm:w-2/5">
                        {item.thumbnailUrl && (
                          <Image
                            src={resolveImageUrl(item.thumbnailUrl)}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        )}
                      </div>

                      <div className={`flex flex-1 flex-col justify-center p-8 ${theme.bg}`}>
                        {item.industry && (
                          <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${theme.label}`}>
                            &bull; {item.industry}
                          </p>
                        )}

                        <h3 className={`mt-3 font-display text-xl font-semibold leading-snug tracking-tight ${theme.text}`}>
                          {item.title}
                        </h3>

                        <p className={`mt-3 text-sm leading-relaxed ${theme.sub}`}>
                          {truncate(item.summary, 140)}
                        </p>

                        <span className={`mt-6 inline-flex w-fit items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${theme.text} transition-transform group-hover:translate-x-1`}>
                          Read more
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
