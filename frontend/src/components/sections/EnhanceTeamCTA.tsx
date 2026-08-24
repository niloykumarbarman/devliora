import Link from "next/link";
import { ArrowRight } from "lucide-react";

// "Enhance your team's capabilities and efficiency." — matches
// kaz.com.bd's per-technology page's third mid-page CTA banner.
// Originally built only for the Staff Augmentation service page
// (services/[slug]/page.tsx). NOTE: the reference uses a magenta/pink
// background here, but that color isn't part of Devliora's palette
// (ink/paper/graphite/signal/ember/wire), so this stays on bg-signal for
// brand consistency with every other CTA banner on the site rather than
// introducing an off-brand one-off color.
export default function EnhanceTeamCTA() {
  return (
    <section className="border-t border-paper/10 bg-signal">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
          <p className="max-w-lg text-lg font-medium leading-snug text-paper">
            Enhance your team&apos;s capabilities and efficiency.
          </p>
          <p className="mt-1 max-w-lg text-sm text-paper/70">Want to scale up?</p>
        </div>
        <Link
          href="/contact"
          className="btn-3d flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
