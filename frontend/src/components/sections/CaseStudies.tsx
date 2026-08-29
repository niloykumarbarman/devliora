import Link from "next/link";
import Reveal from "@/components/Reveal";
import { fetchCaseStudies } from "@/lib/caseStudies";

// Homepage "case studies" section — admin-managed (/admin/case-studies),
// served from the API. Renders nothing until at least one published case
// study exists.
export default async function CaseStudies() {
  const studies = (await fetchCaseStudies()).slice(0, 3);
  if (studies.length === 0) return null;

  return (
    <section
      id="case-studies"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-8%] right-[-10%] h-[440px] w-[440px] rounded-full bg-signal/15 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-15%] left-[-10%] h-[380px] w-[380px] rounded-full bg-ember/10 blur-[130px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Problems that{" "}
            <span className="text-signal">could not stay unsolved</span>.
          </h2>
          <p className="mt-4 text-wire">
            The constraint, the system we built, and the outcome.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-px overflow-hidden rounded-sm border border-paper/10 bg-paper/10">
          {studies.map((study, i) => (
            <Reveal
              key={study.id}
              as="article"
              delay={i * 0.1}
              className="bg-ink p-8 md:p-12"
            >
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-paper/55">
                {[study.industry, study.clientName].filter(Boolean).join(" — ")}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="transition-colors hover:text-signal"
                >
                  {study.title}
                </Link>
              </h3>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Challenge
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">
                    {study.challenge}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Solution
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">
                    {study.solution}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                    Results
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">
                    {study.results}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-signal transition-colors hover:text-paper"
          >
            View all case studies →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
