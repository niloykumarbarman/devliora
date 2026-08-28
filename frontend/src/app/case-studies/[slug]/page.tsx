import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/Reveal";
import {
  fetchCaseStudyBySlug,
  isIllustrativeCaseStudy,
  cleanCaseStudyText,
} from "@/lib/caseStudies";
import { CASE_STUDY_CONTENT } from "@/lib/caseStudyContent";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Splits the CMS "results" free-text (bullet lines) into clean items. */
function toResultItems(results: string): string[] {
  return results
    .split(/\r?\n/)
    .map((line) => line.replace(/^[•\-*\s]+/, "").trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await fetchCaseStudyBySlug(slug);
  if (!study) {
    return buildMetadata({
      title: "Case study not found",
      description: "This case study could not be found.",
      path: `/case-studies/${slug}`,
      noindex: true,
    });
  }
  const title = cleanCaseStudyText(study.title);
  const illustrative = isIllustrativeCaseStudy(study);
  const firstResult = toResultItems(study.results)[0] ?? cleanCaseStudyText(study.solution);
  return buildMetadata({
    title: `${title} — ${illustrative ? "Illustrative Case Study" : "Case Study"}`,
    description: `${illustrative ? "Illustrative example. " : ""}${firstResult}`.slice(0, 160),
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = await fetchCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const title = cleanCaseStudyText(study.title);
  const clientName = cleanCaseStudyText(study.clientName);
  const industry = cleanCaseStudyText(study.industry);
  const illustrative = isIllustrativeCaseStudy(study);
  const content = CASE_STUDY_CONTENT[study.slug] ?? null;
  const resultItems = toResultItems(study.results);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Case Studies", path: "/case-studies" },
    { name: title, path: `/case-studies/${study.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Hero: Client / Project + Industry + illustrative label */}
        <Reveal><section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.15] blur-[120px] animate-ambient-drift"
            style={{ backgroundColor: "var(--color-ember)" }}
          />
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
                {industry} &mdash; {clientName}
              </p>
              {illustrative && (
                <span className="rounded-sm border border-ember/40 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ember">
                  Illustrative Case Study
                </span>
              )}
            </div>
            <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-medium sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {illustrative && (
              <p className="mt-6 max-w-2xl rounded-xl border border-wire/20 bg-paper/5 p-4 text-sm text-wire">
                A representative example of the kind of work Devliora does. The
                client name and some specifics are composite or anonymized;
                this is not a description of a single named engagement.
              </p>
            )}
          </div>
        </section></Reveal>

        <section className="relative bg-paper py-20 text-ink md:py-28">
          <div className="mx-auto max-w-4xl space-y-16 px-6">
            {/* At-a-glance: Client / Project / Industry */}
            <Reveal><dl className="grid gap-8 border-b border-ink/10 pb-12 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Client
                </dt>
                <dd className="mt-2 text-graphite/85">
                  {clientName}
                  {illustrative && " (illustrative)"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Project
                </dt>
                <dd className="mt-2 text-graphite/85">{title}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Industry
                </dt>
                <dd className="mt-2 text-graphite/85">
                  {content?.industrySlug ? (
                    <Link
                      href={`/industries/${content.industrySlug}`}
                      className="text-signal underline-offset-4 hover:underline"
                    >
                      {industry}
                    </Link>
                  ) : (
                    industry
                  )}
                </dd>
              </div>
            </dl></Reveal>

            {/* Business problem */}
            <Reveal><div>
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                Business problem
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-graphite/80">{study.challenge}</p>
            </div></Reveal>

            {/* Solution */}
            <Reveal><div>
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                Solution
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-graphite/80">{study.solution}</p>
            </div></Reveal>

            {content && (
              <>
                {/* Architecture & approach */}
                <Reveal><div>
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Architecture &amp; approach
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {content.approach.map((item) => (
                      <li key={item} className="flex gap-3 text-graphite/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div></Reveal>

                {/* Technologies */}
                <Reveal><div>
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Technologies
                  </h2>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {content.techStack.map((group) => (
                      <div key={group.label}>
                        <h3 className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-graphite/65">
                          {group.label}
                        </h3>
                        <ul className="mt-2 space-y-1.5">
                          {group.items.map((item) => (
                            <li key={item} className="text-sm text-graphite/85">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div></Reveal>

                {/* Development process */}
                <Reveal><div>
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Development process
                  </h2>
                  <p className="mt-3 text-graphite/80">
                    Delivered with Devliora&rsquo;s standard cadence — scoping and a written
                    delivery shape, a fixed weekly demo, continuous delivery behind feature
                    flags, and a monthly review of scope, pace and cost. QA and security
                    checks run in CI on every change.
                  </p>
                </div></Reveal>

                {/* Challenges */}
                <Reveal><div>
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Challenges
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {content.challenges.map((item) => (
                      <li key={item} className="flex gap-3 text-graphite/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div></Reveal>
              </>
            )}

            {/* Results */}
            <Reveal><div>
              <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                Results
              </h2>
              {resultItems.length > 1 ? (
                <ul className="mt-4 space-y-3">
                  {resultItems.map((item) => (
                    <li key={item} className="flex gap-3 text-graphite/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-lg leading-relaxed text-graphite/80">{study.results}</p>
              )}
            </div></Reveal>

            {content && content.metrics.length > 0 && (
              <Reveal><div>
                <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Metrics
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {content.metrics.map((m) => (
                    <div
                      key={m}
                      className="rounded-xl border border-ink/10 p-4 text-sm text-graphite/85"
                    >
                      {m}
                    </div>
                  ))}
                </div>
                {illustrative && (
                  <p className="mt-3 text-xs text-graphite/65">
                    Figures are directional and representative of this class of engagement.
                  </p>
                )}
              </div></Reveal>
            )}

            {content && (
              <Reveal><div className="grid gap-10 border-t border-ink/10 pt-12 sm:grid-cols-2">
                <div>
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Related services
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {content.relatedServices.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          className="text-graphite/80 underline-offset-4 hover:text-signal hover:underline"
                        >
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Related technologies
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {content.relatedTechnologies.map((t) => (
                      <li key={t.href}>
                        <Link
                          href={t.href}
                          className="text-graphite/80 underline-offset-4 hover:text-signal hover:underline"
                        >
                          {t.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div></Reveal>
            )}
          </div>
        </section>

        {/* CTA */}
        <Reveal><section className="relative overflow-hidden bg-ink py-20 md:py-24">
          <div className="bg-grain absolute inset-0" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-semibold text-paper md:text-4xl">
              Have a problem that looks like this?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-wire">
              Tell us about it. We&rsquo;ll come back within two business days with a clear
              read on scope, approach, and timeline.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-sm bg-ember px-6 py-3.5 font-mono text-sm font-medium text-paper transition-colors hover:bg-ember/90"
              >
                Start a conversation
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center rounded-sm border border-wire/30 px-6 py-3.5 font-mono text-sm text-paper/80 transition-colors hover:border-wire/60 hover:text-paper"
              >
                All case studies
              </Link>
            </div>
          </div>
        </section></Reveal>
      </main>
      <Footer />
    </>
  );
}
