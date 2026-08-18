"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchIndustries, IndustryDto } from "@/lib/industries";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";

// "Industries & Verticals Served" block for individual technology pages,
// matching kaz.com.bd's per-technology page: image + copy on one side,
// a grid of industry names on the other. Unlike kaz's static list, this
// pulls Devliora's real admin-managed Industries data (same source as
// /industries) rather than hardcoding a copied list — so it stays
// accurate as that list changes. Reuses the /industries page's own
// banner image (industriesImageUrl) instead of a new per-technology
// field. bg-graphite (not bg-ink) gives this section a distinct dark
// tone from the feature grid above it, echoing the reference's
// navy-then-maroon rhythm without introducing off-brand colors.
export default function TechnologyDetailIndustries({ paragraph }: { paragraph: string }) {
  const [industries, setIndustries] = useState<IndustryDto[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchIndustries().then((data) =>
      setIndustries([...data].sort((a, b) => a.displayOrder - b.displayOrder))
    );
    fetchSiteSettings().then((data) => {
      if (data?.industriesImageUrl) setImageUrl(resolveImageUrl(data.industriesImageUrl));
    });
  }, []);

  if (industries.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-graphite">
      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/3] w-full md:aspect-auto">
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          ) : (
            <div className="h-full w-full bg-graphite" />
          )}
        </div>

        <div className="px-6 py-16 sm:px-10 md:py-20">
          <h2 className="text-balance font-display text-3xl font-semibold text-paper sm:text-4xl">
            Industries &amp; Verticals Served
          </h2>
          <p className="mt-5 max-w-lg text-wire">{paragraph}</p>

          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            {industries.map((industry) => (
              <span key={industry.id} className="font-mono text-sm text-ember">
                {industry.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
