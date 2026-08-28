import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/Reveal";
import FAQView from "@/components/sections/FAQView";
import { breadcrumbJsonLd, buildMetadata, faqPageJsonLd, webPageJsonLd, localBusinessJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import {
  LOCATION_CONTENT,
  LOCATION_SLUGS,
  CASE_STUDY_TITLES,
} from "@/lib/locationContent";

type Props = {
  params: Promise<{ slug: string }>;
};

// The four market pages are the only valid slugs; anything else 404s
// rather than rendering an empty shell.
export function generateStaticParams() {
  return LOCATION_SLUGS.map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = LOCATION_CONTENT[slug];
  if (!content) {
    return buildMetadata({
      title: "Location not found",
      description: "This location page could not be found.",
      path: `/locations/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/locations/${content.slug}`,
  });
}

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

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = LOCATION_CONTENT[slug];
  if (!content) {
    notFound();
  }

  const faqItems = content.faqs.map((faq, i) => ({
    id: `${content.slug}-faq-${i}`,
    serviceSlug: "",
    displayOrder: i,
    question: faq.question,
    answer: faq.answer,
  }));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Locations", path: "/locations" },
    { name: content.label, path: `/locations/${content.slug}` },
  ]);
  const webPage = webPageJsonLd({
    path: `/locations/${content.slug}`,
    name: `${content.metaTitle} | Devliora`,
    description: content.metaDescription,
  });
  const faqLd = faqPageJsonLd(content.faqs, `/locations/${content.slug}`);
  // A LocalBusiness node only where Devliora has a real physical office.
  const localBusiness = content.slug === "australia" ? localBusinessJsonLd() : null;

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={webPage} />
      {faqLd && (
        <JsonLd data={faqLd} />
      )}
      {localBusiness && (
        <JsonLd data={localBusiness} />
      )}
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero + honest presence statement */}
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
          <div className="relative mx-auto max-w-4xl px-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-signal">
              Working with clients in {content.country}
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-paper md:text-5xl lg:text-6xl">
              {content.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-wire md:text-xl">{content.intro}</p>
            <p className="mt-6 max-w-2xl rounded-xl border border-wire/20 bg-paper/5 p-4 text-sm text-wire">
              <span className="font-semibold text-paper">Local presence: </span>
              {content.presence}
            </p>
          </div>
        </section></Reveal>

        {/* Timezone collaboration */}
        <Reveal><section className="relative bg-paper py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Eyebrow>Timezone &amp; collaboration</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
              {content.timezone.overlap} of daily overlap
            </h2>
            <p className="mt-4 max-w-3xl text-graphite/80">{content.timezone.summary}</p>
            <p className="mt-4 max-w-3xl text-graphite/80">{content.timezone.detail}</p>
          </div>
        </section></Reveal>

        {/* Engagement models */}
        <Reveal><section className="relative overflow-hidden bg-ink py-20 md:py-24">
          <div className="bg-grain absolute inset-0" />
          <div className="relative mx-auto max-w-5xl px-6">
            <Eyebrow dark>Engagement models</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-paper md:text-4xl">
              How {content.label} clients work with us
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {content.engagementModels.map((m) => (
                <div key={m.title} className="border-l-2 border-signal/50 pl-5">
                  <h3 className="font-display text-lg font-semibold text-paper">{m.title}</h3>
                  <p className="mt-2 text-wire">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section></Reveal>

        {/* Communication process */}
        <Reveal><section className="relative bg-paper py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Eyebrow>Communication</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
              How we stay in sync
            </h2>
            <ul className="mt-8 space-y-4">
              {content.communication.map((item) => (
                <li key={item} className="flex gap-3 text-graphite/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section></Reveal>

        {/* Contracting + data protection, side by side */}
        <Reveal><section className="relative overflow-hidden bg-ink py-20 md:py-24">
          <div className="bg-grain absolute inset-0" />
          <div className="relative mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-2">
            <div>
              <Eyebrow dark>Contracting &amp; commercial</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-semibold text-paper">
                Engaging Devliora from {content.label}
              </h2>
              <ul className="mt-6 space-y-4">
                {content.contracting.map((item) => (
                  <li key={item} className="flex gap-3 text-wire">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow dark>Data protection &amp; compliance</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-semibold text-paper">
                {content.label} data protection
              </h2>
              <ul className="mt-6 space-y-4">
                {content.dataProtection.map((item) => (
                  <li key={item} className="flex gap-3 text-wire">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section></Reveal>

        {/* Services / technology / industries — summarized, linked out */}
        <Reveal><section className="relative bg-paper py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Eyebrow>Services &amp; expertise</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
              What we build for {content.label} clients
            </h2>
            <p className="mt-4 max-w-3xl text-graphite/80">{content.industries}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-sm border border-ink/20 px-4 py-2 font-mono text-sm text-ink/80 transition-colors hover:border-ink/40 hover:text-ink"
              >
                All services →
              </Link>
              <Link
                href="/technologies"
                className="rounded-sm border border-ink/20 px-4 py-2 font-mono text-sm text-ink/80 transition-colors hover:border-ink/40 hover:text-ink"
              >
                Technology expertise →
              </Link>
              <Link
                href="/industries"
                className="rounded-sm border border-ink/20 px-4 py-2 font-mono text-sm text-ink/80 transition-colors hover:border-ink/40 hover:text-ink"
              >
                Industries →
              </Link>
            </div>
          </div>
        </section></Reveal>

        {/* Project process, framed around the overlap window */}
        <Reveal><section className="relative overflow-hidden bg-ink py-20 md:py-24">
          <div className="bg-grain absolute inset-0" />
          <div className="relative mx-auto max-w-5xl px-6">
            <Eyebrow dark>Project process</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-paper md:text-4xl">
              From first call to steady delivery
            </h2>
            <ol className="mt-10 space-y-6">
              {content.process.map((p, i) => (
                <li key={p.step} className="flex gap-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-signal/50 font-mono text-sm text-signal">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">{p.step}</h3>
                    <p className="mt-1 text-wire">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section></Reveal>

        {/* Relevant case studies */}
        <Reveal><section className="relative bg-paper py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Eyebrow>Relevant case studies</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
              Work relevant to {content.label} clients
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {content.caseStudySlugs.map((cs) => (
                <Link
                  key={cs}
                  href={`/case-studies/${cs}`}
                  className="group block rounded-2xl border border-graphite/10 p-6 transition-colors hover:border-signal/40"
                >
                  <h3 className="font-display text-lg font-semibold text-ink group-hover:text-signal">
                    {CASE_STUDY_TITLES[cs] ?? cs}
                  </h3>
                  <span className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-signal">
                    Read case study →
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-graphite/60">
              More in{" "}
              <Link href="/case-studies" className="text-signal underline-offset-4 hover:underline">
                case studies
              </Link>{" "}
              and our{" "}
              <Link href="/portfolio" className="text-signal underline-offset-4 hover:underline">
                portfolio
              </Link>
              .
            </p>
          </div>
        </section></Reveal>

        {/* FAQ */}
        {faqItems.length > 0 && (
          <FAQView faqs={faqItems} heading={`Working with Devliora from ${content.country}`} />
        )}

        {/* CTA */}
        <Reveal><section className="relative overflow-hidden bg-ink py-20 md:py-24">
          <div className="bg-grain absolute inset-0" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-semibold text-paper md:text-4xl">
              Building software for a {content.label} company?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-wire">
              Tell us about the project. We&rsquo;ll come back within two business days with a
              clear read on scope, timeline, and how the timezone setup would work for you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-sm bg-ember px-6 py-3.5 font-mono text-sm font-medium text-paper transition-colors hover:bg-ember/90"
              >
                Start a conversation
              </Link>
              <Link
                href="/book-consultation"
                className="inline-flex items-center justify-center rounded-sm border border-wire/30 px-6 py-3.5 font-mono text-sm text-paper/80 transition-colors hover:border-wire/60 hover:text-paper"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </section></Reveal>
      </main>
      <Footer />
    </>
  );
}
