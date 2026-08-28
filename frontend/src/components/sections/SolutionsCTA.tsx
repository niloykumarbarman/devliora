import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function SolutionsCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div className="bg-grain absolute inset-0" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(61,90,254,0.25), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(243,242,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(243,242,237,0.04)_1px,transparent_1px)]" />

      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="mt-4 text-balance font-display text-3xl font-semibold text-paper md:text-4xl">
          Not sure which solution fits? <span className="text-signal">Let&apos;s talk it through.</span>
        </h2>
        <p className="mt-4 text-wire">
          A short conversation is usually enough to tell us where the real
          problem is, and what shape the right solution takes.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-8 py-3.5 font-medium text-paper shadow-[0_0_40px_-10px_rgba(61,90,254,0.7)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Start a conversation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}
