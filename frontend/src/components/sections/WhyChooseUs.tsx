import { Fingerprint, Lock, TimerReset, GitBranch } from "lucide-react";
import Reveal from "@/components/Reveal";

type Reason = {
  icon: typeof Fingerprint;
  title: string;
  description: string;
  proof: string;
};

const REASONS: Reason[] = [
  {
    icon: Fingerprint,
    title: "We own the whole stack",
    description:
      "One team designs the database, the API, and the interface, so decisions made on day one don't become someone else's problem on day ninety.",
    proof: "Clean architecture, end to end",
  },
  {
    icon: Lock,
    title: "Security is a default, not a feature",
    description:
      "Authentication, rate limiting, and audit trails ship with every system we build, not added after a client asks for them.",
    proof: "Every mutation is logged and traceable",
  },
  {
    icon: TimerReset,
    title: "We design for the 2am incident",
    description:
      "Caching, token rotation, and failure handling are built assuming something will eventually go wrong, so recovery is fast when it does.",
    proof: "15-minute token expiry, automatic rotation",
  },
  {
    icon: GitBranch,
    title: "Every change is reviewable",
    description:
      "Small, verifiable commits and CI checks mean you can see exactly what changed and why, at any point in the project's history.",
    proof: "Full commit history, no black boxes",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] right-[-12%] h-[460px] w-[460px] rounded-full bg-ember/15 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-15%] left-[-10%] h-[380px] w-[380px] rounded-full bg-signal/15 blur-[130px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Built by people who{" "}
            <span className="text-signal">get paged when it breaks</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            We are engineers first. That shapes every decision we make,
            long before a client ever sees the interface.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <Reveal
                key={reason.title}
                delay={i * 0.08}
                className="hover-lift border-t border-paper/10 pt-7"
              >
                <Icon className="h-6 w-6 text-signal" strokeWidth={1.75} />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/65">
                  {reason.description}
                </p>
                <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ember">
                  {reason.proof}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
