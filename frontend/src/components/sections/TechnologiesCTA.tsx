"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Matches kaz.com.bd/technologies' closing "Ready to turn ideas into
// reality?" / "Get Started Now!" banner — same bg-signal split-banner
// pattern already used for every other CTA banner on the site (their teal
// isn't part of Devliora's palette, so this stays on-brand rather than
// introducing a one-off color, same reasoning as the AI Development page's
// CTA banners). Replaces the old centered gradient-card CTA.
export default function TechnologiesCTA() {
  return (
    <section className="border-t border-paper/10 bg-signal">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
          <p className="max-w-lg text-lg font-medium leading-snug text-paper">
            Ready to turn ideas into reality?
          </p>
        </div>
        <Link
          href="/contact"
          className="btn-3d flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
        >
          Get Started Now!
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
