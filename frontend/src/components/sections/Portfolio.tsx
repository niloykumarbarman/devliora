"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { fetchPortfolios } from "@/lib/portfolios";

type Project = {
  slug: string;
  client: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
};

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
      <p className="mt-3 font-mono text-xs text-graphite/65">
        {project.client}
      </p>

      <h3 className="mt-5 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
        <Link
          href={`/portfolio/${project.slug}`}
          className="line-clamp-2 hover:text-signal"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-graphite/75">
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
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPortfolios().then((items) => {
      if (cancelled) return;
      setProjects(
        items.map((p) => ({
          slug: p.slug,
          client: p.clientName || "Devliora",
          category: p.industry || "Case study",
          title: p.title,
          description: p.summary,
          tags: (p.techStack || "")
            .split(/,\s*/)
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 4),
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const count = projects.length;

  const goTo = useCallback((index: number) => {
    if (count === 0) return;
    setActive(((index % count) + count) % count);
  }, [count]);

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (paused || reduceMotion || count === 0) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, count]);

  const handleManualNav = (fn: () => void) => {
    setPaused(true);
    fn();
  };

  if (count === 0) return null;

  return (
    <section id="work" className="relative scroll-mt-24 overflow-hidden bg-paper text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] right-[-8%] h-[420px] w-[420px] rounded-full bg-signal/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Systems we have{" "}
            <span className="text-signal">put into production</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            A sample of the platforms, migrations, and integrations we
            have shipped for teams that could not afford downtime.
          </p>
        </Reveal>

        <div
          className="relative mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="relative flex h-[460px] items-center justify-center sm:h-[420px]"
            style={{ perspective: "1400px" }}
          >
            {projects.map((project, i) => {
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

              const translate = reduceMotion ? "0%" : `${offset * 62}%`;
              const rotate = reduceMotion ? 0 : offset * -28;
              return (
                <article
                  key={project.title}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `translateX(${translate}) scale(${isActive ? 1 : 0.82}) rotateY(${rotate}deg)`,
                    opacity: visible ? (isActive ? 1 : 0.45) : 0,
                    zIndex: 10 - absOffset,
                    pointerEvents: isActive ? "auto" : "none",
                    transition:
                      "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`absolute w-[88%] max-w-md rounded-xl bg-paper p-8 sm:p-10 ${
                    isActive
                      ? `${activeBorder} ${activeShadow}`
                      : "border border-ink/10 shadow-[0_20px_60px_-20px_rgba(14,20,32,0.25)]"
                  }`}
                >
                  <ProjectCard project={project} isSignal={isSignal} />
                </article>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => handleManualNav(goPrev)}
              aria-label="Previous project"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-wire text-ink transition-colors hover:border-signal hover:text-signal"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center">
              {projects.map((project, i) => (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => handleManualNav(() => goTo(i))}
                  aria-label={`Go to project ${i + 1}`}
                  aria-current={active === i}
                  className="flex h-11 w-8 items-center justify-center"
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      active === i ? "w-8 bg-signal" : "w-2 bg-ink/15"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleManualNav(goNext)}
              aria-label="Next project"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-wire text-ink transition-colors hover:border-signal hover:text-signal"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
