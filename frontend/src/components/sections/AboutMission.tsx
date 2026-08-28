import Reveal from "@/components/Reveal";

export default function AboutMission() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 text-ink md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal
          as="h2"
          delay={0.08}
          className="mt-4 text-balance text-3xl font-semibold leading-tight text-graphite md:text-4xl"
        >
          Most agencies sell a team.{" "}
          <span className="text-signal">Devliora sells a standard.</span>
        </Reveal>
        <Reveal delay={0.16} className="mt-6 space-y-4 text-lg text-graphite/70">
          <p>
            Devliora started from a simple frustration: enterprise clients
            are routinely sold &ldquo;best practices&rdquo; that never make it
            past the sales deck &mdash; rate-limited auth that isn&apos;t
            actually rate-limited, audit logs that don&apos;t audit anything,
            caching layers that were never cache-invalidated correctly.
          </p>
          <p>
            Every claim on this site is backed by a running system: this
            website and its API, which use the same refresh-token rotation
            with revocation, per-IP rate limiting, Redis cache-aside, and
            reviewable commit history that client engagements do.
          </p>
          <p>
            The goal isn&apos;t to look like a large agency. It&apos;s to
            build software the way a large agency should, without the
            overhead &mdash; and to be honest about what that does and
            doesn&apos;t mean for you as a client.
          </p>
        </Reveal>
        <Reveal delay={0.24} className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-wire bg-paper p-6">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
              Our Mission
            </span>
            <p className="mt-3 text-base leading-relaxed text-graphite/80">
              To build enterprise software the way it&apos;s specified, not
              the way it&apos;s marketed &mdash; security that&apos;s
              actually enforced, performance that holds under real load, and
              a commit history a client can read for themselves.
            </p>
          </div>
          <div className="rounded-lg border border-wire bg-paper p-6">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-ember">
              Our Vision
            </span>
            <p className="mt-3 text-base leading-relaxed text-graphite/80">
              A standard where no enterprise client ever has to wonder if
              their vendor actually did the work they paid for.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
