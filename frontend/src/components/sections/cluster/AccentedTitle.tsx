import type { TitlePart } from "./clusterKit";

/**
 * Renders a run of heading text with signal / ember accent spans. Used
 * inside the h1/h2 of every cluster section so the accent logic lives in
 * one place. Returns a fragment — the caller supplies the heading tag.
 */
export default function AccentedTitle({ parts }: { parts: TitlePart[] }) {
  return (
    <>
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.accent === "signal"
              ? "text-signal"
              : part.accent === "ember"
                ? "text-ember"
                : undefined
          }
        >
          {part.text}
        </span>
      ))}
    </>
  );
}
