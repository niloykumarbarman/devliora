"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";

// Full-bleed dark "engineering" hero for /blog, structured like the
// reference (kaz.com.bd/blog): a backdrop behind a large left-aligned
// headline, with extra bottom padding so the post grid can overlap up
// into it (see BlogPostList's negative margin).
//
// Backdrop: an admin-uploaded image (Site Settings -> "Blog Page Hero
// Background") when set; otherwise the CSS code-screen drawn below — no
// image asset required.

const CODE_LINES = [
  "export async function build(spec: Spec) {",
  "  const plan = await architect(spec);",
  "  for (const svc of plan.services) {",
  "    await provision(svc, { region, replicas: 3 });",
  "    observe(svc).with(metrics, traces, logs);",
  "  }",
  "  return deploy(plan, { strategy: 'blue-green' });",
  "}",
  "",
  "// ship small, measure, iterate",
  "const rollout = pipeline()",
  "  .test().scan().canary(10)",
  "  .then(promote)",
  "  .catch(rollback);",
];

export default function BlogHero() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchSiteSettings().then((s) => {
      if (s?.blogHeroImageUrl) setImageUrl(s.blogHeroImageUrl);
    });
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-ink px-6 pt-28 pb-44 sm:pt-32 sm:pb-52">
      {imageUrl ? (
        <>
          <Image
            src={resolveImageUrl(imageUrl)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Keep the photo readable but let it show through: a light
              overall tint, a stronger left-side gradient only where the
              headline sits, and a bottom fade so the overlapping cards
              have a clean edge. */}
          <div className="absolute inset-0 bg-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        </>
      ) : (
        <>
          <div className="bg-grain pointer-events-none absolute inset-0" />

          <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-ember/10 blur-[120px] animate-ambient-drift" />

          <div
            className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
            }}
          />

          {/* Code-screen backdrop — right half, faded toward the headline. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 select-none overflow-hidden pl-10 pt-24 font-mono text-[13px] leading-6 text-wire/15 lg:block"
            style={{
              maskImage:
                "linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)",
            }}
          >
            {CODE_LINES.map((line, i) => (
              <div key={i} className="flex gap-4 whitespace-pre">
                <span className="text-wire/10">{String(i + 1).padStart(2, "0")}</span>
                <span>{line || " "}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="relative mx-auto max-w-6xl">
        <p className="hero-fade-rise font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
          Devliora Blog
        </p>

        <h1 className="hero-h1-rise mt-4 max-w-3xl text-balance font-display text-5xl font-medium leading-[1.05] text-paper sm:text-6xl md:text-7xl">
          Engineering <span className="text-signal">Insights</span>
        </h1>

        <p
          className="hero-fade-rise mt-6 max-w-2xl text-lg text-wire"
          style={{ animationDelay: "0.16s" }}
        >
          Architecture decisions, engineering practices, and lessons from building
          custom, enterprise and AI systems — written by the people who build them.
        </p>
      </div>
    </section>
  );
}
