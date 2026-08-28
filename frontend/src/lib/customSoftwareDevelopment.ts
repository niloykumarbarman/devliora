import {
  Blocks,
  Boxes,
  BookOpen,
  Building2,
  ClipboardCheck,
  Cloud,
  Compass,
  FileCode2,
  GitBranch,
  Handshake,
  Layers,
  LineChart,
  LockKeyhole,
  Network,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  ServerCog,
  ShieldCheck,
  TestTube2,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import type { FaqDto } from "@/lib/faq";
import type {
  ClusterTopic,
  ComparisonRow,
  CtaLink,
  IconItem,
  ProcessStep,
  TitlePart,
} from "@/components/sections/cluster/clusterKit";

/**
 * Static, version-controlled content for the /custom-software-development
 * PILLAR page — the hub of the Phase 21 content cluster. Same rules as
 * src/lib/cloudDevops.ts: every line is a capability statement, never a
 * claim about volume, uptime, revenue or named clients.
 *
 * The eight supporting topic pages each have their own lib file
 * (webDevelopment.ts, legacyModernization.ts,
 * enterpriseApplicationDevelopment.ts) or an existing page
 * (/services/software-engineering, /services/ai-development,
 * /cloud-devops, /services/software-quality-assurance). CLUSTER_TOPICS
 * below is the single source for the visible hub grid; the matching
 * ItemList JSON-LD is built from it in the page component.
 */

export const PAGE_PATH = "/custom-software-development";
export const PAGE_TITLE = "Custom Software Development";
export const PAGE_DESCRIPTION =
  "Custom software development by Devliora — web and enterprise apps, AI features, cloud back ends and legacy modernization, built to a standard your team can own.";

export const HERO_EYEBROW = "Custom Software Development";

export const HERO_BREADCRUMB: { label: string; href?: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Custom Software Development" },
];

export const HERO_TITLE: TitlePart[] = [
  { text: "Software built for how your business " },
  { text: "actually works", accent: "signal" },
  { text: "." },
];

export const HERO_INTRO =
  "When the system you need to run the business doesn't exist off the shelf — or the one you have is holding you back — we design it, build it, and hand it over documented. Custom software development at Devliora spans discovery, architecture, delivery, hardening and long-term support.";

export const HERO_PRIMARY_CTA: CtaLink = {
  label: "Talk to an engineer",
  href: "/contact",
};
export const HERO_SECONDARY_CTA: CtaLink = {
  label: "Book a consultation",
  href: "/book-consultation",
};

export const HERO_CHIPS = [
  "Discovery & scoping",
  "Product architecture",
  "Web & enterprise apps",
  "AI features",
  "Cloud back ends",
  "Legacy modernization",
  "QA & testing",
  "Maintenance & support",
];

// --- When custom is the right call (SplitFeature) --------------------

export const WHEN_CUSTOM_EYEBROW = "When it's the right call";
export const WHEN_CUSTOM_TITLE: TitlePart[] = [
  { text: "Custom is the answer when the " },
  { text: "fit matters more than the head start", accent: "signal" },
  { text: "." },
];
export const WHEN_CUSTOM_INTRO =
  "Off-the-shelf software is the right choice more often than not. Custom development earns its cost in a smaller set of situations — these are the ones we see most.";

export const WHEN_CUSTOM_ITEMS: IconItem[] = [
  {
    name: "The process is the product",
    detail:
      "Your workflow is a real competitive advantage, and bending it to fit a SaaS tool would give that advantage away.",
    icon: Workflow,
  },
  {
    name: "You've outgrown the workaround",
    detail:
      "Spreadsheets, internal scripts or a tool used three ways past its design are now the bottleneck and the risk.",
    icon: Boxes,
  },
  {
    name: "Integration is the hard part",
    detail:
      "The value is in tying together systems that were never meant to talk — and no single vendor covers all of them.",
    icon: Network,
  },
  {
    name: "A replacement, not a rewrite for its own sake",
    detail:
      "A system still runs the business but is slow, fragile and understood by only one or two people.",
    icon: RefreshCw,
  },
  {
    name: "You need to own the roadmap",
    detail:
      "The direction of the software has to be yours to set — not gated behind another company's release schedule.",
    icon: Compass,
  },
];

export const WHEN_CUSTOM_ASIDE = {
  heading: "When we'll say don't",
  points: [
    {
      name: "A mature tool already fits",
      detail:
        "If an established product covers 90% of the need, we'll say so and help you adopt it well.",
      icon: ClipboardCheck,
    },
    {
      name: "The requirements aren't settled",
      detail:
        "If the shape of the problem is still moving, a short discovery beats committing a build budget.",
      icon: Search,
    },
  ] satisfies IconItem[],
};

// --- Capability pillars (CapabilityGrid) -----------------------------

export const CAPABILITIES_EYEBROW = "What we build";
export const CAPABILITIES_TITLE: TitlePart[] = [
  { text: "One team across the " },
  { text: "whole build", accent: "signal" },
  { text: "." },
];
export const CAPABILITIES_INTRO =
  "A custom project rarely fits one label. These are the capabilities we combine on most engagements.";

export const CAPABILITIES: IconItem[] = [
  {
    name: "Product & platform engineering",
    detail:
      "Greenfield products and internal platforms — domain modelling, APIs, data design and the services behind them.",
    icon: Blocks,
  },
  {
    name: "Web applications",
    detail:
      "Customer portals, dashboards and SaaS front ends built on a typed, testable Next.js and React stack.",
    icon: Layers,
  },
  {
    name: "Enterprise applications",
    detail:
      "Line-of-business systems with SSO, role-based access, audit trails, approvals and third-party integrations.",
    icon: Building2,
  },
  {
    name: "AI features",
    detail:
      "Extraction, classification, drafting and routing — measured against real inputs, not a demo, before they ship.",
    icon: Puzzle,
  },
  {
    name: "Cloud back ends & APIs",
    detail:
      "The services, queues, jobs and datastores your app runs on, provisioned as code and deployed by pipeline.",
    icon: Cloud,
  },
  {
    name: "Legacy modernization",
    detail:
      "Incremental re-platforming of a system that still matters — framework upgrades, decomposition, data migration.",
    icon: ServerCog,
  },
  {
    name: "Quality engineering",
    detail:
      "Automated test suites, CI gates and a written definition of done, so releases stop being tense.",
    icon: TestTube2,
  },
  {
    name: "Maintenance & support",
    detail:
      "Patching, dependency upkeep, monitoring and a steady stream of small improvements after launch.",
    icon: Wrench,
  },
];

// --- The cluster hub (ClusterHub + ItemList JSON-LD) -----------------

export const CLUSTER_EYEBROW = "The practice, in depth";
export const CLUSTER_TITLE: TitlePart[] = [
  { text: "Eight parts of " },
  { text: "custom software development", accent: "signal" },
  { text: "." },
];
export const CLUSTER_INTRO =
  "Each of these is a discipline in its own right. Follow any thread for how we approach it, what it involves and where it fits.";

export const CLUSTER_TOPICS: ClusterTopic[] = [
  {
    label: "Software engineering",
    summary:
      "The core discipline — architecture, APIs, data modelling and the engineering standards behind every build.",
    href: "/services/software-engineering",
  },
  {
    label: "Web development",
    summary:
      "Portals, dashboards and SaaS front ends on a typed Next.js and React stack, tuned for Core Web Vitals and accessibility.",
    href: "/web-development",
  },
  {
    label: "AI development",
    summary:
      "Language-shaped features — extraction, classification, drafting — built to be observable, safe and measurable.",
    href: "/services/ai-development",
  },
  {
    label: "Cloud development",
    summary:
      "The cloud back end your application runs on: services, data, Infrastructure as Code and environment parity.",
    href: "/cloud-devops",
  },
  {
    label: "DevOps",
    summary:
      "CI/CD pipelines, containers, monitoring and the automation that gets a commit to production the same way every time.",
    href: "/cloud-devops#devops-services",
  },
  {
    label: "Software testing",
    summary:
      "Automated regression suites, CI quality gates and a written definition of done for releases you can trust.",
    href: "/services/software-quality-assurance",
  },
  {
    label: "Legacy modernization",
    summary:
      "Incremental re-platforming of a system that still runs the business — strangler-fig, parallel run, safe rollback.",
    href: "/legacy-modernization",
  },
  {
    label: "Enterprise applications",
    summary:
      "Identity, RBAC, audit, integrations and reliability targets — what production-grade line-of-business software needs.",
    href: "/enterprise-application-development",
  },
];

// --- Delivery process (PhasedProcess) -------------------------------

export const PROCESS_EYEBROW = "How we deliver";
export const PROCESS_TITLE: TitlePart[] = [
  { text: "Five phases, " },
  { text: "each with a definition of done", accent: "signal" },
  { text: "." },
];
export const PROCESS_INTRO =
  "Fixed-scope discovery first, then build in short increments you can review. Nothing is a black box.";

export const PROCESS_STEPS: ProcessStep[] = [
  {
    label: "Discovery & scoping",
    detail:
      "We map the workflow, the systems it touches and the constraints, then agree what the first release must do — and what it deliberately won't.",
    icon: Search,
  },
  {
    label: "Architecture & plan",
    detail:
      "Domain model, data design, integration points and the stack, written down with the trade-offs so the decisions are reviewable.",
    icon: Compass,
    gate: true,
  },
  {
    label: "Incremental build",
    detail:
      "Two-week increments, each demoed and deployable. Tests and CI are part of the increment, not a later pass.",
    icon: GitBranch,
  },
  {
    label: "Hardening",
    detail:
      "Load and edge-case testing, security review, observability, and the runbooks for operating it in production.",
    icon: ShieldCheck,
    gate: true,
  },
  {
    label: "Handover & support",
    detail:
      "Documentation, an architecture walkthrough for your team, and an agreed support model for what comes after.",
    icon: BookOpen,
  },
];

// --- Engineering standards (CapabilityGrid) -------------------------

export const STANDARDS_EYEBROW = "The standard";
export const STANDARDS_TITLE: TitlePart[] = [
  { text: "What " },
  { text: "“built properly”", accent: "signal" },
  { text: " means here" },
];
export const STANDARDS_INTRO =
  "The parts that aren't visible in a demo but decide whether the software is safe to change a year from now.";

export const STANDARDS: IconItem[] = [
  {
    name: "Typed, tested code",
    detail:
      "TypeScript and C# end to end, with automated tests written alongside features and run on every pull request.",
    icon: FileCode2,
  },
  {
    name: "Documented decisions",
    detail:
      "Architecture and the reasoning behind it are written down, so another engineer can pick it up without a phone call.",
    icon: BookOpen,
  },
  {
    name: "Environment parity",
    detail:
      "Infrastructure as Code means staging and production are the same shape — surprises don't wait for release day.",
    icon: Layers,
  },
  {
    name: "Security from the start",
    detail:
      "Authentication, authorization, rate limiting and audit trails designed in, not bolted on after a review.",
    icon: LockKeyhole,
  },
  {
    name: "Observability",
    detail:
      "Structured logs, metrics and traces from day one, so you hear about a problem before your customers do.",
    icon: LineChart,
  },
  {
    name: "You own it",
    detail:
      "Your repositories, your cloud accounts, your pipelines. No lock-in to us, and a clean handover if you take it in-house.",
    icon: Handshake,
  },
];

// --- Comparison (ComparisonRows) -----------------------------------

export const COMPARE_EYEBROW = "Custom vs off-the-shelf";
export const COMPARE_TITLE: TitlePart[] = [
  { text: "An honest " },
  { text: "trade-off", accent: "signal" },
  { text: ", not a sales pitch" },
];
export const COMPARE_INTRO =
  "Both are the right answer somewhere. This is how they actually differ once the software is live.";
export const COMPARE_LEFT = "Off-the-shelf / SaaS";
export const COMPARE_RIGHT = "Custom software";
export const COMPARE_ROWS: ComparisonRow[] = [
  {
    dimension: "Time to first value",
    left: "Days — configure and go.",
    right: "Weeks to months — discovery, then an increment at a time.",
  },
  {
    dimension: "Fit to your workflow",
    left: "You adapt to the tool's model of the work.",
    right: "The tool is built around how your team already works.",
  },
  {
    dimension: "Cost shape",
    left: "Predictable per-seat subscription that scales with headcount.",
    right: "Higher up front; lower marginal cost as usage grows.",
  },
  {
    dimension: "Roadmap control",
    left: "Set by the vendor; you request and wait.",
    right: "Yours — priorities are decided by your team.",
  },
  {
    dimension: "Integration depth",
    left: "Whatever the vendor's API exposes.",
    right: "As deep as the systems allow — no external gatekeeper.",
  },
  {
    dimension: "Ongoing responsibility",
    left: "The vendor keeps the lights on.",
    right: "You (or a support partner) own maintenance and uptime.",
  },
];

// --- Engagement models (CapabilityGrid) ---------------------------

export const MODELS_EYEBROW = "How we engage";
export const MODELS_TITLE: TitlePart[] = [
  { text: "Three ways to " },
  { text: "start", accent: "signal" },
];
export const MODELS_INTRO =
  "Most projects begin with the first and move to the second once the shape is clear.";

export const MODELS: IconItem[] = [
  {
    name: "Discovery engagement",
    detail:
      "A fixed-scope, fixed-price week or two: workflow mapping, architecture options and a costed delivery plan you own outright.",
    icon: Search,
  },
  {
    name: "Project delivery",
    detail:
      "We take a defined outcome from architecture to production against an agreed scope, on a milestone schedule.",
    icon: Rocket,
  },
  {
    name: "Dedicated team",
    detail:
      "Engineers embedded with your product owner for a rolling roadmap — capacity without a long hiring cycle.",
    icon: Users,
  },
];

// --- FAQ ---------------------------------------------------------------

export const FAQ_HEADING = "Custom software development — common questions";

export const FAQS: FaqDto[] = [
  {
    id: "csd-faq-1",
    question: "How is custom software development different from buying a SaaS product?",
    answer:
      "A SaaS product is built once for many companies, so you adapt your process to its model and its roadmap. Custom software is built around how your team already works and its direction is yours to set. Custom costs more up front and makes you responsible for maintenance; it pays back when the fit of the software is itself a competitive advantage or when no single product covers the need.",
    displayOrder: 1,
    serviceSlug: "",
  },
  {
    id: "csd-faq-2",
    question: "What does the process look like from first call to launch?",
    answer:
      "A fixed-scope discovery maps the workflow and the systems involved and produces a costed plan. Build then happens in two-week increments, each one demoed and deployable, with tests and CI included. A hardening phase covers load testing, security review and observability. Handover includes documentation and an architecture walkthrough for your team.",
    displayOrder: 2,
    serviceSlug: "",
  },
  {
    id: "csd-faq-3",
    question: "Who owns the code and the infrastructure?",
    answer:
      "You do. Work happens in your repositories and your cloud accounts, and the CI/CD pipelines are yours. There is no lock-in to Devliora — if you later move the work in-house, the documented handover is designed to make that clean.",
    displayOrder: 3,
    serviceSlug: "",
  },
  {
    id: "csd-faq-4",
    question: "Can you work alongside our existing engineering team?",
    answer:
      "Yes. Engagements range from a dedicated team that owns a product area to engineers embedded in your team under your product owner. In both cases we work to your branching model, review standards and definition of done rather than imposing ours.",
    displayOrder: 4,
    serviceSlug: "",
  },
  {
    id: "csd-faq-5",
    question: "What technologies do you build on?",
    answer:
      "Backends in .NET (C#) and Node.js; web front ends in Next.js and React with TypeScript; PostgreSQL and SQL Server for data; AWS or Azure for hosting, provisioned with Terraform. The choice on any given project follows the workload and any existing estate, not a house preference.",
    displayOrder: 5,
    serviceSlug: "",
  },
  {
    id: "csd-faq-6",
    question: "What happens after launch?",
    answer:
      "You can take the system in-house with the handover documentation, or keep Devliora on for maintenance — security patching, dependency upkeep, monitoring and a steady backlog of small improvements — under an agreed response model.",
    displayOrder: 6,
    serviceSlug: "",
  },
];

// --- Closing CTA -----------------------------------------------------

export const CTA_TITLE: TitlePart[] = [
  { text: "Have a system that " },
  { text: "needs to exist", accent: "signal" },
  { text: "?" },
];
export const CTA_BODY =
  "Tell us what the software has to do and what it has to talk to. We'll come back with an approach, the trade-offs, and a realistic plan to build it.";
export const CTA_PRIMARY: CtaLink = { label: "Start a conversation", href: "/contact" };
export const CTA_SECONDARY: CtaLink = { label: "See our work", href: "/case-studies" };
