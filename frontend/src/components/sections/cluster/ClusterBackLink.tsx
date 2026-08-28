import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";

/**
 * Slim band placed just under a supporting page's hero, tying it back to
 * the pillar. Gives every topic page an explicit "this is part of a
 * larger practice" signal that the pillar's ClusterHub mirrors.
 */
export default function ClusterBackLink({
  label,
  href = "/custom-software-development",
}: {
  label: string;
  href?: string;
}) {
  return (
    <Reveal className="border-b border-wire/60 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <Link
          href={href}
          className="group inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-graphite/65 transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={2}
          />
          {label}
        </Link>
      </div>
    </Reveal>
  );
}
