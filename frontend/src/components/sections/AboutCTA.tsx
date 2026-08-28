import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 text-ink md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold leading-tight text-graphite md:text-4xl">
          Want to see how this{" "}
          <span className="text-signal">holds up under your project?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-graphite/70">
          Send a message and Niloy will personally reply within 48 hours with
          an honest read on scope and approach.
        </p>

        <Link
          href="/contact"
          className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-signal px-7 py-3.5 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_-4px_var(--color-signal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          Get in touch
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </section>
  );
}
