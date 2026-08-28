import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/Reveal";
import IndustriesCTA from "@/components/sections/IndustriesCTA";
import FAQView from "@/components/sections/FAQView";
import { fetchIndustries, fetchIndustryBySlug } from "@/lib/industries";
import { fetchCaseStudies, type CaseStudy } from "@/lib/caseStudies";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { breadcrumbJsonLd, buildMetadata, faqPageJsonLd, webPageJsonLd } from "@/lib/seo";
import { INDUSTRY_CONTENT } from "@/lib/industryContent";
import JsonLd from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

const ACCENTS = ["border-signal text-signal", "border-ember text-ember"];

async function safeFetchCaseStudies(): Promise<CaseStudy[]> {
  try {
    return await fetchCaseStudies();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = await fetchIndustryBySlug(slug);

  if (!industry) {
    return buildMetadata({
      title: "Industry not found",
      description: "This industry page could not be found.",
      path: `/industries/${slug}`,
      noindex: true,
    });
  }

  const content = INDUSTRY_CONTENT[industry.slug];

  return buildMetadata({
    title: content?.metaTitle ?? `${industry.name} Software Development`,
    description:
      content?.metaDescription ||
      industry.description ||
      `How Devliora designs and builds software for ${industry.name} — real domain context, not guesswork.`,
    path: `/industries/${industry.slug}`,
  });
}

/** Mono uppercase section eyebrow, matching the rest of the site. */
function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-xs font-semibold uppercase tracking-widest ${
        dark ? "text-signal" : "text-graphite/65"
      }`}
    >
      {children}
    </p>
  );
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [industry, industries, settings, allCaseStudies] = await Promise.all([
    fetchIndustryBySlug(slug),
    fetchIndustries(),
    fetchSiteSettings(),
    safeFetchCaseStudies(),
  ]);

  if (!industry) {
    notFound();
  }

  const content = INDUSTRY_CONTENT[industry.slug] ?? null;
  const sortedStats = [...industry.stats].sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedIndustries = [...industries].sort((a, b) => a.displayOrder - b.displayOrder);
  const imageUrl = settings?.industriesImageUrl ?? "";
  const relatedCaseStudies = content
    ? content.caseStudySlugs
        .map((s) => allCaseStudies.find((cs) => cs.slug === s))
        .filter((cs): cs is CaseStudy => Boolean(cs))
    : [];
  const faqItems = content
    ? content.faqs.map((faq, i) => ({
        id: `${industry.slug}-faq-${i}`,
        serviceSlug: "",
        displayOrder: i,
        question: faq.question,
        answer: faq.answer,
      }))
    : [];

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Industries", path: "/industries" },
    { name: industry.name, path: `/industries/${industry.slug}` },
  ]);
  const webPage = webPageJsonLd({
    path: `/industries/${industry.slug}`,
    name: `${content?.metaTitle ?? `${industry.name} Software Development`} | Devliora`,
    description: content?.metaDescription || industry.description || undefined,
  });
  const faqLd = content
    ? faqPageJsonLd(content.faqs, `/industries/${industry.slug}`)
    : null;

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={webPage} />
      {faqLd && (
        <JsonLd data={faqLd} />
      )}
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Reveal><section className="relative overflow-hidden bg-ink py-24 md:py-32">
          <div className="bg-grain absolute inset-0" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(61,90,254,0.25), transparent 60%), radial-gradient(circle at 80% 0%, rgba(255,107,53,0.15), transparent 55%)",
            }}
          />
          <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(243,242,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(243,242,237,0.04)_1px,transparent_1px)]" />
          <div
            className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full opacity-[0.15] blur-[120px] animate-ambient-drift"
            style={{ backgroundColor: "var(--color-signal)" }}
          />

          <div className="relative mx-auto max-w-4xl px-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-signal">
              Industries
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-paper md:text-5xl lg:text-6xl">
              {content ? `${industry.name} Software Development` : industry.name}
            </h1>
            {(content?.intro || industry.description) && (
              <p className="mt-6 max-w-2xl text-lg text-wire md:text-xl">
                {content?.intro || industry.description}
              </p>
            )}
          </div>
        </section></Reveal>

        {content && (
          <>
            {/* 1 — Industry problems */}
            <Reveal><section className="relative bg-paper py-20 md:py-24">
              <div className="mx-auto max-w-5xl px-6">
                <Eyebrow>The problem</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
                  What slows {industry.name} teams down
                </h2>
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  {content.problems.map((p) => (
                    <div key={p.title} className="border-l-2 border-ember/40 pl-5">
                      <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                      <p className="mt-2 text-graphite/80">{p.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section></Reveal>

            {/* 2 — Devliora solutions */}
            <Reveal><section className="relative overflow-hidden bg-ink py-20 md:py-24">
              <div className="bg-grain absolute inset-0" />
              <div className="relative mx-auto max-w-5xl px-6">
                <Eyebrow dark>How Devliora helps</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-semibold text-paper md:text-4xl">
                  What we build for {industry.name}
                </h2>
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  {content.solutions.map((s) => (
                    <div key={s.title} className="border-l-2 border-signal/50 pl-5">
                      <h3 className="font-display text-lg font-semibold text-paper">{s.title}</h3>
                      <p className="mt-2 text-wire">{s.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section></Reveal>

            {/* 3 — Software capabilities */}
            <Reveal><section className="relative bg-paper py-20 md:py-24">
              <div className="mx-auto max-w-5xl px-6">
                <Eyebrow>Software capabilities</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
                  {industry.name} software we deliver
                </h2>
                <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {content.capabilities.map((cap) => (
                    <li key={cap} className="flex gap-3 text-graphite/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section></Reveal>
          </>
        )}

        {sortedStats.length > 0 && (
          <Reveal><section className="relative overflow-hidden bg-ink py-20">
            <div className="bg-grain absolute inset-0" />
            <div className="relative mx-auto max-w-5xl px-6">
              {content && (
                <Eyebrow dark>Standards we build to</Eyebrow>
              )}
              <div className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-3 ${content ? "mt-10" : ""}`}>
                {sortedStats.map((stat, i) => {
                  const accent = ACCENTS[i % ACCENTS.length];
                  return (
                    <div key={`${stat.label}-${i}`} className="tilt-3d flex items-start gap-5 rounded-xl p-2">
                      <div
                        className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 ${accent}`}
                      >
                        <span className="text-center font-display text-lg font-bold leading-tight">
                          {stat.value}
                        </span>
                      </div>
                      <div className="pt-2">
                        <p className="text-base leading-relaxed text-wire">{stat.label}</p>
                        {stat.source && (
                          <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-paper/55">
                            {stat.source}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section></Reveal>
        )}

        {content && (
          <>
            {/* 4 — Technology */}
            <Reveal><section className="relative bg-paper py-20 md:py-24">
              <div className="mx-auto max-w-5xl px-6">
                <Eyebrow>Technology</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
                  The stack behind {industry.name} builds
                </h2>
                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {content.techGroups.map((group) => (
                    <div key={group.label}>
                      <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-graphite/65">
                        {group.label}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {group.items.map((item) => (
                          <li key={item} className="text-graphite/85">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-sm text-graphite/60">
                  We choose per project — see{" "}
                  <Link href="/technologies" className="text-signal underline-offset-4 hover:underline">
                    all technologies
                  </Link>{" "}
                  we work with.
                </p>
              </div>
            </section></Reveal>

            {/* 5 — Security & compliance */}
            <Reveal><section className="relative overflow-hidden bg-ink py-20 md:py-24">
              <div className="bg-grain absolute inset-0" />
              <div className="relative mx-auto max-w-5xl px-6">
                <Eyebrow dark>Security &amp; compliance</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-semibold text-paper md:text-4xl">
                  How we protect {industry.name} data
                </h2>
                <ul className="mt-10 space-y-4">
                  {content.security.map((item) => (
                    <li key={item} className="flex gap-3 text-wire">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section></Reveal>

            {/* 6 — Case studies */}
            <Reveal><section className="relative bg-paper py-20 md:py-24">
              <div className="mx-auto max-w-5xl px-6">
                <Eyebrow>Case studies</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
                  {industry.name} work
                </h2>
                {relatedCaseStudies.length > 0 ? (
                  <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    {relatedCaseStudies.map((cs) => (
                      <Link
                        key={cs.slug}
                        href={`/case-studies/${cs.slug}`}
                        className="group block rounded-2xl border border-graphite/10 p-6 transition-colors hover:border-signal/40"
                      >
                        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-signal">
                          {cs.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm text-graphite/75">{cs.results}</p>
                        <span className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-signal">
                          Read case study →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 max-w-2xl text-graphite/75">
                    Related engagements are in our{" "}
                    <Link href="/case-studies" className="text-signal underline-offset-4 hover:underline">
                      case studies
                    </Link>{" "}
                    and{" "}
                    <Link href="/portfolio" className="text-signal underline-offset-4 hover:underline">
                      portfolio
                    </Link>
                    . Ask us for {industry.name}-specific references on a call.
                  </p>
                )}
              </div>
            </section></Reveal>

            {/* 7 — FAQ */}
            {faqItems.length > 0 && (
              <FAQView faqs={faqItems} heading={`${industry.name} software: common questions`} />
            )}
          </>
        )}

        <Reveal><section className="relative bg-paper py-16 md:py-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 md:grid-cols-[1.3fr_1fr]">
            <div className="tilt-3d relative aspect-[16/10] overflow-hidden rounded-2xl bg-graphite/5">
              {imageUrl ? (
                <Image
                  src={resolveImageUrl(imageUrl)}
                  alt={`${industry.name} software development at Devliora`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-graphite/30">
                  <span className="font-mono text-sm">No image set</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-graphite/65">
                More industries
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
                            ? "font-mono text-base font-semibold text-ink"
                            : "font-mono text-base text-graphite/70 transition-colors duration-200 hover:text-ink"
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
        </section></Reveal>

        {/* 8 — CTA */}
        <IndustriesCTA />
      </main>
      <Footer />
    </>
  );
}
