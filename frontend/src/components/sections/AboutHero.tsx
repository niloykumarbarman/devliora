"use client";

import Image from "next/image";
import { useAbout } from "@/lib/aboutContent";
import { resolveImageUrl } from "@/lib/hero";

export default function AboutHero() {
  const { about } = useAbout();
  if (!about) return null;

  const hasImage = Boolean(about.heroImageUrl);

  return (
    <section className="bg-grain relative isolate overflow-hidden bg-ink py-28 text-paper md:py-36">
      {hasImage ? (
        <>
          <Image
            src={resolveImageUrl(about.heroImageUrl)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Readable but visible: light overall tint + a soft centre-out
              wash behind the (centre-aligned) heading. */}
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-ink)_0%,rgba(14,20,32,0.55)_45%,transparent_80%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px] animate-ambient-drift"
            style={{ backgroundColor: "var(--color-signal)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
            }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="hero-h1-rise mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl">
          {about.heroHeading}{" "}
          {about.heroHeadingAccent && (
            <span className="text-signal">{about.heroHeadingAccent}</span>
          )}{" "}
          {about.heroHeadingSuffix}
        </h1>

        <p
          className="hero-fade-rise mx-auto mt-6 max-w-2xl text-lg text-paper/70"
          style={{ animationDelay: "0.16s" }}
        >
          {about.heroSubtitle}
        </p>
      </div>
    </section>
  );
}
