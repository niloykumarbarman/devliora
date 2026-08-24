import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchCaseStudyBySlug } from "@/lib/caseStudies";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const ILLUSTRATIVE_SUFFIX = " (Illustrative Example)";

function splitClientName(clientName: string): {
  name: string;
  isIllustrative: boolean;
} {
  if (clientName.endsWith(ILLUSTRATIVE_SUFFIX)) {
    return {
      name: clientName.slice(0, -ILLUSTRATIVE_SUFFIX.length),
      isIllustrative: true,
    };
  }
  return { name: clientName, isIllustrative: false };
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await fetchCaseStudyBySlug(slug);
  if (!study) {
    return buildMetadata({
      title: "Case Study | Devliora",
      description: "Case study details.",
      path: `/case-studies/${slug}`,
    });
  }
  return buildMetadata({
    title: `${study.title} | Devliora`,
    description: study.results.slice(0, 160),
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = await fetchCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const { name, isIllustrative } = splitClientName(study.clientName);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Case Studies", path: "/case-studies" },
    { name: study.title, path: `/case-studies/${study.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
                {study.industry} &mdash; {name}
              </p>
              {isIllustrative && (
                <span className="rounded-sm border border-ember/30 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ember">
                  Illustrative Example
                </span>
              )}
            </div>
            <h1 className="mt-4 max-w-3xl text-balance font-display text-3xl font-medium sm:text-5xl">
              {study.title}
            </h1>
          </div>
        </section>

        <section className="relative overflow-hidden bg-paper py-20 text-ink md:py-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Challenge
                </p>
                <p className="mt-3 text-sm leading-relaxed text-graphite/80">
                  {study.challenge}
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Solution
                </p>
                <p className="mt-3 text-sm leading-relaxed text-graphite/80">
                  {study.solution}
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  Results
                </p>
                <p className="mt-3 text-sm leading-relaxed text-graphite/80">
                  {study.results}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
