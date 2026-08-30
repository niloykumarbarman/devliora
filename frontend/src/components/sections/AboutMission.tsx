"use client";

import Reveal from "@/components/Reveal";
import { useAbout, toParagraphs } from "@/lib/aboutContent";

export default function AboutMission() {
  const { about } = useAbout();
  if (!about) return null;

  return (
    <section className="relative overflow-hidden bg-paper py-24 text-ink md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal
          as="h2"
          delay={0.08}
          className="mt-4 text-balance text-3xl font-semibold leading-tight text-graphite md:text-4xl"
        >
          {about.missionHeading}{" "}
          {about.missionHeadingAccent && (
            <span className="text-signal">{about.missionHeadingAccent}</span>
          )}
        </Reveal>
        <Reveal delay={0.16} className="mt-6 space-y-4 text-lg text-graphite/70">
          {toParagraphs(about.missionBody).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={0.24} className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-wire bg-paper p-6">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
              {about.missionCardLabel}
            </span>
            <p className="mt-3 text-base leading-relaxed text-graphite/80">
              {about.missionCardBody}
            </p>
          </div>
          <div className="rounded-lg border border-wire bg-paper p-6">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-ember">
              {about.visionCardLabel}
            </span>
            <p className="mt-3 text-base leading-relaxed text-graphite/80">
              {about.visionCardBody}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
