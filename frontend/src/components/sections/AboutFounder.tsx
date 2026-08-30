"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useAbout, toParagraphs, aboutIcon } from "@/lib/aboutContent";

export default function AboutFounder() {
  const { about } = useAbout();
  if (!about) return null;

  return (
    <section
      id="founder"
      className="relative scroll-mt-24 overflow-hidden border-t border-wire bg-paper py-24 text-ink md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          {about.founderEyebrow && (
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
              {about.founderEyebrow}
            </p>
          )}
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight text-graphite md:text-4xl">
            {about.founderName}
          </h2>
          {about.founderRole && (
            <p className="mt-1 font-mono text-sm text-graphite/65">
              {about.founderRole}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.08} className="mt-6 space-y-4 text-lg leading-relaxed text-graphite/75">
          {toParagraphs(about.founderBody).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>

        {about.founderCards.length > 0 && (
          <Reveal delay={0.16} className="mt-12 grid gap-6 sm:grid-cols-3">
            {about.founderCards.map((item) => {
              const Icon = aboutIcon(item.iconName);
              return (
                <div key={item.id ?? item.title} className="rounded-lg border border-wire bg-paper p-5">
                  <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                  <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-graphite">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite/70">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </Reveal>
        )}

        {about.founderCtaText && (
          <Reveal delay={0.24} className="mt-10">
            <Link
              href={about.founderCtaUrl || "/contact"}
              className="group inline-flex items-center gap-2 font-mono text-sm font-semibold text-signal transition-colors hover:text-ink"
            >
              {about.founderCtaText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
