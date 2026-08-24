"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type Project = {
  client: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
};

const PROJECTS: Project[] = [
  {
    client: "Meridian Logistics",
    category: "Platform Engineering",
    title: "Fleet operations platform rebuild",
    description:
      "Replaced a decade-old monolith with a service-based platform handling live dispatch, routing, and driver compliance for a national fleet.",
    tags: ["ASP.NET Core", "PostgreSQL", "Redis"],
  },
  {
    client: "Northbridge Health",
    category: "System Migration",
    title: "Patient records modernization",
    description:
      "Migrated a legacy on-premise records system to a cloud-native architecture with zero downtime and full audit compliance.",
    tags: ["Cloud Migration", "Audit Logging", "PostgreSQL"],
  },
  {
    client: "Verity Payments",
    category: "API Design & Integration",
    title: "Multi-bank settlement API",
    description:
      "Designed a contract-first settlement API connecting six banking partners, processing transactions with strict idempotency guarantees.",
    tags: ["REST API", "JWT Auth", "Rate Limiting"],
  },
  {
    client: "Devliora",
    category: "Internal Platform",
    title: "This website and its backend platform",
    description:
      "Designed and built end to end, with the same architecture patterns, security defaults, and caching strategy we apply for clients.",
    tags: ["Next.js", "ASP.NET Core", "Redis"],
  },
];

const AUTO_ROTATE_MS = 4500;

function ProjectCard({ project, isSignal }: { project: Project; isSignal: boolean }) {
  const accentText = isSignal ? "text-signal" : "text-ember";
  const accentBg = isSignal ? "bg-signal/10" : "bg-ember/10";
  const accentBorder = isSignal ? "border-signal/30" : "border-ember/30";
  const accentIconBg = isSignal ? "bg-signal/15" : "bg-ember/15";
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ${accentBg} ${accentText}`}
        >
          {project.category}
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accentIconBg} ${accentText}`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-3 font-mono text-xs text-graphite/50">
        {project.client}
      </p>

      <h3 className="mt-5 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
        {project.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-graphite/75">
        {project.description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className={`rounded-sm border ${accentBorder} ${accentBg} px-2.5 py-1 font-mono text-[0.6875rem] font-medium ${accentText}`}
          >
            {tag}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Portfolio() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = PROJECTS.length;

  const goTo = useCallback((index: number) => {
    setActive(((index % count) + count) % count);
  }, [count]);

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, count]);

  const handleManualNav = (fn: () => void) => {
    setPaused(true);
    fn();
  };

  return (
    <section id="work" className="relative overflow-hidden bg-paper text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] right-[-8%] h-[420px] w-[420px] rounded-full bg-signal/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Systems we have{" "}
            <span className="text-signal">put into production</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            A sample of the platforms, migrations, and integrations we
            have shipped for teams that could not afford downtime.
          </p>
        </motion.div>

        <div
          className="relative mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="relative flex h-[420px] items-center justify-center sm:h-[380px]"
            style={{ perspective: "1400px" }}
          >
            {PROJECTS.map((project, i) => {
              let offset = i - active;
              if (offset > count / 2) offset -= count;
              if (offset < -count / 2) offset += count;

              const isActive = offset === 0;
              const absOffset = Math.abs(offset);
              const visible = absOffset <= 1;
              const isSignal = i % 2 === 0;
              const activeBorder = isSignal ? "border-2 border-signal/60" : "border-2 border-ember/60";
              const activeShadow = isSignal
                ? "shadow-[0_20px_70px_-15px_rgba(47,92,255,0.35)]"
                : "shadow-[0_20px_70px_-15px_rgba(255,122,69,0.35)]";

              return (
                <motion.article
                  key={project.title}
                  animate={{
                    x: reduceMotion ? 0 : `${offset * 62}%`,
                    scale: isActive ? 1 : 0.82,
                    rotateY: reduceMotion ? 0 : offset * -28,
                    opacity: visible ? (isActive ? 1 : 0.45) : 0,
                    zIndex: 10 - absOffset,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className={`absolute w-[88%] max-w-md rounded-xl bg-paper p-8 sm:p-10 ${
                    isActive
                      ? `${activeBorder} ${activeShadow}`
                      : "border border-ink/10 shadow-[0_20px_60px_-20px_rgba(14,20,32,0.25)]"
                  }`}
                >
                  <ProjectCard project={project} isSignal={isSignal} />
                </motion.article>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => handleManualNav(goPrev)}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-wire text-ink transition-colors hover:border-signal hover:text-signal"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {PROJECTS.map((project, i) => (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => handleManualNav(() => goTo(i))}
                  aria-label={`Go to project ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === i ? "w-8 bg-signal" : "w-2 bg-ink/15 hover:bg-ink/30"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleManualNav(goNext)}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-wire text-ink transition-colors hover:border-signal hover:text-signal"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
