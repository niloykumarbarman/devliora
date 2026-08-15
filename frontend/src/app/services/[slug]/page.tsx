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
  Shield,
  Star,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchServiceBySlug, fetchServices, serviceHref, STATIC_SERVICE_LINKS } from "@/lib/services";
import { fetchIndustries } from "@/lib/industries";
import { fetchHero, resolveImageUrl } from "@/lib/hero";
import { fetchCaseStudies } from "@/lib/caseStudies";
import { fetchBlogPosts, type BlogPost } from "@/lib/blogPosts";
import { fetchTechnologies } from "@/lib/technologies";
import { API_BASE_URL } from "@/lib/apiConfig";
import { buildMetadata } from "@/lib/seo";
import { getTechIcon } from "@/lib/techIcons";
import TechBrandIcon from "@/components/TechBrandIcon";
import ServiceTabs, {
  type ServiceTab,
  type ServiceApproachStep,
  type ServiceCapability,
  type ServiceClosingCta,
} from "@/components/sections/ServiceTabs";
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
  const { slug: rawSlug } = await params;
  const { baseSlug, tabLabel } = parseServiceSlug(rawSlug);
  const service = await fetchServiceBySlug(baseSlug);
  if (!service) {
    return buildMetadata({
      title: "Service | Devliora",
      description: "Service details.",
      path: `/services/${rawSlug}`,
    });
  }
  const tab = tabLabel ? SERVICE_TABS[baseSlug]?.find((t) => t.label === tabLabel) : null;
  return buildMetadata({
    title: `${tab ? tab.heading : service.title} | Devliora`,
    description: tab ? tab.body : service.shortDescription,
    path: `/services/${rawSlug}`,
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

// Fallback background for an industry card with no uploaded image yet —
// a brand-color gradient (cycled by card index) instead of a flat gray
// box, so the grid doesn't look empty while a real photo is pending.
// Not a stand-in for any specific reference photo, just decorative color.
const INDUSTRY_CARD_FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #FF6B35, #3D5AFE)",
  "linear-gradient(135deg, #3D5AFE, #a78bfa)",
  "linear-gradient(135deg, #60a5fa, #3D5AFE)",
  "linear-gradient(135deg, #FF6B35, #a78bfa)",
];

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

// Eight evenly spaced points (45° apart, starting at top, clockwise)
// around the "engagement team" ring on Performance & Reliability
// Engineering — each carries which side its label sits on, since a label
// centered above/below only reads cleanly at the top/bottom points.
const TEAM_ROLE_POSITIONS: { top: string; left: string; side: "top" | "right" | "bottom" | "left" }[] = [
  { top: "0%", left: "50%", side: "top" },
  { top: "14.6%", left: "85.4%", side: "right" },
  { top: "50%", left: "100%", side: "right" },
  { top: "85.4%", left: "85.4%", side: "right" },
  { top: "100%", left: "50%", side: "bottom" },
  { top: "85.4%", left: "14.6%", side: "left" },
  { top: "50%", left: "0%", side: "left" },
  { top: "14.6%", left: "14.6%", side: "left" },
];

const PERFORMANCE_ENGAGEMENT_TEAM = [
  "Developers",
  "UX/UI designer",
  "DevOps engineer",
  "QA engineers",
  "Architect/Team lead",
  "Project manager",
  "Business analyst",
  "Account manager",
];

// Generic delivery-lifecycle stages for the "Our approach" zigzag
// timeline inside each tab. Same 7 stages regardless of platform — this
// is a standard SDLC shape, not a claim specific to Web/Mobile/
// Desktop — so it's defined once and reused across all three tabs'
// approach.steps. iconKey (not the icon component itself) because this
// data crosses the server->client boundary into ServiceTabs, which
// can't receive component/function props — see ServiceTabs.tsx.
const APPROACH_STEPS: ServiceApproachStep[] = [
  { iconKey: "lightbulb", title: "Ideation" },
  { iconKey: "wireframe", title: "Wireframe/Mockups" },
  { iconKey: "prototype", title: "Prototype" },
  { iconKey: "code", title: "Development" },
  { iconKey: "database", title: "Data/Content" },
  { iconKey: "search", title: "Quality Assurance" },
  { iconKey: "package", title: "Delivery" },
];

// Reused across all three Software Engineering tabs' whyChooseUs block.
// Two of the reference's four cards ("Commitment to Customer Success"
// and its second "Quality Management" card) claimed specific org
// structures Devliora doesn't have — a dedicated executive advisory
// program, a CTO office, multiple "Centers of Excellence" — so those
// two are reworded to the same honest substance without inventing
// formal structures. The other two are generic and kept close to the
// reference. The second card was also retitled ("Continuous
// Innovation") since the reference oddly reuses "Quality Management"
// as the title of both the 1st and 4th card.
const WHY_CHOOSE_US_EXTRA_CARDS: ServiceCapability[] = [
  {
    title: "Quality Management",
    body: "We follow a structured quality management approach that maintains high standards across our services and software delivery.",
  },
  {
    title: "Security Management",
    body: "Our security practices protect the confidentiality and integrity of information throughout the entire Software Development Life Cycle (SDLC).",
  },
  {
    title: "Commitment to Customer Success",
    body: "We stay closely involved throughout your project, with senior team members available as advisors to help keep it on track toward a successful outcome.",
  },
  {
    title: "Continuous Innovation",
    body: "We continuously evaluate new tools, frameworks, and practices, testing and integrating the ones that genuinely improve how we build and deliver software.",
  },
];

const WHY_CHOOSE_US_CLOSING_CTA: ServiceClosingCta = {
  text: "Schedule a free consultation with our software development experts.",
  buttonText: "Book now",
  href: "/book-consultation",
};

// Generic, non-platform-specific capability copy — same content
// regardless of which tab (Web/Mobile/Desktop) is active, since this
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
      approach: {
        tagline: "Crafting well-built web applications, one deliberate decision at a time.",
        steps: APPROACH_STEPS,
      },
      roadmap: {
        tagline: "Crafting web experiences that are fast, secure, and built to grow with your business.",
        body: "At Devliora, we build web applications with a clear focus on usability, reliability, and your business goals. From early idea shaping to UX/UI design, development, testing, and ongoing support, our team stays involved throughout the entire process. With over a decade of experience, we understand how to create applications that run smoothly and adapt well to your needs.",
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
      // Web tab only, per explicit request — same per-instance treatment
      // as the "Engineering Excellence" Glassdoor quote on the
      // Performance & Reliability page: kept verbatim rather than
      // genericized, since the request was specifically to reproduce it.
      reviewQuote: {
        text: "Exceptional software quality and attention to detail.",
        source: "Glassdoor",
      },
      scope: {
        intro: "We cover every stage of web application development with a balance of precision and creativity. Here's an overview of what our web development services include.",
        items: [
          {
            title: "Conceptualization & Ideation",
            body: "We collaborate with you to brainstorm and refine innovative ideas. Detailed project scopes and timelines are crafted to align with your vision.",
          },
          {
            title: "Architecture & Design",
            body: "Our team creates scalable and robust architectures that form the backbone of your application. Engaging and responsive designs ensure a seamless user experience across devices.",
          },
          {
            title: "Development & Customization",
            body: "Our expert developers build custom features tailored to your specific business needs. We employ cutting-edge technologies to ensure high performance and security.",
          },
          {
            title: "Integration & Automation",
            body: "Seamless integration with third-party services and APIs enhances functionality. Automation of repetitive tasks increases efficiency and reduces operational costs.",
          },
          {
            title: "Testing & Optimization",
            body: "Comprehensive testing ensures bug-free, optimized performance. Continuous performance monitoring and tuning maintain peak efficiency.",
          },
          {
            title: "Launch & Beyond",
            body: "We handle strategic deployment for a successful launch. Ongoing support and iterative enhancements keep your application ahead of the curve.",
          },
        ],
      },
      // Web tab only, per explicit request. Only "Years in Operation" is
      // a real, verified Devliora figure — the reference's other stats
      // (countries, savings, launches, company count) are that
      // company's own claims and are deliberately left out rather than
      // fabricated for Devliora. See ServiceImpact/ServiceImpactStat.
      impact: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Our Impact in Numbers",
        tagline: "A track record built one project at a time.",
        stats: [
          {
            value: "10",
            label: "Years in Operation",
            tagline: "Building lasting partnerships",
          },
        ],
      },
      // Shown on all three tabs so switching tabs doesn't lose the case
      // studies section — see the note above the far-down "Real
      // results, real impact" section (now hidden on this slug to
      // avoid showing the same case studies twice on one page).
      caseStudiesIntro: {
        highlight: "Success Stats",
        rest: "That Speak Volumes",
        tagline: "Real Results, Real Impact, The Devliora Cases.",
        body: "Explore our work across diverse industries. See how we've tackled real challenges and delivered outcomes our clients can point to — each case study reflects our commitment to quality.",
        ctaText: "Ready to turn ideas into reality?",
      },
      // Web tab only, per explicit request. Purely descriptive
      // engineering-capability copy — no client facts/figures, so kept
      // close to the reference the same way the Comprehensive Scope
      // cards were.
      capabilities: {
        before: "Reliable Solutions with",
        highlight: "Thoughtful",
        after: "Engineering",
        body: "From complex business systems to scalable, everyday web applications, our engineering practice focuses on clarity, performance, and long-term stability. We design software with careful attention to security, maintainability, and your specific needs, ensuring smooth integration and room for future evolution.",
        items: [
          {
            title: "Flexible deployment options",
            body: "We build software that runs dependably across different operating systems and environments, giving teams a consistent experience wherever they work.",
          },
          {
            title: "Streamlined development flow",
            body: "Our streamlined engineering workflows and toolkits help shorten development cycles while maintaining clean, reliable output.",
          },
          {
            title: "Security-first approach",
            body: "Security principles are applied from the ground up, helping protect your systems and data throughout the entire lifecycle.",
          },
          {
            title: "Designed to scale",
            body: "Our solutions grow naturally with your business, staying stable and efficient even as user needs and workloads increase.",
          },
          {
            title: "Versatile engineering toolkit",
            body: "We draw from a wide range of engineering tools, frameworks, and practices to support functionality and ensure a smooth build process.",
          },
        ],
      },
      // Shown on all three tabs so switching tabs doesn't lose it (same
      // reasoning as caseStudiesIntro above). The reasons list matches
      // the far-down page-level "Why choose us" section verbatim (now
      // hidden on this slug) rather than the reference's current
      // wording, since that section's copy was already vetted to avoid
      // the reference's fabricated "20+ years" claim.
      whyChooseUs: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Why Choose Devliora for Your Web Application Development Needs?",
        tagline: "Unmatched Expertise and Dedication",
        reasons: [
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
        ],
        extraCards: WHY_CHOOSE_US_EXTRA_CARDS,
        closingCta: WHY_CHOOSE_US_CLOSING_CTA,
      },
      // Same ring-diagram content as the page-level "Our software
      // essentials" section (SOFTWARE_ESSENTIALS, hidden on this slug
      // in favor of this per-tab version) — generic, non-platform-
      // specific engineering copy, reused rather than duplicated.
      essentials: {
        tagline: "We build web applications with a laser focus on quality, performance, and security — every time.",
        items: SOFTWARE_ESSENTIALS,
      },
      // Web tab only, per explicit request. Distinct from the
      // page-level "Delivery framework" section further down (which
      // lists this service's actual deliverables from service.includes)
      // — this one is generic SDLC-stage copy, same as the reference.
      deliveryFramework: {
        highlight: "From Code to Launch",
        rest: "Devliora's Complete Delivery Framework",
        tagline: "Crafting Solutions with Care – We Build, You Excel!",
        body: "Devliora drives the entire development process, from initial concept to final deployment. Whether starting from scratch or stepping in at any stage of your software's lifecycle, we ensure seamless execution. We also provide ongoing post-launch support, offering long-term maintenance and updates to keep your solutions running smoothly.",
        steps: [
          { title: "Analysis", checkpoint: "Requirements Testing" },
          { title: "Design", checkpoint: "UX/UI Testing" },
          { title: "Development" },
          { title: "Quality Assurance", checkpoint: "Stabilization" },
          { title: "Deployment", checkpoint: "Acceptance testing" },
          { title: "Support" },
        ],
      },
      // Heading/tagline/body match the reference; "our in-house R&D" is
      // reworded to "continuous learning" since it implies a formal R&D
      // department Devliora doesn't have — same reasoning as the
      // "CTO office" / "Centers of Excellence" rewrite above.
      techIntro: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Technologies we work with",
        tagline: "Driven by a mix of cutting-edge tech, endless innovation, and continuous learning.",
        body: "We leverage a wide range of technologies to build powerful, customized solutions tailored to your needs. Our team uses proven tools and methodologies to stay current with the tech landscape, aiming for reliable, future-ready software.",
        // Reference has a Web/Mobile/Desktop toggle here; clicking a
        // pill switches the site's own real tabs above (same three
        // platforms, since Desktop is a genuine Devliora offering). See
        // ServiceTechIntro.showTabToggle in ServiceTabs.tsx.
        showTabToggle: true,
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
      approach: {
        tagline: "Crafting well-built mobile apps, one deliberate decision at a time.",
        steps: APPROACH_STEPS,
      },
      roadmap: {
        tagline: "Building secure, feature-rich mobile experiences that move your business forward.",
        body: "At Devliora, we build mobile applications with a clear focus on usability, reliability, and your business goals. From early idea shaping to UX/UI design, development, testing, and ongoing support, our team stays involved throughout the entire process. With over a decade of experience, we understand how to create apps that run smoothly and adapt well to your needs.",
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
      // Mobile tab, mirroring the Web tab's reviewQuote treatment — the
      // reference's own quote for this tab, reproduced verbatim as a
      // design element rather than genericized.
      reviewQuote: {
        text: "Delivered our project faster than expected without compromising quality.",
        source: "Glassdoor",
      },
      // Unlike the Web tab (whose Comprehensive Scope walks through
      // SDLC stages — already covered for Mobile by the roadmap section
      // above), the reference's Mobile page uses this slot for cost
      // factors instead, so this list is intentionally different in
      // shape from the Web tab's, not just reworded.
      scope: {
        intro: "Mobile app development costs vary based on a number of factors. Here's an overview of what shapes the cost of your mobile application.",
        items: [
          {
            title: "Functionality and Features",
            body: "The app's logic, feature set, and complexity heavily influence cost — the more moving parts, the more engineering effort required.",
          },
          {
            title: "App Design",
            body: "UX research, prototyping, visual design, animations, and branding requirements all factor into the design budget.",
          },
          {
            title: "Platform",
            body: "Native apps for iOS and Android require separate teams and higher cost, while a cross-platform approach is generally more cost-effective.",
          },
          {
            title: "Team",
            body: "Cost is also shaped by the size, expertise, and composition of the development team — project managers, developers, QA, and designers.",
          },
          {
            title: "APIs",
            body: "Integrating third-party services — payments, social logins, mapping, and similar — adds to the overall scope and cost.",
          },
        ],
      },
      // Mobile tab, mirroring Web's impact block. Same real, verified
      // figure ("10" Years in Operation) — not platform-specific, so
      // reused as-is rather than inventing a mobile-only stat.
      impact: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Our Impact in Numbers",
        tagline: "A track record built one project at a time.",
        stats: [
          {
            value: "10",
            label: "Years in Operation",
            tagline: "Building lasting partnerships",
          },
        ],
      },
      caseStudiesIntro: {
        highlight: "Success Stats",
        rest: "That Speak Volumes",
        tagline: "Real Results, Real Impact, The Devliora Cases.",
        body: "Explore our work across diverse industries. See how we've tackled real challenges and delivered outcomes our clients can point to — each case study reflects our commitment to quality.",
        ctaText: "Ready to turn ideas into reality?",
      },
      // Mobile tab, mirroring Web's "Reliable Solutions with Thoughtful
      // Engineering" capabilities section — same structure, reworded for
      // mobile-specific engineering concerns (cross-platform reach,
      // device-level security, etc.) rather than duplicated verbatim.
      capabilities: {
        before: "Reliable Mobile Solutions with",
        highlight: "Thoughtful",
        after: "Engineering",
        body: "From consumer-facing apps to complex mobile platforms, our engineering practice focuses on clarity, performance, and long-term stability. We design mobile software with careful attention to security, maintainability, and your specific needs, ensuring smooth integration and room for future evolution.",
        items: [
          {
            title: "Cross-platform reach",
            body: "We build apps that run dependably across iOS and Android, giving your users a consistent experience regardless of device.",
          },
          {
            title: "Streamlined development flow",
            body: "Our streamlined mobile engineering workflows and toolkits help shorten development cycles while maintaining clean, reliable output.",
          },
          {
            title: "Security-first approach",
            body: "Security principles are applied from the ground up, protecting user data and device-level access throughout the app's lifecycle.",
          },
          {
            title: "Designed to scale",
            body: "Our apps grow naturally with your user base, staying fast and stable even as usage and feature demands increase.",
          },
          {
            title: "Versatile engineering toolkit",
            body: "We draw from a wide range of native and cross-platform tools and frameworks to support functionality and ensure a smooth build process.",
          },
        ],
      },
      whyChooseUs: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Why Choose Devliora for Your Mobile Application Development Needs?",
        tagline: "Unmatched Expertise and Dedication",
        reasons: [
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
        ],
        extraCards: WHY_CHOOSE_US_EXTRA_CARDS,
        closingCta: WHY_CHOOSE_US_CLOSING_CTA,
      },
      essentials: {
        tagline: "We craft mobile apps with a laser focus on quality, performance, and security — every time.",
        items: SOFTWARE_ESSENTIALS,
      },
      // Mobile tab, mirroring Web's "From Code to Launch" delivery
      // framework — generic SDLC-stage copy, same 6 steps, reworded from
      // "software's lifecycle" to "mobile app's lifecycle".
      deliveryFramework: {
        highlight: "From Code to Launch",
        rest: "Devliora's Complete Delivery Framework",
        tagline: "Crafting Solutions with Care – We Build, You Excel!",
        body: "Devliora drives the entire development process, from initial concept to final deployment. Whether starting from scratch or stepping in at any stage of your mobile app's lifecycle, we ensure seamless execution. We also provide ongoing post-launch support, offering long-term maintenance and updates to keep your apps running smoothly.",
        steps: [
          { title: "Analysis", checkpoint: "Requirements Testing" },
          { title: "Design", checkpoint: "UX/UI Testing" },
          { title: "Development" },
          { title: "Quality Assurance", checkpoint: "Stabilization" },
          { title: "Deployment", checkpoint: "Acceptance testing" },
          { title: "Support" },
        ],
      },
      techIntro: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Powering your mobile vision with cutting-edge tech",
        tagline: "Bringing mobile ideas to life with next-gen tech.",
        body: "Our mobile application development approach focuses on thoughtful use of modern technologies to build reliable, well-designed apps. Across iOS and Android, we combine practical engineering with considered design to address your specific requirements. Our team works with current tools and frameworks to ensure long-term maintainability — from native to hybrid and cross-platform, we support the full journey from concept to launch.",
        // Same real Web/Mobile/Desktop tab toggle as the Web tab — see
        // note on that tab's techIntro.
        showTabToggle: true,
        // Reference's own Mobile-relevant tech stack — real language
        // names, not fabricated. "Objective-C", "Java", and "C#" don't
        // have brand icons in techIcons.ts (Apple/Oracle/Microsoft had
        // simple-icons remove theirs) so those three render as a plain
        // colored dot instead, same fallback the site-wide grid uses.
        curatedTechNames: [
          "Kotlin",
          "Swift",
          "Objective-C",
          "TypeScript",
          "Java",
          "C#",
          "Dart",
          "HTML5",
          "CSS3",
          "JavaScript",
        ],
      },
    },
    {
      // Enterprise tab removed per explicit request, to match the
      // reference's real 3-tab structure (Web/Mobile/Desktop) exactly
      // now that Desktop is confirmed as a genuine Devliora offering —
      // it was only added earlier as a substitute for the reference's
      // Desktop toggle, back when Desktop wasn't yet confirmed real.
      //
      // Added per explicit confirmation that Devliora does offer desktop
      // application development — same full-parity treatment as
      // Web/Mobile. Content adapted from the reference's own Desktop
      // page, except its
      // "roadmap" section (which lists industry verticals — Healthcare,
      // Finance, Furniture eCommerce, Telecom, Logistics, Retail —
      // rather than the SDLC stages every other roadmap on this page
      // uses) and its "93% of bots...unverified" security stat, both of
      // which read as a content mix-up on the reference's own site
      // rather than real Desktop-specific claims, so kept consistent
      // with the site's own established pattern instead.
      label: "Desktop",
      heading: "Desktop Application Development",
      body: "Custom and platform-based desktop applications that transform internal workflows, streamline business operations, and bring innovative digital solutions to life — for Windows, macOS, and Linux. We handle everything from initial architecture through release and post-launch support.",
      // Unlike Web/Mobile, the reference's own Desktop page uses a
      // process-stage card pattern here instead of "Custom/Platform-
      // Based/Legacy" — kept verbatim since it's real, generic
      // descriptive copy with no fabricated claims.
      cards: [
        {
          title: "Design and Develop",
          body: "We start by understanding your needs and designing custom desktop applications that meet your requirements. Our development process ensures a product that aligns with your business goals and enhances user experience.",
        },
        {
          title: "Test and Refine",
          body: "Rigorous testing and refinement ensure that our desktop applications perform flawlessly. We identify and address any issues, optimizing functionality and user experience before launch.",
        },
        {
          title: "Deploy and Support",
          body: "Once deployed, we provide ongoing support and maintenance to ensure your desktop applications continue to operate efficiently. Our team is here to assist with updates, troubleshooting, and enhancements.",
        },
      ],
      // Desktop tab only, matching the reference's own page. The 93%
      // stat is Cloudflare's own bot-traffic research, cited with
      // attribution — not a Devliora claim — same treatment as the
      // Accenture research citation elsewhere on this site.
      security: {
        heading: "Fortifying your desktop app with top-notch security",
        body: "We embed cybersecurity throughout our desktop app development, using threat modeling, input validation, and security headers. Our approach includes data encryption and SAST/DAST testing, with continuous exploration of new security measures to stay ahead of threats.",
        checklist: [
          "Embedded Cybersecurity",
          "Threat Modeling",
          "Input Validation",
          "Security Headers",
          "Data Encryption",
          "SAST & DAST",
          "Continuous Exploration",
        ],
        stat: {
          value: "93%",
          percent: 93,
          description: "of bots identified in 2024 were unverified bots, and potentially malicious.",
          source: "Cloudflare",
        },
        ctaText: "Unlock new possibilities with our tailored desktop solutions.",
      },
      // Desktop tab only, matching the reference's own page verbatim,
      // including "TypeScript" in the business-users list and the
      // "Colaboration" spelling — per explicit request to match the
      // reference exactly rather than editorialize its content.
      targetUsers: {
        heading: "Desktop apps for your target users",
        tagline: "Crafting desktop experiences that engage, empower, and elevate your users.",
        body: "At Devliora, we excel in developing both enterprise and consumer-facing desktop applications. For every unique user group, we tailor feature sets and user experiences that perfectly align with their needs and preferences.",
        groups: [
          {
            heading: "For business users",
            items: [
              "Digital workplace",
              "Digital content",
              "Colaboration",
              "TypeScript",
              "HR management",
              "CRM",
              "Enterprise resource planning",
              "Business intelligence",
              "Business process management",
            ],
          },
          {
            heading: "For consumers",
            items: [
              "Customer portals",
              "Ecommerce portals",
              "eLearning portals",
              "B2B portals",
              "Employee portals",
              "Healthcare portals",
              "Project management",
              "Finance managers",
            ],
          },
        ],
        ctaText: "Ready to turn ideas into reality?",
      },
      // No "approach" zigzag on Desktop, unlike Web/Mobile — the
      // reference's own Desktop page goes straight from this CTA into
      // the roadmap, per explicit request to match it exactly.
      // Per explicit request, this matches the reference's own Desktop
      // roadmap verbatim — industry verticals rather than the SDLC
      // stages every other roadmap on this page uses. "RegFollower"
      // (a bullet under Finance on the reference) reads as the name of
      // one of their own client projects rather than a generic
      // capability, so it's left out rather than implied as Devliora's.
      roadmap: {
        tagline: "Building stable, high-performance desktop software for long-term use.",
        body: "We transform ideas into reliable desktop applications designed for performance, security, and usability. From early planning and design to development, testing, and long-term support, we manage every stage of the process. Our experience helps ensure desktop solutions that remain dependable as business needs evolve.",
        steps: [
          {
            title: "Healthcare",
            body: "Our desktop applications for healthcare streamline patient management, improve clinical workflows, and ensure compliance with regulations. We offer solutions that enhance both provider and patient experiences.",
            bullets: ["Efficient patient data management", "Secure communication channels"],
          },
          {
            title: "Finance",
            body: "In finance, our desktop solutions optimize transaction processing, enhance data security, and ensure compliance with financial regulations. We provide tools that support robust financial management and analytics.",
            bullets: [
              "Streamlined transaction processing",
              "Advanced data security features",
              "Compliance with financial regulations",
            ],
          },
          {
            title: "Furniture eCommerce",
            body: "Our desktop applications for furniture eCommerce help you manage inventory, track orders, and enhance the online shopping experience. We design solutions that drive sales and improve customer satisfaction.",
          },
          {
            title: "Telecom",
            body: "In telecom, our desktop applications enhance customer service management, streamline billing processes, and support network monitoring. We provide solutions that improve service delivery and operational efficiency.",
            bullets: ["Customer service management", "Network performance monitoring"],
          },
          {
            title: "Logistics",
            body: "Our desktop solutions for logistics optimize route planning, track shipments, and manage fleet operations. We deliver tools that improve operational efficiency and reduce costs.",
          },
          {
            title: "Retail",
            body: "For retail, our desktop apps streamline point-of-sale systems, manage inventory, and offer real-time sales analytics. We create solutions that boost efficiency and enhance the shopping experience.",
          },
        ],
      },
      // Unlike Web's SDLC-stage Scope, this mirrors the reference
      // Desktop page's own "Cost-Effective Desktop Application
      // Development" section — cost-control practices rather than cost
      // factors, since that's what the reference actually covers here.
      scope: {
        intro: "Building a desktop application doesn't have to be costly. Here's how we manage budgets while delivering dependable, high-quality solutions.",
        items: [
          {
            title: "Strategic Planning",
            body: "We begin with a thorough analysis of your project needs to create a clear, actionable plan. Defining scope, requirements, and milestones early minimizes the risk of scope creep and unforeseen costs.",
          },
          {
            title: "Efficient Development",
            body: "Our development process emphasizes efficiency through agile methodologies and reusable code, reducing development time and cost while maintaining high standards of quality.",
          },
          {
            title: "Continuous Optimization",
            body: "We continuously monitor and optimize the application throughout the development lifecycle, catching potential issues early rather than through costly revisions later.",
          },
        ],
      },
      impact: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Our Impact in Numbers",
        tagline: "A track record built one project at a time.",
        stats: [
          {
            value: "10",
            label: "Years in Operation",
            tagline: "Building lasting partnerships",
          },
        ],
      },
      caseStudiesIntro: {
        highlight: "Success Stats",
        rest: "That Speak Volumes",
        tagline: "Real Results, Real Impact, The Devliora Cases.",
        body: "Explore our work across diverse industries. See how we've tackled real challenges and delivered outcomes our clients can point to — each case study reflects our commitment to quality.",
        ctaText: "Ready to turn ideas into reality?",
      },
      capabilities: {
        before: "Reliable Desktop Solutions with",
        highlight: "Thoughtful",
        after: "Engineering",
        body: "From internal business tools to consumer-facing desktop products, our engineering practice focuses on clarity, performance, and long-term stability. We design desktop software with careful attention to security, maintainability, and your specific needs, ensuring smooth integration and room for future evolution.",
        items: [
          {
            title: "Cross-platform reach",
            body: "We build desktop apps that run dependably across Windows, macOS, and Linux, giving your users a consistent experience regardless of platform.",
          },
          {
            title: "Streamlined development flow",
            body: "Our streamlined desktop engineering workflows and toolkits help shorten development cycles while maintaining clean, reliable output.",
          },
          {
            title: "Security-first approach",
            body: "Security principles are applied from the ground up, protecting user data and system-level access throughout the application's lifecycle.",
          },
          {
            title: "Designed to scale",
            body: "Our desktop applications grow naturally with your business, staying fast and stable even as usage and feature demands increase.",
          },
          {
            title: "Versatile engineering toolkit",
            body: "We draw from a wide range of desktop frameworks and tools to support functionality and ensure a smooth build process.",
          },
        ],
      },
      whyChooseUs: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Why Choose Devliora for Your Desktop Application Development Needs?",
        tagline: "Unmatched Expertise and Dedication",
        reasons: [
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
        ],
        extraCards: WHY_CHOOSE_US_EXTRA_CARDS,
        closingCta: WHY_CHOOSE_US_CLOSING_CTA,
      },
      essentials: {
        tagline: "We build desktop applications with a laser focus on quality, performance, and security — every time.",
        items: SOFTWARE_ESSENTIALS,
      },
      deliveryFramework: {
        highlight: "From Code to Launch",
        rest: "Devliora's Complete Delivery Framework",
        tagline: "Crafting Solutions with Care – We Build, You Excel!",
        body: "Devliora drives the entire development process, from initial concept to final deployment. Whether starting from scratch or stepping in at any stage of your desktop application's lifecycle, we ensure seamless execution. We also provide ongoing post-launch support, offering long-term maintenance and updates to keep your applications running smoothly.",
        steps: [
          { title: "Analysis", checkpoint: "Requirements Testing" },
          { title: "Design", checkpoint: "UX/UI Testing" },
          { title: "Development" },
          { title: "Quality Assurance", checkpoint: "Stabilization" },
          { title: "Deployment", checkpoint: "Acceptance testing" },
          { title: "Support" },
        ],
      },
      techIntro: {
        ctaText: "Ready to turn ideas into reality?",
        heading: "Powering your desktop vision with cutting-edge tech",
        tagline: "Bringing desktop ideas to life with next-gen tech.",
        body: "Our desktop application development approach focuses on thoughtful use of modern technologies to build reliable, well-designed apps. Across Windows, macOS, and Linux, we combine practical engineering with considered design to address your specific requirements. Our team works with current tools and frameworks to ensure long-term maintainability — from native to cross-platform, we support the full journey from concept to launch.",
        showTabToggle: true,
        // Real desktop-relevant languages/frameworks, same treatment as
        // Mobile's curatedTechNames — not the site-wide technologies grid.
        curatedTechNames: [".NET", "Java", "C#", "Python", "JavaScript", "TypeScript", "Swift", "Kotlin"],
      },
    },
  ],
};

// The reference (and now this site) gives each platform tab its own URL
// — /services/software-engineering-mobile opens straight to the Mobile
// tab — rather than only a client-side pill toggle on one shared URL.
// "Web" has no suffix (it's the bare slug, same as before this existed).
// Only strips a suffix when the resulting base slug actually has tabs
// defined, so an unrelated service slug that happens to end in
// "-mobile" etc. isn't misread.
const TAB_SLUG_SUFFIXES: [string, string][] = [
  ["-mobile", "Mobile"],
  ["-desktop", "Desktop"],
  ["-web", "Web"],
];

function parseServiceSlug(rawSlug: string): { baseSlug: string; tabLabel: string | null } {
  for (const [suffix, label] of TAB_SLUG_SUFFIXES) {
    if (rawSlug.endsWith(suffix)) {
      const base = rawSlug.slice(0, -suffix.length);
      if (SERVICE_TABS[base]?.some((t) => t.label === label)) {
        return { baseSlug: base, tabLabel: label };
      }
    }
  }
  return { baseSlug: rawSlug, tabLabel: null };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const { baseSlug: slug, tabLabel } = parseServiceSlug(rawSlug);
  const [
    service,
    hero,
    caseStudies,
    blogPosts,
    testimonial,
    technologies,
    featuredPortfolios,
    allServices,
    industries,
  ] = await Promise.all([
    fetchServiceBySlug(slug),
    fetchHero(),
    safeFetchCaseStudies(),
    safeFetchBlogPosts(),
    fetchFeaturedTestimonial(),
    safeFetchTechnologies(),
    safeFetchFeaturedPortfolios(),
    fetchServices(),
    fetchIndustries(),
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

  // The "Years in Operation" stat is the only one hardcoded in
  // SERVICE_TABS (it's not derived from any API); the rest of the
  // "Our Impact in Numbers" grid is filled out here with real, live
  // counts from Devliora's own data instead of copying the reference's
  // fabricated figures (35 countries, $100M savings, etc.) — same
  // 5-column layout, honest numbers.
  const tabs = SERVICE_TABS[service.slug]?.map((tab) =>
    tab.impact
      ? {
          ...tab,
          impact: {
            ...tab.impact,
            stats: [
              ...tab.impact.stats,
              {
                value: `${allServices.length}`,
                label: "Services Offered",
                tagline: "Full-cycle software delivery",
              },
              {
                value: `${industries.length}`,
                label: "Industries Served",
                tagline: "Domain-aware engineering",
              },
              {
                value: `${technologies.length}`,
                label: "Technologies We Use",
                tagline: "A modern, proven stack",
              },
              {
                value: `${caseStudies.length}`,
                label: "Case Studies Delivered",
                tagline: "Real, documented outcomes",
              },
            ],
          },
        }
      : tab
  );

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

        {/* "Key facts at a glance" — Performance & Reliability Engineering
            only, static. NOTE: the reference's facts included specific
            claimed figures ("3,600+ concurrent users simulated per test",
            "1 master, 6 slave servers", "1-2 weeks setup", "82% of
            findings traced to infrastructure and application layer") —
            KAZ's own reported numbers, not verified Devliora data. Per
            explicit request these are reworded to qualitative capability
            statements instead of invented figures. */}
        {service.slug === "performance-reliability-engineering" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                Key facts at a glance
              </h2>
              <p className="mt-5 max-w-2xl text-paper/70">
                With hands-on experience in distributed load testing, our team brings deep
                expertise across web, APIs, e-commerce, and Magento platforms, helping projects
                move forward with confidence and deliver performance-ready solutions.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-5 sm:grid-cols-2">
                {[
                  "End-to-end performance testing partner",
                  "Fast test setup with early, actionable results",
                  "Distributed load testing on real cloud infrastructure",
                  "Simulates realistic concurrent user loads per test",
                  "Experience across web, API, e-commerce, and Magento platforms",
                  "Findings mapped to infrastructure and application-layer root causes",
                ].map((fact) => (
                  <p key={fact} className="font-semibold text-paper">
                    {fact}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "More solutions designed to deliver meaningful outcomes" —
            Performance & Reliability Engineering only, static. Generic
            capability copy, no fabricated claims. 5-item 2-column grid,
            each with an arrow-accented title + underline + description —
            distinct enough from every other generic per-service section
            (highlights/toolNames/processSteps) that it's built as bespoke
            markup rather than stretched onto one of those. */}
        {service.slug === "performance-reliability-engineering" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-12 md:grid-cols-2">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  {renderHighlightedHeading("{More solutions} designed to deliver meaningful outcomes.")}
                </h2>
                <p className="text-paper/70">
                  Our teams combine thoughtful design with dependable engineering. From
                  cross-platform applications using Flutter to clean frontend interfaces and
                  reliable database solutions with SQL Server and MySQL, we support a wide range
                  of needs. Our cloud specialists design scalable, secure AWS environments that
                  enable teams to build and iterate with confidence.
                </p>
              </div>

              <div className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2">
                {[
                  {
                    title: "Flutter Development",
                    body: "Craft beautiful, high-performance apps with our Flutter experts, ready to bring your vision to life across all platforms.",
                  },
                  {
                    title: "Frontend Development",
                    body: "Deliver stunning, user-centric interfaces with our seasoned frontend developers who blend creativity with code.",
                  },
                  {
                    title: "SQL Server Development",
                    body: "Optimize your data management with our skilled SQL Server developers, ensuring robust and scalable database solutions.",
                  },
                  {
                    title: "MySQL Development",
                    body: "Leverage the strength of MySQL with our developers who excel at building efficient and reliable databases.",
                  },
                  {
                    title: "AWS Development",
                    body: "Scale effortlessly with our AWS experts, mastering cloud solutions tailored to your business needs.",
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <div className="flex items-center gap-2 border-b border-paper/15 pb-3">
                      <h3 className="font-semibold text-ember">{item.title}</h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ember" />
                    </div>
                    <p className="mt-4 text-paper/70">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* "Engineering Excellence" — Performance & Reliability Engineering
            only, static. Kept verbatim with the Glassdoor attribution per
            explicit request (unlike the same section on the Staff
            Augmentation page, where the equivalent Glassdoor quote was
            genericized — this choice is per-instance, not a standing
            policy). */}
        {service.slug === "performance-reliability-engineering" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
              <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start md:gap-16">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Engineering Excellence
                </h2>
                <div>
                  <div className="flex items-start gap-2 sm:gap-4">
                    <span className="shrink-0 font-display text-3xl leading-none text-ember sm:text-5xl">
                      &ldquo;
                    </span>
                    <p className="text-balance text-xl font-medium leading-snug text-paper sm:text-2xl">
                      Supportive management and a collaborative work culture.
                    </p>
                    <span className="shrink-0 font-display text-3xl leading-none text-ember sm:text-5xl">
                      &rdquo;
                    </span>
                  </div>
                  <p className="mt-6 text-right font-display text-2xl font-bold uppercase tracking-wide text-paper/60">
                    &lsquo;GLASSDOOR&rsquo;
                  </p>
                </div>
              </div>
            </div>
          </section>
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

                {/* Below sm, 3 categories x 2 subs each squeezes into
                    unreadably narrow columns, so the connector-line tree
                    is desktop/tablet only and mobile gets a simple
                    stacked list instead (no lines, just spacing). */}
                <div className="hidden sm:flex">
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

                <div className="mt-8 flex flex-col gap-10 sm:hidden">
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
                  ].map((cat) => (
                    <div key={cat.title} className="flex flex-col items-center text-center">
                      <cat.icon className="h-7 w-7 text-ember" strokeWidth={1.5} />
                      <p className="mt-2 font-semibold text-paper">{cat.title}</p>

                      <div className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-2 border-t border-paper/15 pt-4">
                        {cat.subs.map((sub) => (
                          <div key={sub.title} className="flex flex-col items-center gap-1.5">
                            <p className="text-sm font-medium text-paper">{sub.title}</p>
                            {sub.leaves.map((leaf) => (
                              <p key={leaf} className="text-xs leading-snug text-paper/60">
                                {leaf}
                              </p>
                            ))}
                          </div>
                        ))}
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
                <div className="flex items-start gap-2 sm:gap-4">
                  <span className="shrink-0 font-display text-3xl leading-none text-ember sm:text-5xl">
                    &ldquo;
                  </span>
                  <p className="text-balance text-xl font-medium leading-snug text-paper sm:text-2xl">
                    Building a culture where technical excellence and continuous learning go
                    hand in hand, so every engineer we place is set up to do their best work.
                  </p>
                  <span className="shrink-0 font-display text-3xl leading-none text-ember sm:text-5xl">
                    &rdquo;
                  </span>
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

        {/* "Software quality assurance" intro + testing roadmap — Software
            Quality Assurance only, static. Generic process copy, no
            fabricated claims. The reference's timeline has 5 numbered
            milestones (Analysis/Design/Development/Deployment/Support)
            plus an unlabeled 6th phase ("Stabilization", hollow dot, no
            number) sitting between Development and Deployment. Built
            with the same 3-row CSS-grid technique as the Digital
            Marketing roadmap (dashed stub + solid line spanning row 2,
            dots per column) rather than a per-column border, so the line
            reads as one continuous connector instead of 6 separate
            segments. */}
        {service.slug === "software-quality-assurance" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-12 md:grid-cols-2">
                <div>
                  <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                    Software quality assurance
                  </h2>
                  <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
                    Rigorous testing, flawless results, guaranteed quality—every time.
                  </p>
                </div>
                <p className="text-paper/70">
                  Our QA team performs thorough testing throughout each stage of development to
                  ensure the software meets quality standards and aligns with both functional and
                  non-functional requirements. The focus is on delivering a reliable, well-tested
                  product that&apos;s ready for real-world use.
                </p>
              </div>

              {(() => {
                const steps = [
                  {
                    number: "1",
                    phase: "Analysis",
                    subtitle: "Requirements testing",
                    items: ["Requirements Testing"],
                    filled: true,
                  },
                  {
                    number: "2",
                    phase: "Design",
                    subtitle: "UX/UI testing",
                    items: ["Prototype Testing", "Usability Testing"],
                    filled: true,
                  },
                  {
                    number: "3",
                    phase: "Development",
                    subtitle: "Ongoing testing",
                    items: [
                      "Compatibility Testing",
                      "Web Service Testing",
                      "Functional Testing",
                      "Security Testing",
                      "Performance Audit",
                      "Test Automation",
                    ],
                    filled: true,
                  },
                  {
                    number: null,
                    phase: null,
                    subtitle: "Stabilization",
                    items: ["Regression Testing", "End-To-End Testing"],
                    filled: false,
                  },
                  {
                    number: "4",
                    phase: "Deployment",
                    subtitle: "Acceptance testing",
                    items: ["Upgrade Testing", "Migration Testing"],
                    filled: true,
                  },
                  {
                    number: "5",
                    phase: "Support",
                    subtitle: "Production support",
                    items: ["Reproducing Issues", "Identifying Causes Of Issues"],
                    filled: true,
                  },
                ];
                const stub = 100 / (steps.length * 2);

                return (
                  <div className="mt-16 overflow-x-auto pb-2">
                    <div
                      className="relative grid min-w-[820px]"
                      style={{
                        gridTemplateColumns: `repeat(${steps.length}, minmax(120px, 1fr))`,
                        gridTemplateRows: "auto 1.75rem auto",
                      }}
                    >
                      {/* continuous line: dashed stub, solid, dashed stub */}
                      <div
                        className="flex items-center self-center"
                        style={{ gridColumn: "1 / -1", gridRow: "2" }}
                      >
                        <div
                          className="h-px shrink-0 border-t border-dashed border-paper/30"
                          style={{ width: `${stub}%` }}
                        />
                        <div className="h-px flex-1 bg-paper/30" />
                        <div
                          className="h-px shrink-0 border-t border-dashed border-paper/30"
                          style={{ width: `${stub}%` }}
                        />
                      </div>

                      {steps.map((step, i) => (
                        <div
                          key={`label-${step.subtitle}`}
                          className="flex items-baseline gap-1.5 px-2 pb-4"
                          style={{ gridColumn: `${i + 1}`, gridRow: "1" }}
                        >
                          {step.number && (
                            <>
                              <span className="font-display text-lg font-bold text-ember">
                                {step.number}
                              </span>
                              <span className="font-semibold text-paper">{step.phase}</span>
                            </>
                          )}
                        </div>
                      ))}

                      {steps.map((step, i) => (
                        <div
                          key={`dot-${step.subtitle}`}
                          className="flex justify-center"
                          style={{ gridColumn: `${i + 1}`, gridRow: "2" }}
                        >
                          <span
                            className={`h-3.5 w-3.5 rounded-full ring-4 ring-ink ${
                              step.filled ? "bg-ember" : "border-2 border-ember bg-ink"
                            }`}
                          />
                        </div>
                      ))}

                      {steps.map((step, i) => (
                        <div
                          key={`body-${step.subtitle}`}
                          className="px-2 pt-4"
                          style={{ gridColumn: `${i + 1}`, gridRow: "3" }}
                        >
                          <p className="font-semibold text-paper">{step.subtitle}</p>
                          <ul className="mt-2 flex flex-col gap-1">
                            {step.items.map((item) => (
                              <li key={item} className="text-sm leading-snug text-paper/70">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        {/* "Ensure flawless performance with our QA expertise" CTA banner —
            Software Quality Assurance only, static, same two-line-capable
            bg-signal pattern as the page's other CTA banners (single line
            here). */}
        {service.slug === "software-quality-assurance" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Ensure flawless performance with our QA expertise.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Test Perfect
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Proactive risk management" — Software Quality Assurance only,
            static. Generic risk-framework copy, no fabricated claims. The
            diagram is a true compass layout — center gradient-bordered
            circle (same gradient-via-padding-wrapper technique as the IT
            Consulting radial diagram) with 4 straight spokes to cardinal
            points, matching the reference more closely per follow-up
            request (the earlier 3x3-grid version had no connecting
            lines). Since only 4 cardinal directions are needed (not 8
            radial angles), the spokes are hardcoded vertical/horizontal
            segments rather than trig-computed. "2. Measurement" has no
            body text under its label — that matches the reference
            exactly (an earlier draft had invented a description there;
            removed per explicit request to copy only what's actually
            there, not add anything extra). */}
        {service.slug === "software-quality-assurance" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-16 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                    Proactive risk management
                  </h2>
                  <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
                    Identifying risks, assessing impacts, and mitigating threats—ensuring your
                    project&apos;s success
                  </p>
                  <p className="mt-5 max-w-md text-paper/70">
                    We employ a structured risk management framework to identify, assess, and
                    mitigate potential risks throughout the development lifecycle. This proactive
                    approach helps maintain software quality, protect delivery timelines, and
                    reduce uncertainty,{" "}
                    <span className="text-ember">
                      ensuring projects progress with stability and control
                    </span>
                    .
                  </p>
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-lg py-10">
                  {/* top spoke: 1. Identification */}
                  <div
                    className="absolute left-1/2 top-[18%] h-[16%] w-px -translate-x-1/2"
                    style={{ backgroundImage: "linear-gradient(to bottom, #a78bfa, #60a5fa)" }}
                  />
                  <span
                    className="absolute left-1/2 top-[34%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: "#a78bfa" }}
                  />
                  <div className="absolute left-1/2 top-0 w-40 -translate-x-1/2 text-center sm:w-48">
                    <p className="font-semibold text-paper">1. Identification</p>
                    <p className="mt-1 text-sm leading-snug text-paper/60">
                      Risk Committee review and Risk Owner appointment
                    </p>
                  </div>

                  {/* right spoke: 2. Measurement */}
                  <div
                    className="absolute left-[66%] top-1/2 h-px w-[16%] -translate-y-1/2"
                    style={{ backgroundImage: "linear-gradient(to right, #8b9bf6, #60a5fa)" }}
                  />
                  <span
                    className="absolute left-[82%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: "#60a5fa" }}
                  />
                  <div className="absolute left-[86%] top-1/2 w-40 -translate-y-1/2 text-left sm:w-48">
                    <p className="font-semibold text-paper">2. Measurement</p>
                  </div>

                  {/* bottom spoke: 3. Mitigation */}
                  <div
                    className="absolute left-1/2 top-[66%] h-[16%] w-px -translate-x-1/2"
                    style={{ backgroundColor: "#60a5fa" }}
                  />
                  <span
                    className="absolute left-1/2 top-[66%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: "#60a5fa" }}
                  />
                  <div className="absolute bottom-0 left-1/2 w-40 -translate-x-1/2 text-center sm:w-48">
                    <p className="font-semibold text-paper">3. Mitigation</p>
                    <p className="mt-1 text-sm leading-snug text-paper/60">
                      Creation and execution of a mitigation plan
                    </p>
                  </div>

                  {/* left spoke: 4. Reporting & Monitoring */}
                  <div
                    className="absolute left-[18%] top-1/2 h-px w-[16%] -translate-y-1/2"
                    style={{ backgroundImage: "linear-gradient(to left, #8b9bf6, #60a5fa)" }}
                  />
                  <span
                    className="absolute left-[18%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: "#60a5fa" }}
                  />
                  <div className="absolute right-[86%] top-1/2 w-40 -translate-y-1/2 text-right sm:w-48">
                    <p className="font-semibold text-paper">4. Reporting &amp; Monitoring</p>
                    <p className="mt-1 text-sm leading-snug text-paper/60">
                      Registration of risk attributes and ongoing review
                    </p>
                  </div>

                  {/* center circle */}
                  <div
                    className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-[2px] sm:h-28 sm:w-28"
                    style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #60a5fa)" }}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-ink">
                      <div className="relative flex h-9 w-9 items-center justify-center">
                        <Shield className="h-9 w-9 text-signal" strokeWidth={1.5} />
                        <Star
                          className="absolute h-3.5 w-3.5 text-signal"
                          strokeWidth={1.5}
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* "Quality management" — Software Quality Assurance only. Same
            shared component the /services, IT Consulting, and IT
            Maintenance & Support pages use — this reference has the
            identical heading and bullets too. */}
        {service.slug === "software-quality-assurance" && (
          <QualityManagement description="Devliora is a quality-driven software development company, committed to setting and maintaining high standards in engineering practices. We follow proven processes and comply with established quality and information security frameworks to ensure every solution is robust, secure, and built to last." />
        )}

        {/* "Boost your software's reliability with precision QA" CTA
            banner — Software Quality Assurance only, static, same
            bg-signal pattern as the page's other CTA banners. */}
        {service.slug === "software-quality-assurance" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Boost your software&apos;s reliability with precision QA.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                Assure Quality
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* Testing-automation step chain + tools row — Software Quality
            Assurance only, static. Generic process copy, no fabricated
            claims. Reference shows 5 real tool logos in this order:
            Postman, [unidentified], Apache JMeter, Selenium, Appium —
            4 of 5 confirmed and added to techIcons.ts by rendering
            candidate SVGs and comparing against a higher-res follow-up
            screenshot. The 2nd icon (gray diamond outline with a
            stylized "S") couldn't be matched to anything in the
            simple-icons catalog after checking soapui, saucelabs,
            testrail, swagger, and others — left off rather than
            guessed. */}
        {service.slug === "software-quality-assurance" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {["Testing scope definition", "Automation tools selection", "Testing framework development", "Framework implementation", "Test automation monitoring & support"].map(
                  (step, i, steps) => (
                    <div key={step} className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-40 rounded-lg border-2 px-4 py-4 text-center text-sm font-medium text-paper sm:w-44 ${
                          i % 2 === 0 ? "border-signal" : "border-[#a78bfa]"
                        }`}
                      >
                        {step}
                      </div>
                      {i < steps.length - 1 && (
                        <ChevronRight className="h-5 w-5 shrink-0 text-paper/40" />
                      )}
                    </div>
                  ),
                )}
              </div>

              <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {["postman", "apachejmeter", "selenium", "appium"].map((key) => (
                  <div
                    key={key}
                    className="flex h-14 items-center opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0 sm:h-16"
                  >
                    <TechBrandIcon name={key} className="h-12 w-12 sm:h-14 sm:w-14" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
          <ServiceTabs
            tabs={tabs}
            baseSlug={service.slug}
            initialActiveLabel={tabLabel}
            heroImageUrl={hero?.backgroundImageUrl}
            technologies={technologies}
            caseStudies={caseStudies}
            tabCaseStudies={service.tabCaseStudies}
            testimonial={testimonial}
          />
        ) : service.slug === "it-consulting" ||
          service.slug === "it-maintenance-support" ||
          service.slug === "digital-design" ||
          service.slug === "digital-marketing" ||
          service.slug === "staff-augmentation" ||
          service.slug === "software-quality-assurance" ||
          service.slug === "performance-reliability-engineering" ? null : (
          /* Fallback overview for services without a tab breakdown. Every
             bespoke-page slug above already shows shortDescription/
             fullDescription in its own hero or intro section, so this
             generic "Overview" block (same two fields, duplicated) is
             excluded there — found as a bug: it was silently rendering a
             second, redundant Overview block on Digital Design, Digital
             Marketing, Staff Augmentation, and Software Quality Assurance
             too, not just the newly-built Performance & Reliability
             Engineering page. */
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
                      {card.imageUrl ? (
                        <Image
                          src={resolveImageUrl(card.imageUrl)}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-75"
                          style={{
                            backgroundImage:
                              INDUSTRY_CARD_FALLBACK_GRADIENTS[i % INDUSTRY_CARD_FALLBACK_GRADIENTS.length],
                          }}
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

        {/* "Top-tier engineers..." CTA banner + "Our performance testing
            engagement models" — Performance & Reliability Engineering
            only, static. Bespoke rather than the generic Engagement
            Models / Software Essentials sections (both hidden for this
            slug above) because the reference's version is specific to
            performance testing, not a generic pricing-model list. Team
            roles are a generic team-composition description, not a
            fabricated claim about staffing levels. CTA stays on
            bg-signal, not the reference's actual slate-blue, matching
            every other CTA banner on the site. */}
        {service.slug === "performance-reliability-engineering" && (
          <>
            <section className="border-t border-paper/10 bg-signal">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                  <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                    Top-tier engineers skilled in JMeter and performance testing. Ready to
                    elevate your project?
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
                >
                  Get Talent
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </section>

            <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
              <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Our performance testing engagement models
                </h2>

                <div className="mt-14 grid gap-16 md:grid-cols-2 md:items-center">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-signal">
                      Full performance audit
                    </h3>
                    <p className="mt-4 text-paper/70">
                      We undertake the entire process of performance testing, from test
                      planning and environment setup to load simulation and analysis, with
                      full responsibility for findings quality and remediation reporting.
                    </p>

                    <p className="mt-8 font-semibold text-paper">Why opt for a full performance audit:</p>
                    <ul className="mt-4 space-y-3">
                      {[
                        "End-to-end test ownership with zero internal overhead",
                        "Faster bottleneck discovery and remediation roadmap",
                        "An independent perspective on your platform's breaking points",
                        "Access to distributed AWS testing infrastructure you don't need to build",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-paper/80">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative mx-auto hidden aspect-square w-full max-w-md md:block">
                    <div className="absolute inset-[15%] rounded-full border border-dashed border-paper/30" />
                    <div
                      className="absolute inset-[27%] rounded-full p-[2px]"
                      style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #60a5fa)" }}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-ink">
                        <Users className="h-9 w-9 text-signal" strokeWidth={1.5} />
                      </div>
                    </div>

                    {TEAM_ROLE_POSITIONS.map((pos, i) => {
                      const dot = <span key="dot" className="h-2.5 w-2.5 shrink-0 rounded-full bg-ember" />;
                      const label = (
                        <span key="label" className="text-sm text-paper/80">
                          {PERFORMANCE_ENGAGEMENT_TEAM[i]}
                        </span>
                      );
                      // Outside-the-ring direction differs per point: top/bottom
                      // stack vertically (label above or below the dot), the
                      // rest sit beside the dot, label away from the ring.
                      const flexClass =
                        pos.side === "top" || pos.side === "bottom" ? "flex-col gap-2" : "flex-row gap-2.5";
                      const children =
                        pos.side === "top" || pos.side === "left" ? [label, dot] : [dot, label];
                      return (
                        <div
                          key={PERFORMANCE_ENGAGEMENT_TEAM[i]}
                          className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap ${flexClass}`}
                          style={{ top: `calc(${pos.top} * 0.7 + 15%)`, left: `calc(${pos.left} * 0.7 + 15%)` }}
                        >
                          {children}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile: the ring is decorative and hidden below md, but
                      the team composition itself is real content, so it
                      gets a plain chip list instead of just disappearing. */}
                  <div className="flex flex-wrap gap-2 md:hidden">
                    {PERFORMANCE_ENGAGEMENT_TEAM.map((role) => (
                      <span
                        key={role}
                        className="rounded-full border border-paper/15 px-3 py-1.5 text-sm text-paper/80"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* "Guarantee your software's success with our thorough QA" CTA
            banner — Software Quality Assurance only, static. Positioned
            right after ClientSpotlight (rather than immediately after the
            tools row, where it was originally placed) to match the
            reference's actual page order — ClientSpotlight renders here,
            fixed, on every service page, and the QA reference has this
            banner right after it. NOTE: the reference uses a magenta/pink
            background here too, same off-brand-color reasoning as the
            page's earlier CTA — stays on bg-signal for consistency with
            every other CTA banner on the site. */}
        {service.slug === "software-quality-assurance" && (
          <section className="border-t border-paper/10 bg-signal">
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 px-6 py-8 sm:px-10 sm:pl-[max(1.5rem,calc(50vw_-_36rem_+_2.5rem))]">
                <p className="max-w-lg text-lg font-medium leading-snug text-paper">
                  Guarantee your software&apos;s success with our thorough QA.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex shrink-0 items-center justify-center gap-2 bg-black/15 px-10 py-8 text-lg font-semibold text-paper transition-colors hover:bg-black/25 sm:pr-[max(2.5rem,calc(50vw_-_36rem_+_2.5rem))]"
              >
                QA Ready
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        )}

        {/* "Seamless testing management" — Software Quality Assurance
            only, static. Generic process copy, no fabricated claims. Each
            phase is a label + a 3-column item grid (CSS grid auto-flow
            naturally wraps a phase's 4th item to a new row under column
            1, matching the reference's "Role distribution" / "Performance
            optimization" / "Testing team exit" placement). */}
        {service.slug === "software-quality-assurance" && (
          <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 md:grid-cols-2">
                <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                  Seamless testing management
                </h2>
                <p className="text-paper/70">
                  Entrust your quality assessment to us, and we&apos;ll execute your custom
                  testing strategy with precision, keeping you informed on progress and results
                  every step of the way.
                </p>
              </div>

              <div className="mt-16 flex flex-col">
                {[
                  {
                    title: "Discovery",
                    items: ["Business objectives", "Project goals, specifics, and risks", "Current QA-related issues"],
                  },
                  {
                    title: "Strategy",
                    items: ["Methods and tools", "Deliverables", "Roadmap and timeline", "Role distribution"],
                  },
                  {
                    title: "Transition",
                    items: ["Environment setup", "Test cases", "Knowledge transfer"],
                  },
                  {
                    title: "Delivery",
                    items: ["Test execution", "Monitoring", "Issue management", "Performance optimization"],
                  },
                  {
                    title: "Reporting and Exit",
                    items: ["Testing reports", "Results evaluation", "Assessment", "Testing team exit"],
                  },
                ].map((phase) => (
                  <div
                    key={phase.title}
                    className="grid grid-cols-1 gap-y-3 border-b border-paper/15 py-8 first:pt-0 md:grid-cols-4 md:gap-x-6"
                  >
                    <p className="font-semibold text-ember">{phase.title}</p>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3 md:col-span-3">
                      {phase.items.map((item) => (
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

        {/* Skipped here for Digital Marketing — already rendered higher up,
            right after the "Maximize Reach" CTA, to match the reference's
            page order (see above). */}
        {service.slug !== "digital-marketing" && <FeaturedWorkSplit items={featuredWorkSplit} />}

        {/* Case studies, pulled live from the site's real case-studies data.
            Hidden on Digital Design at request — ClientSpotlight and
            FeaturedWorkSplit above already cover "proof of work" on that
            page. Also hidden on Digital Marketing and IT Consulting at
            request (the case studies shown are all engineering-flavored,
            not marketing or consulting). Hidden on Software Engineering
            since ServiceTabs now renders the same case studies higher up
            (right after "Our Impact in Numbers", per the reference's
            page order) — showing them twice would be redundant.
            Still shown on every other service page. */}
        {caseStudies.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && service.slug !== "software-quality-assurance" && service.slug !== "performance-reliability-engineering" && service.slug !== "software-engineering" && (
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
            at request, same as Case Studies above. Hidden on Software
            Engineering at request too — the tab-specific sections above
            now cover this page in full, so the older page-level sections
            are redundant there — still shown on every other service
            page. */}
        {blogGridCells.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && service.slug !== "software-quality-assurance" && service.slug !== "performance-reliability-engineering" && service.slug !== "software-engineering" && (
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
            at request, same as Case Studies/Blog Highlights above. Hidden
            on Software Engineering since ServiceTabs now renders the same
            testimonial higher up (right after "Reliable Solutions with
            Thoughtful Engineering", per the reference's page order) —
            showing it twice would be redundant.
            Still shown on every other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && service.slug !== "software-quality-assurance" && service.slug !== "performance-reliability-engineering" && service.slug !== "software-engineering" && (
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
            Consulting and Software Engineering at request (redundant
            with the tab-specific sections above on the latter) — still
            shown on every other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && service.slug !== "software-quality-assurance" && service.slug !== "performance-reliability-engineering" && service.slug !== "software-engineering" && (
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
            Marketing, IT Consulting, and Software Engineering at
            request, same as the sections above — still shown on every
            other service page. */}
        {service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && service.slug !== "software-quality-assurance" && service.slug !== "performance-reliability-engineering" && service.slug !== "software-engineering" && (
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
            Marketing, and IT Consulting at request. Also hidden on
            Software Engineering itself — the Web tab's own
            deliveryFramework section (ServiceTabs) now covers this same
            "From code to launch" concept, so this page-level version
            would be redundant there — still shown on every other
            service page. */}
        {service.includes.length > 0 && service.slug !== "digital-design" && service.slug !== "digital-marketing" && service.slug !== "it-consulting" && service.slug !== "it-maintenance-support" && service.slug !== "staff-augmentation" && service.slug !== "software-quality-assurance" && service.slug !== "performance-reliability-engineering" && service.slug !== "software-engineering" && (
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
