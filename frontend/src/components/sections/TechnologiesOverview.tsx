import Reveal from "@/components/Reveal";

// Matches kaz.com.bd/technologies' "Technologies we work with" wrap-up
// section (heading, tagline, and paragraph confirmed verbatim — all
// generic, non-attributable copy). The language grid underneath is NOT
// copied from the reference: KAZ's own list includes several languages
// (PHP, Go, C, Ruby, Rust, R, C++) that aren't part of Devliora's real
// stack anywhere else on this site, so reusing it verbatim would be a
// fabricated capability claim. This list instead unions the real
// languages already visible across Devliora's own category sections
// above (Java, Python, TypeScript, JavaScript, C# via .NET, Swift/
// Kotlin/Objective-C via the Mobile Apps section, Dart via Flutter) —
// 9 items, so a 3-column grid instead of the reference's 4 fits evenly
// with no empty trailing cells.
const LANGUAGES = [
  "Java",
  "Python",
  "TypeScript",
  "JavaScript",
  "C#",
  "Swift",
  "Kotlin",
  "Objective-C",
  "Dart",
];

export default function TechnologiesOverview() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 text-paper sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-start">
        <div>
          <Reveal
            as="h2"
            className="text-balance font-display text-3xl font-medium sm:text-4xl"
          >
            Technologies we work with
          </Reveal>

          <Reveal
            as="p"
            delay={0.08}
            className="mt-5 inline-block max-w-md border-b border-signal/40 pb-3 italic text-wire"
          >
            Chosen for support, hire-ability, and how well your team can maintain them after handover.
          </Reveal>
        </div>

        <Reveal as="p" delay={0.1} className="text-wire md:pt-2">
          We keep the stack small and proven. Most projects sit on the same core &mdash; .NET,
          Node.js or Python on the server, React and Next.js on the front end, PostgreSQL and
          Redis for data &mdash; and we reach for something outside it only when the problem
          genuinely calls for it.
        </Reveal>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
        {LANGUAGES.map((lang, i) => (
          <Reveal
            key={lang}
            as="p"
            delay={i * 0.04}
            className="font-display text-lg font-medium text-paper"
          >
            {lang}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
