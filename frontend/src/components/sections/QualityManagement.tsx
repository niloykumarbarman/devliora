"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/hero";
import { fetchPartners, type PartnerDto } from "@/lib/partners";
import Reveal from "@/components/Reveal";

// No fabricated numbers/credentials here — generic capability claims,
// safe to state as Devliora's own, matching the reference's own bullets
// verbatim.
const QUALITY_BULLETS: string[] = [
  "Quality management and information security compliance",
  "Rigorous testing and validation at every development stage",
  "Proactive system performance monitoring and coordination",
];

type QualityManagementProps = {
  description: string;
};

// Shared "Quality management" section — first built for the /services
// page, reused here since the IT Consulting page reference has the exact
// same heading and bullets (only the description paragraph's wording
// differs slightly). Real, admin-managed Partners logos stand in for the
// reference's Clutch/Glassdoor/G2/GoodFirms row, same reasoning as before.
export default function QualityManagement({ description }: QualityManagementProps) {
  const [partners, setPartners] = useState<PartnerDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPartners().then((data) => {
      if (!cancelled) setPartners(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal
          as="h2"
          className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl"
        >
          Quality management
        </Reveal>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal as="p" delay={0.08} className="max-w-md text-paper/70">
            {description}
          </Reveal>

          <Reveal as="ul" delay={0.16} className="flex flex-col gap-5">
            {QUALITY_BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                <span className="font-semibold text-ember">{bullet}</span>
              </li>
            ))}
          </Reveal>
        </div>

        {partners.length > 0 && (
          <Reveal
            delay={0.24}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-14 gap-y-8 border-t border-paper/10 pt-12"
          >
            {partners.slice(0, 6).map((partner) =>
              partner.logoUrl ? (
                <div key={partner.id} className="relative h-10 w-28 md:h-12">
                  <Image
                    src={resolveImageUrl(partner.logoUrl)}
                    alt={partner.name}
                    fill
                    sizes="112px"
                    className="object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              ) : (
                <span key={partner.id} className="font-mono text-sm text-paper/50">
                  {partner.name}
                </span>
              ),
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
