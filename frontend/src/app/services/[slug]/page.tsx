import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  BrainCircuit,
  Blocks,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  ClipboardCheck,
  Clock,
  Cloud,
  DollarSign,
  Glasses,
  Globe,
  HandCoins,
  HeartHandshake,
  Layers,
  MessageCircle,
  Milestone,
  MousePointerClick,
  Network,
  Server,
  Star,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
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
import PartnerSpotlight from "@/components/sections/PartnerSpotlight";
import QualityManagement from "@/components/sections/QualityManagement";
import ExpandableServiceCards from "@/components/sections/ExpandableServiceCards";
import PricingModels from "@/components/sections/PricingModels";
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

        {/* IT Consulting only, static. NOTE: "Since 2004" and the three
            stats below (30%/85%/90%) are the KAZ reference's own claims,
            not verified Devliora history or data — kept only because the
            user explicitly asked for them verbatim after being told
            they're not real Devliora figures. Tool icons fetched and
            verified from simple-icons the same way as the Digital
            Marketing page's tools. */}
        {service.slug === "it-consulting" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-12 md:grid-cols-2">
                <div>
                  <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                    Expert IT consulting, tailored for you
                  </h2>
                  <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
                    Smart solutions, tailored strategies, and proven success.
                  </p>
                  <div className="mt-6 flex flex-col gap-4 text-paper/80">
                    <p>
                      We create software roadmaps that{" "}
                      <span className="font-semibold text-ember">
                        cut implementation time by 30%
                      </span>
                      , ensuring smooth transitions and optimized investments.
                    </p>
                    <p>
                      Our tech advisory services{" "}
                      <span className="font-semibold text-ember">
                        helped 85% of clients select the best platform
                      </span>{" "}
                      for long-term success.
                    </p>
                    <p>
                      <span className="font-semibold text-ember">
                        Over 90% of businesses we consult find the ideal CRM
                      </span>
                      , ERP, or custom solution for their specific needs.
                    </p>
                  </div>
                </div>
                <p className="text-paper/70">
                  Since 2004, we&apos;ve helped organizations streamline operations, improve
                  services, and launch new digital products. Our IT consulting services focus on
                  shaping practical technology environments that align with business goals,
                  strengthen capabilities, and support better customer experiences.
                </p>
              </div>

              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-6">
                {[
                  { slug: "nodejs", label: "Node.js" },
                  { slug: "php", label: "PHP" },
                  { slug: "laravel", label: "Laravel" },
                  { slug: "react", label: "React" },
                  { slug: "angular", label: "Angular" },
                  { slug: "java", label: "Java" },
                  { slug: "flutter", label: "Flutter" },
                ].map((tool) => {
                  const icon = getTechIcon(tool.slug);
                  return (
                    <div
                      key={tool.slug}
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-paper/95 shadow-sm"
                    >
                      {icon ? (
                        <TechBrandIcon name={tool.slug} className="h-8 w-8" />
                      ) : (
                        <span className="px-1 text-center text-[0.65rem] font-semibold leading-tight text-ink/70">
                          {tool.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* "Strategic IT consulting" + industry focus areas + "Get Started"
            CTA — IT Consulting only, static. Generic technology-domain
            copy, no fabricated claims. The 6 focus areas are outline
            concept icons (not brand logos), so these use lucide-react
            rather than simple-icons brand marks. */}
        {service.slug === "it-consulting" && (
          <>
            <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
              <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-12 md:grid-cols-2">
                  <div>
                    <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                      Strategic IT consulting
                    </h2>
                    <p className="mt-5 inline-block max-w-md border-b border-paper/30 pb-3 italic text-paper/60">
                      Aligned solutions, industry-focused, future-ready
                    </p>
                  </div>
                  <p className="text-paper/70">
                    Stay ahead with technology-driven strategies tailored to your business needs.
                    Our IT consulting services help you select and implement solutions that
                    improve operations and support growth. The focus is on practical guidance,
                    informed decisions, and long-term value.
                  </p>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-6">
                  {[
                    { icon: Blocks, label: "Blockchain Technology" },
                    { icon: Glasses, label: "Augmented Reality" },
                    { icon: BrainCircuit, label: "Artificial Intelligence" },
                    { icon: Network, label: "Internet of Things" },
                    { icon: Cloud, label: "Cloud Computing" },
                    { icon: CircleDollarSign, label: "FinTech" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center text-center">
                      <item.icon className="h-10 w-10 text-paper" strokeWidth={1.25} />
                      <p className="mt-4 text-sm text-paper/80">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="border-t border-paper/10 bg-signal">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                  <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                    Transform your business with cutting-edge IT solutions and tailored
                    strategies.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </section>
          </>
        )}

        {/* "Unmatched Experience in IT Solutions and Innovation" — Staff
            Augmentation only, static. NOTE: the reference's 4 stats
            (20+ years, 10+ industry leaders, 100+ developers, 200+
            deliveries) are the KAZ reference's own claims, not verified
            Devliora figures — kept verbatim per explicit request, same
            as the IT Consulting and IT Maintenance pages' numbers.
            Built as bespoke markup (not the generic service.highlights
            section) since the reference has no colon after each label,
            just an inline sentence. */}
        {service.slug === "staff-augmentation" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                Unmatched Experience in IT Solutions and Innovation
              </h2>

              <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
                {[
                  { plain: "", ember: "20+ years", tail: " in custom software development and engineering" },
                  {
                    plain: "10+ industry leaders trust our ",
                    ember: "IT solutions, including Microsoft, AWS, and Google Cloud",
                    tail: "",
                  },
                  { plain: "", ember: "100+ experienced", tail: " developers across diverse technologies" },
                  {
                    plain: "Dedicated Centers of Excellence in ",
                    ember: "FinTech, Healthcare, Retail, and Manufacturing",
                    tail: "",
                  },
                  { plain: "", ember: "200+", tail: " successful software deliveries worldwide" },
                  {
                    plain: "Continuous innovation through company-wide ",
                    ember: "R&D initiatives",
                    tail: "",
                  },
                ].map((item, i) => (
                  <p key={i} className="text-base leading-relaxed text-paper/80">
                    {item.plain}
                    <span className="font-semibold text-ember">{item.ember}</span>
                    {item.tail}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Empowering your dedicated development team for success" —
            Staff Augmentation only, static. Generic capability copy, no
            fabricated claims. The org-chart is a 3-tier breakdown
            (Dedicated Development Center -> People/Infrastructure/
            Processes -> 2 sub-areas each -> 2 leaf items each) drawn as a
            real connector tree: each row of siblings is a flex row where
            every child paints its own half of the horizontal bracket line
            (0-50% or 50-100% of its own width) plus a vertical drop to
            its content — the classic pure-CSS org-chart technique, so the
            line only spans from the first child's center to the last
            child's center instead of the full container width. */}
        {service.slug === "staff-augmentation" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2 md:items-start">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Empowering your dedicated development team for success
                </h2>
                <p className="text-paper/70">
                  We build skilled teams with the right expertise, infrastructure, and processes
                  to support productivity and clear communication, aligned with project goals.
                  Collaboration is structured, transparent, and responsive. This ensures teams
                  integrate smoothly and deliver consistently over time.
                </p>
              </div>

              <div className="mt-20">
                <div className="text-center">
                  <p className="inline-block font-semibold text-paper">Dedicated Development Center</p>
                </div>
                <div className="mx-auto h-6 w-px bg-paper/25" />

                <div className="flex">
                  {[
                    {
                      title: "People",
                      icon: Users,
                      subs: [
                        { title: "Teams", leaves: ["Team Productivity", "Knowledge Accumulation"] },
                        { title: "Individuals", leaves: ["Technological Skills", "Domain Experience"] },
                      ],
                    },
                    {
                      title: "Infrastructure",
                      icon: Server,
                      subs: [
                        { title: "Hardware", leaves: ["Devices", "Networks"] },
                        { title: "Software", leaves: ["Test Automation", "IDEs"] },
                      ],
                    },
                    {
                      title: "Processes",
                      icon: Workflow,
                      subs: [
                        { title: "Integration", leaves: ["In-House/Offshore", "Process Optimization"] },
                        { title: "Alignment", leaves: ["Seamless Communication", "Methodologies Adjustment"] },
                      ],
                    },
                  ].map((cat, i, cats) => (
                    <div key={cat.title} className="relative flex-1 px-3">
                      <span
                        className="absolute top-0 h-px bg-paper/25"
                        style={{ left: i === 0 ? "50%" : "0", right: i === cats.length - 1 ? "50%" : "0" }}
                      />
                      <span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-paper/25" />

                      <div className="flex flex-col items-center pt-6 text-center">
                        <cat.icon className="h-7 w-7 text-ember" strokeWidth={1.5} />
                        <p className="mt-2 font-semibold text-paper">{cat.title}</p>
                        <div className="mt-4 h-4 w-px bg-paper/25" />

                        <div className="flex w-full">
                          {cat.subs.map((sub, j, subs) => (
                            <div key={sub.title} className="relative flex-1 px-2">
                              <span
                                className="absolute top-0 h-px bg-paper/25"
                                style={{ left: j === 0 ? "50%" : "0", right: j === subs.length - 1 ? "50%" : "0" }}
                              />
                              <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-paper/25" />

                              <div className="flex flex-col items-center gap-2 pt-4 text-center">
                                <p className="text-sm font-medium text-paper">{sub.title}</p>
                                {sub.leaves.map((leaf) => (
                                  <p key={leaf} className="text-xs leading-snug text-paper/60">
                                    {leaf}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* "Unlock the full potential of your project" CTA banner — Staff
            Augmentation only, static, same two-line bg-signal pattern as
            the IT Maintenance & Support page's CTA banners. */}
        {service.slug === "staff-augmentation" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Unlock the full potential of your project.
                </p>
                <p className="mt-1 max-w-lg text-sm text-paper/70">Need additional resources?</p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Seamless Collaboration Across Distributed Teams" — Staff
            Augmentation only, static. Generic capability copy, no
            fabricated claims. 5 icon-columns, each with a title (with a
            divider line underneath) and a plain leaf-item list — icons
            are generic concept marks (not brand logos), so lucide-react
            rather than simple-icons. */}
        {service.slug === "staff-augmentation" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2 md:items-start">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Seamless Collaboration Across Distributed Teams
                </h2>
                <p className="text-paper/70">
                  We&apos;ve perfected collaboration and project management in distributed teams,
                  mastering industry best practices to overcome geographic, language, and
                  cultural barriers. Our expertise ensures smooth integration into global,
                  multi-vendor environments for efficient teamwork.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  {
                    icon: Server,
                    title: "Common Infrastructure",
                    items: ["Integrated Codebase", "Single CI Server", "Hourly Automated Builds"],
                  },
                  {
                    icon: BookOpen,
                    title: "Inter-Team Alignment",
                    items: ["Technology Alignment", "Tool Matching", "Knowledge Transfer"],
                  },
                  {
                    icon: CalendarClock,
                    title: "Multi-Team Management",
                    items: ["Accountable Roles Matching", "Project Progress Tracking", "Completed Phases Analysis"],
                  },
                  {
                    icon: Globe,
                    title: "Community",
                    items: ["Project Management Tools", "Wikis And Blogs", "Shared Mailing Lists"],
                  },
                  {
                    icon: MessageCircle,
                    title: "Communication",
                    items: ["Sprint Planning", "Regular Standups", "Retrospectives"],
                  },
                ].map((col) => (
                  <div key={col.title}>
                    <div className="flex items-center gap-2 border-b border-paper/15 pb-3">
                      <col.icon className="h-6 w-6 shrink-0 text-ember" strokeWidth={1.5} />
                      <p className="font-semibold text-paper">{col.title}</p>
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {col.items.map((item) => (
                        <li key={item} className="text-sm leading-snug text-ember/80">
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

        {/* "Our Staff Augmentation Services" — Staff Augmentation only,
            static. Generic capability copy, company name swapped to
            Devliora — the reference's card body text was confirmed
            verbatim once the "Show more" state was screenshotted. Image
            reuses service.heroImageUrl, same pattern as the Digital
            Marketing and IT Maintenance split sections. Cards use the
            same "Show more"/"Show less" interaction as ServiceTabs.tsx's
            ScopeCard, extracted into ExpandableServiceCards since this
            is the first place outside ServiceTabs that needs it. */}
        {service.slug === "staff-augmentation" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2 md:items-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
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
                <div>
                  <h2 className="text-balance font-display text-3xl font-bold uppercase leading-tight text-paper sm:text-4xl">
                    Our Staff Augmentation Services
                  </h2>
                  <p className="mt-5 text-paper/70">
                    At Devliora, we help teams scale with the right talent at the right time.
                    Here&apos;s a snapshot of how our staff augmentation services support your
                    delivery goals.
                  </p>
                </div>
              </div>

              <ExpandableServiceCards
                cards={[
                  {
                    title: "Consulting",
                    description:
                      "We work with you to understand skill gaps, team structure, and project needs, helping you define roles, timelines, and engagement models that align with your business objectives and delivery plans.",
                  },
                  {
                    title: "Talent Matching",
                    description:
                      "Our team sources and assigns engineers based on technical fit, experience, and team compatibility, ensuring a smooth extension of your in-house team with minimal ramp-up time.",
                  },
                  {
                    title: "Flexible Team Extension",
                    description:
                      "Scale your team up or down as needed with dedicated professionals who integrate seamlessly into your workflows, tools, and communication processes.",
                  },
                  {
                    title: "Delivery & Collaboration Support",
                    description:
                      "We ensure our augmented team members follow your processes, quality standards, and delivery expectations while maintaining clear communication and accountability.",
                  },
                  {
                    title: "Long-Term Engagement Options",
                    description:
                      "Whether for short-term needs or extended collaboration, we offer flexible engagement models that adapt as your projects, priorities, and timelines evolve.",
                  },
                ]}
              />
            </div>
          </section>
        )}

        {/* "Transform your development team for success" CTA banner —
            Staff Augmentation only, static, same two-line bg-signal
            pattern as the page's other CTA banners. */}
        {service.slug === "staff-augmentation" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Transform your development team for success.
                </p>
                <p className="mt-1 max-w-lg text-sm text-paper/70">Looking for skilled experts?</p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Explore Options
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Engineering Excellence" — Staff Augmentation only, static.
            NOTE: the reference attributes a specific quote — "One of the
            best software companies to work for in Bangladesh" — to
            Glassdoor. That's KAZ's own (unverified) third-party rating
            claim, not Devliora's, so per explicit request this is
            replaced with a generic engineering-culture statement rather
            than fabricating a Glassdoor citation — same reasoning
            already applied to the Quality management section's
            Clutch/Glassdoor/G2/GoodFirms row elsewhere on the site. */}
        {service.slug === "staff-augmentation" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
              <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Engineering Excellence
                </h2>
                <div className="flex items-start gap-4">
                  <span className="font-display text-5xl leading-none text-ember">&ldquo;</span>
                  <p className="text-balance text-xl font-medium leading-snug text-paper sm:text-2xl">
                    Building a culture where technical excellence and continuous learning go
                    hand in hand, so every engineer we place is set up to do their best work.
                  </p>
                  <span className="font-display text-5xl leading-none text-ember">&rdquo;</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* "Microsoft" PartnerSpotlight — Staff Augmentation only, static.
            Same shared component as the Meta/Accenture/IBM spotlights.
            Kept verbatim per explicit request. Microsoft's simple-icons
            SVG resolves on the CDN but isn't in the current searchable
            index — same trademark-pull pattern as IBM/Java/Marketo — so
            it falls back to the text-badge UI. */}
        {service.slug === "staff-augmentation" && (
          <PartnerSpotlight
            quote="We rely on thousands of external specialists to accelerate product development."
            description="Microsoft uses large-scale external engineering talent to extend internal teams and ship products faster across multiple divisions."
            name="Microsoft"
            icons={[{ key: "microsoft", label: "Microsoft" }]}
          />
        )}

        {/* "Tailored tech solutions for every industry" — Staff
            Augmentation only, static. Generic capability copy, real
            technology/domain names (not fabricated claims). 4 plain
            columns, same divider-under-header style as the "Seamless
            Collaboration" icon columns above. */}
        {service.slug === "staff-augmentation" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                    Tailored tech solutions for every industry
                  </h2>
                  <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
                    Proven expertise, industry knowledge, tailored results.
                  </p>
                </div>
                <p className="text-paper/70 md:pt-2">
                  Across industries, we build custom solutions tailored to the needs of
                  healthcare, telecom, finance, automotive, and retail. The focus is on smooth
                  integration and operational efficiency. From concept through execution,
                  technology is applied to support meaningful outcomes.
                </p>
              </div>

              <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
                {[
                  { title: "Programming languages", items: ["Java", ".NET", "C++", "Python", "C#", "PHP"] },
                  { title: "Platforms", items: ["Office 365", "SPA Commerce", "SharePoint", "Salesforce", "Atlassian"] },
                  {
                    title: "Technologies",
                    items: [
                      "Cloud",
                      "Machine Learning",
                      "Internet of Things",
                      "Augmented & Virtual Reality",
                      "Cybersecurity",
                      "Blockchain",
                    ],
                  },
                  { title: "Domains", items: ["Healthcare", "Telecom", "Finance", "Automotive", "Retail"] },
                ].map((col) => (
                  <div key={col.title}>
                    <p className="font-semibold text-ember">{col.title}</p>
                    <div className="mt-2 border-t border-paper/15" />
                    <div className="mt-4 flex flex-col gap-3">
                      {col.items.map((item) => (
                        <p key={item} className="text-paper/80">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Enhance your team's capabilities and efficiency" CTA banner —
            Staff Augmentation only, static. NOTE: the reference uses a
            magenta/pink background here, but that color isn't part of
            Devliora's palette (ink/paper/graphite/signal/ember/wire), so
            this stays on bg-signal for brand consistency with every
            other CTA banner on the site rather than introducing an
            off-brand one-off color. */}
        {service.slug === "staff-augmentation" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Enhance your team&apos;s capabilities and efficiency.
                </p>
                <p className="mt-1 max-w-lg text-sm text-paper/70">Want to scale up?</p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Pricing models" — Staff Augmentation only. Same shared
            component the /services page uses (identical two engagement
            models, same copy). */}
        {service.slug === "staff-augmentation" && <PricingModels />}

        {/* "Comprehensive multi-tier software support services" — IT
            Maintenance & Support only, static. Generic capability copy
            (L1/L2/L3 is a standard industry term, not a fabricated
            Devliora claim). Image reuses service.heroImageUrl, same
            pattern as Digital Marketing's "Our digital marketing
            services" split section — no new dedicated field. */}
        {service.slug === "it-maintenance-support" && (
          <section className="relative overflow-hidden border-t border-paper/10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col">
                <div className="bg-graphite/40 px-6 py-14 sm:px-10 md:py-16">
                  <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                    Comprehensive multi-tier software support services
                  </h2>
                  <p className="mt-5 max-w-md text-paper/70">
                    To tackle your software challenges effectively, we offer three tailored
                    support packages, each designed with varying levels of coverage across L1,
                    L2, and L3 tiers of technical support.
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
                <ul className="mt-8 flex flex-col gap-6">
                  {[
                    {
                      title: "User-Level Support",
                      body: "We quickly resolve user-facing issues and minor glitches before they escalate.",
                    },
                    {
                      title: "Comprehensive Troubleshooting",
                      body: "We diagnose and fix system bugs, handling critical configurations and updates.",
                    },
                    {
                      title: "Advanced Diagnostics",
                      body: "Our experts dive into code to resolve complex issues and optimize performance.",
                    },
                    {
                      title: "Proactive Maintenance",
                      body: "We prevent disruptions with regular updates and proactive fixes.",
                    },
                    {
                      title: "Performance Enhancement",
                      body: "We optimize your system and add new features for improved efficiency.",
                    },
                  ].map((item) => (
                    <li key={item.title}>
                      <p className="font-semibold text-ember">{item.title}</p>
                      <p className="mt-1.5 text-paper/70">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* "Our numbers at a glance" — IT Maintenance & Support only,
            static. NOTE: these 4 stats (99.9%/25+/15-Minute/30%) are the
            KAZ reference's own claims, not verified Devliora figures —
            kept verbatim per explicit request, same as the IT Consulting
            page's numbers. Built as bespoke markup rather than the
            generic service.highlights section since that one has no
            description-paragraph slot. */}
        {service.slug === "it-maintenance-support" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                Our numbers at a glance
              </h2>
              <p className="mt-5 max-w-xl text-paper/70">
                Explore the results of our IT maintenance and support solutions that empower
                businesses across industries.
              </p>

              <div className="mt-10 grid gap-x-12 gap-y-6 sm:grid-cols-2">
                {[
                  {
                    label: "99.9% Uptime",
                    body: "Ensuring minimal downtime for your operations",
                  },
                  { label: "25+ Industries", body: "Tailored support for diverse sectors." },
                  {
                    label: "15-Minute Response",
                    body: "Swiftly addressing critical issues.",
                  },
                  {
                    label: "30% Cost Savings",
                    body: "Optimized strategies that reduce expenses.",
                  },
                ].map((item) => (
                  <p key={item.label} className="text-base leading-relaxed text-paper/80">
                    <span className="font-semibold text-ember">{item.label}: </span>
                    {item.body}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Get Started" CTA banner — IT Maintenance & Support only,
            static, same full-bleed pattern as the other CTA banners on
            this page. */}
        {service.slug === "it-maintenance-support" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Our dedicated team ensures your software runs smoothly.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "IT support and maintenance roadmap" — IT Maintenance & Support
            only, static. Generic process description, no fabricated
            claims. 5 icon-cards in a row (no connecting line/numbering in
            the reference, unlike the Digital Marketing roadmap). Icons
            are generic concept marks, not brand logos, so lucide-react
            rather than simple-icons. */}
        {service.slug === "it-maintenance-support" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2 md:items-start">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  IT support and maintenance roadmap
                </h2>
                <p className="text-paper/70">
                  When managing IT infrastructure, we follow a structured, step-by-step approach
                  to design and implement a maintenance strategy aligned with specific
                  operational needs.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    icon: ClipboardCheck,
                    title: "System Audit",
                    body: "We begin by examining your software architecture and code, reviewing documentation, and performing functional and performance tests.",
                  },
                  {
                    icon: HandCoins,
                    title: "Maintenance Proposal",
                    body: "Based on our audit, we define the scope of services required and outline objectives and requirements.",
                  },
                  {
                    icon: Milestone,
                    title: "Roadmap Development",
                    body: "Our team then creates a detailed, milestone-driven maintenance strategy, including the practices and tools to be used, for your approval.",
                  },
                  {
                    icon: HeartHandshake,
                    title: "Project Handover",
                    body: "Once the strategy is approved, we assign roles and responsibilities, and begin implementing the agreed-upon steps.",
                  },
                  {
                    icon: MousePointerClick,
                    title: "Ongoing Support & Maintenance",
                    body: "We continuously address issues, perform updates, and release new features as needed, providing regular status reports on progress.",
                  },
                ].map((step) => (
                  <div key={step.title}>
                    <step.icon className="h-8 w-8 text-ember" strokeWidth={1.5} />
                    <h3 className="mt-4 font-semibold text-paper">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/70">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Service delivery models" — IT Maintenance & Support only,
            static. Generic engagement-model descriptions, no fabricated
            claims. */}
        {service.slug === "it-maintenance-support" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2 md:items-start">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Service delivery models
                </h2>
                <p className="text-paper/70">
                  Select the level of software support and maintenance that best aligns with
                  your project requirements and business environment.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
                {[
                  {
                    title: "Managed Support",
                    body: "For a fixed fee, engage our dedicated support team to monitor the health and stability of your software ecosystem around the clock. We conduct scheduled maintenance and provide prompt fixes for any complexity.",
                  },
                  {
                    title: "Pay-As-You-Go Support",
                    body: "Utilize our professional technicians, engineers, or consultants to supplement your in-house maintenance team as needed. This model allows you to access services for a specified duration, paying only for the resources consumed.",
                  },
                  {
                    title: "Emergency Support",
                    body: "If you experience a sudden, disruptive software issue or a security breach, our support team is ready to assist. Count on swift team mobilization and extensive expertise in resolving security incidents and critical outages.",
                  },
                ].map((model) => (
                  <div key={model.title} className="border-t border-paper/25 pt-5">
                    <h3 className="font-display text-xl font-semibold text-paper">
                      {model.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper/70">{model.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Quality management" — IT Maintenance & Support only, static.
            Same shared component the /services and IT Consulting pages
            use, since this page's reference has the identical heading
            and bullets (only the source-company name in the description
            differs, already genericized). */}
        {service.slug === "it-maintenance-support" && (
          <QualityManagement description="Devliora is a quality-driven software development company, committed to setting and maintaining high standards in engineering practices. We follow proven processes and comply with established quality and information security frameworks to ensure every solution is robust, secure, and built to last." />
        )}

        {/* "Connect with our professionals" CTA banner — IT Maintenance &
            Support only, static. Two-line text stack (unlike the site's
            other single-line CTA banners), same full-bleed pattern
            otherwise. */}
        {service.slug === "it-maintenance-support" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Connect with our professionals to tackle your challenges.
                </p>
                <p className="mt-1 max-w-lg text-sm text-paper/70">
                  Need Expert Assistance for Your IT Needs?
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {tabs ? (
          <ServiceTabs tabs={tabs} heroImageUrl={hero?.backgroundImageUrl} technologies={technologies} />
        ) : service.slug === "it-consulting" || service.slug === "it-maintenance-support" ? null : (
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
          <PartnerSpotlight
            quote="More than 200 million businesses use our platforms to reach customers."
            description="Facebook and Instagram remain the world's most widely used channels for digital marketing and brand visibility."
            name="Meta"
            icons={[
              { key: "facebook", label: "Facebook" },
              { key: "instagram", label: "Instagram" },
            ]}
          />
        )}

        {/* "Accenture" spotlight — IT Consulting only, static. The quote
            frames a real, widely-cited industry-research theme (not a
            Devliora claim), same reasoning as the Meta spotlight above. */}
        {service.slug === "it-consulting" && (
          <PartnerSpotlight
            quote="Every business is becoming a digital business."
            description="Accenture's global research highlights how enterprises depend on IT consulting partners to modernize systems and drive digital transformation."
            name="Accenture"
            icons={[{ key: "accenture", label: "Accenture" }]}
          />
        )}

        {/* "IBM" spotlight — IT Maintenance & Support only, static. The
            quote frames a real, publicly-known IT-operations theme (not
            a Devliora claim), same reasoning as the spotlights above.
            IBM's simple-icons SVG resolves on the CDN but isn't in the
            current searchable index — same trademark-pull pattern as
            Java/Marketo elsewhere on the site — so it falls back to the
            text-badge UI. */}
        {service.slug === "it-maintenance-support" && (
          <PartnerSpotlight
            quote="Proactive systems reduce downtime before it impacts business."
            description="IBM's modern IT operations model emphasizes predictive, always-on support to keep critical infrastructure running smoothly."
            name="IBM"
            icons={[{ key: "ibm", label: "IBM" }]}
          />
        )}

        {/* "Meet your support dream team" — IT Maintenance & Support only,
            static. NOTE: the reference's "Diverse Portfolio" card claimed
            "over 21 years of experience" — that's the KAZ reference's own
            company history, not Devliora's, so reworded to a generic
            capability statement per explicit request (the other two
            cards were already generic, kept as-is). */}
        {service.slug === "it-maintenance-support" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2 md:items-start">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Meet your support dream team.
                </h2>
                <p className="text-paper/70">
                  Welcome to a team with deep technical expertise focused on keeping your
                  software running effectively. We combine experience and care to support
                  reliable operations, so you can stay focused on growing your business.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
                {[
                  {
                    title: "Diverse Portfolio",
                    body: "Our dynamic team has mastered the art of maintaining software ecosystems across a variety of industries. From healthcare to entertainment, we've got the know-how to keep your systems thriving!",
                  },
                  {
                    title: "Continuous Operation",
                    body: "By applying modern DevOps practices, our teams ensure maintenance activities—from routine updates to feature releases—are carried out smoothly, supporting stable and uninterrupted operations.",
                  },
                  {
                    title: "Tailored Deliverables",
                    body: "We believe in a personalized approach! That's why we craft custom support SLAs with each client, outlining our commitments on service hours, software coverage, response times, and ticket priorities, all designed to meet your unique needs.",
                  },
                ].map((item) => (
                  <div key={item.title} className="border-t border-paper/25 pt-5">
                    <h3 className="font-display text-xl font-semibold text-ember">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper/70">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Learn More" CTA banner — IT Maintenance & Support only, static,
            two-line text stack like the "Contact Us" CTA below, same
            full-bleed pattern otherwise. */}
        {service.slug === "it-maintenance-support" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Discover how our maintenance strategies drive growth.
                </p>
                <p className="mt-1 max-w-lg text-sm text-paper/70">
                  Looking to Optimize Your Software Performance?
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Learn More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Quality management" — IT Consulting only, static. Same shared
            component the /services page uses, since this page's
            reference has the identical heading and bullets, just a
            differently-worded description paragraph. */}
        {service.slug === "it-consulting" && (
          <QualityManagement description="We are a quality-driven software development organization, committed to maintaining strong engineering standards. By following proven processes and established quality and information security frameworks, solutions are designed to be reliable, secure, and sustainable over time." />
        )}

        {/* "Empower your business with smart tech solutions" — IT
            Consulting only, static. Generic technology-capability terms,
            no fabricated claims. Circles sit on a true radial layout
            (trig-computed positions, not a CSS grid) with a gradient
            ring border, matching the reference more closely per
            follow-up request. The reference's center graphic is bespoke
            line art (a person in a VR headset) — approximated with a
            hand-drawn SVG (drafted and checked with cairosvg before
            committing) rather than redrawn from their original asset.
            Its arrow/bracket controls read as carousel chrome for
            rotating capability sets; kept as plain decoration since
            there's no second set of terms to rotate through. */}
        {service.slug === "it-consulting" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-16 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                    Empower your business with smart tech solutions
                  </h2>
                  <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
                    Leverage AI, blockchain, and IoT, effortlessly, securely, and effectively.
                  </p>
                  <p className="mt-5 max-w-md text-paper/70">
                    We integrate emerging technologies such as AI, blockchain, and AR/VR into
                    existing IT environments with a focus on stability and long-term value. The
                    approach supports smooth adoption and helps organizations apply innovation
                    where it creates practical advantage.
                  </p>
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-lg">
                  {/* corner brackets framing the center icon */}
                  {[0, 90, 180, 270].map((deg) => (
                    <svg
                      key={deg}
                      viewBox="0 0 20 20"
                      className="absolute left-1/2 top-1/2 h-4 w-4 text-paper/30"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${deg}deg) translate(-34px, -34px)`,
                      }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    >
                      <path d="M2 10 V2 H10" />
                    </svg>
                  ))}

                  <ChevronUp className="absolute left-1/2 top-[38%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-paper/30" />
                  <ChevronDown className="absolute left-1/2 top-[62%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-paper/30" />
                  <ChevronLeft className="absolute left-[38%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-paper/30" />
                  <ChevronRight className="absolute left-[62%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-paper/30" />

                  {/* center icon */}
                  <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-24 sm:w-24">
                    <svg
                      viewBox="0 0 100 100"
                      className="h-14 w-14 text-paper/70 sm:h-16 sm:w-16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      role="img"
                      aria-label="Person wearing an AR/VR headset"
                    >
                      <path d="M 23 40 C 22 26, 32 15, 47 14 C 59 13.5, 68 21, 69 31 L 69 47 C 69 51, 67 55, 63 58 C 60 63, 55 66.5, 49 68 C 44 69, 39 68, 35 65 C 29 60, 24 52, 23 44 C 22.7 42.7, 22.8 41.3, 23 40 Z" />
                      <path d="M 41 67 L 38 80" />
                      <rect x="45" y="29" width="25" height="16" rx="6.5" />
                      <path d="M 47 28 C 40 19, 31 16, 23 19" />
                    </svg>
                  </div>

                  {/* 8 capability circles, positioned radially (0deg = top,
                      clockwise) around the center. */}
                  {[
                    { label: "Computer vision", angle: 0 },
                    { label: "Personalization solutions", angle: 45 },
                    { label: "AR/VR/MR", angle: 90 },
                    { label: "Intelligent process automation", angle: 135 },
                    { label: "Enterprise AI", angle: 180 },
                    { label: "Blockchain", angle: 225 },
                    { label: "IoT & edge computing", angle: 270 },
                    { label: "Big data & analytics", angle: 315 },
                  ].map((item) => {
                    const rad = (item.angle * Math.PI) / 180;
                    const radius = 38;
                    const left = 50 + radius * Math.sin(rad);
                    const top = 50 - radius * Math.cos(rad);
                    return (
                      <div
                        key={item.label}
                        className="absolute flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-[2px] sm:h-28 sm:w-28"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          backgroundImage: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                        }}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-ink p-3 text-center">
                          <span className="text-xs font-medium leading-snug text-paper">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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

        {/* "Explore Now" CTA banner — IT Consulting only, static, same
            full-bleed pattern as the other CTA banners on this page.
            Positioned right before ClientSpotlight to match the
            reference's order. */}
        {service.slug === "it-consulting" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Discover how our expert consulting can streamline your software implementation
                  and tech choices.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Explore Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        <ClientSpotlight items={clientSpotlight} />

        {/* Skipped here for Digital Marketing — already rendered higher up,
            right after the "Maximize Reach" CTA, to match the reference's
            page order (see above). */}
        {service.slug !== "digital-marketing" && <FeaturedWorkSplit items={featuredWorkSplit} />}

        {/* Case studies, pulled live from the site's real case-studies data.
            Hidden on Digital Design at request — ClientSpotlight and
            FeaturedWorkSplit above already cover "proof of work" on that
            page. Also hidden on Digital Marketing and IT Consulting at
            request (the case studies shown are all engineering-flavored,
            not marketing or consulting).
            Still shown on every other service page. */}
        {caseStudies.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && (
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
            Hidden on Digital Design, Digital Marketing, and IT Consulting
            at request, same as Case Studies above — still shown on every
            other service
            page. */}
        {blogGridCells.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && (
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
            Hidden on Digital Design, Digital Marketing, and IT Consulting
            at request, same as Case Studies/Blog Highlights above — still
            shown on every other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && (
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
            Solutions/Pricing/Timeline section above; also hidden on IT
            Consulting at request — still shown on
            every other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && (
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

        {/* Software essentials. Hidden on Digital Design, Digital
            Marketing, and IT Consulting at request, same as the sections
            above — still shown on every other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && (
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
            (SEO, paid ads, etc.). Hidden on Digital Design, Digital
            Marketing, and IT Consulting at request, same as the sections
            above — still shown on every other service page. */}
        {service.includes.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && (
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
