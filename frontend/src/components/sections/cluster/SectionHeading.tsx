import Reveal from "@/components/Reveal";
import AccentedTitle from "./AccentedTitle";
import type { TitlePart } from "./clusterKit";

/**
 * The eyebrow + display heading + intro paragraph block that opens every
 * cluster section. `tone` flips the intro colour for dark bands.
 */
export default function SectionHeading({
  eyebrow,
  titleParts,
  intro,
  tone = "light",
  className = "max-w-2xl",
}: {
  eyebrow: string;
  titleParts: TitlePart[];
  intro?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
        {eyebrow}
      </p>
      <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        <AccentedTitle parts={titleParts} />
      </h2>
      {intro && (
        <p
          className={`mt-6 max-w-xl text-lg leading-relaxed ${
            tone === "dark" ? "text-paper/70" : "text-graphite/75"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
