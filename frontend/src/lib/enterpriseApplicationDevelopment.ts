import {
  Boxes,
  CalendarCheck,
  ClipboardCheck,
  Cog,
  Database,
  FileStack,
  Fingerprint,
  GitMerge,
  KeyRound,
  Layers,
  LineChart,
  ListChecks,
  LockKeyhole,
  Plug,
  RefreshCw,
  ScrollText,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Workflow,
} from "lucide-react";
import type { FaqDto } from "@/lib/faq";
import type {
  CtaLink,
  IconItem,
  ProcessStep,
  TitlePart,
} from "@/components/sections/cluster/clusterKit";

/**
 * Static content for the /enterprise-application-development supporting
 * page in the Phase 21 "Custom Software Development" cluster. Capability
 * statements only — no invented metrics or client names (see
 * src/lib/cloudDevops.ts).
 */

export const PAGE_PATH = "/enterprise-application-development";
export const PAGE_TITLE = "Enterprise Application Development";
export const PAGE_DESCRIPTION =
  "Devliora builds enterprise applications — line-of-business systems with SSO, role-based access, audit trails, approvals and integrations, built for reliability.";

export const HERO_EYEBROW = "Enterprise Applications";
export const HERO_BREADCRUMB: { label: string; href?: string }[] = [
  { label: "Home", href: "/" },
  { label: "Custom Software Development", href: "/custom-software-development" },
  { label: "Enterprise Applications" },
];
export const HERO_TITLE: TitlePart[] = [
  { text: "Line-of-business software the whole company " },
  { text: "runs on", accent: "signal" },
  { text: "." },
];
export const HERO_INTRO =
  "Enterprise applications carry real process — approvals, records, money, compliance — for many users across departments. That raises the bar on identity, access control, auditability, integration and uptime. This is how we build to it.";
export const HERO_PRIMARY_CTA: CtaLink = { label: "Talk to an engineer", href: "/contact" };
export const HERO_SECONDARY_CTA: CtaLink = { label: "Book a consultation", href: "/book-consultation" };
export const HERO_CHIPS = [
  "Single sign-on",
  "Role-based access",
  "Audit trails",
  "Approval workflows",
  "System integration",
  "Reporting & exports",
  "Data migration",
  "SLA-backed support",
];

export const BACK_LINK_LABEL = "Part of custom software development";

// --- What counts as enterprise (SplitFeature) -------------------

export const DEFINE_EYEBROW = "What makes it “enterprise”";
export const DEFINE_TITLE: TitlePart[] = [
  { text: "Not the size of the company — the " },
  { text: "weight of the process", accent: "signal" },
];
export const DEFINE_INTRO =
  "An app becomes an enterprise application when getting it wrong has consequences beyond one user. These are the requirements that follow.";
export const DEFINE_ITEMS: IconItem[] = [
  {
    name: "Identity that fits the org",
    detail:
      "Single sign-on against the company directory, provisioning and de-provisioning that follow HR, and no separate password to manage.",
    icon: KeyRound,
  },
  {
    name: "Access control that maps to roles",
    detail:
      "Permissions modelled on real job functions, delegated administration, and least privilege by default.",
    icon: Fingerprint,
  },
  {
    name: "An audit trail you can stand behind",
    detail:
      "Who changed what, when and from where — immutable, queryable, and retained to policy.",
    icon: ScrollText,
  },
  {
    name: "Process, not just forms",
    detail:
      "Multi-step approvals, delegation, escalation and states — the workflow encoded, not left to email.",
    icon: Workflow,
  },
  {
    name: "It doesn't stand alone",
    detail:
      "It reads from and writes to the ERP, CRM, finance and identity systems already in place.",
    icon: Plug,
  },
];
export const DEFINE_ASIDE = {
  heading: "Also in scope",
  points: [
    {
      name: "Reporting & exports",
      detail:
        "Scheduled reports, ad-hoc queries and exports finance and auditors can rely on.",
      icon: LineChart,
    },
    {
      name: "Admin tooling",
      detail:
        "Configuration, reference data and user management your team runs without a developer.",
      icon: SlidersHorizontal,
    },
  ] satisfies IconItem[],
};

// --- Capabilities (CapabilityGrid) ---------------------------

export const CAPS_EYEBROW = "What we build";
export const CAPS_TITLE: TitlePart[] = [
  { text: "The building blocks of a " },
  { text: "line-of-business system", accent: "signal" },
];
export const CAPS_INTRO =
  "Most enterprise projects assemble a subset of these around a core domain model.";
export const CAPS_ITEMS: IconItem[] = [
  {
    name: "Workflow & approvals",
    detail:
      "Configurable multi-step processes with delegation, escalation, SLAs and a full history per item.",
    icon: Workflow,
  },
  {
    name: "Master data management",
    detail:
      "One authoritative record for customers, products or assets, with matching, merge and stewardship.",
    icon: Database,
  },
  {
    name: "Document & case handling",
    detail:
      "Structured cases with attachments, versioning, retention rules and controlled access.",
    icon: FileStack,
  },
  {
    name: "Reporting & analytics",
    detail:
      "Operational dashboards, scheduled reports and warehouse-ready exports for BI tools.",
    icon: LineChart,
  },
  {
    name: "Admin & configuration",
    detail:
      "Reference data, feature toggles, permission management and environment settings your team controls.",
    icon: Cog,
  },
  {
    name: "Batch & scheduled jobs",
    detail:
      "Reconciliations, imports, billing runs and nightly processing with monitoring and retry.",
    icon: CalendarCheck,
  },
];

// --- Integration & identity (SplitFeature) -------------------

export const INTEGRATION_EYEBROW = "Integration & identity";
export const INTEGRATION_TITLE: TitlePart[] = [
  { text: "It has to " },
  { text: "fit the estate", accent: "signal" },
  { text: " it lands in" },
];
export const INTEGRATION_INTRO =
  "An enterprise app that can't talk to the systems around it just adds another silo. Integration is designed from the first sprint.";
export const INTEGRATION_ITEMS: IconItem[] = [
  {
    name: "SSO & directory",
    detail:
      "SAML or OpenID Connect against Entra ID, Okta or Google Workspace, with SCIM provisioning where it's available.",
    icon: KeyRound,
  },
  {
    name: "System-of-record integration",
    detail:
      "APIs, message queues or change-data-capture into ERP, CRM and finance — with reconciliation, not fire-and-forget.",
    icon: GitMerge,
  },
  {
    name: "Eventing",
    detail:
      "Publishes domain events other systems can subscribe to, so the app is a good citizen in the estate.",
    icon: Boxes,
  },
  {
    name: "Data migration",
    detail:
      "Legacy data profiled, cleansed, mapped and loaded in waves, with a verified rollback until cutover.",
    icon: RefreshCw,
  },
];
export const INTEGRATION_ASIDE = {
  heading: "Identity done once",
  points: [
    {
      name: "No new credentials",
      detail:
        "Users sign in with their company account; leavers lose access when HR says so.",
      icon: Fingerprint,
    },
    {
      name: "Delegated admin",
      detail:
        "Team leads manage their own people and permissions within policy — not a ticket to IT.",
      icon: Users,
    },
  ] satisfies IconItem[],
};

// --- Security & compliance (CapabilityGrid) -----------------

export const SECURITY_EYEBROW = "Security & compliance";
export const SECURITY_TITLE: TitlePart[] = [
  { text: "Built to " },
  { text: "pass review", accent: "signal" },
];
export const SECURITY_INTRO =
  "The controls an internal security team or an external auditor will ask about — in place from the start, not retrofitted. See our security page for how we work.";
export const SECURITY_ITEMS: IconItem[] = [
  {
    name: "Least-privilege access",
    detail:
      "Role-based permissions enforced server-side, reviewed access, and no shared accounts.",
    icon: LockKeyhole,
  },
  {
    name: "Encryption in transit & at rest",
    detail:
      "TLS everywhere, encrypted datastores and backups, and secrets held in a managed vault.",
    icon: ShieldCheck,
  },
  {
    name: "Immutable audit log",
    detail:
      "Every state change and privileged action recorded with actor, time and source, retained to policy.",
    icon: ScrollText,
  },
  {
    name: "Data lifecycle",
    detail:
      "Classification, retention and deletion rules implemented, with export and erasure paths for subject requests.",
    icon: FileStack,
  },
  {
    name: "Change control",
    detail:
      "Peer review, CI checks, environment separation and a release trail — auditable from commit to production.",
    icon: ListChecks,
  },
  {
    name: "Dependency & vulnerability management",
    detail:
      "Automated scanning of dependencies and images, with a patching cadence rather than an annual scramble.",
    icon: ClipboardCheck,
  },
];

// --- Scale & reliability (StatementBand) --------------------

export const SCALE_TITLE: TitlePart[] = [
  { text: "Reliability is a " },
  { text: "requirement", accent: "signal" },
  { text: ", so we test for it" },
];
export const SCALE_BODY =
  "An enterprise app that's down is a department that's stopped. We design for availability and prove the ceiling before a launch — the same discipline as our performance and reliability engineering.";
export const SCALE_POINTS = [
  "Load and soak testing to a defined concurrency target, not a hopeful guess",
  "Horizontal scaling, health checks and graceful degradation under pressure",
  "Background work isolated from request paths so a slow job can't take the app down",
  "Structured logs, metrics and traces from day one, with alerting on the paths that matter",
  "Documented runbooks and an agreed incident and support model",
  "Backups tested by restore, not just by existing",
];

// --- Process (PhasedProcess) -----------------------------

export const PROCESS_EYEBROW = "How an enterprise build runs";
export const PROCESS_TITLE: TitlePart[] = [
  { text: "Domain first, then " },
  { text: "integrate and harden", accent: "signal" },
];
export const PROCESS_INTRO =
  "The domain model and the identity and integration boundaries are settled early, because they're the expensive things to change late.";
export const PROCESS_STEPS: ProcessStep[] = [
  {
    label: "Domain & process discovery",
    detail:
      "Map the process, the records, the roles and the systems it touches; agree the first release boundary.",
    icon: ClipboardCheck,
  },
  {
    label: "Architecture & identity",
    detail:
      "Domain model, permission model, integration contracts and the SSO approach, written down with trade-offs.",
    icon: Layers,
    gate: true,
  },
  {
    label: "Incremental build",
    detail:
      "Two-week increments against the model, each demoed to real users, with integrations stubbed then wired.",
    icon: Boxes,
  },
  {
    label: "Integration & migration",
    detail:
      "Connect the systems of record, migrate legacy data in waves, and reconcile continuously.",
    icon: GitMerge,
  },
  {
    label: "Hardening & handover",
    detail:
      "Load testing, security review, runbooks and an SLA-backed support model — then an architecture walkthrough for your team.",
    icon: ServerCog,
    gate: true,
  },
];

// --- FAQ ------------------------------------------------

export const FAQ_HEADING = "Enterprise application development — common questions";
export const FAQS: FaqDto[] = [
  {
    id: "ent-faq-1",
    question: "How is this different from your general custom software development?",
    answer:
      "It's the same team and the same delivery process, applied where the non-functional requirements dominate: single sign-on against a corporate directory, role-based access modelled on real job functions, immutable audit trails, deep integration with systems of record, and reliability targets that are tested rather than hoped for. On a simpler product those concerns are lighter; here they shape the architecture from the first week.",
    displayOrder: 1,
    serviceSlug: "",
  },
  {
    id: "ent-faq-2",
    question: "Can you integrate with our existing ERP, CRM and identity provider?",
    answer:
      "Yes. Single sign-on is via SAML or OpenID Connect against Entra ID, Okta or Google Workspace, with SCIM provisioning where the provider supports it. Integration with ERP, CRM and finance systems is done through their APIs, message queues or change-data-capture, always with reconciliation so the two systems can't silently drift apart.",
    displayOrder: 2,
    serviceSlug: "",
  },
  {
    id: "ent-faq-3",
    question: "Will it stand up to a security or compliance audit?",
    answer:
      "It's built to. Least-privilege access enforced server-side, encryption in transit and at rest, an immutable audit log, implemented data-retention and deletion rules, peer-reviewed change control with an auditable release trail, and automated dependency and vulnerability scanning. We can work to the specific framework your auditors use.",
    displayOrder: 3,
    serviceSlug: "",
  },
  {
    id: "ent-faq-4",
    question: "How do you handle migrating data from the system we're replacing?",
    answer:
      "Legacy data is profiled and quality-assessed during discovery, then mapped to the new model and loaded in waves rather than one cutover. Old and new are reconciled continuously and a verified rollback path is kept until the new system is authoritative. This is the same approach described on the Legacy Modernization page.",
    displayOrder: 4,
    serviceSlug: "",
  },
  {
    id: "ent-faq-5",
    question: "What does support look like after launch?",
    answer:
      "An agreed SLA-backed model: defined response times, an on-call arrangement for critical incidents, documented runbooks, and a backlog process for enhancements. Backups are verified by restore, and dependency patching runs on a cadence. You can also take the system in-house using the handover documentation.",
    displayOrder: 5,
    serviceSlug: "",
  },
];

// --- Closing CTA ------------------------------------

export const CTA_TITLE: TitlePart[] = [
  { text: "Have a process that's outgrown " },
  { text: "spreadsheets and email", accent: "signal" },
  { text: "?" },
];
export const CTA_BODY =
  "Tell us the process, the roles involved and the systems it has to talk to. We'll come back with a domain model sketch, the integration and identity approach, and a plan.";
export const CTA_PRIMARY: CtaLink = { label: "Start a conversation", href: "/contact" };
export const CTA_SECONDARY: CtaLink = { label: "Explore custom software", href: "/custom-software-development" };
