"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TechBrandIcon from "@/components/TechBrandIcon";
import { getTechIcon } from "@/lib/techIcons";
import { fetchTechnologies, TechnologyDto } from "@/lib/technologies";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/technologyCategories";

// Per-category heading/tagline/paragraph, matching kaz.com.bd/technologies'
// stacked "[Category] engineering, built for X" sections — one full-width
// section per category instead of the old single bento-grid-of-all-
// categories layout. Backend & APIs' copy is confirmed verbatim from the
// reference screenshot (it's generic, non-attributable process
// description, and happens to already name Devliora's real Python/.NET/
// Java/Node.js stack). The other 5 categories aren't in the screenshots
// shown, so their copy is original — same style, written for Devliora's
// own real stack in each category, not copied from an unseen reference.
const CATEGORY_COPY: Record<number, { heading: string; tagline: string; paragraph: string }> = {
  0: {
    heading: "Backend engineering, built for scale",
    tagline: "Reliable, scalable, innovative backend solutions.",
    paragraph:
      "From Java and .NET to Python and Node.js, backend systems are designed to support the core of modern applications. The focus is on scalable, high-performance architectures using microservices, modern databases, and real-time APIs. Whether built with Java Spring or Node.js, solutions emphasize reliability, security, and long-term maintainability.",
  },
  1: {
    heading: "Frontend engineering, built for delight",
    tagline: "Fast, accessible, pixel-perfect interfaces.",
    paragraph:
      "From React and Next.js to TypeScript and modern JavaScript, frontend work is focused on interfaces that feel instant and hold up across devices. The emphasis is on component-driven architecture, strong typing, and accessibility from the first line of code — not bolted on afterward.",
  },
  2: {
    heading: "Cloud infrastructure, built to scale predictably",
    tagline: "Resilient systems that fail gracefully under load.",
    paragraph:
      "Across AWS, Azure, and GCP, infrastructure is containerized with Docker and orchestrated with Kubernetes for predictable scaling and fast recovery. The focus is on infrastructure-as-code, observability, and environments that behave the same in staging as they do in production.",
  },
  3: {
    heading: "Data layers, built for consistency and speed",
    tagline: "The right store for the access pattern that matters.",
    paragraph:
      "From PostgreSQL and MySQL to MongoDB and Redis, data layers are chosen based on how the data is actually read and written — not habit. The goal is consistency where it matters, caching where it counts, and schemas that stay maintainable as the system grows.",
  },
  4: {
    heading: "DevOps pipelines, built to ship the same way every time",
    tagline: "Automated, auditable, and boring in the best way.",
    paragraph:
      "GitHub Actions and Jenkins drive the pipelines, Terraform provisions the infrastructure behind them, and NGINX and Traefik handle routing at the edge. SonarQube, Snyk, and Trivy run automatically on every change, so quality and security checks aren't a separate step — they're part of the pipeline itself.",
  },
  5: {
    heading: "AI and ML, built for practical outcomes",
    tagline: "Real workflows, not novelty demos.",
    paragraph:
      "TensorFlow and PyTorch power model training, Scikit-learn and NumPy handle the statistical groundwork, and Pandas keeps the data pipeline clean end to end. Where an off-the-shelf model fits better than a custom one, OpenAI's APIs are used directly — the goal is the right tool for the workflow, not the most impressive one.",
  },
};

export default function TechnologiesDetailList() {
  const reducedMotion = useReducedMotion();
  const [technologies, setTechnologies] = useState<TechnologyDto[]>([]);

  useEffect(() => {
    fetchTechnologies().then(setTechnologies);
  }, []);

  useEffect(() => {
    if (technologies.length === 0) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [technologies]);

  const groups = CATEGORY_ORDER.map((categoryId) => {
    const items = technologies
      .filter((t) => t.category === categoryId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return { categoryId, meta: CATEGORY_META[categoryId], copy: CATEGORY_COPY[categoryId], items };
  }).filter((group) => group.items.length > 0);

  return (
    <>
      {groups.map((group, i) => (
        <section
          key={group.categoryId}
          id={group.meta.slug}
          className={`relative scroll-mt-24 overflow-hidden px-6 py-20 sm:py-24 ${
            i % 2 === 0 ? "bg-paper" : "bg-ink"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
            style={{
              backgroundImage:
                i % 2 === 0
                  ? "linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)"
                  : "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className={`max-w-2xl text-balance font-display text-3xl font-medium sm:text-4xl ${
                i % 2 === 0 ? "text-ink" : "text-paper"
              }`}
            >
              {group.copy.heading}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className={`mt-5 inline-block max-w-md border-b pb-3 italic ${
                i % 2 === 0 ? "border-signal/40 text-graphite/70" : "border-signal/40 text-wire"
              }`}
            >
              {group.copy.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className={`mt-5 max-w-2xl ${i % 2 === 0 ? "text-graphite" : "text-wire"}`}
            >
              {group.copy.paragraph}
            </motion.p>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
              {group.items.map((tool, idx) => {
                const hasIcon = !!getTechIcon(tool.name);
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    {hasIcon ? (
                      <TechBrandIcon name={tool.name} className="mt-1 h-7 w-7 shrink-0" />
                    ) : (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-signal" />
                    )}
                    <div>
                      <p className={`font-display text-lg font-semibold ${i % 2 === 0 ? "text-ink" : "text-paper"}`}>
                        {tool.displayName.trim()}
                      </p>
                      {tool.frameworks && (
                        <p className={`mt-1.5 text-sm leading-relaxed ${i % 2 === 0 ? "text-graphite/70" : "text-wire"}`}>
                          {tool.frameworks}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
