import { ShieldCheck, Clock, FileCheck, Handshake } from "lucide-react";
import Reveal from "@/components/Reveal";

type Guarantee = {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
};

const GUARANTEES: Guarantee[] = [
  {
    icon: ShieldCheck,
    title: "Security by default",
    description:
      "Every engagement includes hardened authentication, audit logging, and rate limiting from day one, not as a paid add-on.",
  },
  {
    icon: Clock,
    title: "48-hour response guarantee",
    description:
      "Every inquiry gets a substantive reply within two business days, with a clear next step, not an automated acknowledgment.",
  },
  {
    icon: FileCheck,
    title: "Full commit visibility",
    description:
      "You get access to the real commit history and CI results throughout the build, not a status update once a week.",
  },
  {
    icon: Handshake,
    title: "No lock-in by design",
    description:
      "You own the code, the infrastructure config, and the documentation. Leaving us should never be harder than staying.",
  },
];

export default function TrustGuarantees() {
  return (
    <section id="trust" className="relative scroll-mt-24 overflow-hidden bg-paper text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12%] left-[-8%] h-[400px] w-[400px] rounded-full bg-signal/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Commitments we{" "}
            <span className="text-signal">put in writing</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            We are early in building out public case studies from named
            clients. In the meantime, here is exactly what you can expect
            from working with us.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {GUARANTEES.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className="hover-pop relative z-0 bg-paper p-8"
              >
                <Icon className="h-6 w-6 text-signal" strokeWidth={1.75} />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite/75">
                  {item.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
