import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function ServicesCTA() {
  return (
    <section className="bg-grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px] animate-ambient-drift"
        style={{ backgroundColor: "var(--color-ember)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold leading-tight md:text-4xl">
          Not sure which service{" "}
          <span className="text-signal">fits your project?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-paper/70">
          Most engagements combine two or three of these disciplines. Describe
          what you are building and Niloy will scope it honestly.
        </p>

        <Link
          href="/contact"
          className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-signal px-7 py-3.5 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_-4px_var(--color-signal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          Discuss your project
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </section>
  );
}
