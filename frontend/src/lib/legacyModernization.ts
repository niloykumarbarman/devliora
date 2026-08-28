import {
  Activity,
  AlarmClockOff,
  ArrowLeftRight,
  Boxes,
  ClipboardList,
  Database,
  FileWarning,
  GitBranch,
  Landmark,
  LayoutList,
  MapPin,
  Network,
  RefreshCw,
  Route,
  ScrollText,
  ShieldCheck,
  SplitSquareHorizontal,
  TestTube2,
  Undo2,
  UserX,
} from "lucide-react";
import type { FaqDto } from "@/lib/faq";
import type {
  CtaLink,
  IconItem,
  ProcessStep,
  TitlePart,
} from "@/components/sections/cluster/clusterKit";

/**
 * Static content for the /legacy-modernization supporting page in the
 * Phase 21 "Custom Software Development" cluster. Capability statements
 * only — no invented metrics or client names (see src/lib/cloudDevops.ts).
 */

export const PAGE_PATH = "/legacy-modernization";
export const PAGE_TITLE = "Legacy System Modernization";
export const PAGE_DESCRIPTION =
  "Devliora modernizes systems that still run the business — incremental re-platforming, the strangler-fig pattern, parallel running, data migration and safe rollback.";

export const HERO_EYEBROW = "Legacy Modernization";
export const HERO_BREADCRUMB: { label: string; href?: string }[] = [
  { label: "Home", href: "/" },
  { label: "Custom Software Development", href: "/custom-software-development" },
  { label: "Legacy Modernization" },
];
export const HERO_TITLE: TitlePart[] = [
  { text: "Replace the system " },
  { text: "without stopping the business", accent: "ember" },
  { text: "." },
];
export const HERO_INTRO =
  "A system that still runs the business but is slow, fragile and understood by one or two people is a risk you can't leave alone and can't switch off. We modernize it in place — incrementally, with a parallel run and a rollback at every step.";
export const HERO_PRIMARY_CTA: CtaLink = { label: "Talk to an engineer", href: "/contact" };
export const HERO_SECONDARY_CTA: CtaLink = { label: "Book a consultation", href: "/book-consultation" };
export const HERO_CHIPS = [
  "Assessment & mapping",
  "Strangler-fig migration",
  "Parallel running",
  "Data migration",
  "Framework upgrades",
  "Monolith decomposition",
  "On-prem to cloud",
  "Safe rollback",
];

export const BACK_LINK_LABEL = "Part of custom software development";

// --- Signs you need it (SplitFeature) ----------------------------

export const SIGNS_EYEBROW = "Signs it's time";
export const SIGNS_TITLE: TitlePart[] = [
  { text: "When a working system has become a " },
  { text: "liability", accent: "ember" },
];
export const SIGNS_INTRO =
  "Modernization is worth its cost when the system still delivers value but the cost and risk of changing it keep rising.";
export const SIGNS_ITEMS: IconItem[] = [
  {
    name: "Every change is slow and risky",
    detail:
      "A small feature takes weeks, and each release carries a real chance of breaking something unrelated.",
    icon: AlarmClockOff,
  },
  {
    name: "Bus factor of one",
    detail:
      "Only one or two people understand how it works, and there's no documentation to fall back on.",
    icon: UserX,
  },
  {
    name: "Unsupported platform",
    detail:
      "The framework, runtime or database version is out of support — security patches have stopped arriving.",
    icon: FileWarning,
  },
  {
    name: "It can't integrate",
    detail:
      "New tools and partners need an API or data feed the system was never built to provide.",
    icon: Network,
  },
  {
    name: "Hosting is the constraint",
    detail:
      "It's pinned to a server or data centre you want to leave, and scaling means buying more hardware.",
    icon: Landmark,
  },
];
export const SIGNS_ASIDE = {
  heading: "When to wait",
  points: [
    {
      name: "It's being retired anyway",
      detail:
        "If the business process behind it is going away within a year, keep it on life support instead.",
      icon: ClipboardList,
    },
    {
      name: "No one can define correct",
      detail:
        "If current behaviour isn't understood or documented, that discovery comes before any rebuild.",
      icon: ScrollText,
    },
  ] satisfies IconItem[],
};

// --- Assessment (CapabilityGrid) --------------------------------

export const ASSESS_EYEBROW = "Assessment first";
export const ASSESS_TITLE: TitlePart[] = [
  { text: "You can't modernize what you " },
  { text: "haven't mapped", accent: "signal" },
];
export const ASSESS_INTRO =
  "Every engagement starts with a fixed-scope assessment that produces a written picture of the system and a costed, sequenced plan.";
export const ASSESS_ITEMS: IconItem[] = [
  {
    name: "Capability map",
    detail:
      "What the system does for the business, broken into capabilities that can be moved one at a time.",
    icon: MapPin,
  },
  {
    name: "Dependency graph",
    detail:
      "What calls what, which data is shared, and where the seams are that a migration can cut along.",
    icon: Network,
  },
  {
    name: "Risk register",
    detail:
      "The parts with no tests, no owner or no documentation — sequenced so the riskiest moves happen with the most safety net.",
    icon: ShieldCheck,
  },
  {
    name: "Data model review",
    detail:
      "Schema, volume and quality, plus the transformations a migration to the new model will need.",
    icon: Database,
  },
  {
    name: "Sequenced plan",
    detail:
      "The order of migration, the parallel-run strategy per slice, and the rollback for each step — costed.",
    icon: LayoutList,
  },
  {
    name: "Target architecture",
    detail:
      "Where it lands: framework versions, service boundaries, hosting, and the standards the new code holds to.",
    icon: Boxes,
  },
];

// --- Approach strategies (bespoke ModernizationApproach) ---------

export const APPROACH_EYEBROW = "The approach";
export const APPROACH_TITLE: TitlePart[] = [
  { text: "Strangle it, " },
  { text: "don't big-bang it", accent: "ember" },
];
export const APPROACH_INTRO =
  "A routing layer sits in front of the old system. Capabilities are rebuilt behind it one at a time and traffic is moved across only when the new slice matches the old — with the old path still there to fall back to.";

export const APPROACH_FLOW: IconItem[] = [
  { name: "Users & integrations", detail: "No change to how anyone reaches the system.", icon: Network },
  { name: "Routing layer", detail: "A proxy or façade decides old path or new, per capability, per user.", icon: Route },
  { name: "Legacy system", detail: "Still authoritative for everything not yet migrated.", icon: Landmark },
  { name: "New services", detail: "Rebuilt capabilities, taking traffic slice by slice.", icon: Boxes },
];

export const APPROACH_STRATEGIES: IconItem[] = [
  {
    name: "Strangler-fig migration",
    detail:
      "Route by capability through a façade; rebuild and cut over one slice at a time until nothing routes to the old system and it can be switched off.",
    icon: SplitSquareHorizontal,
  },
  {
    name: "Incremental re-platform",
    detail:
      "Where the design is sound, lift the code forward in stages — supported framework and runtime versions, dependency upgrades, containerised deploy — without changing behaviour.",
    icon: RefreshCw,
  },
  {
    name: "Data migration",
    detail:
      "Move data in waves with dual-write or change-data-capture, reconcile old and new continuously, and keep a verified path back until the new store is authoritative.",
    icon: ArrowLeftRight,
  },
];

// --- Risk controls (CapabilityGrid) ---------------------------

export const RISK_EYEBROW = "Risk controls";
export const RISK_TITLE: TitlePart[] = [
  { text: "Every step has a " },
  { text: "way back", accent: "signal" },
];
export const RISK_INTRO =
  "Modernization goes wrong when a cutover is irreversible. These are in place for every slice we move.";
export const RISK_ITEMS: IconItem[] = [
  {
    name: "Parallel running",
    detail:
      "Old and new handle the same input for a period; outputs are compared automatically before traffic shifts.",
    icon: Activity,
  },
  {
    name: "Characterisation tests",
    detail:
      "Before touching a slice, we pin its current behaviour in tests — including the quirks — so 'the same' is measurable.",
    icon: TestTube2,
  },
  {
    name: "Feature-flagged cutover",
    detail:
      "Traffic moves by flag, a cohort at a time. A problem means flipping one switch, not a deploy.",
    icon: GitBranch,
  },
  {
    name: "Reversible data moves",
    detail:
      "Dual-write and reconciliation keep the old store valid until the new one has proven itself.",
    icon: Undo2,
  },
];

// --- Process (PhasedProcess) --------------------------------

export const PROCESS_EYEBROW = "How a modernization runs";
export const PROCESS_TITLE: TitlePart[] = [
  { text: "Assess, slice, " },
  { text: "migrate, retire", accent: "ember" },
];
export const PROCESS_INTRO =
  "The assessment sets the sequence; then it's the same loop per slice until the old system carries no traffic.";
export const PROCESS_STEPS: ProcessStep[] = [
  {
    label: "Assessment",
    detail:
      "Fixed-scope mapping of capabilities, dependencies, data and risk, ending in a costed, sequenced plan.",
    icon: MapPin,
    gate: true,
  },
  {
    label: "Seam & routing layer",
    detail:
      "Put the façade in front of the legacy system with everything still routing to the old path — no behaviour change yet.",
    icon: Route,
  },
  {
    label: "Rebuild a slice",
    detail:
      "Characterisation tests, then the capability rebuilt to current standards behind the façade, running in parallel.",
    icon: Boxes,
  },
  {
    label: "Cut over",
    detail:
      "Compare outputs, move traffic by feature flag a cohort at a time, watch the metrics, keep the old path warm.",
    icon: GitBranch,
    gate: true,
  },
  {
    label: "Retire",
    detail:
      "When nothing routes to the legacy system, decommission it — and the hosting, licences and on-call that came with it.",
    icon: AlarmClockOff,
  },
];

// --- FAQ ---------------------------------------------------

export const FAQ_HEADING = "Legacy modernization — common questions";
export const FAQS: FaqDto[] = [
  {
    id: "lm-faq-1",
    question: "Do we have to freeze the old system while you work?",
    answer:
      "No. The strangler-fig approach exists precisely so the business keeps running. A routing layer goes in front of the current system, capabilities are rebuilt behind it one at a time, and traffic moves across only when the new slice is proven. The legacy system stays authoritative for everything not yet migrated.",
    displayOrder: 1,
    serviceSlug: "",
  },
  {
    id: "lm-faq-2",
    question: "What if a migrated slice behaves differently from the old one?",
    answer:
      "Before any slice is touched we write characterisation tests that pin its current behaviour, including quirks. During parallel running, old and new process the same inputs and outputs are compared automatically. Cutover happens by feature flag for a small cohort first, so a discrepancy is caught early and reversed by flipping one switch.",
    displayOrder: 2,
    serviceSlug: "",
  },
  {
    id: "lm-faq-3",
    question: "Is a full rewrite ever the right answer?",
    answer:
      "Rarely, and never as the default. A big-bang rewrite means a long period with no delivery and a single high-risk cutover. We only recommend it when the existing system genuinely can't be seamed — for example, no separable capabilities and no way to run old and new side by side — and even then we'd stage it.",
    displayOrder: 3,
    serviceSlug: "",
  },
  {
    id: "lm-faq-4",
    question: "Can you move it to the cloud as part of this?",
    answer:
      "Yes. On-prem to cloud is often part of the target architecture — containerised deploys, Infrastructure as Code and managed data services. That work is done with the cloud and DevOps side of the same team; see the Cloud & DevOps page for how that infrastructure is built and operated.",
    displayOrder: 4,
    serviceSlug: "",
  },
  {
    id: "lm-faq-5",
    question: "What do we get from the assessment if we don't proceed?",
    answer:
      "A written capability map, dependency graph, data-model review, risk register and a sequenced, costed modernization plan. It's yours to keep and to take to another team or to act on later — it isn't contingent on continuing with Devliora.",
    displayOrder: 5,
    serviceSlug: "",
  },
];

// --- Closing CTA -----------------------------------------

export const CTA_TITLE: TitlePart[] = [
  { text: "Sitting on a system you " },
  { text: "can't change and can't switch off", accent: "ember" },
  { text: "?" },
];
export const CTA_BODY =
  "Tell us what it does and what's making it hard to live with. We'll start with an assessment and a plan you own, whatever you decide next.";
export const CTA_PRIMARY: CtaLink = { label: "Start a conversation", href: "/contact" };
export const CTA_SECONDARY: CtaLink = { label: "Explore custom software", href: "/custom-software-development" };
