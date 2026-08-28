import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, KeyRound, GaugeCircle, ScrollText, Lock, GitPullRequestArrow, ArrowRight } from "lucide-react";
import { buildMetadata, webPageJsonLd, siteConfig } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Security",
  description:
    "How Devliora secures client software and this site — auth, rate limiting, audit logging, secret handling, CI checks — and how to report a vulnerability.",
  path: "/security",
});

const pageLd = webPageJsonLd({
  path: "/security",
  name: "Security at Devliora",
  description:
    "Security practices Devliora applies to client software and this site, and how to report a vulnerability.",
});

// Every item below reflects a practice that is actually in place on this
// site's own stack (and is applied the same way on client work). Nothing
// here is a certification or an audit claim — see the closing note.
const IN_EVERY_BUILD = [
  {
    icon: Lock,
    title: "Encrypted transport",
    body: "All traffic is served over HTTPS with certificates issued and renewed automatically. There is no plaintext HTTP path to the application.",
  },
  {
    icon: KeyRound,
    title: "Authentication that expires",
    body: "Access tokens are short-lived. Refresh tokens rotate on every use and can be revoked; rotating the signing key invalidates every token that was issued before it. Passwords are stored hashed, never in a recoverable form.",
  },
  {
    icon: GaugeCircle,
    title: "Rate limiting on the front door",
    body: "Authentication and other sensitive endpoints are rate-limited per client, so a credential-stuffing or brute-force attempt is throttled rather than left to run.",
  },
  {
    icon: ScrollText,
    title: "Audit logging",
    body: "Every state-changing action is recorded — who did what, and when — so an unexpected change can be traced rather than guessed at.",
  },
  {
    icon: ShieldCheck,
    title: "Validated input, least-privilege access",
    body: "Requests are validated against explicit rules before they reach business logic, and each part of the system runs with the narrowest set of permissions it needs.",
  },
  {
    icon: GitPullRequestArrow,
    title: "Checks before code ships",
    body: "Changes go through review on a protected branch, CI runs on every commit, and deploys happen from that branch only — not from a laptop.",
  },
];

const IN_HOW_WE_OPERATE = [
  "Secrets — signing keys, database credentials, API tokens — are never committed to the repository. They are supplied through environment variables or a secrets manager, and the application refuses to start with a missing or weak signing key rather than falling back to an insecure default.",
  "Dependencies are kept current, and known-vulnerability scanning runs as part of the build pipeline rather than on an ad-hoc basis.",
  "Access to production systems is limited to the people who need it, and removed when they no longer do.",
  "During an engagement, clients get visibility into the real commit history and build results, so security-relevant changes are inspectable rather than described.",
];

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={pageLd} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className="relative overflow-hidden bg-ink py-28 text-paper md:py-36">
          <div className="bg-grain absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />
          <div className="relative mx-auto max-w-3xl px-6">
            <h1 className="hero-h1-rise text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
              Security is a <span className="text-signal">property of the build</span>, not a checklist at the end.
            </h1>
            <p
              className="hero-fade-rise mt-6 max-w-2xl text-lg text-wire"
              style={{ animationDelay: "0.16s" }}
            >
              The practices below are in place on this website and the API
              behind it, and they are the baseline we apply to client
              software. This page describes what that means concretely, and
              how to report a problem if you find one.
            </p>
          </div>
        </section>

        <section className="relative bg-paper py-20 text-ink md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal as="h2" className="font-display text-2xl font-semibold text-graphite sm:text-3xl">
              In every build
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {IN_EVERY_BUILD.map((item) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} className="rounded-lg border border-wire bg-paper p-6">
                    <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                    <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-graphite">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-graphite/70">{item.body}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative border-t border-wire bg-paper py-20 text-ink md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal as="h2" className="font-display text-2xl font-semibold text-graphite sm:text-3xl">
              In how we operate
            </Reveal>
            <Reveal delay={0.08} className="mt-8 space-y-5">
              {IN_HOW_WE_OPERATE.map((line) => (
                <p key={line} className="flex gap-3 text-graphite/75">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  <span className="leading-relaxed">{line}</span>
                </p>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="relative border-t border-wire bg-paper py-20 text-ink md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal as="h2" className="font-display text-2xl font-semibold text-graphite sm:text-3xl">
              Reporting a vulnerability
            </Reveal>
            <Reveal delay={0.08} className="mt-6 space-y-4 text-graphite/75">
              <p className="leading-relaxed">
                If you believe you have found a security issue in this site,
                its API, or software Devliora has delivered, email{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}?subject=Security%20report`}
                  className="font-medium text-signal underline underline-offset-2 hover:text-ink"
                >
                  {siteConfig.contactEmail}
                </a>{" "}
                with &ldquo;Security report&rdquo; in the subject. Include the
                affected URL or component, the steps to reproduce, and what an
                attacker could do with it.
              </p>
              <p className="leading-relaxed">
                We aim to acknowledge a report within two business days and
                will keep you updated while we investigate. Please give us a
                reasonable window to fix an issue before disclosing it
                publicly, and avoid accessing or changing data that is not
                yours while testing.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative border-t border-wire bg-paper py-16 text-ink md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal className="rounded-lg border border-wire bg-graphite/[0.03] p-6">
              <p className="text-sm leading-relaxed text-graphite/70">
                <span className="font-semibold text-graphite">A note on certifications.</span>{" "}
                Devliora does not currently hold a formal security
                certification such as SOC&nbsp;2 or ISO&nbsp;27001. What is on
                this page is a description of practice, not an audited claim.
                If an engagement has a specific compliance requirement, tell
                us early and we will scope the work against it.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-wire bg-ink py-20 text-paper md:py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Reveal as="h2" className="text-balance font-display text-3xl font-semibold sm:text-4xl">
              Building something where this matters?
            </Reveal>
            <Reveal delay={0.08} className="mx-auto mt-4 max-w-xl text-wire">
              Tell us what you are working with and what it needs to hold up
              against. You will get an honest read on scope and approach.
            </Reveal>
            <Reveal delay={0.16} className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-signal px-7 py-3.5 font-mono text-sm font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-transform hover:-translate-y-0.5"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
