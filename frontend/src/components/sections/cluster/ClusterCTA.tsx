import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import AccentedTitle from "./AccentedTitle";
import type { TitlePart, CtaLink } from "./clusterKit";

/** Closing dark CTA band, mirrors CloudDevOpsCTA. */
export default function ClusterCTA({
  titleParts,
  body,
  primaryCta,
  secondaryCta,
}: {
  titleParts: TitlePart[];
  body: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}) {
  return (
    <section className="bg-grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-signal/12 blur-[120px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold leading-tight md:text-4xl">
          <AccentedTitle parts={titleParts} />
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
          {body}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href={primaryCta.href}
            className="btn-3d inline-flex items-center gap-2 rounded-lg bg-signal px-7 py-3.5 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-colors hover:bg-signal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {primaryCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-lg border border-paper/20 px-7 py-3.5 font-medium text-paper transition-colors hover:border-paper/50 hover:bg-paper/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/30"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
