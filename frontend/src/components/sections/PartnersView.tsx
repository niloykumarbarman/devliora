"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Handshake } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/hero";
import Reveal from "@/components/Reveal";

type PartnerDto = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  displayOrder: number;
};

// 4-per-row was the count before the logos were sized up for a more
// premium look; at the bigger size, 4 across no longer fits one line at
// common desktop widths and wraps into an awkward 3+1. 3-per-row keeps
// every page a full line at the new size.
function getPerPage(width: number) {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

export default function PartnersView({ partners }: { partners: PartnerDto[] }) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(4);

  useEffect(() => {
    const updatePerPage = () => setPerPage(getPerPage(window.innerWidth));
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const pageCount = Math.max(1, Math.ceil(partners.length / perPage));

  useEffect(() => {
    setPage((prev) => Math.min(prev, pageCount - 1));
  }, [pageCount]);

  if (partners.length === 0) {
    return null;
  }

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  const visible = partners.slice(page * perPage, page * perPage + perPage);
  const showArrows = pageCount > 1;

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal className="mb-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Meet Our <span className="text-signal">Partners</span>
          </h2>
          <p className="mt-3 text-base text-graphite/60 md:text-lg">
            Who are helping us grow, thank you.
          </p>
        </Reveal>

        <div className="relative flex items-center">
          {showArrows && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous partners"
              className="absolute left-0 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-wire bg-paper text-ink shadow-sm transition-colors hover:border-signal hover:text-signal"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex min-h-[160px] w-full items-center justify-center overflow-hidden px-16">
            <div
              key={page}
              className="carousel-swap flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-10 sm:gap-x-10"
            >
              {visible.map((partner) => {
                const content = partner.logoUrl ? (
                  <div className="relative h-16 w-[180px] transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-[200px] lg:h-24 lg:w-[240px]">
                    <Image
                      src={resolveImageUrl(partner.logoUrl)}
                      alt={partner.name}
                      fill
                      sizes="240px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="flex items-center gap-2 font-mono text-lg text-graphite/60">
                    <Handshake className="h-7 w-7" strokeWidth={1.6} />
                    {partner.name}
                  </span>
                );

                return (
                  <div key={partner.id} className="flex items-center justify-center">
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={partner.name}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {showArrows && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next partners"
              className="absolute right-0 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-wire bg-paper text-ink shadow-sm transition-colors hover:border-signal hover:text-signal"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
