/**
 * Per-case-study enrichment for /case-studies/[slug]. The CMS record
 * only holds title / client / industry / challenge / solution / results;
 * these entries add the architecture, technology, delivery-challenge,
 * metric and cross-link sections a full case study needs.
 *
 * Every case study currently on the site is illustrative (see
 * ILLUSTRATIVE_CASE_STUDY_SLUGS in lib/caseStudies.ts). The `approach`
 * and `techStack` below are therefore written as *representative* of the
 * kind of system described — consistent with each record's own
 * `solution` text — and the page renders them under a clear
 * "Illustrative Case Study" label. They are not claims about a specific
 * real client's infrastructure.
 *
 * When a genuine, client-approved case study is published, give it an
 * entry here with real details and remove its slug from the illustrative
 * set.
 */

export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface CaseStudyContent {
  /** Canonical industry slug for the "Industry" cross-link, if one fits. */
  industrySlug?: string;
  /** Section: Architecture & approach. */
  approach: string[];
  /** Section: Technologies, grouped. */
  techStack: { label: string; items: string[] }[];
  /** Section: Delivery challenges (distinct from the business problem). */
  challenges: string[];
  /** Section: Metrics (representative; drawn from the record's results). */
  metrics: string[];
  relatedServices: CaseStudyLink[];
  relatedTechnologies: CaseStudyLink[];
}

const SVC = {
  engineering: { label: "Software Engineering", href: "/services/software-engineering" },
  qa: { label: "Software Quality Assurance", href: "/services/software-quality-assurance" },
  perf: { label: "Performance Testing", href: "/services/performance-reliability-engineering" },
  cloud: { label: "Cloud Infrastructure & DevOps", href: "/cloud-devops" },
  consulting: { label: "IT Consulting", href: "/services/it-consulting" },
} as const;

const TECH = {
  dotnet: { label: ".NET", href: "/technologies/dot-net-development" },
  node: { label: "Node.js", href: "/technologies/node-js-development" },
  nextjs: { label: "Next.js", href: "/technologies/nextjs-development" },
  postgres: { label: "PostgreSQL", href: "/technologies/postgresql-development" },
  sqlserver: { label: "SQL Server", href: "/technologies/sql-server-development" },
  aws: { label: "AWS", href: "/technologies/aws-development" },
  azure: { label: "Azure", href: "/technologies/azure-development" },
  kubernetes: { label: "Kubernetes", href: "/technologies/kubernetes-development" },
} as const;

export const CASE_STUDY_CONTENT: Record<string, CaseStudyContent> = {
  "multi-bank-settlement-api-modernization": {
    industrySlug: "fintech",
    approach: [
      "A single settlement API gateway in front of every banking-partner integration, replacing point-to-point connections.",
      "Idempotency keys and transaction validation on every settlement request, so a retry can never create a duplicate.",
      "Reconciliation workers that match internal records against partner statements continuously, surfacing exceptions in real time.",
      "Token authentication, per-client rate limiting, and end-to-end request tracing built in from the first release.",
    ],
    techStack: [
      { label: "Backend", items: [".NET / ASP.NET Core", "REST APIs"] },
      { label: "Data", items: ["PostgreSQL", "Redis", "message queue for settlement events"] },
      { label: "Operations", items: ["structured logging", "metrics and alerting", "blue/green deploys"] },
    ],
    challenges: [
      "Each banking partner exposed a different integration style and error model, so the gateway had to normalize them without leaking partner-specific quirks upstream.",
      "There was no settlement window to cut over in, so the new path ran in parallel and was reconciled against the old one before switchover.",
    ],
    metrics: [
      "Reconciliation time: days → minutes",
      "Duplicate settlements after go-live: 0",
      "Banking-partner integrations: consolidated onto one standard API",
    ],
    relatedServices: [SVC.engineering, SVC.qa, SVC.cloud],
    relatedTechnologies: [TECH.dotnet, TECH.postgres, TECH.aws],
  },

  "patient-records-modernization-healthcare-platform": {
    industrySlug: "healthcare",
    approach: [
      "A modern API and interface layer in front of the legacy records system, so clinicians moved to the new experience while data stayed authoritative in the existing store.",
      "HL7 v2 and FHIR interfaces to exchange records with labs and downstream systems automatically.",
      "Field-level access control and an audit log of every record view and change.",
      "Incremental migration of workflows, one department at a time, with both systems running until each cutover.",
    ],
    techStack: [
      { label: "Backend", items: [".NET / ASP.NET Core"] },
      { label: "Interoperability", items: ["HL7 v2", "FHIR R4"] },
      { label: "Data", items: ["SQL Server", "encrypted object storage"] },
      { label: "Infrastructure", items: ["Azure under a BAA"] },
    ],
    challenges: [
      "The legacy system could not be taken offline, so every migration step had to be reversible and verified against live data.",
      "Clinical workflows varied by department, so the rollout sequence and training had to be planned around real schedules.",
    ],
    metrics: [
      "Record retrieval: manual lookup → seconds",
      "Lab and downstream systems integrated via HL7/FHIR",
      "Migration: zero-downtime, department by department",
    ],
    relatedServices: [SVC.engineering, SVC.consulting, SVC.qa],
    relatedTechnologies: [TECH.dotnet, TECH.sqlserver, TECH.azure],
  },

  "scaling-saas-platform-enterprise-workloads": {
    industrySlug: "saas-b2b-platforms",
    approach: [
      "Profiled the real production workload to find the query, caching and architecture bottlenecks before changing anything.",
      "Reworked hot-path queries and added targeted indexes; moved heavy work to asynchronous background processing.",
      "Introduced per-tenant rate limits so one large customer can't degrade the rest.",
      "Added SLOs, tracing and dashboards so regressions are caught in staging, not production.",
    ],
    techStack: [
      { label: "Backend", items: [".NET", "Node.js"] },
      { label: "Data", items: ["PostgreSQL", "Redis"] },
      { label: "Infrastructure", items: ["Kubernetes", "Terraform"] },
      { label: "Observability", items: ["OpenTelemetry", "Prometheus / Grafana"] },
    ],
    challenges: [
      "The largest tenants had data volumes orders of magnitude above the median, so fixes had to hold at the extremes, not just the average.",
      "Changes had to ship continuously, without a maintenance window.",
    ],
    metrics: [
      "p95 API latency under peak load: materially reduced",
      "Noisy-neighbour incidents: eliminated with per-tenant limits",
      "Largest-tenant workload: handled without degrading others",
    ],
    relatedServices: [SVC.engineering, SVC.perf, SVC.cloud],
    relatedTechnologies: [TECH.dotnet, TECH.postgres, TECH.kubernetes],
  },

  "scalable-digital-platform-for-technology-agency": {
    industrySlug: "saas-b2b-platforms",
    approach: [
      "A composable architecture — a fast front end over a clean API — so features could be added without a rebuild.",
      "CI/CD with preview environments, so every change is reviewed running, not just as a diff.",
      "Infrastructure as code and autoscaling, so capacity tracks demand.",
      "Automated tests around the core flows to keep releases safe as the team grew.",
    ],
    techStack: [
      { label: "Frontend", items: ["Next.js / React", "TypeScript"] },
      { label: "Backend", items: ["Node.js", ".NET"] },
      { label: "Data", items: ["PostgreSQL"] },
      { label: "Infrastructure", items: ["AWS", "Kubernetes", "Terraform"] },
    ],
    challenges: [
      "The roadmap was moving fast, so the architecture had to favour changeability over premature optimization.",
      "A small team meant tooling and automation had to do the heavy lifting.",
    ],
    metrics: [
      "Release cadence: infrequent and manual → continuous",
      "New-engineer environment setup: hours → minutes",
      "Capacity: fixed → autoscaled to demand",
    ],
    relatedServices: [SVC.engineering, SVC.cloud, SVC.consulting],
    relatedTechnologies: [TECH.nextjs, TECH.node, TECH.aws],
  },
};
