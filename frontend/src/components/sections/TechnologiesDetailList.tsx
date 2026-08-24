"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TechBrandIcon from "@/components/TechBrandIcon";
import { getTechIcon } from "@/lib/techIcons";
import { fetchTechnologies, TechnologyDto } from "@/lib/technologies";
import { fetchSiteSettings, SiteSettingsDto } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/technologyCategories";

// kaz.com.bd/technologies interspersed a CTA banner between category
// sections rather than only at the very end (confirmed by screenshot: one
// after Backend, a differently-worded one after Frontend). Only these two
// exact texts are confirmed, so they alternate between every section
// rather than inventing more variants — the true final CTA after the last
// category is TechnologiesCTA.tsx (page-level, unchanged).
const INTERSPERSED_CTAS = [
  { text: "Ready to turn ideas into reality?", buttonText: "Get Started Now!" },
  { text: "Want tech that's ahead of the game?", buttonText: "Explore Our Tech!" },
];

// Which SiteSettings field holds each category section's image, matching
// kaz.com.bd/technologies' own per-section photo beside the tech list.
const CATEGORY_IMAGE_KEY: Record<number, keyof SiteSettingsDto> = {
  0: "technologiesBackendImageUrl",
  1: "technologiesFrontendImageUrl",
  2: "technologiesCloudImageUrl",
  3: "technologiesDatabaseImageUrl",
  4: "technologiesDevOpsImageUrl",
  5: "technologiesAiMlImageUrl",
  6: "technologiesMobileImageUrl",
};

// Per-category heading/tagline/paragraph, matching kaz.com.bd/technologies'
// stacked sections — one full-width section per category instead of the
// old single bento-grid-of-all-categories layout. Backend & Frontend's
// copy is confirmed verbatim from reference screenshots (tagline and
// heading style, at least — see headingAccent below). Backend's paragraph
// happens to already name Devliora's real Python/.NET/Java/Node.js stack
// so it's reused verbatim too; Frontend's reference paragraph names
// Angular and Vue.js, which Devliora doesn't actually offer (real stack is
// React/Next.js/TypeScript/JavaScript), so that paragraph is adapted to
// Devliora's real stack instead of copied verbatim. The other 4
// categories aren't in the screenshots shown, so their copy is original —
// same style, written for Devliora's own real stack in each, not copied
// from an unseen reference.
const CATEGORY_COPY: Record<
  number,
  { heading: string; headingAccent?: string; tagline: string; paragraph: string }
> = {
  0: {
    heading: "Backend engineering, built for scale",
    tagline: "Reliable, scalable, innovative backend solutions.",
    paragraph:
      "From Java and .NET to Python and Node.js, backend systems are designed to support the core of modern applications. The focus is on scalable, high-performance architectures using microservices, modern databases, and real-time APIs. Whether built with Java Spring or Node.js, solutions emphasize reliability, security, and long-term maintainability.",
  },
  1: {
    // Reference renders "Frontend" in its accent color and "Excellence"
    // in the base text color — a two-tone heading, unlike Backend's plain
    // one — confirmed by screenshot.
    heading: "Excellence",
    headingAccent: "Frontend",
    tagline: "Unlock faster, smarter, more efficient front-end solutions.",
    paragraph:
      "We build responsive, well-structured applications using modern front-end technologies. From React and Next.js to TypeScript and modern JavaScript, the focus is on performance and maintainability. Whether using React Query for data fetching or server-side rendering for speed, solutions are designed to scale and adapt over time.",
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
  // Heading, tagline, and paragraph confirmed verbatim from the reference
  // screenshot ("Modern mobile experiences").
  6: {
    heading: "Modern mobile experiences",
    tagline: "Scalable, high-performance mobile apps built for real users.",
    paragraph:
      "Our mobile development expertise covers native and cross-platform technologies that support performance, usability, and long-term maintainability. From native Android and iOS applications to flexible cross-platform frameworks, we build mobile solutions that align with product goals, user expectations, and evolving business needs.",
  },
};

export default function TechnologiesDetailList() {
  const reducedMotion = useReducedMotion();
  const [technologies, setTechnologies] = useState<TechnologyDto[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsDto | null>(null);

  useEffect(() => {
    fetchTechnologies().then(setTechnologies);
    fetchSiteSettings().then(setSiteSettings);
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
      {groups.map((group, i) => {
        const imageUrl = siteSettings?.[CATEGORY_IMAGE_KEY[group.categoryId]];
        return (
        <Fragment key={group.categoryId}>
        <section
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
              {group.copy.headingAccent && <span className="text-ember">{group.copy.headingAccent} </span>}
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

            <div
              className={`mt-12 grid grid-cols-1 gap-10 md:items-start ${
                imageUrl ? "md:grid-cols-[minmax(0,1fr)_2fr]" : ""
              }`}
            >
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-graphite md:max-w-sm"
                >
                  <Image src={resolveImageUrl(imageUrl)} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
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
          </div>
        </section>

        {i < groups.length - 1 && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  {INTERSPERSED_CTAS[i % INTERSPERSED_CTAS.length].text}
                </p>
              </div>
              <Link
                href="/contact"
                className="btn-3d flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                {INTERSPERSED_CTAS[i % INTERSPERSED_CTAS.length].buttonText}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}
        </Fragment>
        );
      })}
    </>
  );
}
