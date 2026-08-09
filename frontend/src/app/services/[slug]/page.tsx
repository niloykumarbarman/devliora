import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchServiceBySlug } from "@/lib/services";
import { fetchHero, resolveImageUrl } from "@/lib/hero";
import { buildMetadata } from "@/lib/seo";
import ServiceTabs, { type ServiceTab } from "@/components/sections/ServiceTabs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) {
    return buildMetadata({
      title: "Service | Devliora",
      description: "Service details.",
      path: `/services/${slug}`,
    });
  }
  return buildMetadata({
    title: `${service.title} | Devliora`,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
  });
}

const gridOverlayStyle = {
  backgroundImage:
    "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
};

// Secondary checkpoint shown under each roadmap step's dotted drop-line.
// Only defined where it lines up 1:1 with a service's real includes[] —
// everything else falls back to the single-tier line (see ServiceDetailPage).
const ROADMAP_CHECKPOINTS: Record<string, string[]> = {
  "software-engineering": [
    "Requirements Review",
    "UX/UI Testing",
    "Integration Testing",
    "Contract Validation",
    "Regression Testing",
    "Release Sign-off",
  ],
};

// Platform breakdown shown as a tab switcher under the hero. Only defined
// where we have real, distinct capabilities to describe per tab — every
// other service falls back to a single general overview section instead.
const SERVICE_TABS: Record<string, ServiceTab[]> = {
  "software-engineering": [
    {
      label: "Web",
      heading: "Web Application Development",
      body: "We design and build custom web applications from the ground up, matched to your actual workflows rather than a generic template. From architecture through deployment, every layer is built for correctness, maintainability, and long-term stability.",
    },
    {
      label: "Mobile",
      heading: "Mobile Application Development",
      body: "Native and cross-platform mobile apps for iOS and Android, built around real user workflows. We handle everything from initial architecture through app store release and post-launch support.",
    },
    {
      label: "Enterprise",
      heading: "Enterprise System Integration",
      body: "Enterprise systems designed to integrate cleanly with what you already run — connecting existing tools, data, and processes instead of forcing a rebuild. We focus on architecture that holds up as the organization scales.",
    },
  ],
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, hero] = await Promise.all([fetchServiceBySlug(slug), fetchHero()]);

  if (!service) {
    notFound();
  }

  const rawCheckpoints = ROADMAP_CHECKPOINTS[service.slug];
  const checkpoints =
    rawCheckpoints && rawCheckpoints.length === service.includes.length ? rawCheckpoints : null;
  const stepCount = service.includes.length;
  const tabs = SERVICE_TABS[service.slug];

  return (
    <>
      <Navbar />
      <main className="bg-ink text-paper">
        {/* Hero: full-bleed background image with the service title */}
        <section className="relative h-[380px] overflow-hidden sm:h-[440px] md:h-[480px]">
          {hero?.backgroundImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageUrl(hero.backgroundImageUrl)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-ink/70" />
          <div className="relative flex h-full items-center justify-center px-6">
            <h1 className="text-balance text-center font-display text-4xl font-extrabold leading-tight text-paper sm:text-6xl md:text-7xl">
              {service.title}
            </h1>
          </div>
        </section>

        {/* Breadcrumb bar */}
        <section className="border-t border-paper/10 py-6">
          <div className="mx-auto max-w-5xl px-6">
            <nav className="flex flex-wrap items-center gap-2 font-mono text-sm text-paper/50">
              <Link href="/" className="transition-colors hover:text-paper">
                Home
              </Link>
              <span>/</span>
              <Link href="/services" className="transition-colors hover:text-paper">
                Services
              </Link>
              <span>/</span>
              <span className="text-ember">{service.title}</span>
            </nav>
          </div>
        </section>

        {tabs ? (
          <ServiceTabs tabs={tabs} />
        ) : (
          /* Fallback overview for services without a tab breakdown */
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <div className="flex items-center gap-4">
                {service.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveImageUrl(service.iconUrl)}
                    alt=""
                    className="h-8 w-8 shrink-0 object-contain"
                  />
                ) : (
                  <Layers className="h-8 w-8 shrink-0 text-ember" strokeWidth={1.75} />
                )}
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">Overview</p>
              </div>
              <p className="mt-5 max-w-2xl text-lg text-paper/70">{service.shortDescription}</p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/70">
                {service.fullDescription}
              </p>
            </div>
          </section>
        )}

        {/* Roadmap, built from the service's own includes[] */}
        {service.includes.length > 0 && (
          <section className="relative overflow-hidden border-t border-paper/10 py-24 md:py-32">
            <div
              className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-60"
              style={gridOverlayStyle}
            />
            <div className="relative mx-auto max-w-6xl px-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">Our approach</p>
              <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold md:text-4xl">
                Full-cycle {service.title.toLowerCase()} roadmap
              </h2>
              <p className="mt-4 max-w-xl text-paper/60">
                From the first architecture decision to launch and post-launch support —
                here is exactly how we get there.
              </p>

              {/* Desktop: delivery-framework timeline (single line, labels above, optional checkpoint drop-line below) */}
              <div className="relative mt-28 hidden md:block">
                {/* dotted stubs extending past the first/last node */}
                <div
                  className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-paper/30"
                  style={{ left: 0, width: `${50 / stepCount}%` }}
                />
                <div
                  className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-paper/30"
                  style={{ right: 0, width: `${50 / stepCount}%` }}
                />
                {/* solid line spanning from the first node's center to the last */}
                <div
                  className="absolute top-1/2 h-px -translate-y-1/2 bg-paper/30"
                  style={{ left: `${50 / stepCount}%`, right: `${50 / stepCount}%` }}
                />

                <div
                  className="relative grid"
                  style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}
                >
                  {service.includes.map((item, i) => (
                    <div key={item} className="flex flex-col items-center">
                      <p className="max-w-[9.5rem] text-center text-sm font-semibold leading-snug text-paper">
                        {item}
                      </p>
                      <span className="mt-4 h-3.5 w-3.5 shrink-0 rounded-full bg-ember ring-4 ring-ink" />
                      {checkpoints && (
                        <>
                          <span className="mt-3 h-8 w-px border-l border-dashed border-paper/30" />
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ember bg-ink" />
                          <p className="mt-3 max-w-[8rem] text-center text-xs text-paper/50">
                            {checkpoints[i]}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: vertical timeline */}
              <div className="relative mt-14 space-y-8 border-l border-paper/15 pl-8 md:hidden">
                {service.includes.map((item, i) => (
                  <div key={item} className="relative">
                    <span className="absolute -left-[2.05rem] top-1 h-3 w-3 rounded-full bg-ember ring-4 ring-ink" />
                    <p className="text-sm font-semibold leading-snug text-paper">{item}</p>
                    {checkpoints && (
                      <p className="mt-1.5 font-mono text-xs uppercase tracking-wide text-paper/50">
                        {checkpoints[i]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-paper/10 py-24 md:py-32">
          <div
            className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-[0.14] blur-[120px]"
            style={{ backgroundColor: "var(--color-ember)" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[size:56px_56px]" style={gridOverlayStyle} />

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-balance text-3xl font-semibold leading-tight md:text-4xl">
              Ready to build something{" "}
              <span className="text-ember">reliable?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-paper/70">
              Describe what you are building and Niloy will scope it honestly.
            </p>

            <Link
              href="/contact"
              className="group mt-9 inline-flex items-center gap-2 rounded-lg bg-ember px-7 py-3.5 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-ember)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_-4px_var(--color-ember)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Discuss your project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div>
              <Link
                href="/services"
                className="group mt-10 inline-flex items-center gap-2 font-mono text-sm text-paper/60 transition-colors hover:text-paper"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                All services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
