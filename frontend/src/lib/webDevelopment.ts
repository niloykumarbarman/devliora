import {
  Accessibility,
  BarChart3,
  Boxes,
  Braces,
  Code2,
  Compass,
  Gauge,
  LayoutDashboard,
  LayoutTemplate,
  MonitorSmartphone,
  PlugZap,
  Rocket,
  Search,
  ServerCog,
  ShieldCheck,
  Smartphone,
  SquareStack,
  TestTube2,
  Users,
} from "lucide-react";
import type { FaqDto } from "@/lib/faq";
import type {
  CtaLink,
  IconItem,
  ProcessStep,
  TitlePart,
} from "@/components/sections/cluster/clusterKit";

/**
 * Static content for the /web-development supporting page in the Phase 21
 * "Custom Software Development" cluster. Capability statements only — no
 * invented metrics, uptime or client counts (same rule as
 * src/lib/cloudDevops.ts).
 */

export const PAGE_PATH = "/web-development";
export const PAGE_TITLE = "Web Application Development";
export const PAGE_DESCRIPTION =
  "Devliora builds web applications — portals, dashboards and SaaS front ends — on a typed Next.js and React stack, tuned for Core Web Vitals and accessibility.";

export const HERO_EYEBROW = "Web Development";
export const HERO_BREADCRUMB: { label: string; href?: string }[] = [
  { label: "Home", href: "/" },
  { label: "Custom Software Development", href: "/custom-software-development" },
  { label: "Web Development" },
];
export const HERO_TITLE: TitlePart[] = [
  { text: "Web applications that stay " },
  { text: "fast and maintainable", accent: "signal" },
  { text: " as they grow." },
];
export const HERO_INTRO =
  "Portals, dashboards and SaaS front ends built on Next.js, React and TypeScript — with performance, accessibility and a clean boundary to your API treated as requirements, not polish.";
export const HERO_PRIMARY_CTA: CtaLink = { label: "Talk to an engineer", href: "/contact" };
export const HERO_SECONDARY_CTA: CtaLink = { label: "Book a consultation", href: "/book-consultation" };
export const HERO_CHIPS = [
  "Next.js & React",
  "TypeScript",
  "Design systems",
  "Core Web Vitals",
  "Accessibility (WCAG)",
  "API integration",
  "SSR & static rendering",
  "Progressive web apps",
];

export const BACK_LINK_LABEL = "Part of custom software development";

// --- App types (CapabilityGrid) ------------------------------------

export const TYPES_EYEBROW = "What we build for the web";
export const TYPES_TITLE: TitlePart[] = [
  { text: "Application front ends, " },
  { text: "not brochure sites", accent: "signal" },
];
export const TYPES_INTRO =
  "The common shapes. Most projects are one of these with a real back end behind it.";
export const APP_TYPES: IconItem[] = [
  {
    name: "Customer portals",
    detail:
      "Authenticated areas where your users manage accounts, data, billing and documents — the app your customers log into.",
    icon: Users,
  },
  {
    name: "Operational dashboards",
    detail:
      "Internal tools that surface live data, run bulk actions and replace the spreadsheet an ops team currently lives in.",
    icon: LayoutDashboard,
  },
  {
    name: "SaaS front ends",
    detail:
      "The product UI for a subscription business — onboarding, workspaces, permissions, settings and usage views.",
    icon: SquareStack,
  },
  {
    name: "Marketing sites with a CMS",
    detail:
      "Fast, content-managed sites where editors own the copy and the build stays static wherever it can.",
    icon: LayoutTemplate,
  },
  {
    name: "Progressive web apps",
    detail:
      "Installable, offline-capable web apps for field and mobile use where a native build isn't warranted.",
    icon: Smartphone,
  },
  {
    name: "Design systems",
    detail:
      "A shared component library and tokens so every screen looks and behaves consistently and new pages are quick to build.",
    icon: Boxes,
  },
];

// --- The stack (SplitFeature) ------------------------------------

export const STACK_EYEBROW = "The stack";
export const STACK_TITLE: TitlePart[] = [
  { text: "A typed, testable front end on " },
  { text: "Next.js and React", accent: "signal" },
];
export const STACK_INTRO =
  "One stack, chosen because it holds up: server and static rendering where each fits, typed end to end, and easy to hand over.";
export const STACK_ITEMS: IconItem[] = [
  {
    name: "Next.js App Router",
    detail:
      "Server components and static rendering by default, client interactivity only where it's needed — fast first loads without a single-page-app tax.",
    icon: Code2,
  },
  {
    name: "TypeScript everywhere",
    detail:
      "Shared types from the API contract to the component props, so a breaking change fails the build, not production.",
    icon: Braces,
  },
  {
    name: "Component library & tokens",
    detail:
      "A documented design system means consistent UI and new screens assembled from parts rather than rebuilt.",
    icon: Boxes,
  },
  {
    name: "Tested and CI-gated",
    detail:
      "Component and end-to-end tests run on every pull request; a red build blocks the merge.",
    icon: TestTube2,
  },
];
export const STACK_ASIDE = {
  heading: "Works with your back end",
  points: [
    {
      name: "Any API",
      detail:
        "REST or GraphQL, yours or a third party's — the front end is built against a typed client, not glued to one server.",
      icon: PlugZap,
    },
    {
      name: "Or we build it",
      detail:
        "Need the services behind the UI too? That's the cloud back-end and software-engineering side of the same team.",
      icon: ServerCog,
    },
  ] satisfies IconItem[],
};

// --- What "good" means (CapabilityGrid) -------------------------

export const QUALITY_EYEBROW = "What “good” means on the web";
export const QUALITY_TITLE: TitlePart[] = [
  { text: "The things users " },
  { text: "feel", accent: "signal" },
  { text: " — measured, not assumed" },
];
export const QUALITY_INTRO =
  "These are acceptance criteria on our projects, checked in CI and on real devices before a release ships.";
export const QUALITY: IconItem[] = [
  {
    name: "Core Web Vitals",
    detail:
      "LCP, INP and CLS budgeted and monitored — a regression shows up in the pipeline, not in a Search Console report weeks later.",
    icon: Gauge,
  },
  {
    name: "Accessibility",
    detail:
      "Semantic markup, keyboard paths, focus management and contrast to WCAG 2.2 AA, tested with axe and a screen reader.",
    icon: Accessibility,
  },
  {
    name: "Responsive to real devices",
    detail:
      "Checked on the phones and laptops your users actually have, not just a desktop browser resized.",
    icon: MonitorSmartphone,
  },
  {
    name: "SEO fundamentals",
    detail:
      "Server-rendered content, correct metadata, canonical URLs, structured data and a clean sitemap — the technical baseline done right.",
    icon: Search,
  },
  {
    name: "Resilient loading",
    detail:
      "Skeletons, error boundaries and retry paths, so a slow network degrades gracefully instead of showing a blank screen.",
    icon: ShieldCheck,
  },
  {
    name: "Analytics that answer questions",
    detail:
      "Event tracking wired to the flows that matter, so you can see where users drop rather than guess.",
    icon: BarChart3,
  },
];

// --- Process (PhasedProcess) ----------------------------------

export const PROCESS_EYEBROW = "How a web build runs";
export const PROCESS_TITLE: TitlePart[] = [
  { text: "Design, build, " },
  { text: "measure", accent: "signal" },
  { text: ", ship" },
];
export const PROCESS_INTRO =
  "Short increments against a shared design system, with performance and accessibility checked the whole way.";
export const PROCESS_STEPS: ProcessStep[] = [
  {
    label: "Flows & wireframes",
    detail:
      "We agree the screens, the states and the navigation before visual design — the cheapest place to change your mind.",
    icon: Compass,
  },
  {
    label: "Design system first",
    detail:
      "Tokens, primitives and key components built and documented, so page work is assembly rather than reinvention.",
    icon: Boxes,
  },
  {
    label: "Incremental build",
    detail:
      "Pages and features in two-week increments, each deployed to a preview URL you can click through.",
    icon: Code2,
    gate: true,
  },
  {
    label: "Performance & a11y pass",
    detail:
      "Lighthouse and axe in CI, plus a manual keyboard and screen-reader review against the acceptance criteria.",
    icon: Gauge,
    gate: true,
  },
  {
    label: "Launch & monitor",
    detail:
      "Real-user monitoring for Web Vitals and errors from day one, with a plan for the first weeks of iteration.",
    icon: Rocket,
  },
];

// --- FAQ ------------------------------------------------------

export const FAQ_HEADING = "Web application development — common questions";
export const FAQS: FaqDto[] = [
  {
    id: "wd-faq-1",
    question: "Do you build the back end as well as the front end?",
    answer:
      "Yes, when it's needed. The front end can be built against your existing API or a third party's, or we can build the services, data model and infrastructure behind it — that's the same software-engineering and cloud team. Many projects are both.",
    displayOrder: 1,
    serviceSlug: "",
  },
  {
    id: "wd-faq-2",
    question: "Why Next.js and React rather than another framework?",
    answer:
      "It gives us server and static rendering where each is appropriate, a very large ecosystem, strong TypeScript support and a hiring pool that makes handover realistic. For a content site with no application behaviour we'll still use it, configured to output mostly static pages.",
    displayOrder: 2,
    serviceSlug: "",
  },
  {
    id: "wd-faq-3",
    question: "How do you keep the site fast as features are added?",
    answer:
      "Performance budgets for Core Web Vitals are set at the start and enforced in CI, so a change that regresses LCP or INP fails the build. Rendering is server-side or static by default, client JavaScript is added only where interactivity requires it, and images and fonts are optimised as part of the pipeline.",
    displayOrder: 3,
    serviceSlug: "",
  },
  {
    id: "wd-faq-4",
    question: "Is accessibility included or an add-on?",
    answer:
      "Included. Semantic HTML, keyboard operability, focus management and colour contrast to WCAG 2.2 AA are acceptance criteria on every screen, tested with automated tooling and a manual screen-reader pass before release.",
    displayOrder: 4,
    serviceSlug: "",
  },
  {
    id: "wd-faq-5",
    question: "Can you work with our existing design team or brand?",
    answer:
      "Yes. We can build to your designs and brand guidelines, turn them into a coded design system, or provide product design ourselves. If you have a Figma library we'll implement against it and flag gaps rather than improvising.",
    displayOrder: 5,
    serviceSlug: "",
  },
];

// --- Closing CTA -------------------------------------------

export const CTA_TITLE: TitlePart[] = [
  { text: "Got a web app to " },
  { text: "build or rebuild", accent: "signal" },
  { text: "?" },
];
export const CTA_BODY =
  "Send us the flows and the API you're working with — or the site you're replacing. We'll come back with an approach and a plan.";
export const CTA_PRIMARY: CtaLink = { label: "Start a conversation", href: "/contact" };
export const CTA_SECONDARY: CtaLink = { label: "Explore custom software", href: "/custom-software-development" };
