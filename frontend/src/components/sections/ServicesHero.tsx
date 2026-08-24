"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { serviceHref, STATIC_SERVICE_LINKS } from "@/lib/services";
import { SOLUTIONS } from "@/lib/solutions";
import { slugify } from "@/lib/slugify";
import { API_BASE_URL } from "@/lib/apiConfig";
import QualityManagement from "@/components/sections/QualityManagement";
import PricingModels from "@/components/sections/PricingModels";

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

// The reference's "Our talent pool" stats (90%/70%/35%, 20+ countries,
// Dhaka HQ) are specific numbers about that company's own team — not
// Devliora's. Per standing policy, kept as qualitative capability
// statements instead of invented percentages.
const TALENT_HIGHLIGHTS = [
  { title: "Formally trained", body: "Engineers with backgrounds in Computer Science, Software Engineering, or related fields." },
  { title: "Senior-led", body: "Every project pairs hands-on engineers with senior technical oversight." },
  { title: "Built for continuity", body: "We stay engaged well beyond launch, not just through delivery." },
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
  // Four independent, admin-editable images (Site Settings) — one per
  // image slot on this page, per explicit request (not a single reused
  // image anymore).
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [engineeringImageUrl, setEngineeringImageUrl] = useState("");
  const [techImageUrl, setTechImageUrl] = useState("");
  const [solutionsImageUrl, setSolutionsImageUrl] = useState("");
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((data) => {
      if (cancelled || !data) return;
      if (data.servicesBannerImageUrl) setBannerImageUrl(resolveImageUrl(data.servicesBannerImageUrl));
      if (data.servicesEngineeringImageUrl) setEngineeringImageUrl(resolveImageUrl(data.servicesEngineeringImageUrl));
      if (data.servicesTechImageUrl) setTechImageUrl(resolveImageUrl(data.servicesTechImageUrl));
      if (data.servicesSolutionsImageUrl) setSolutionsImageUrl(resolveImageUrl(data.servicesSolutionsImageUrl));
    });
    fetchFeaturedTestimonial().then((data) => {
      if (!cancelled) setTestimonial(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // whileInView (not animate) so sections below the fold reveal on scroll,
  // matching the rest of the site's convention (ClientSpotlight,
  // FeaturedWorkSplit, ServicesCTA, etc.) — with `animate`, everything on
  // this long page was fading in within ~1s of page load regardless of
  // scroll position, so content far down the page (Pricing models, Global
  // delivery, Tailored Solutions) was already fully visible before the
  // user ever scrolled to it.
  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
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
          {bannerImageUrl ? (
            <Image src={bannerImageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
          ) : (
            <div
              className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[120px] animate-ambient-drift"
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
          description, the static two-column service list, and its own
          admin-editable image (SiteSettings.ServicesEngineeringImageUrl)
          on the right. */}
      <section className="bg-grain relative overflow-hidden bg-ink py-16 text-paper md:py-20">
        <div
          className="pointer-events-none absolute -top-40 left-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px] animate-ambient-drift"
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
              {engineeringImageUrl && (
                <Image
                  src={engineeringImageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
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
            className="btn-3d flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* "Advanced Technologies": heading/tagline/description + the site's
          own real Technologies list (admin-managed, not copied from any
          reference) on the right, and on the left its own admin-editable
          image plus a real featured client testimonial underneath. */}
      <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-graphite">
                {techImageUrl && (
                  <Image
                    src={techImageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>

              {testimonial && (
                <div className="mt-6 rounded-lg border border-ember/20 bg-ember/[0.07] p-6">
                  <h3 className="font-display text-lg font-semibold text-paper">Customer Voice</h3>
                  <p className="mt-3 text-paper/80">{testimonial.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    {testimonial.clientPhotoUrl && (
                      <Image
                        src={resolveImageUrl(testimonial.clientPhotoUrl)}
                        alt=""
                        width={40}
                        height={40}
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

      {/* "Quality management" — extracted to a shared component now that
          the IT Consulting page reference needs the same heading and
          bullets. Devliora-specific paragraph passed in here; the
          reference names the source company directly, this one doesn't. */}
      <QualityManagement description="Devliora is a quality-driven software development company, committed to setting and maintaining high standards in engineering practices. We follow proven processes and comply with established quality and information security frameworks to ensure every solution is robust, secure, and built to last." />

      {/* "Want tech that's ahead of the game?" banner — solid single-tone
          split (unlike the earlier CTA, the reference has no dark overlay
          here), links through to /technologies. */}
      <section className="border-t border-paper/10 bg-signal">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
            <p className="max-w-lg text-lg font-medium leading-snug text-paper">
              Want tech that&apos;s ahead of the game?
            </p>
          </div>
          <Link
            href="/technologies"
            className="flex shrink-0 items-center justify-center gap-2 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/10 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
          >
            Explore Our Tech!
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* "Pricing models" — extracted to a shared component now that the
          Staff Augmentation page reference needs the identical section. */}
      <PricingModels />

      {/* "Global delivery" + "Our talent pool": the reference names the
          source company, a country count, and a headquarters city, plus
          three specific team-composition percentages — none of that is
          Devliora's real data, so this is generic delivery-approach copy
          and qualitative (non-numeric) team highlights instead. */}
      <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <motion.div {...fadeUp(0)}>
              <h2 className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
                Global delivery
              </h2>
              <p className="mt-5 max-w-md text-paper/70">
                Devliora delivers software engineering and consulting
                services built around each client&apos;s actual working
                setup — remote-first, timezone-aware, and structured for
                clear, direct communication throughout. We combine careful
                engineering practice with modern tooling to create
                reliable, maintainable solutions.
              </p>
            </motion.div>

            <motion.div {...fadeUp(1)}>
              <h2 className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
                Our talent pool
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {TALENT_HIGHLIGHTS.map((item) => (
                  <div key={item.title} className="border-t-2 border-ember pt-4">
                    <p className="font-display text-xl font-bold leading-tight text-paper">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-paper/60">{item.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* "Tailored Solutions": heading/tagline/description and the link
          list are static; the image on the right is its own independent
          admin-editable field (SiteSettings.ServicesSolutionsImageUrl).
          Link list is the site's own real Solutions offerings, not the
          reference's. */}
      <section className="bg-grain relative overflow-hidden bg-ink py-16 text-paper md:py-20">
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <motion.h2
                {...fadeUp(0)}
                className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl"
              >
                Tailored Solutions
              </motion.h2>

              <motion.p
                {...fadeUp(1)}
                className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60"
              >
                Tailored Solutions for Tomorrow&apos;s Challenges
              </motion.p>

              <motion.p {...fadeUp(2)} className="mt-5 max-w-md text-paper/70">
                We believe in solutions that fit like a glove. Our bespoke
                approach means we listen, understand, and deliver precisely
                what your business needs to thrive in a competitive
                landscape. No cookie-cutter templates here — just
                personalized strategies that solve your unique problems.
              </motion.p>

              <motion.div {...fadeUp(3)} className="mt-8 flex flex-col gap-3">
                {SOLUTIONS.map((solution) => (
                  <Link
                    key={solution.id}
                    href={`/solutions#${slugify(solution.title)}`}
                    className="w-fit font-medium text-ember transition-colors hover:text-paper"
                  >
                    {solution.title}
                  </Link>
                ))}
              </motion.div>
            </div>

            <motion.div
              {...fadeUp(2)}
              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-graphite md:aspect-square"
            >
              {solutionsImageUrl && (
                <Image
                  src={solutionsImageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
