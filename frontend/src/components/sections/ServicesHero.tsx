"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { serviceHref, STATIC_SERVICE_LINKS } from "@/lib/services";
import { API_BASE_URL } from "@/lib/apiConfig";

// Static two-column tech list per explicit request, matching the reference
// exactly. Double-check these against /admin/technologies before launch —
// a few (PHP, iOS/Android, Flutter, VR, SQL Server) aren't in the site's
// admin-managed Technologies list today, so confirm they're real
// capabilities before this goes out representing Devliora's stack.
const TECH_COLUMNS: string[][] = [
  [
    ".NET Development",
    "Java Development",
    "PHP Development",
    "Node.js Development",
    "Flutter Development",
    "Frontend Development",
    "SQL Server Development",
    "MySQL Development",
  ],
  [
    "AWS Development",
    "Azure Development",
    "iOS Development",
    "Android Development",
    "AI Development",
    "VR Development",
    "eCommerce",
    "Python",
  ],
];

type Testimonial = {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientPhotoUrl: string;
  quote: string;
};

// Same GET /api/testimonials?featured=true source the homepage
// Testimonials section uses — real, admin-entered client feedback.
async function fetchFeaturedTestimonial(): Promise<Testimonial | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials?featured=true`, { cache: "no-store" });
    if (!res.ok) return null;
    const items = (await res.json()) as Testimonial[];
    return items[0] ?? null;
  } catch {
    return null;
  }
}

export default function ServicesHero() {
  const shouldReduceMotion = useReducedMotion();
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((data) => {
      if (!cancelled && data?.servicesImageUrl) {
        setHeroImageUrl(resolveImageUrl(data.servicesImageUrl));
      }
    });
    fetchFeaturedTestimonial().then((data) => {
      if (!cancelled) setTestimonial(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: i * 0.08 },
        };

  return (
    <>
      {/* Full-bleed page-title banner, same pattern every other detail
          page on the site uses (Portfolio, individual services, etc.) —
          the reference has this above its "Engineering Services" content
          block, not just the breadcrumb. */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="relative flex h-[280px] items-center justify-center sm:h-[340px] md:h-[380px]">
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px]"
              style={{ backgroundColor: "var(--color-signal)" }}
            />
          )}
          <div className="absolute inset-0 bg-ink/70" />
          <h1 className="relative text-balance text-center font-display text-5xl font-semibold leading-tight md:text-7xl">
            Services
          </h1>
        </div>

        <div className="relative border-t border-paper/10 bg-ink">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-6 font-mono text-sm">
            <Link href="/" className="text-paper/80 transition-colors hover:text-paper">
              Home
            </Link>
            <span className="text-paper/30">/</span>
            <span className="text-ember">Services</span>
          </div>
        </div>
      </section>

      {/* "Engineering Services" content block: heading, tagline,
          description, the static two-column service list, and the same
          hero image again on the right (reused, not a second field). */}
      <section className="bg-grain relative overflow-hidden bg-ink py-16 text-paper md:py-20">
        <div
          className="pointer-events-none absolute -top-40 left-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px]"
          style={{ backgroundColor: "var(--color-signal)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <motion.h2
                {...fadeUp(1)}
                className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl"
              >
                Engineering Services
              </motion.h2>

              <motion.p
                {...fadeUp(2)}
                className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60"
              >
                Crafting reliable software, one line of code at a time.
              </motion.p>

              <motion.p {...fadeUp(3)} className="mt-5 max-w-md text-paper/70">
                We turn your ideas into dependable software. Our engineers and
                specialists work closely with you to deliver solutions built
                around your actual requirements — not a generic package.
                Whether it&apos;s a customer-facing web app or a complex
                enterprise system, we&apos;ve got you covered.
              </motion.p>

              <motion.div {...fadeUp(4)} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {STATIC_SERVICE_LINKS.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {column.map((service) => (
                      <Link
                        key={service.slug}
                        href={serviceHref(service.slug)}
                        className="font-medium text-ember transition-colors hover:text-paper"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              {...fadeUp(2)}
              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-graphite md:aspect-square"
            >
              {heroImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* "Ready to turn ideas into reality?" banner. Full-bleed on both
          sides (no max-w wrapper) so the two-tone split doesn't leave a
          mismatched color strip on wide screens — same fix already applied
          to the DaaS page's CTA banner. */}
      <section className="border-t border-paper/10 bg-signal">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
            <p className="max-w-lg text-lg font-medium leading-snug text-paper">
              Ready to turn ideas into reality?
            </p>
          </div>
          <Link
            href="/contact"
            className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* "Advanced Technologies": heading/tagline/description + the site's
          own real Technologies list (admin-managed, not copied from any
          reference) on the right, and on the left the same hero image
          again plus a real featured client testimonial underneath. */}
      <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-graphite">
                {heroImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>

              {testimonial && (
                <div className="mt-6 rounded-lg border border-ember/20 bg-ember/[0.07] p-6">
                  <h3 className="font-display text-lg font-semibold text-paper">Customer Voice</h3>
                  <p className="mt-3 text-paper/80">{testimonial.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    {testimonial.clientPhotoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveImageUrl(testimonial.clientPhotoUrl)}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-paper">{testimonial.clientName}</p>
                      <p className="text-xs text-paper/60">
                        {testimonial.clientTitle}
                        {testimonial.clientCompany && (
                          <>
                            , <span className="text-ember">{testimonial.clientCompany}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
                Advanced Technologies
              </h2>
              <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
                Cutting-Edge Tech, Timeless Quality
              </p>
              <p className="mt-5 max-w-md text-paper/70">
                Dive into the future with Devliora&apos;s top-notch technology
                stack. We stay ahead of the curve, embracing the latest
                advancements to ensure your project is built on a foundation
                of innovation and reliability — from AI and machine learning
                to cloud computing and beyond.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {TECH_COLUMNS.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {column.map((tech) => (
                      <span key={tech} className="font-medium text-ember">
                        {tech}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
