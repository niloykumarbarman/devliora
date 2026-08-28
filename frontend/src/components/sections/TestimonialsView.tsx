"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/hero";
import Reveal from "@/components/Reveal";

type TestimonialItem = {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientPhotoUrl: string;
  quote: string;
  rating: number;
};

const PER_PAGE = 3;

export default function TestimonialsView({ items }: { items: TestimonialItem[] }) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(PER_PAGE);

  useEffect(() => {
    const updatePerPage = () => setPerPage(window.innerWidth < 1024 ? 1 : PER_PAGE);
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const pageCount = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    setPage((prev) => Math.min(prev, pageCount - 1));
  }, [pageCount]);

  if (items.length === 0) {
    return null;
  }

  const visible = items.slice(page * perPage, page * perPage + perPage);

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
        <Reveal className="max-w-2xl">
          <h2 className="text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            What clients say{" "}
            <span className="text-signal">after we ship</span>.
          </h2>
        </Reveal>

        <div className="mt-16 min-h-[420px]">
            <div
              key={page}
              className="carousel-swap grid gap-8 lg:grid-cols-3"
            >
              {visible.map((item, i) => {
                const isSignal = i % 2 === 0;
                const starClass = isSignal ? "fill-signal text-signal" : "fill-ember text-ember";
                const ringClass = isSignal ? "ring-signal/30" : "ring-ember/30";
                const badgeClass = isSignal ? "bg-signal" : "bg-ember";
                const topBarClass = isSignal ? "bg-signal" : "bg-ember";
                return (
                <div
                  key={item.id}
                  className="tilt-3d relative flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-paper p-8 pb-14 shadow-[0_1px_2px_rgba(14,20,32,0.04)]"
                >
                  <span className={`absolute inset-x-0 top-0 h-1 ${topBarClass}`} />
                  {item.rating > 0 && (
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4 w-4 ${
                            starIndex < item.rating
                              ? starClass
                              : "fill-transparent text-ink/15"
                          }`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  )}
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-graphite/80">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                    {item.clientPhotoUrl ? (
                      <Image
                        src={resolveImageUrl(item.clientPhotoUrl)}
                        alt={item.clientName}
                        width={40}
                        height={40}
                        className={`h-10 w-10 shrink-0 rounded-full object-cover ring-2 ${ringClass}`}
                      />
                    ) : (
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-xs uppercase ring-2 ${ringClass} ${isSignal ? "bg-signal/15 text-signal" : "bg-ember/15 text-ember"}`}>
                        {item.clientName.slice(0, 1)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-graphite">
                        {item.clientName}
                      </p>
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-graphite/65">
                        {item.clientTitle}
                        {item.clientCompany ? ` — ${item.clientCompany}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className={`absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-paper shadow-lg ${badgeClass}`}>
                    <Quote className="h-4 w-4" strokeWidth={2} fill="currentColor" />
                  </div>
                </div>
                );
                })}
            </div>
        </div>

        {pageCount > 1 && (
          <div className="mt-12 flex items-center justify-center">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Go to testimonials page ${i + 1}`}
                aria-current={page === i}
                className="flex h-11 w-8 items-center justify-center"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    page === i ? "w-8 bg-signal" : "w-2 bg-ink/15"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
