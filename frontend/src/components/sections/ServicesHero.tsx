"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { serviceHref, STATIC_SERVICE_LINKS } from "@/lib/services";

export default function ServicesHero() {
  const shouldReduceMotion = useReducedMotion();
  const [heroImageUrl, setHeroImageUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((data) => {
      if (!cancelled && data?.servicesImageUrl) {
        setHeroImageUrl(resolveImageUrl(data.servicesImageUrl));
      }
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
    </>
  );
}
