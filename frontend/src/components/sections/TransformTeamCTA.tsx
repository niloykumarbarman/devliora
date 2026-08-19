import Link from "next/link";
import { ArrowRight } from "lucide-react";

// "Transform your development team for success." — matches
// kaz.com.bd's per-technology page's second mid-page CTA banner.
// Originally built only for the Staff Augmentation service page
// (services/[slug]/page.tsx); extracted here so other pages can reuse
// the same bg-signal split-banner pattern instead of duplicating it.
export default function TransformTeamCTA() {
  return (
    <section className="border-t border-paper/10 bg-signal">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
          <p className="max-w-lg text-lg font-medium leading-snug text-paper">
            Transform your development team for success.
          </p>
          <p className="mt-1 max-w-lg text-sm text-paper/70">Looking for skilled experts?</p>
        </div>
        <Link
          href="/contact"
          className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
        >
          Explore Options
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
