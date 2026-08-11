"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";
import type { IndustryDto } from "@/lib/industries";

type IndustriesMenuProps = {
  open: boolean;
  industries: IndustryDto[];
  imageUrl?: string;
  loaded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
};

export default function IndustriesMenu({
  open,
  industries,
  imageUrl,
  loaded,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: IndustriesMenuProps) {
  if (!open) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full z-40 hidden border-t border-wire/60 bg-paper shadow-lg lg:block"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-[1.3fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-wire/10">
          {imageUrl ? (
            <Image
              src={resolveImageUrl(imageUrl)}
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 0px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-graphite/30">
              <Building2 className="h-10 w-10" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-graphite/50">
            Industries
          </h3>
          <ul className="mt-4 space-y-3">
            {industries.map((industry) => (
              <li key={industry.id}>
                <Link
                  href={`/industries/${industry.slug}`}
                  onClick={onNavigate}
                  className="font-mono text-sm text-graphite/70 transition-colors duration-200 hover:text-ink"
                >
                  {industry.name}
                </Link>
              </li>
            ))}
            {!loaded && <li className="font-mono text-sm text-graphite/40">Loading…</li>}
            {loaded && industries.length === 0 && (
              <li className="font-mono text-sm text-graphite/40">No industries yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
