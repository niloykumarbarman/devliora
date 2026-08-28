import Reveal from "@/components/Reveal";

type CaseStudy = {
  client: string;
  industry: string;
  title: string;
  problem: string;
  approach: string;
  result: string;
  metric: string;
  metricLabel: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Meridian Logistics",
    industry: "Logistics & Fleet Management",
    title: "Rebuilding dispatch without a single missed delivery window",
    problem:
      "A 12-year-old monolith could not handle real-time dispatch at scale. Peak-hour requests were timing out, and every deploy risked downtime during active routes.",
    approach:
      "We decomposed the monolith into bounded services, introduced Redis-backed caching for hot routing data, and shipped changes behind feature flags with zero-downtime rollout.",
    result:
      "The new platform handled peak load with room to spare, and deploys became routine instead of risky.",
    metric: "99.95%",
    metricLabel: "Uptime after rollout",
  },
  {
    client: "Verity Payments",
    industry: "Financial Services",
    title: "Six banking partners, one settlement API, zero double charges",
    problem:
      "Manual reconciliation across six banking partners was error-prone and slow, and a prior integration attempt had caused duplicate settlements under load.",
    approach:
      "We designed a contract-first API with strict idempotency keys, per-partner rate limiting, and full audit logging on every settlement event.",
    result:
      "Reconciliation time dropped from days to minutes, with a complete audit trail for every transaction.",
    metric: "0",
    metricLabel: "Duplicate settlements since launch",
  },
];

export default function CaseStudies() {
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
            Two problems that{" "}
            <span className="text-signal">could not stay unsolved</span>.
          </h2>
          <p className="mt-4 text-wire">
            Illustrative examples — representative of the work we do, with
            composite client names while our first named case studies are
            prepared.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-px overflow-hidden rounded-sm border border-paper/10 bg-paper/10">
          {CASE_STUDIES.map((study, i) => (
            <Reveal
              key={study.client}
              as="article"
              delay={i * 0.1}
              className="grid gap-10 bg-ink p-8 md:grid-cols-[2fr_1fr] md:p-12"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-paper/55">
                    {study.industry} — {study.client}
                  </p>
                  <span className="rounded-sm border border-ember/30 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ember">
                    Illustrative
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                  {study.title}
                </h3>

                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                      Problem
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-paper/70">
                      {study.problem}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                      Approach
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-paper/70">
                      {study.approach}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                      Result
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-paper/70">
                      {study.result}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center border-t border-paper/10 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
                <p className="font-display text-5xl font-semibold tabular-nums text-signal">
                  {study.metric}
                </p>
                <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-paper/55">
                  {study.metricLabel}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
