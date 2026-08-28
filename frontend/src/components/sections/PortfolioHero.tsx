"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";

export default function PortfolioHero() {
  const [heroImageUrl, setHeroImageUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((data) => {
      if (!cancelled && data?.portfolioHeroImageUrl) {
        setHeroImageUrl(resolveImageUrl(data.portfolioHeroImageUrl));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="relative flex h-[420px] items-center justify-center md:h-[480px]">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt="Devliora portfolio"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px] animate-ambient-drift"
            style={{ backgroundColor: "var(--color-signal)" }}
          />
        )}
        <div className="absolute inset-0 bg-ink/70" />

        <h1 className="hero-h1-rise relative text-balance text-5xl font-semibold leading-tight md:text-7xl">
          Software Development Portfolio
        </h1>
      </div>

      <div className="relative border-t border-paper/10 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-6 font-mono text-sm">
          <Link href="/" className="text-paper/70 transition-colors hover:text-paper">
            Home
          </Link>
          <span className="text-paper/30">/</span>
          <span className="text-ember">My Work</span>
        </div>
      </div>
    </section>
  );
}
