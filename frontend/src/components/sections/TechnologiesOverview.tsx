"use client";

import { motion, useReducedMotion } from "framer-motion";

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
// with no empty trailing cells. The "Quality Management" heading the
// reference shows directly above a similar list didn't actually
// correspond to this content (looked like an unrelated section bleeding
// into the same screenshot), so it's dropped rather than reproduced.
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
  const reducedMotion = useReducedMotion();

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
          <motion.h2
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-balance font-display text-3xl font-medium sm:text-4xl"
          >
            Technologies we work with
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-5 inline-block max-w-md border-b border-signal/40 pb-3 italic text-wire"
          >
            Driven by a mix of cutting-edge tech, endless innovation, and our in-house R&amp;D.
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-wire md:pt-2"
        >
          We leverage a wide range of technologies to build powerful, customized solutions
          tailored to your needs. Our expert team uses cutting-edge tools and methodologies to
          stay ahead in the tech landscape, delivering exceptional results and future-ready
          software.
        </motion.p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
        {LANGUAGES.map((lang, i) => (
          <motion.p
            key={lang}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="font-display text-lg font-medium text-paper"
          >
            {lang}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
