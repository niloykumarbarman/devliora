"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";

// Individual technology page banner (e.g. /technologies/dot-net-development),
// matching kaz.com.bd's per-technology page: same full-bleed image + centered
// title treatment as TechnologiesHero.tsx, but with a three-level breadcrumb
// (Home / Technologies / <title>) since this sits one level deeper. Reuses
// the same technologiesHeroImageUrl banner image as the /technologies index
// rather than introducing a per-technology image field.
export default function TechnologyDetailHero({ title }: { title: string }) {
  const [bannerImageUrl, setBannerImageUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((data) => {
      if (cancelled || !data) return;
      if (data.technologiesHeroImageUrl) setBannerImageUrl(resolveImageUrl(data.technologiesHeroImageUrl));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="relative flex h-[280px] items-center justify-center sm:h-[340px] md:h-[380px]">
        {bannerImageUrl ? (
          <Image src={bannerImageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px]"
            style={{ backgroundColor: "var(--color-signal)" }}
          />
        )}
        <div className="absolute inset-0 bg-ink/70" />
        <h1 className="relative text-balance text-center font-display text-5xl font-semibold leading-tight md:text-7xl">
          {title}
        </h1>
      </div>

      <div className="relative border-t border-paper/10 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-6 font-mono text-sm">
          <Link href="/" className="text-paper/80 transition-colors hover:text-paper">
            Home
          </Link>
          <span className="text-paper/30">/</span>
          <Link href="/technologies" className="text-paper/80 transition-colors hover:text-paper">
            Technologies
          </Link>
          <span className="text-paper/30">/</span>
          <span className="text-ember">{title}</span>
        </div>
      </div>
    </section>
  );
}
