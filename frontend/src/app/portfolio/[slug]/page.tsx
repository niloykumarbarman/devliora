import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/Reveal";
import { fetchPortfolioBySlug, parseTechStack } from "@/lib/portfolios";
import { resolveImageUrl } from "@/lib/hero";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await fetchPortfolioBySlug(slug);

  if (!portfolio) {
    return buildMetadata({
      title: "Case Study | Devliora",
      description: "Client project case study.",
      path: `/portfolio/${slug}`,
    });
  }

  return buildMetadata({
    title: `${portfolio.title} | Devliora`,
    description: portfolio.result.slice(0, 160),
    path: `/portfolio/${portfolio.slug}`,
  });
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await fetchPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  const techList = parseTechStack(portfolio.techStack);
  const sortedImages = [...portfolio.images].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const sortedMetrics = [...portfolio.metrics].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "My Work", path: "/portfolio" },
    { name: portfolio.title, path: `/portfolio/${portfolio.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <main>
        <Reveal><section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.15] blur-[120px] animate-ambient-drift"
            style={{ backgroundColor: "var(--color-signal)" }}
          />
          <div className="relative mx-auto max-w-4xl px-6">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
              {portfolio.industry} &mdash; {portfolio.clientName}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-medium sm:text-5xl md:text-6xl">
              {portfolio.title}
            </h1>
            {techList.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {techList.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm border border-paper/20 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-paper/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section></Reveal>

        <Reveal><section className="relative overflow-hidden bg-paper py-20 text-ink md:py-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="tilt-3d rounded-xl p-2">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Challenge
                </p>
                <p className="mt-3 text-base leading-relaxed text-graphite/80 md:text-lg">
                  {portfolio.challenge}
                </p>
              </div>
              <div className="tilt-3d rounded-xl p-2">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Approach
                </p>
                <p className="mt-3 text-base leading-relaxed text-graphite/80 md:text-lg">
                  {portfolio.approach}
                </p>
              </div>
              <div className="tilt-3d rounded-xl p-2">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Result
                </p>
                <p className="mt-3 text-base leading-relaxed text-graphite/80 md:text-lg">
                  {portfolio.result}
                </p>
              </div>
            </div>
          </div>
        </section></Reveal>

        {sortedMetrics.length > 0 && (
          <Reveal><section className="relative overflow-hidden bg-ink py-20 text-paper">
            <div className="mx-auto max-w-4xl px-6">
              <div className="grid gap-px overflow-hidden rounded-xl bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
                {sortedMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    // Plain scale (no translate/rotate/tilt-3d): the
                    // parent grid is overflow-hidden (it relies on that
                    // for the gap-px hairline mosaic trick), which would
                    // clip a bigger lift at the tile edges.
                    className="relative z-0 bg-ink px-6 py-8 text-center transition-transform duration-300 hover:z-10 hover:scale-[1.05]"
                  >
                    <p className="font-display text-3xl font-semibold tabular-nums text-signal sm:text-4xl">
                      {metric.value}
                    </p>
                    <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-paper/60">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section></Reveal>
        )}

        {sortedImages.length > 0 && (
          <Reveal><section className="relative overflow-hidden bg-paper py-20 text-ink md:py-28">
            <div className="mx-auto max-w-4xl px-6">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                Gallery
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {sortedImages.map((image, i) => (
                  <figure
                    key={`${image.imageUrl}-${i}`}
                    className="tilt-3d overflow-hidden rounded-xl border border-ink/10 bg-graphite/5"
                  >
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={resolveImageUrl(image.imageUrl)}
                        alt={image.caption || portfolio.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {image.caption && (
                      <figcaption className="px-4 py-3 text-sm leading-relaxed text-graphite/70">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section></Reveal>
        )}

        {portfolio.testimonialQuote && (
          <Reveal><section className="relative overflow-hidden bg-graphite/5 py-20 text-ink md:py-28">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <blockquote className="font-display text-xl font-medium leading-relaxed text-graphite sm:text-2xl">
                &ldquo;{portfolio.testimonialQuote}&rdquo;
              </blockquote>
              {portfolio.testimonialClientName && (
                <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-graphite/60">
                  {portfolio.testimonialClientName}
                  {portfolio.testimonialClientTitle
                    ? ` — ${portfolio.testimonialClientTitle}`
                    : ""}
                </p>
              )}
            </div>
          </section></Reveal>
        )}
      </main>
      <Footer />
    </>
  );
}
