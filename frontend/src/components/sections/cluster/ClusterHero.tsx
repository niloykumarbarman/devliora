import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AccentedTitle from "./AccentedTitle";
import type { TitlePart, CtaLink } from "./clusterKit";

/**
 * Dark capability-page hero shared by every cluster page. Structure and
 * visual grammar match CloudDevOpsHero; the content is fully
 * parameterised so each page reads as its own.
 */
export default function ClusterHero({
  eyebrow,
  breadcrumb,
  titleParts,
  intro,
  primaryCta,
  secondaryCta,
  chips,
}: {
  eyebrow: string;
  breadcrumb: { label: string; href?: string }[];
  titleParts: TitlePart[];
  intro: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  chips: string[];
}) {
  return (
    <section className="bg-grain relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-signal/20 blur-[130px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-20">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-sm">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-paper/30">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-paper/70 transition-colors hover:text-paper"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-ember">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <p className="hero-fade-rise mt-12 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
          {eyebrow}
        </p>

        <h1 className="hero-h1-rise mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          <AccentedTitle parts={titleParts} />
        </h1>

        <p
          className="hero-fade-rise mt-7 max-w-2xl text-lg leading-relaxed text-paper/70"
          style={{ animationDelay: "0.28s" }}
        >
          {intro}
        </p>

        <div
          className="hero-fade-rise mt-9 flex flex-wrap gap-3"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href={primaryCta.href}
            className="btn-3d inline-flex items-center gap-2 rounded-lg bg-signal px-6 py-3 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-colors hover:bg-signal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {primaryCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-lg border border-paper/20 px-6 py-3 font-medium text-paper transition-colors hover:border-paper/50 hover:bg-paper/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/30"
          >
            {secondaryCta.label}
          </Link>
        </div>

        <ul
          className="hero-fade-rise mt-12 flex flex-wrap gap-2"
          style={{ animationDelay: "0.5s" }}
          aria-label="Capabilities"
        >
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-paper/15 bg-paper/[0.04] px-3.5 py-1.5 font-mono text-xs text-paper/70"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
