import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpDown, Clock, DollarSign, Layers, Star, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchServiceBySlug, serviceHref, STATIC_SERVICE_LINKS } from "@/lib/services";
import { fetchHero, resolveImageUrl } from "@/lib/hero";
import { fetchCaseStudies } from "@/lib/caseStudies";
import { fetchBlogPosts, type BlogPost } from "@/lib/blogPosts";
import { fetchTechnologies } from "@/lib/technologies";
import { API_BASE_URL } from "@/lib/apiConfig";
import { buildMetadata } from "@/lib/seo";
import { getTechIcon } from "@/lib/techIcons";
import TechBrandIcon from "@/components/TechBrandIcon";
import ServiceTabs, { type ServiceTab } from "@/components/sections/ServiceTabs";
import ClientSpotlight, { type ClientSpotlightItem } from "@/components/sections/ClientSpotlight";
import FeaturedWorkSplit from "@/components/sections/FeaturedWorkSplit";
import { fetchPortfolios, fetchPortfolioBySlug, type Portfolio } from "@/lib/portfolios";

async function safeFetchTechnologies() {
  try {
    return await fetchTechnologies();
  } catch {
    return [];
  }
}

async function safeFetchCaseStudies() {
  try {
    return await fetchCaseStudies();
  } catch {
    return [];
  }
}

// Real, admin-managed featured work — same data /portfolio pulls from.
// Fetched once and split across two differently-styled sections
// (ClientSpotlight, FeaturedWorkSplit) so they don't repeat each other.
async function safeFetchFeaturedPortfolios() {
  try {
    const all = await fetchPortfolios();
    return all.filter((p) => p.isFeatured);
  } catch {
    return [];
  }
}

// The list endpoint doesn't include metrics, so fetch full detail for
// just this small slice to pull each one's headline stat.
async function toClientSpotlightItems(portfolios: Portfolio[]): Promise<ClientSpotlightItem[]> {
  const details = await Promise.all(
    portfolios.map((p) => fetchPortfolioBySlug(p.slug).catch(() => null))
  );
  return portfolios.map((p, i) => {
    const detail = details[i];
    const topMetric = detail
      ? [...detail.metrics].sort((a, b) => a.displayOrder - b.displayOrder)[0]
      : undefined;
    return {
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      thumbnailUrl: p.thumbnailUrl,
      industry: p.industry,
      metricValue: topMetric?.value ?? null,
      metricLabel: topMetric?.label ?? null,
    };
  });
}

async function safeFetchBlogPosts() {
  try {
    return await fetchBlogPosts();
  } catch {
    return [];
  }
}

type Testimonial = {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientPhotoUrl: string;
  quote: string;
  rating: number;
};

// Same GET /api/testimonials?featured=true source the homepage
// Testimonials section uses (see components/sections/Testimonials.tsx) —
// real, admin-entered client feedback, not anything written for this page.
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

function formatPostDate(publishedAt: string | null): string {
  if (!publishedAt) return "";
  return new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

type BlogGridCell = { post: BlogPost; type: "image" | "label" };

function buildBlogGridCells(posts: BlogPost[]): BlogGridCell[] {
  const cells: BlogGridCell[] = [];
  for (let i = 0; i < posts.length; i += 2) {
    const rowPosts = posts.slice(i, i + 2);
    const rowIndex = i / 2;
    const order: BlogGridCell["type"][] = rowIndex % 2 === 0 ? ["image", "label"] : ["label", "image"];
    for (const post of rowPosts) {
      for (const type of order) {
        cells.push({ post, type });
      }
    }
  }
  return cells;
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

// Interpolates between the site's two accent colors for the Process
// timeline's dots/line, so a longer step sequence still reads as one
// smooth ember -> signal gradient rather than two flat halves.
function lerpAccentColor(t: number): string {
  const from = [255, 107, 53]; // ember
  const to = [61, 90, 254]; // signal
  const [r, g, b] = from.map((c, i) => Math.round(c + (to[i] - c) * t));
  return `rgb(${r}, ${g}, ${b})`;
}

// Renders a heading string, coloring any {curly brace} segment in the
// ember accent — e.g. "Crafting exceptional {UI/UX} across industries".
function renderHighlightedHeading(text: string) {
  return text.split(/(\{[^}]+\})/g).map((part, i) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={i} className="text-ember">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    )
  );
}

const gridOverlayStyle = {
  backgroundImage:
    "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
};

// Six evenly spaced points around the "Software essentials" decorative
// ring (top, then clockwise), as percentages of the ring's own box.
const RING_DOT_POSITIONS = [
  { top: "0%", left: "50%" },
  { top: "25%", left: "93.3%" },
  { top: "75%", left: "93.3%" },
  { top: "100%", left: "50%" },
  { top: "75%", left: "6.7%" },
  { top: "25%", left: "6.7%" },
];

// Generic, non-platform-specific capability copy — same content
// regardless of which tab (Web/Mobile/Enterprise) is active, since this
// section sits below the tabs as a shared block, not inside them.
const SOFTWARE_ESSENTIALS = [
  {
    title: "Lightning-Fast Performance",
    body: "Built with efficient code, smart caching, and optimized rendering, so your software stays fast even as usage grows.",
  },
  {
    title: "Rock-Solid Security",
    body: "Data protection is built in from the start — encrypted transfers, secure sessions, and hardening against common threats.",
  },
  {
    title: "Seamless Interoperability",
    body: "Your software connects cleanly with the third-party tools and internal systems it needs to talk to.",
  },
  {
    title: "Tailored Personalization",
    body: "We design experiences that adapt to each user, from smart defaults to targeted content.",
  },
  {
    title: "User-First Experience",
    body: "Our design process centers on the user, resulting in interfaces that are intuitive from first use to final release.",
  },
  {
    title: "Uncompromising Compliance",
    body: "We build with the regulatory and data-handling standards your industry requires, from day one.",
  },
];

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
      techIntro: {
        heading: "Powering your web vision with cutting-edge tech",
        tagline: "Bringing web ideas to life with next-gen tech.",
        body: "Our web application development approach focuses on thoughtful use of modern technologies to build reliable, well-designed applications. We combine practical engineering with considered design to address your specific requirements, using current tools and frameworks that support long-term maintainability — from front-end to back-end, we support the full journey from concept to launch.",
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
      techIntro: {
        heading: "Powering your mobile vision with cutting-edge tech",
        tagline: "Bringing mobile ideas to life with next-gen tech.",
        body: "Our mobile application development approach focuses on thoughtful use of modern technologies to build reliable, well-designed apps. Across iOS and Android, we combine practical engineering with considered design to address your specific requirements. Our team works with current tools and frameworks to ensure long-term maintainability — from native to hybrid and cross-platform, we support the full journey from concept to launch.",
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
      techIntro: {
        heading: "Powering your enterprise vision with cutting-edge tech",
        tagline: "Bringing enterprise ideas to life with next-gen tech.",
        body: "Our enterprise system development approach focuses on thoughtful use of modern technologies to build reliable, well-integrated systems. We combine practical engineering with considered design to address your organization's specific requirements, using current tools and frameworks that support long-term maintainability and scale.",
      },
    },
  ],
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, hero, caseStudies, blogPosts, testimonial, technologies, featuredPortfolios] =
    await Promise.all([
      fetchServiceBySlug(slug),
      fetchHero(),
      safeFetchCaseStudies(),
      safeFetchBlogPosts(),
      fetchFeaturedTestimonial(),
      safeFetchTechnologies(),
      safeFetchFeaturedPortfolios(),
    ]);
  const blogGridCells = buildBlogGridCells(blogPosts.slice(0, 4));

  if (!service) {
    notFound();
  }

  const clientSpotlight = await toClientSpotlightItems(featuredPortfolios.slice(0, 2));
  const featuredWorkSplit = featuredPortfolios.slice(2, 4);

  const rawCheckpoints = ROADMAP_CHECKPOINTS[service.slug];
  const checkpoints =
    rawCheckpoints && rawCheckpoints.length === service.includes.length ? rawCheckpoints : null;
  const stepCount = service.includes.length;
  const tabs = SERVICE_TABS[service.slug];

  return (
    <>
      <Navbar />
      <main className="bg-ink text-paper">
        {service.slug === "digital-design" ? (
          /* Split hero: breadcrumb + heading/tagline/description + static
             service list on the left, this service's own hero image (set
             per-service in the admin panel) on the right — requested
             specifically for this page, in addition to (not instead of)
             the same-styled hero on the /services listing page. */
          <section className="bg-grain relative overflow-hidden py-16 md:py-20">
            <div
              className="pointer-events-none absolute -top-40 left-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px]"
              style={{ backgroundColor: "var(--color-signal)" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-60" style={gridOverlayStyle} />

            <div className="relative mx-auto max-w-6xl px-6">
              <nav className="flex items-center gap-2 font-mono text-sm">
                <Link href="/" className="text-paper/80 transition-colors hover:text-paper">
                  Home
                </Link>
                <span className="text-paper/30">/</span>
                <Link href="/services" className="text-paper/80 transition-colors hover:text-paper">
                  Services
                </Link>
                <span className="text-paper/30">/</span>
                <span className="text-ember">{service.title}</span>
              </nav>

              <div className="mt-10 grid gap-12 md:grid-cols-2 md:items-center">
                <div>
                  <h1 className="text-balance font-display text-4xl font-semibold leading-tight md:text-5xl">
                    {service.title}
                  </h1>
                  <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
                    {service.shortDescription}
                  </p>
                  <p className="mt-5 max-w-md text-paper/70">{service.fullDescription}</p>

                  <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                    {STATIC_SERVICE_LINKS.map((column, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-2">
                        {column.map((link) => (
                          <Link
                            key={link.slug}
                            href={serviceHref(link.slug)}
                            className={
                              link.slug === service.slug
                                ? "font-medium text-paper"
                                : "font-medium text-ember transition-colors hover:text-paper"
                            }
                          >
                            {link.title}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-graphite md:aspect-square">
                  {(service.heroImageUrl || hero?.backgroundImageUrl) && (
                    <Image
                      src={resolveImageUrl(service.heroImageUrl || hero!.backgroundImageUrl)}
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Hero: full-bleed background image with the service title.
                Prefers this service's own hero image (set per-service in the
                admin panel); falls back to the site's shared hero background
                for services that haven't had one uploaded yet. */}
            <section className="relative h-[380px] overflow-hidden sm:h-[440px] md:h-[480px]">
              {(service.heroImageUrl || hero?.backgroundImageUrl) && (
                <Image
                  src={resolveImageUrl(service.heroImageUrl || hero!.backgroundImageUrl)}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
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
                <nav className="flex flex-wrap items-center gap-2 font-mono text-sm">
                  <Link href="/" className="text-paper/80 transition-colors hover:text-paper">
                    Home
                  </Link>
                  <span className="text-paper/30">/</span>
                  <Link href="/services" className="text-paper/80 transition-colors hover:text-paper">
                    Services
                  </Link>
                  <span className="text-paper/30">/</span>
                  <span className="text-ember">{service.title}</span>
                </nav>
              </div>
            </section>
          </>
        )}

        {tabs ? (
          <ServiceTabs tabs={tabs} heroImageUrl={hero?.backgroundImageUrl} technologies={technologies} />
        ) : (
          /* Fallback overview for services without a tab breakdown */
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <div className="flex items-center gap-4">
                {service.iconUrl ? (
                  <Image
                    src={resolveImageUrl(service.iconUrl)}
                    alt=""
                    width={32}
                    height={32}
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

        {/* At-a-glance highlights, admin-managed per service */}
        {service.highlights.length > 0 && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
                {service.title} at a glance
              </h2>
              <div className="mt-10 grid gap-x-12 gap-y-6 sm:grid-cols-2">
                {[...service.highlights]
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((highlight, i) => (
                    <p key={`${highlight.label}-${i}`} className="text-base leading-relaxed text-paper/80">
                      <span className="font-semibold text-ember">{highlight.label}: </span>
                      {highlight.description}
                    </p>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* "Tools we work with", admin-managed per service */}
        {service.toolNames.length > 0 && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
                {service.toolsHeading && (
                  <h2 className="text-balance font-display text-2xl font-semibold text-paper sm:text-3xl">
                    {service.toolsHeading}
                  </h2>
                )}
                {service.toolsDescription && (
                  <p className="text-base leading-relaxed text-paper/70">{service.toolsDescription}</p>
                )}
              </div>

              {service.toolsTagline && (
                <p className="mt-8 max-w-md border-b border-paper/15 pb-6 text-base italic leading-relaxed text-paper/60">
                  {service.toolsTagline}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6">
                {service.toolNames.map((name) => {
                  const icon = getTechIcon(name);
                  return (
                    <div
                      key={name}
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-paper/95 shadow-sm"
                    >
                      {icon ? (
                        <TechBrandIcon name={name} className="h-8 w-8" />
                      ) : (
                        <span className="px-1 text-center text-[0.65rem] font-semibold leading-tight text-ink/70">
                          {name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* "Meta" platform spotlight — Digital Marketing only, static.
            The quote is a real, publicly-cited Meta statistic (not a
            Devliora claim), so it's safe to state as-is. */}
        {service.slug === "digital-marketing" && (
          <section className="relative overflow-hidden border-t border-paper/10 bg-graphite/20 py-16 md:py-20">
            <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 px-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-balance text-xl font-semibold leading-snug text-ember sm:text-2xl">
                  &ldquo;More than 200 million businesses use our platforms to reach customers.&rdquo;
                </p>
                <p className="mt-4 max-w-lg text-paper/70">
                  Facebook and Instagram remain the world&apos;s most widely used channels for
                  digital marketing and brand visibility.
                </p>
                <p className="mt-4 font-display text-2xl font-bold text-paper">Meta</p>
              </div>
              <div className="flex shrink-0 gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-paper/95 shadow-sm">
                  <TechBrandIcon name="facebook" className="h-8 w-8" />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-paper/95 shadow-sm">
                  <TechBrandIcon name="instagram" className="h-8 w-8" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* "Key Digital Solutions" / Pricing / Timeline — Digital Marketing
            only, static, 3 columns matching the reference's layout.
            Reworked from the KAZ reference: its Pricing column quoted
            that company's own specific pricing ($180/person/year etc.),
            and its Limitations column was joke/humor copy about that
            plan — neither is Devliora's real offering. Pricing here
            reuses the same Time & Material / Dedicated Team engagement
            models already on the /services page; Limitations is
            replaced with a real Timeline column instead. */}
        {service.slug === "digital-marketing" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2 md:gap-16">
                <div>
                  <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                    Smart marketing, tailored to your goals.
                  </h2>
                  <p className="mt-4 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                    No cookie-cutter campaigns — strategy built around what actually moves your
                    business.
                  </p>
                </div>
                <p className="text-base leading-relaxed text-paper/70">
                  Devliora&apos;s marketing team builds and runs campaigns around your actual
                  goals — brand visibility, lead generation, or conversion — using the channels
                  and tools that make sense for your audience, not a generic playbook.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
                {[
                  {
                    icon: Zap,
                    label: "Key Digital Solutions",
                    items: [
                      "Social Media Management",
                      "Content Creation & Curation",
                      "SEO Optimization",
                      "Email Marketing Automation",
                      "Analytics & Reporting Dashboards",
                    ],
                  },
                  {
                    icon: DollarSign,
                    label: "Pricing",
                    items: [
                      "Time & Material — billed for actual hours and effort",
                      "Dedicated Team — an extension of your in-house team",
                      "Fixed-price for well-scoped campaigns",
                      "Monthly retainers for ongoing management",
                    ],
                  },
                  {
                    icon: Clock,
                    label: "Timeline",
                    items: [
                      "Onboarding & strategy: 1–2 weeks",
                      "Campaign setup & launch: 2–3 weeks",
                      "Ongoing optimization, reviewed monthly",
                      "Regular performance reporting",
                    ],
                  },
                ].map((col) => (
                  <div key={col.label}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember text-ink">
                        <col.icon className="h-5 w-5" strokeWidth={2.25} />
                      </span>
                      <p className="text-base font-bold uppercase tracking-wide text-paper">
                        {col.label}
                      </p>
                    </div>
                    <ul className="mt-6 flex flex-col gap-4">
                      {col.items.map((item) => (
                        <li key={item} className="text-base text-paper/80">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Boost Visibility" CTA banner — Digital Marketing only, static,
            same full-bleed calc()-padding pattern as the /services page
            CTA banners (no max-w wrapper, so the two-tone split doesn't
            leave a mismatched color strip on wide screens). */}
        {service.slug === "digital-marketing" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Elevate your online presence with targeted digital marketing strategies.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Boost Visibility
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Our digital marketing services" — Digital Marketing only,
            static. Generic process/capability copy, no fabricated
            claims, so kept close to the reference. Image reuses the
            same service.heroImageUrl already used elsewhere on this
            page rather than adding another dedicated field. */}
        {service.slug === "digital-marketing" && (
          <section className="relative overflow-hidden border-t border-paper/10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col">
                <div className="bg-graphite/40 px-6 py-14 sm:px-10 md:py-16">
                  <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                    Our digital marketing services
                  </h2>
                  <p className="mt-5 max-w-md text-paper/70">
                    We build digital marketing strategies that empower your business to drive
                    engagement, increase brand visibility, and maximize return on investment.
                  </p>
                </div>
                <div className="relative min-h-[260px] flex-1">
                  {(service.heroImageUrl || hero?.backgroundImageUrl) && (
                    <Image
                      src={resolveImageUrl(service.heroImageUrl || hero!.backgroundImageUrl)}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="bg-ink px-6 py-14 sm:px-10 md:py-16">
                <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-paper">
                  Services include:
                </p>
                <ul className="mt-8 flex flex-col gap-5">
                  {[
                    "Assess your business goals and market landscape",
                    "Define key performance indicators (KPIs) and metrics",
                    "Develop a comprehensive digital marketing plan",
                    "Implement and optimize marketing campaigns",
                    "Leverage data analytics for insights",
                    "Enhance brand presence across channels",
                    "Continuous monitoring and strategy adjustment",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-paper/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* "Drive Conversions" CTA banner — Digital Marketing only, static,
            same full-bleed pattern as the other CTA banners on this page. */}
        {service.slug === "digital-marketing" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Transform clicks into customers with our data-driven marketing solutions.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Drive Conversions
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Our digital marketing project roadmap" — Digital Marketing
            only, static. Visually distinct from the generic
            service.processSteps timeline above/below (which only shows a
            short label per step): this one needs a numbered index plus a
            full description under each step, so it's bespoke markup
            rather than an extension of that shared component. Reuses the
            same lerpAccentColor gradient dots for visual consistency. */}
        {service.slug === "digital-marketing" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                Our digital marketing project roadmap
              </h2>

              <div className="mt-20 flex flex-col gap-14">
                {(() => {
                  const roadmapSteps = [
                    {
                      title: "Strategy Development",
                      description:
                        "Defining goals, target audiences, and key performance indicators (KPIs) to guide your marketing efforts.",
                    },
                    {
                      title: "Creative Design",
                      description:
                        "Crafting engaging content and visual assets, including brand design, ad creatives, and campaign materials.",
                    },
                    {
                      title: "Campaign Execution",
                      description:
                        "Implementing and managing campaigns across various channels, including social media, email, and paid advertising.",
                    },
                    {
                      title: "Performance Analysis",
                      description:
                        "Monitoring campaign performance, analyzing data, and optimizing strategies based on insights and metrics.",
                    },
                    {
                      title: "Reporting",
                      description:
                        "Providing detailed reports on campaign results, ROI, and actionable recommendations for future improvements.",
                    },
                    {
                      title: "Continuous Improvement",
                      description:
                        "Ongoing refinement of marketing strategies, updating content, and adapting to new trends to ensure sustained success.",
                    },
                  ];

                  // Split into rows of up to 4 so the line/dot grid doesn't
                  // force excessive horizontal scrolling on desktop; each
                  // row only shows a dotted stub on the outer edges of the
                  // whole sequence (row 1's left edge, last row's right
                  // edge) so it still reads as one continuous timeline.
                  const rows: { title: string; description: string }[][] = [];
                  for (let i = 0; i < roadmapSteps.length; i += 4) {
                    rows.push(roadmapSteps.slice(i, i + 4));
                  }

                  return rows.map((rowSteps, rowIndex) => {
                    const leftDotted = rowIndex === 0;
                    const rightDotted = rowIndex === rows.length - 1;
                    const half = 50 / rowSteps.length;
                    const gradient = "linear-gradient(to right, #FF6B35, #3D5AFE)";

                    return (
                      <div key={rowIndex} className="overflow-x-auto pb-2">
                        <div
                          className="relative grid min-w-[720px]"
                          style={{
                            gridTemplateColumns: `repeat(${rowSteps.length}, minmax(140px, 1fr))`,
                            gridTemplateRows: "auto 1.5rem auto",
                          }}
                        >
                          <div
                            className="flex items-center self-center"
                            style={{ gridColumn: "1 / -1", gridRow: "2" }}
                          >
                            <div
                              className="h-px shrink-0"
                              style={
                                leftDotted
                                  ? { width: `${half}%`, borderTop: "1px dashed var(--color-paper)", opacity: 0.3 }
                                  : { width: `${half}%`, backgroundImage: gradient }
                              }
                            />
                            <div className="h-px flex-1" style={{ backgroundImage: gradient }} />
                            <div
                              className="h-px shrink-0"
                              style={
                                rightDotted
                                  ? { width: `${half}%`, borderTop: "1px dashed var(--color-paper)", opacity: 0.3 }
                                  : { width: `${half}%`, backgroundImage: gradient }
                              }
                            />
                          </div>

                          {rowSteps.map((step, i) => (
                            <div
                              key={`label-${step.title}`}
                              className="flex items-center gap-2 px-2 pb-6"
                              style={{ gridColumn: `${i + 1}`, gridRow: "1" }}
                            >
                              <span className="font-display text-2xl font-bold text-ember">
                                {rowIndex * 4 + i + 1}
                              </span>
                              <span className="font-semibold text-paper">{step.title}</span>
                            </div>
                          ))}

                          {rowSteps.map((step, i) => (
                            <div
                              key={`dot-${step.title}`}
                              className="flex justify-center"
                              style={{ gridColumn: `${i + 1}`, gridRow: "2" }}
                            >
                              <span
                                className="h-3 w-3 rounded-full ring-4 ring-ink"
                                style={{
                                  backgroundColor: lerpAccentColor(
                                    rowSteps.length > 1 ? i / (rowSteps.length - 1) : 0,
                                  ),
                                }}
                              />
                            </div>
                          ))}

                          {rowSteps.map((step, i) => (
                            <div
                              key={`desc-${step.title}`}
                              className="px-2 pt-6 text-sm leading-relaxed text-paper/70"
                              style={{ gridColumn: `${i + 1}`, gridRow: "3" }}
                            >
                              {step.description}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </section>
        )}

        {/* "Maximize Reach" CTA banner — Digital Marketing only, static,
            same full-bleed pattern as the other CTA banners on this page
            (kept on the site's own bg-signal accent rather than the
            reference's one-off magenta, for consistency with every
            other CTA banner already on this page). */}
        {service.slug === "digital-marketing" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Expand your audience and grow your brand through expert digital campaigns.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Maximize Reach
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* Featured work, moved up to sit right after the CTA above —
            matching the reference's page order exactly, per explicit
            request. Same real data/component as the shared render
            further down; that later one is skipped for this service
            (see the guard below) so it isn't shown twice on one page. */}
        {service.slug === "digital-marketing" && <FeaturedWorkSplit items={featuredWorkSplit} />}

        {/* "Process" horizontal timeline, admin-managed per service */}
        {service.processSteps.length > 0 && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="font-display text-3xl font-bold text-paper sm:text-4xl">Process</h2>

              <div className="mt-20 overflow-x-auto pb-2">
                <div
                  className="relative grid min-w-[640px]"
                  style={{
                    gridTemplateColumns: `repeat(${service.processSteps.length}, minmax(100px, 1fr))`,
                    gridTemplateRows: "1.5rem auto 1.5rem 2.5rem",
                  }}
                >
                  {service.processGroupCount > 0 && (
                    <div
                      className="relative rounded-lg border border-dashed border-paper/25"
                      style={{
                        gridColumn: `${service.processGroupStart + 1} / ${
                          service.processGroupStart + service.processGroupCount + 1
                        }`,
                        gridRow: "1 / 5",
                      }}
                    >
                      {service.processGroupLabel && (
                        <span className="absolute inset-x-0 bottom-2 text-center text-xs text-paper/50">
                          {service.processGroupLabel}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="self-center" style={{ gridColumn: "1 / -1", gridRow: "3" }}>
                    <div
                      className="h-px"
                      style={{
                        marginInline: `calc(50% / ${service.processSteps.length})`,
                        backgroundImage: "linear-gradient(to right, #FF6B35, #3D5AFE)",
                      }}
                    />
                  </div>

                  {service.processSteps.map((step, i) => (
                    <div
                      key={`label-${i}`}
                      className="flex items-end justify-center px-2 pb-4 text-center text-sm text-paper/80"
                      style={{ gridColumn: `${i + 1}`, gridRow: "2" }}
                    >
                      {step}
                    </div>
                  ))}

                  {service.processSteps.map((step, i) => (
                    <div
                      key={`dot-${i}`}
                      className="flex justify-center"
                      style={{ gridColumn: `${i + 1}`, gridRow: "3" }}
                    >
                      <span
                        className="h-3 w-3 rounded-full ring-4 ring-ink"
                        style={{
                          backgroundColor: lerpAccentColor(
                            service.processSteps.length > 1 ? i / (service.processSteps.length - 1) : 0
                          ),
                        }}
                        title={step}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Static inspirational quote — DaaS-specific, not admin-managed
            (a well-known, correctly-attributed public quote, unlike the
            Highlights numbers which needed to be Devliora's own claims). */}
        {service.slug === "digital-design" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-lg font-medium text-ember sm:text-xl">
                    &ldquo;Design is not just what it looks like and feels like. Design is how it
                    works.&rdquo;
                  </p>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/80">
                    Apple&apos;s design-led philosophy, championed by Steve Jobs, set the global
                    benchmark for UX and UI excellence.
                  </p>
                  <p className="mt-5 font-display text-xl font-bold text-paper">Apple</p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="h-20 w-20 shrink-0 text-paper/25 sm:h-24 sm:w-24"
                  fill="currentColor"
                  role="img"
                  aria-label="Apple"
                >
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
              </div>
            </div>
          </section>
        )}

        {/* Industries image-card grid, admin-managed per service */}
        {service.industryCards.length > 0 && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="max-w-2xl">
                {service.industriesHeading && (
                  <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                    {renderHighlightedHeading(service.industriesHeading)}
                  </h2>
                )}
                {service.industriesTagline && (
                  <p className="mt-6 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                    {service.industriesTagline}
                  </p>
                )}
                {service.industriesDescription && (
                  <p className="mt-6 text-base leading-relaxed text-paper/70">
                    {service.industriesDescription}
                  </p>
                )}
              </div>

              <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...service.industryCards]
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((card, i) => (
                    <div
                      key={`${card.title}-${i}`}
                      className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-graphite"
                    >
                      {card.imageUrl && (
                        <Image
                          src={resolveImageUrl(card.imageUrl)}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-ink/90 p-4">
                        <p className="text-sm font-semibold text-paper">
                          <span className="text-ember">&middot; </span>
                          {card.title}
                        </p>
                        {card.description && (
                          <p className="mt-1.5 text-xs leading-snug text-paper/70">{card.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Static "book a call" banner + collaboration diagram — DaaS-specific,
            not admin-managed, same as the Apple quote block above. */}
        {service.slug === "digital-design" && (
          <>
            <section className="border-t border-paper/10 bg-signal">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                  <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                    Book a call with our experts and start turning your ideas into reality.
                  </p>
                </div>
                <Link
                  href="/book-consultation"
                  className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
                >
                  Start Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </section>

            <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
              <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                  <div>
                    <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                      Why settle for less when you can design with the best?
                    </h2>
                    <p className="mt-6 inline-block border-b border-paper/25 pb-3 italic text-paper/60">
                      Direct collaboration, bespoke designs, seamless delivery.
                    </p>
                    <p className="mt-6 text-base leading-relaxed text-paper/70">
                      At Devliora, our in-house team of design professionals brings unmatched
                      creativity and precision to every project, delivering tailored solutions that
                      perfectly align with your vision. Skip the agency middleman and work directly
                      with our experts to achieve design excellence without compromise.
                    </p>
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-sm pl-9">
                      {/* Bypass connector: Devliora team can be reached
                          directly, without routing through "Digital agency" —
                          the visual argument for "skip the agency middleman". */}
                      <svg
                        className="pointer-events-none absolute inset-y-2 left-0 h-[calc(100%-1rem)] w-7 text-paper/30"
                        viewBox="0 0 28 100"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        <path
                          d="M20 97 V14 H6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d="M11 8 L5 14 L11 20"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div className="rounded-md bg-gradient-to-r from-[#8B5CF6] to-signal px-4 py-2.5 text-xs font-medium text-paper">
                        Customer&apos;s brand team
                      </div>
                      <div className="flex items-center gap-2 py-2 text-paper/30">
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                      <div className="w-fit rounded-md border border-signal px-4 py-2.5 text-xs font-medium text-paper">
                        Digital agency
                      </div>
                      <div className="flex items-center gap-2 py-2 text-paper/30">
                        <ArrowUpDown className="h-4 w-4" />
                      </div>

                      <div className="rounded-lg border border-dashed border-paper/25 p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-paper/50">
                          Devliora team
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {["Design", "PM", "BA", "QA"].map((role) => (
                            <span
                              key={role}
                              className="rounded border border-paper/25 px-3 py-2 text-center text-xs font-medium text-paper/80"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-paper/50">
                          Development
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["ASP.NET Core", "React", "Next.js"].map((tech) => (
                            <span
                              key={tech}
                              className="rounded border border-signal/60 px-3 py-1.5 text-xs font-medium text-paper/80"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <ClientSpotlight items={clientSpotlight} />

        {/* Skipped here for Digital Marketing — already rendered higher up,
            right after the "Maximize Reach" CTA, to match the reference's
            page order (see above). */}
        {service.slug !== "digital-marketing" && <FeaturedWorkSplit items={featuredWorkSplit} />}

        {/* Case studies, pulled live from the site's real case-studies data.
            Hidden on Digital Design at request — ClientSpotlight and
            FeaturedWorkSplit above already cover "proof of work" on that
            page. Also hidden on Digital Marketing at request (the case
            studies shown are all engineering-flavored, not marketing).
            Still shown on every other service page. */}
        {caseStudies.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && (
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
                      <Image
                        src={resolveImageUrl(study.coverImageUrl)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
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

        {/* Blog Highlights, pulled live from the site's real blog posts.
            Hidden on Digital Design and Digital Marketing at request, same
            as Case Studies above — still shown on every other service
            page. */}
        {blogGridCells.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">From the blog</p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Blog Highlights
              </h2>
            </div>

            <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 lg:grid-cols-4">
              {blogGridCells.map((cell, i) =>
                cell.type === "image" ? (
                  <div key={`${cell.post.id}-image-${i}`} className="relative h-64 overflow-hidden sm:h-72">
                    {cell.post.coverImageUrl && (
                      <Image
                        src={resolveImageUrl(cell.post.coverImageUrl)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <Link
                    key={`${cell.post.id}-label-${i}`}
                    href={`/blog/${cell.post.slug}`}
                    className={`group flex h-64 flex-col justify-center px-6 transition-colors sm:h-72 ${
                      i % 4 < 2 ? "bg-graphite" : "bg-ink"
                    }`}
                  >
                    {formatPostDate(cell.post.publishedAt) && (
                      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-ember">
                        &middot; {formatPostDate(cell.post.publishedAt)}
                      </p>
                    )}
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-paper">
                      {cell.post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-paper/70">
                      {cell.post.excerpt}
                    </p>
                    <span className="mt-4 font-mono text-sm font-semibold text-ember transition-colors group-hover:text-paper">
                      Read more
                    </span>
                  </Link>
                )
              )}
            </div>
          </section>
        )}

        {/* Why choose us + a real, admin-entered client testimonial.
            Hidden on Digital Design and Digital Marketing at request, same
            as Case Studies/Blog Highlights above — still shown on every
            other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && (
        <section className="relative overflow-hidden border-t border-paper/10 py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2">
            <div>
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Built around how you actually work.
              </h2>
              <p className="mt-3 inline-block border-b border-ember/40 pb-3 italic text-paper/60">
                No layers of account management between you and the people building it.
              </p>

              {testimonial && (
                <div className="mt-12 rounded-2xl border border-ember/20 bg-ember/10 p-8">
                  <h3 className="font-display text-xl font-semibold text-paper">Customer Voice</h3>
                  <p className="mt-4 text-lg leading-relaxed text-paper/80">
                    &ldquo;{testimonial.quote.replace(/^[“"]|[”"]$/g, "")}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    {testimonial.clientPhotoUrl ? (
                      <Image
                        src={resolveImageUrl(testimonial.clientPhotoUrl)}
                        alt=""
                        width={44}
                        height={44}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember/20 text-ember">
                        <Star className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-paper">{testimonial.clientName}</p>
                      <p className="text-sm text-paper/60">
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

            <ul className="space-y-8">
              {[
                {
                  title: "Client-Centric Approach",
                  body: "Our process starts with understanding your actual business needs, not fitting you into a template.",
                },
                {
                  title: "Thoughtful Engineering",
                  body: "We choose architecture and technologies based on your real requirements, not what's trending.",
                },
                {
                  title: "Direct Communication",
                  body: "You work directly with the team building your software — no layers of account management in between.",
                },
                {
                  title: "Comprehensive Services",
                  body: "From initial architecture through deployment and beyond, we handle the full lifecycle.",
                },
                {
                  title: "Dedicated Support",
                  body: "We stay involved after launch, so your application keeps running reliably as your needs change.",
                },
              ].map((item) => (
                <li key={item.title}>
                  <span className="font-semibold text-ember">{item.title}:</span>{" "}
                  <span className="text-paper/80">{item.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        )}

        {/* Engagement models. Hidden on Digital Design at request; also
            hidden on Digital Marketing since it already has its own
            "Pricing" column (Time & Material/Dedicated Team) in the
            Solutions/Pricing/Timeline section above — still shown on
            every other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && (
        <section className="relative overflow-hidden border-t border-paper/10 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember">How we engage</p>
            <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Engagement models
            </h2>

            <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Fixed Price",
                  body: "We provide fixed-price engagement for projects with well-defined scope and requirements, so cost and timeline are clear from the start.",
                },
                {
                  title: "Time & Materials",
                  body: "We bill for the time and resources spent on your project, giving you flexibility and transparency as scope evolves.",
                },
                {
                  title: "Dedicated Team",
                  body: "We set up a dedicated development team — engineers, tools, and process — built around your project's specific needs.",
                },
                {
                  title: "Team Augmentation",
                  body: "Our engineers integrate directly with your existing team, extending your in-house capacity without the overhead of a full hire.",
                },
              ].map((model) => (
                <div key={model.title} className="border-t border-ember/40 pt-5">
                  <h3 className="font-display text-xl font-semibold text-paper">{model.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/70">{model.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Software essentials. Hidden on Digital Design and Digital
            Marketing at request, same as the sections above — still shown
            on every other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && (
        <section className="relative overflow-hidden border-t border-paper/10 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Our software essentials
            </h2>
            <p className="mt-3 inline-block border-b border-paper/20 pb-3 italic text-paper/60">
              We build software with a focus on speed, security, and a smooth user experience — every time.
            </p>

            <div className="relative mt-16 grid grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-[1fr_14rem_1fr]">
              <div className="space-y-10 md:text-right">
                {SOFTWARE_ESSENTIALS.slice(0, 3).map((item) => (
                  <div key={item.title}>
                    <h3 className="font-display text-lg font-semibold text-ember">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/70">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="relative mx-auto hidden h-56 w-56 shrink-0 md:block">
                <div className="absolute inset-0 rounded-full border border-dashed border-paper/30" />
                {RING_DOT_POSITIONS.map((pos, i) => (
                  <span
                    key={i}
                    className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
                    style={{ top: pos.top, left: pos.left }}
                  />
                ))}
                <div className="absolute inset-8 flex items-center justify-center rounded-full border-2 border-ember text-center">
                  <p className="font-display text-sm font-bold leading-snug text-paper">
                    Our software
                    <br />
                    essentials
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                {SOFTWARE_ESSENTIALS.slice(3, 6).map((item) => (
                  <div key={item.title}>
                    <h3 className="font-display text-lg font-semibold text-ember">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/70">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Roadmap, built from the service's own includes[], framed as
            "From code to launch" / "Delivery framework" — software-
            engineering-specific copy that doesn't fit Digital Marketing
            even when its own includes[] happens to list marketing tasks
            (SEO, paid ads, etc.). Hidden on Digital Design and Digital
            Marketing at request, same as the sections above — still
            shown on every other service page. */}
        {service.includes.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && (
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
