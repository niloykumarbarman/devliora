import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchServiceBySlug } from "@/lib/services";
import { fetchHero, resolveImageUrl } from "@/lib/hero";
import { fetchCaseStudies } from "@/lib/caseStudies";
import { buildMetadata } from "@/lib/seo";
import ServiceTabs, { type ServiceTab } from "@/components/sections/ServiceTabs";

async function safeFetchCaseStudies() {
  try {
    return await fetchCaseStudies();
  } catch {
    return [];
  }
}

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
      cards: [
        {
          title: "Custom Web Application Development",
          body: "Bespoke web apps built from the ground up around your actual workflows, not forced into an off-the-shelf template.",
        },
        {
          title: "Platform-Based Web Customization",
          body: "Built on proven frameworks and reusable components, so you get a reliable product without paying to reinvent the basics.",
        },
        {
          title: "Legacy Web Application Modernization",
          body: "Careful, incremental migration of aging web systems onto modern, maintainable architecture — without disrupting the business that depends on them.",
        },
      ],
      roadmap: {
        tagline: "Crafting web experiences that are fast, secure, and built to grow with your business.",
        steps: [
          {
            title: "Development",
            body: "We build web applications of varying complexity, helping teams streamline internal operations, strengthen business transactions, and digitize customer-facing services.",
          },
          {
            title: "Integration",
            body: "We connect your web application with the rest of your stack — internal systems, third-party APIs, and enterprise tools — through secure, well-documented integration points.",
          },
          {
            title: "Migration",
            body: "When it's time to move a web application to a new host, cloud provider, or on-premise environment, we plan the migration to avoid downtime, data loss, and the usual surprises.",
          },
          {
            title: "Testing",
            body: "We run structured testing across the application before every release.",
            bullets: [
              "Functional testing",
              "Performance testing",
              "Cross-browser compatibility testing",
              "Usability testing",
              "Automated regression testing",
            ],
          },
          {
            title: "Security",
            body: "We build with security in mind from the start — encryption, access controls, and hardening against common and emerging web threats.",
          },
          {
            title: "Modernization",
            body: "We refactor and modernize the parts of a legacy web application that are holding the business back, reducing maintenance cost and improving reliability.",
          },
        ],
      },
      scope: {
        intro: "We cover every stage of web application development with a balance of precision and creativity. Here's an overview of what our web development services include.",
        items: [
          {
            title: "Conceptualization & Ideation",
            body: "We work with you to shape and refine the idea behind your web application, scoping the project around real business goals and constraints before a line of code is written. Every concept is grounded in what your users and your team actually need.",
          },
          {
            title: "Architecture & Design",
            body: "We design a scalable, well-structured architecture that forms the backbone of your application, chosen for the access patterns and load it will actually see — not a one-size-fits-all default.",
          },
          {
            title: "Development & Customization",
            body: "Our engineers build the custom features your business actually needs, rather than bending a generic template to fit. Every layer is written for correctness and long-term maintainability.",
          },
          {
            title: "Integration & Automation",
            body: "We connect your application with the third-party services and internal systems it depends on, and automate the workflows that would otherwise be manual and error-prone.",
          },
          {
            title: "Testing & Optimization",
            body: "We test thoroughly for correctness and performance across the application, and optimize it so it stays fast and reliable as usage and complexity grow.",
          },
          {
            title: "Launch & Beyond",
            body: "We handle deployment carefully and provide ongoing support after launch, so the application keeps running reliably as your needs and traffic change over time.",
          },
        ],
      },
    },
    {
      label: "Mobile",
      heading: "Mobile Application Development",
      body: "Native and cross-platform mobile apps for iOS and Android, built around real user workflows. We handle everything from initial architecture through app store release and post-launch support.",
      cards: [
        {
          title: "Custom Mobile Application Development",
          body: "Bespoke iOS and Android apps built from the ground up around your actual product requirements.",
        },
        {
          title: "Platform-Based Mobile Customization",
          body: "Built on proven frameworks and reusable components to ship a dependable mobile product without starting from zero.",
        },
        {
          title: "Legacy Mobile Application Redesign",
          body: "Refreshing aging mobile apps with modern interfaces, updated code, and improved performance and stability.",
        },
      ],
      roadmap: {
        tagline: "Building secure, feature-rich mobile experiences that move your business forward.",
        steps: [
          {
            title: "Development",
            body: "We develop mobile applications of varying complexity to help teams streamline internal operations, strengthen business transactions, and digitize customer-facing services.",
          },
          {
            title: "Integration",
            body: "We integrate your mobile application with other software in your enterprise ecosystem or third-party tools, with secure connections and reliable data exchange.",
          },
          {
            title: "Migration",
            body: "We can move a mobile app's backend to a new cloud or on-premise environment, planning around common migration risks like downtime and data loss.",
          },
          {
            title: "Testing",
            body: "We perform comprehensive testing to catch the bugs, defects, and weaknesses that undermine an app's operation and user experience.",
            bullets: [
              "Functional testing",
              "Performance testing",
              "Device & OS compatibility testing",
              "Usability testing",
              "Test automation",
            ],
          },
          {
            title: "Security",
            body: "We advise on making mobile applications resilient against common and emerging security threats, with encryption, secure storage, and access controls.",
          },
          {
            title: "Modernization",
            body: "We improve the outdated or underperforming parts of a legacy mobile app, reducing usability issues and long-term cost of ownership.",
          },
        ],
      },
      scope: {
        intro: "We cover every stage of mobile application development with a balance of precision and creativity. Here's an overview of what our mobile development services include.",
        items: [
          {
            title: "Conceptualization & Ideation",
            body: "We work with you to shape and refine the idea behind your mobile app, scoping the project around real user needs and business goals before a line of code is written.",
          },
          {
            title: "Architecture & Design",
            body: "We design a scalable architecture for your mobile app, chosen for the platform, offline behavior, and data patterns it will actually need to handle.",
          },
          {
            title: "Development & Customization",
            body: "Our engineers build the custom mobile features your product actually needs — native or cross-platform, depending on what fits the requirements best.",
          },
          {
            title: "Integration & Automation",
            body: "We connect your mobile app with backend services, third-party APIs, and internal systems, automating the workflows that would otherwise be manual.",
          },
          {
            title: "Testing & Optimization",
            body: "We test across devices, OS versions, and network conditions, and optimize the app so it stays fast, stable, and responsive as it scales.",
          },
          {
            title: "Launch & Beyond",
            body: "We handle app store submission and release, then provide ongoing support after launch so the app keeps running reliably as your needs evolve.",
          },
        ],
      },
    },
    {
      label: "Enterprise",
      heading: "Enterprise System Integration",
      body: "Enterprise systems designed to integrate cleanly with what you already run — connecting existing tools, data, and processes instead of forcing a rebuild. We focus on architecture that holds up as the organization scales.",
      cards: [
        {
          title: "Custom Enterprise System Development",
          body: "Enterprise software built around your organization's real processes, not a generic template.",
        },
        {
          title: "Platform Integration & Customization",
          body: "Connecting and customizing the enterprise platforms and tools you already run, instead of forcing a rebuild.",
        },
        {
          title: "Legacy System Modernization",
          body: "Migrating aging enterprise systems onto modern, maintainable architecture without disrupting business continuity.",
        },
      ],
      roadmap: {
        tagline: "Building enterprise systems that are secure, integrated, and built to scale with your organization.",
        steps: [
          {
            title: "Development",
            body: "We build enterprise systems of varying complexity, tailored to how your organization actually operates rather than a generic off-the-shelf process.",
          },
          {
            title: "Integration",
            body: "We integrate enterprise systems with the tools, data sources, and third-party platforms your teams already depend on, with secure and reliable connections.",
          },
          {
            title: "Migration",
            body: "We move enterprise applications between environments — on-premise, cloud, or hybrid — with a migration plan that accounts for uptime and data integrity.",
          },
          {
            title: "Testing",
            body: "We test enterprise systems thoroughly before rollout, across functionality, load, and the workflows real users depend on.",
            bullets: [
              "Functional testing",
              "Load & performance testing",
              "Integration testing",
              "User acceptance testing",
              "Regression testing",
            ],
          },
          {
            title: "Security",
            body: "We apply enterprise-grade security practices — access management, encryption, and audit trails — appropriate to the systems and data involved.",
          },
          {
            title: "Modernization",
            body: "We modernize legacy enterprise systems in place, reducing technical debt and total cost of ownership without disrupting the business.",
          },
        ],
      },
      scope: {
        intro: "We cover every stage of enterprise system development with a balance of precision and creativity. Here's an overview of what our enterprise development services include.",
        items: [
          {
            title: "Conceptualization & Ideation",
            body: "We work with you to shape the scope of your enterprise system around real organizational needs, before committing to an architecture or a build.",
          },
          {
            title: "Architecture & Design",
            body: "We design architecture that holds up as the organization scales, chosen for the workflows, data volume, and integrations it actually needs to support.",
          },
          {
            title: "Development & Customization",
            body: "Our engineers build the custom workflows your organization actually needs, rather than forcing your processes into an off-the-shelf product.",
          },
          {
            title: "Integration & Automation",
            body: "We connect with the enterprise tools and data sources you already run, and automate the workflows that would otherwise depend on manual handoffs.",
          },
          {
            title: "Testing & Optimization",
            body: "We test thoroughly across the workflows real users depend on, and optimize the system so it stays reliable as data volume and usage grow.",
          },
          {
            title: "Launch & Beyond",
            body: "We handle rollout carefully and provide ongoing support afterward, so the system keeps running reliably as your organization's needs evolve.",
          },
        ],
      },
    },
  ],
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, hero, caseStudies] = await Promise.all([
    fetchServiceBySlug(slug),
    fetchHero(),
    safeFetchCaseStudies(),
  ]);

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
          <ServiceTabs tabs={tabs} heroImageUrl={hero?.backgroundImageUrl} />
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

        {/* Case studies, pulled live from the site's real case-studies data */}
        {caseStudies.length > 0 && (
          <section className="relative overflow-hidden border-t border-paper/10 bg-graphite py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">Case studies</p>
              <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Real results, real impact
              </h2>
              <p className="mt-4 max-w-xl text-paper/60">
                A look at the challenges we&apos;ve taken on and the outcomes they led to.
              </p>

              <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {caseStudies.slice(0, 4).map((study) => (
                  <Link
                    key={study.id}
                    href={`/case-studies/${study.slug}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-ink"
                  >
                    {study.coverImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveImageUrl(study.coverImageUrl)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-ink/90 p-4">
                      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ember">
                        &middot; {study.industry}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-paper/80">
                        {study.results}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
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
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">Delivery framework</p>
              <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold md:text-4xl">
                From code to launch
              </h2>
              <p className="mt-4 max-w-xl text-paper/60">
                A consistent process from the first commit to production, and every
                release after.
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
