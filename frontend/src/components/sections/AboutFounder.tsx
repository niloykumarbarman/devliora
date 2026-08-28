import Link from "next/link";
import { ArrowRight, GitBranch, ShieldCheck, Boxes } from "lucide-react";
import Reveal from "@/components/Reveal";

// Everything stated here is verifiable from the site itself or the
// company README: the founder's name and role, that Devliora is
// founder-led with teams in Bangladesh and Australia, and that this site
// and its API are Devliora's own build (also shown on /portfolio). No
// invented years of experience, degrees, employers, or awards.
const ACCOUNTABLE_FOR = [
  {
    icon: Boxes,
    title: "Architecture on every engagement",
    body: "The data model, service boundaries, and API contracts on client work are reviewed and signed off by the founder, not delegated and hoped for.",
  },
  {
    icon: ShieldCheck,
    title: "The security defaults",
    body: "Short-lived access tokens, refresh-token rotation with revocation, per-IP rate limiting on auth, and audit logging on every mutation ship as the baseline — the same setup this site runs on.",
  },
  {
    icon: GitBranch,
    title: "How the work is shown",
    body: "Small, reviewable commits on a visible cadence, CI on every change, and client access to the real history and build results throughout.",
  },
];

export default function AboutFounder() {
  return (
    <section
      id="founder"
      className="relative scroll-mt-24 overflow-hidden border-t border-wire bg-paper py-24 text-ink md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
            Who runs it
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight text-graphite md:text-4xl">
            Niloy Kumar Barman
          </h2>
          <p className="mt-1 font-mono text-sm text-graphite/65">
            Founder &amp; Software Engineer
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-6 space-y-4 text-lg leading-relaxed text-graphite/75">
          <p>
            Devliora is founder-led. Niloy started it to work the way he
            thought enterprise software should be built &mdash; with security,
            performance, and transparency treated as requirements rather than
            things to discuss later &mdash; and without the layers of
            account management that put distance between a client and the
            people writing the code.
          </p>
          <p>
            He sets the engineering standards the company works to and stays
            hands-on with architecture across engagements, supported by
            delivery teams in Bangladesh and Australia. This website and the
            API behind it are Devliora&apos;s own build, end to end &mdash; a
            working reference for the practices described on this page rather
            than a claim about them.
          </p>
        </Reveal>

        <Reveal delay={0.16} className="mt-12 grid gap-6 sm:grid-cols-3">
          {ACCOUNTABLE_FOR.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-wire bg-paper p-5">
                <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-graphite">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite/70">
                  {item.body}
                </p>
              </div>
            );
          })}
        </Reveal>

        <Reveal delay={0.24} className="mt-10">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 font-mono text-sm font-semibold text-signal transition-colors hover:text-ink"
          >
            Talk to the person who would build it
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
