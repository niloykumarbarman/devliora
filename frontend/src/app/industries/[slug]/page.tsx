import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IndustriesCTA from "@/components/sections/IndustriesCTA";
import { fetchIndustries, fetchIndustryBySlug } from "@/lib/industries";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

const ACCENTS = ["border-signal text-signal", "border-ember text-ember"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = await fetchIndustryBySlug(slug);

  if (!industry) {
    return buildMetadata({
      title: "Industry | Devliora",
      description: "Industries where Devliora has built real domain context.",
      path: `/industries/${slug}`,
    });
  }

  return buildMetadata({
    title: `${industry.name} | Devliora`,
    description:
      industry.description ||
      `How Devliora builds for ${industry.name} — domain context, not guesswork.`,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [industry, industries, settings] = await Promise.all([
    fetchIndustryBySlug(slug),
    fetchIndustries(),
    fetchSiteSettings(),
  ]);

  if (!industry) {
    notFound();
  }

  const sortedStats = [...industry.stats].sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedIndustries = [...industries].sort((a, b) => a.displayOrder - b.displayOrder);
  const imageUrl = settings?.industriesImageUrl ?? "";

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-ink py-24 md:py-32">
          <div className="bg-grain absolute inset-0" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(61,90,254,0.25), transparent 60%), radial-gradient(circle at 80% 0%, rgba(255,107,53,0.15), transparent 55%)",
            }}
          />
          <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(243,242,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(243,242,237,0.04)_1px,transparent_1px)]" />

          <div className="relative mx-auto max-w-4xl px-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-signal">
              Industries
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-paper md:text-5xl">
              {industry.name}
            </h1>
            {industry.description && (
              <p className="mt-6 max-w-2xl text-lg text-wire">{industry.description}</p>
            )}
          </div>
        </section>

        <section className="relative bg-paper py-20 md:py-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 md:grid-cols-[1.3fr_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-graphite/5">
              {imageUrl ? (
                <Image
                  src={resolveImageUrl(imageUrl)}
                  alt={industry.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-graphite/30">
                  <span className="font-mono text-sm">No image set</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-graphite/50">
                Industries
              </h2>
              <ul className="mt-4 space-y-3">
                {sortedIndustries.map((item) => {
                  const isCurrent = item.slug === industry.slug;
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/industries/${item.slug}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={
                          isCurrent
                            ? "font-mono text-sm font-semibold text-ink"
                            : "font-mono text-sm text-graphite/70 transition-colors duration-200 hover:text-ink"
                        }
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {sortedStats.length > 0 && (
          <section className="relative overflow-hidden bg-ink py-20">
            <div className="bg-grain absolute inset-0" />
            <div className="relative mx-auto max-w-5xl px-6">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {sortedStats.map((stat, i) => {
                  const accent = ACCENTS[i % ACCENTS.length];
                  return (
                    <div key={`${stat.label}-${i}`} className="flex items-start gap-5">
                      <div
                        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 ${accent}`}
                      >
                        <span className="text-center font-display text-lg font-bold leading-tight">
                          {stat.value}
                        </span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm leading-relaxed text-wire">{stat.label}</p>
                        {stat.source && (
                          <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-paper/40">
                            {stat.source}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <IndustriesCTA />
      </main>
      <Footer />
    </>
  );
}
