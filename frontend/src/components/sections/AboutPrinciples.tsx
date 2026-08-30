"use client";

import Reveal from "@/components/Reveal";
import { useAbout, aboutIcon } from "@/lib/aboutContent";

export default function AboutPrinciples() {
  const { about } = useAbout();
  if (!about || about.principles.length === 0) return null;

  return (
    <section className="bg-grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-[480px] w-[480px] rounded-full opacity-[0.1] blur-[120px] animate-ambient-drift"
        style={{ backgroundColor: "var(--color-ember)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal
          as="h2"
          delay={0.08}
          className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight md:text-4xl"
        >
          {about.principlesHeading}{" "}
          {about.principlesHeadingAccent && (
            <span className="text-signal">{about.principlesHeadingAccent}</span>
          )}
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-paper/10 sm:grid-cols-2">
          {about.principles.map((principle, i) => {
            const Icon = aboutIcon(principle.iconName);
            return (
              <Reveal
                key={principle.id ?? principle.title}
                delay={(i + 2) * 0.08}
                className="bg-ink p-8"
              >
                <Icon className="h-6 w-6 text-signal" strokeWidth={1.75} />
                <h3 className="mt-5 text-lg font-semibold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">
                  {principle.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
