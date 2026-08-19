"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import TechBrandIcon from "@/components/TechBrandIcon";
import ExpandableServiceCards, {
  type ExpandableServiceCard,
} from "@/components/sections/ExpandableServiceCards";
import { fetchSiteSettings, type SiteSettingsDto } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";

// "<Technology> Development Services" block for individual technology
// pages, matching kaz.com.bd's per-technology page: a decorative card +
// intro copy, followed by a grid of expandable service cards (reusing
// ExpandableServiceCards, already built for the Staff Augmentation
// page). The card's content, in priority order: `imageUrl` (the
// per-page TechnologyDetailPage.servicesCardImageUrl override, set from
// the Technology Pages admin form); an admin-uploaded image via the
// older `settingsImageKey`-named Site Settings field (kept for .NET's
// pre-existing upload, from before per-page image fields existed); a
// custom `visual` node (e.g. a coded code-editor mockup, for pages whose
// reference uses a photo rather than a brand-colored card — no photo
// asset needed); or the `gradient`/`iconName` fallback (the technology's
// own real brand color, plus its brand mark when lib/techIcons.ts has
// one — some, like Java, don't, see that file's notes on trademark-
// holder takedown requests).
type TechnologyDetailServicesProps = {
  heading: string;
  cardLabel: string;
  paragraph: string;
  services: ExpandableServiceCard[];
  gradient: string;
  iconName?: string;
  imageUrl?: string;
  settingsImageKey?: keyof SiteSettingsDto;
  visual?: ReactNode;
};

export default function TechnologyDetailServices({
  heading,
  cardLabel,
  paragraph,
  services,
  gradient,
  iconName,
  imageUrl,
  settingsImageKey,
  visual,
}: TechnologyDetailServicesProps) {
  const [settingsCardImageUrl, setSettingsCardImageUrl] = useState("");

  useEffect(() => {
    if (imageUrl || !settingsImageKey) return;
    fetchSiteSettings().then((data) => {
      const value = data?.[settingsImageKey];
      if (typeof value === "string" && value) setSettingsCardImageUrl(resolveImageUrl(value));
    });
  }, [imageUrl, settingsImageKey]);

  const cardImageUrl = imageUrl ? resolveImageUrl(imageUrl) : settingsCardImageUrl;

  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-lg sm:aspect-[16/9]"
            style={cardImageUrl || visual ? undefined : { background: gradient }}
          >
            {cardImageUrl ? (
              <>
                <Image
                  src={cardImageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-ink/40" />
                <div className="relative flex h-full items-center justify-between px-6 sm:px-8">
                  <span className="font-display text-xl font-medium text-paper/90 sm:text-2xl md:text-3xl">
                    {cardLabel}
                  </span>
                </div>
              </>
            ) : visual ? (
              visual
            ) : (
              <>
                <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                <div className="relative flex h-full items-center justify-between px-6 sm:px-8">
                  <span className="font-display text-xl font-medium text-paper/90 sm:text-2xl md:text-3xl">
                    {cardLabel}
                  </span>
                  {iconName && (
                    <TechBrandIcon name={iconName} color="#fff" className="h-12 w-12 shrink-0 opacity-90 sm:h-16 sm:w-16 md:h-20 md:w-20" />
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="text-balance font-display text-3xl font-bold uppercase leading-tight text-paper sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-5 text-paper/70">{paragraph}</p>
          </div>
        </div>

        <ExpandableServiceCards cards={services} />
      </div>
    </section>
  );
}
