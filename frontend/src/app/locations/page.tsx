import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/Reveal";
import { buildMetadata } from "@/lib/seo";
import { LOCATION_CONTENT, LOCATION_SLUGS } from "@/lib/locationContent";

export const metadata: Metadata = buildMetadata({
  title: "Where Devliora Works",
  description:
    "Devliora is a software development company with a Melbourne team and a Bangladesh delivery team, working with clients across the US, UK, Canada, Australia and Europe.",
  path: "/locations",
});

export default function LocationsIndexPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Reveal><section className="relative overflow-hidden bg-ink py-24 md:py-32">
          <div className="bg-grain absolute inset-0" />
          <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(243,242,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(243,242,237,0.04)_1px,transparent_1px)]" />
          <div className="relative mx-auto max-w-4xl px-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-signal">
              Where we work
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-paper md:text-5xl lg:text-6xl">
              A Melbourne team, a Bangladesh delivery team, international clients
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-wire md:text-xl">
              Devliora runs an engineering team in Point Cook, Melbourne alongside a
              larger delivery team in Bangladesh. Most of our clients are elsewhere —
              the pages below set out, honestly, how an engagement works from each
              market: the hours we overlap, how contracting and tax are handled, and
              the privacy rules that apply.
            </p>
          </div>
        </section></Reveal>

        <Reveal><section className="relative bg-paper py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {LOCATION_SLUGS.map((slug) => {
                const c = LOCATION_CONTENT[slug];
                return (
                  <Link
                    key={slug}
                    href={`/locations/${slug}`}
                    className="group block rounded-2xl border border-graphite/10 p-6 transition-colors hover:border-signal/40"
                  >
                    <h2 className="font-display text-xl font-semibold text-ink group-hover:text-signal">
                      {c.label}
                    </h2>
                    <p className="mt-2 text-sm text-graphite/75">{c.intro}</p>
                    <p className="mt-3 font-mono text-xs uppercase tracking-widest text-graphite/65">
                      {c.timezone.overlap} overlap
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 border-t border-graphite/10 pt-8">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-graphite/65">
                Our offices
              </h2>
              <ul className="mt-4 space-y-2 text-graphite/80">
                <li>Point Cook, Melbourne, VIC — Australia</li>
                <li>Gaibandha — Bangladesh</li>
              </ul>
              <p className="mt-4 text-sm text-graphite/60">
                See the{" "}
                <Link href="/contact" className="text-signal underline-offset-4 hover:underline">
                  contact page
                </Link>{" "}
                for full addresses and phone numbers.
              </p>
            </div>
          </div>
        </section></Reveal>
      </main>
      <Footer />
    </>
  );
}
