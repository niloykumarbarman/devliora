import {
  Cloud,
  Server,
  Boxes,
  Container,
  GitBranch,
  Workflow,
  FileCode2,
  Network,
  Terminal,
  Activity,
  LineChart,
  ScrollText,
  Radar,
  ScanLine,
  ShieldCheck,
  Users,
  GitPullRequest,
  TestTube2,
  Search,
  Package,
  Rocket,
  Bell,
  Globe,
  Split,
  Database,
  DatabaseZap,
  RefreshCw,
  Lock,
  KeyRound,
  Gauge,
  HeartPulse,
  Cpu,
  MemoryStick,
  HardDrive,
  Timer,
  TriangleAlert,
  CircleCheckBig,
  Fingerprint,
  Bug,
  LockKeyhole,
  BrickWall,
  PackageSearch,
  DatabaseBackup,
  LifeBuoy,
  Undo2,
  TrendingUp,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

/**
 * Static, version-controlled content for the /cloud-devops capability
 * page. Kept here (not fetched from the admin API) on purpose — this is
 * a positioning/marketing page whose structure is a design decision, not
 * something admins are expected to reword. Everything here is a
 * capability statement, not a claim about volume, uptime, or named
 * clients — see the design brief's "no fake statistics" rule.
 *
 * The page is architected so a real backend (GitHub Actions status,
 * Prometheus, Grafana, a deploy API) can be wired into the pipeline and
 * dashboard sections later without reworking the layout — the visual
 * components take plain data and would take live data the same way.
 */

export interface CloudPlatform {
  name: string;
  /** One-line "what it's best at" framing. */
  tagline: string;
  description: string;
  useCases: string[];
  /** Brand hex, used only as a small accent (dot / hover border). */
  color: string;
  icon: LucideIcon;
}

export const CLOUD_PLATFORMS: CloudPlatform[] = [
  {
    name: "AWS",
    tagline: "The broadest managed-service catalogue",
    description:
      "The default choice for large-scale production workloads that need mature managed services and global reach — EC2, EKS, RDS, S3 and CloudFront.",
    useCases: [
      "High-scale production platforms",
      "Managed Kubernetes on EKS",
      "Serverless APIs with Lambda",
      "Global edge delivery via CloudFront",
    ],
    color: "#FF9900",
    icon: Cloud,
  },
  {
    name: "Microsoft Azure",
    tagline: "Enterprise identity and .NET-native workloads",
    description:
      "A natural fit where the organisation already runs on Microsoft — AKS, App Service and Azure SQL sit alongside Entra ID for single sign-on and role-based access.",
    useCases: [
      ".NET and Windows workloads",
      "Enterprise SSO with Entra ID",
      "Hybrid on-prem / cloud estates",
      "Regulated-industry compliance baselines",
    ],
    color: "#0078D4",
    icon: Cloud,
  },
  {
    name: "Google Cloud",
    tagline: "Kubernetes-first and data-heavy platforms",
    description:
      "GKE is the reference Kubernetes experience, and BigQuery plus Cloud Run make GCP strong for container-native services and analytics workloads.",
    useCases: [
      "Kubernetes-native platforms on GKE",
      "Analytics and warehousing with BigQuery",
      "Container-native APIs on Cloud Run",
      "Data and ML pipelines",
    ],
    color: "#4285F4",
    icon: Cloud,
  },
  {
    name: "Oracle Cloud",
    tagline: "High-performance compute and Oracle Database",
    description:
      "OCI is the pragmatic home for existing Oracle Database estates and for compute-heavy workloads where price-to-performance on bare metal matters.",
    useCases: [
      "Oracle Database migrations and hosting",
      "Cost-efficient bare-metal compute",
      "High-throughput block storage",
      "Enterprise Java workloads",
    ],
    color: "#F80000",
    icon: Cloud,
  },
  {
    name: "DigitalOcean",
    tagline: "Lean, predictable infrastructure",
    description:
      "Flat-rate pricing and a small, well-chosen set of primitives — Droplets, managed Kubernetes (DOKS) and managed databases — for teams that want production without the surface area.",
    useCases: [
      "Startup and SMB production hosting",
      "Predictable flat-rate billing",
      "Straightforward managed Kubernetes",
      "Staging and preview environments",
    ],
    color: "#0080FF",
    icon: Cloud,
  },
];

export type DevOpsCategory =
  | "Containers & Orchestration"
  | "CI/CD Automation"
  | "Infrastructure as Code"
  | "Runtime & Operating System"
  | "Monitoring & Observability"
  | "Security & Quality Gates";

export interface DevOpsTool {
  name: string;
  category: DevOpsCategory;
  /** What it is actually used for — not a logo caption. */
  purpose: string;
  icon: LucideIcon;
}

export const DEVOPS_CATEGORY_ORDER: DevOpsCategory[] = [
  "Containers & Orchestration",
  "CI/CD Automation",
  "Infrastructure as Code",
  "Runtime & Operating System",
  "Monitoring & Observability",
  "Security & Quality Gates",
];

export const DEVOPS_STACK: DevOpsTool[] = [
  {
    name: "Docker",
    category: "Containers & Orchestration",
    purpose:
      "Packages an application and its exact dependencies into a portable image that runs identically on a laptop, in CI, and in production.",
    icon: Container,
  },
  {
    name: "Kubernetes",
    category: "Containers & Orchestration",
    purpose:
      "Schedules containers across a cluster, restarts unhealthy ones, scales replicas to match load, and rolls out new versions without downtime.",
    icon: Boxes,
  },
  {
    name: "GitHub Actions",
    category: "CI/CD Automation",
    purpose:
      "Runs build, test, scan and deploy pipelines directly from the repository, triggered on every push and pull request.",
    icon: Workflow,
  },
  {
    name: "Jenkins",
    category: "CI/CD Automation",
    purpose:
      "Self-hosted pipeline engine for complex or legacy build matrices that need to run inside a private network.",
    icon: GitBranch,
  },
  {
    name: "Terraform",
    category: "Infrastructure as Code",
    purpose:
      "Describes cloud infrastructure as declarative code so environments are provisioned, reviewed and destroyed reproducibly.",
    icon: FileCode2,
  },
  {
    name: "Ansible",
    category: "Infrastructure as Code",
    purpose:
      "Agentless configuration management — brings servers to a known state and handles application deploys over SSH.",
    icon: Terminal,
  },
  {
    name: "Nginx",
    category: "Runtime & Operating System",
    purpose:
      "Reverse proxy and web server handling TLS termination, load balancing, caching and request routing in front of application containers.",
    icon: Network,
  },
  {
    name: "Linux",
    category: "Runtime & Operating System",
    purpose:
      "The hardened, minimal base image and host OS every workload runs on, tuned for security and predictable performance.",
    icon: Server,
  },
  {
    name: "Prometheus",
    category: "Monitoring & Observability",
    purpose:
      "Scrapes and stores time-series metrics from every service and evaluates alerting rules against them.",
    icon: Activity,
  },
  {
    name: "Grafana",
    category: "Monitoring & Observability",
    purpose:
      "Unifies metrics, logs and traces into dashboards that make system health readable at a glance.",
    icon: LineChart,
  },
  {
    name: "Loki",
    category: "Monitoring & Observability",
    purpose:
      "Aggregates logs indexed by label rather than full text, so log storage stays cheap and queries stay fast.",
    icon: ScrollText,
  },
  {
    name: "OpenTelemetry",
    category: "Monitoring & Observability",
    purpose:
      "Vendor-neutral instrumentation standard for traces, metrics and logs, so observability isn't locked to one backend.",
    icon: Radar,
  },
  {
    name: "SonarQube",
    category: "Security & Quality Gates",
    purpose:
      "Static analysis on every pull request — catches bugs, code smells and security hotspots, and enforces coverage thresholds.",
    icon: Search,
  },
  {
    name: "Trivy",
    category: "Security & Quality Gates",
    purpose:
      "Scans container images, dependencies and IaC for known vulnerabilities and misconfigurations before they reach a registry.",
    icon: ScanLine,
  },
];

export interface PipelineStage {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  /** Flags a stage that can block the pipeline on failure. */
  gate?: boolean;
}

export const CICD_PIPELINE: PipelineStage[] = [
  { id: "dev", label: "Developer", detail: "Feature branch, local tests green, pull request opened.", icon: Users },
  { id: "github", label: "GitHub", detail: "Push triggers the workflow; branch protection requires review.", icon: GitBranch },
  { id: "ci", label: "CI Pipeline", detail: "Dependencies restored, application built in a clean container.", icon: Workflow },
  { id: "tests", label: "Automated Testing", detail: "Unit, integration and contract tests run in parallel.", icon: TestTube2, gate: true },
  { id: "sonar", label: "SonarQube Analysis", detail: "Quality gate on coverage, duplication and security hotspots.", icon: Search, gate: true },
  { id: "trivy", label: "Trivy Security Scan", detail: "Image and dependency CVE scan; build fails on critical findings.", icon: ScanLine, gate: true },
  { id: "build", label: "Docker Build", detail: "Multi-stage build produces a minimal, signed production image.", icon: Container },
  { id: "registry", label: "Container Registry", detail: "Image pushed and tagged with the commit SHA for traceability.", icon: Package },
  { id: "deploy", label: "Production Deployment", detail: "Rolling update via Kubernetes; previous version kept for rollback.", icon: Rocket },
  { id: "monitor", label: "Monitoring & Alerting", detail: "Prometheus, Grafana and alert rules confirm the release is healthy.", icon: Bell },
];

export interface ArchNode {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}

/** The request path, top to bottom. */
export const ARCH_FLOW: ArchNode[] = [
  { id: "user", label: "User", detail: "Browser or API client over HTTPS.", icon: Globe },
  { id: "cdn", label: "CDN", detail: "Edge cache for static assets and TLS offload.", icon: Cloud },
  { id: "lb", label: "Load Balancer", detail: "Distributes traffic across healthy nodes, drains unhealthy ones.", icon: Split },
  { id: "nginx", label: "Nginx", detail: "Reverse proxy, routing, rate limiting and gzip/brotli.", icon: Network },
  { id: "containers", label: "Application Containers", detail: "Stateless app replicas orchestrated by Kubernetes.", icon: Boxes },
  { id: "api", label: "API", detail: "Business logic, authentication and validation layer.", icon: Server },
  { id: "db", label: "PostgreSQL / MySQL", detail: "Primary datastore with replicas and automated backups.", icon: Database },
  { id: "redis", label: "Redis", detail: "Cache, session store and queue for hot-path reads.", icon: DatabaseZap },
];

/** Concerns that wrap every layer of the request path. */
export const ARCH_CROSSCUTTING: { label: string; detail: string; icon: LucideIcon }[] = [
  { label: "Monitoring", detail: "Metrics and health checks on every tier.", icon: Activity },
  { label: "Logging", detail: "Structured logs shipped to Loki, correlated by trace ID.", icon: ScrollText },
  { label: "Backup", detail: "Scheduled, encrypted, restore-tested snapshots.", icon: RefreshCw },
  { label: "Security", detail: "Network isolation, secrets management, least-privilege IAM.", icon: Lock },
  { label: "CI/CD", detail: "Every change ships through the same automated pipeline.", icon: Workflow },
  { label: "Alerting", detail: "Actionable alerts routed to on-call, not noise.", icon: Bell },
];

export interface DevOpsService {
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
}

export const DEVOPS_SERVICES: DevOpsService[] = [
  {
    title: "Cloud Infrastructure",
    description: "Design secure, scalable cloud infrastructure sized to the workload rather than guessed at.",
    points: ["Network and subnet topology", "Auto-scaling groups and quotas", "Cost visibility from day one"],
    icon: Cloud,
  },
  {
    title: "CI/CD Automation",
    description: "Automate build, testing, security scanning and deployment so releases are routine, not events.",
    points: ["Pipeline-as-code", "Parallel test stages", "Gated promotions between environments"],
    icon: Workflow,
  },
  {
    title: "Docker & Kubernetes",
    description: "Containerise applications and orchestrate production workloads with sane defaults for scaling and recovery.",
    points: ["Minimal, non-root images", "Health probes and resource limits", "Rolling and blue-green rollouts"],
    icon: Boxes,
  },
  {
    title: "Cloud Migration",
    description: "Move legacy applications onto modern cloud infrastructure in measured phases, not a single risky cutover.",
    points: ["Dependency and data-flow mapping", "Incremental strangler migration", "Rollback plan at every step"],
    icon: GitPullRequest,
  },
  {
    title: "Infrastructure as Code",
    description: "Use Terraform and automation to make every environment reproducible and reviewable.",
    points: ["Version-controlled infrastructure", "Peer-reviewed plan/apply", "Identical staging and production"],
    icon: FileCode2,
  },
  {
    title: "Monitoring & Observability",
    description: "Implement Prometheus, Grafana, Loki and OpenTelemetry so problems are seen before users report them.",
    points: ["Golden-signal dashboards", "Trace-to-log correlation", "SLO-based alerting"],
    icon: LineChart,
  },
  {
    title: "Cloud Security",
    description: "Secure networking, secrets management, vulnerability scanning and access control built into the platform.",
    points: ["Least-privilege IAM / RBAC", "Secrets in a managed vault", "Image and dependency scanning in CI"],
    icon: ShieldCheck,
  },
  {
    title: "High Availability",
    description: "Design resilient infrastructure with backups, health checks, failover and rollback as standard.",
    points: ["Multi-AZ redundancy", "Automated failover", "Restore-tested backups"],
    icon: HeartPulse,
  },
];

/** Production-deployment workflow, section 7 of the brief. */
export const DEPLOY_WORKFLOW: { label: string; icon: LucideIcon; approval?: boolean }[] = [
  { label: "Git Push", icon: GitBranch },
  { label: "Automated Tests", icon: TestTube2 },
  { label: "Security Scan", icon: ScanLine },
  { label: "Docker Build", icon: Container },
  { label: "Container Registry", icon: Package },
  { label: "Staging", icon: Server },
  { label: "Approval", icon: KeyRound, approval: true },
  { label: "Production", icon: Rocket },
  { label: "Health Check", icon: Gauge },
  { label: "Monitoring", icon: Activity },
];

/** How the rollout itself avoids downtime — section 7's "Zero-Downtime" concept. */
export const ZERO_DOWNTIME_POINTS: { title: string; detail: string; icon: LucideIcon }[] = [
  {
    title: "Rolling replacement",
    detail: "New pods start and pass readiness checks before any old pod is removed — capacity never dips.",
    icon: RefreshCw,
  },
  {
    title: "Health-gated traffic",
    detail: "The load balancer only sends requests to instances reporting healthy; failing ones are drained, not served.",
    icon: Gauge,
  },
  {
    title: "Backward-compatible migrations",
    detail: "Schema changes ship in expand/contract steps so old and new code run against the same database.",
    icon: Database,
  },
  {
    title: "Instant rollback",
    detail: "The previous image stays in the registry and the prior ReplicaSet is kept — reverting is one command.",
    icon: Undo2,
  },
];

export interface SecurityControl {
  name: string;
  detail: string;
  icon: LucideIcon;
}

/** Section 9 — enterprise cloud-security controls. */
export const SECURITY_CONTROLS: SecurityControl[] = [
  { name: "HTTPS / TLS", detail: "TLS 1.2+ everywhere, HSTS, automated certificate rotation, no plaintext internal hops.", icon: LockKeyhole },
  { name: "Firewall", detail: "Default-deny security groups and network ACLs; only required ports are reachable.", icon: BrickWall },
  { name: "IAM / RBAC", detail: "Least-privilege roles, scoped service accounts, no shared or long-lived credentials.", icon: Fingerprint },
  { name: "Secrets Management", detail: "Secrets held in a managed vault, injected at runtime, never committed or baked into images.", icon: KeyRound },
  { name: "Container Security", detail: "Minimal non-root base images, read-only filesystems, dropped Linux capabilities.", icon: Container },
  { name: "Dependency Scanning", detail: "Software composition analysis on every build flags vulnerable and unmaintained packages.", icon: PackageSearch },
  { name: "Vulnerability Scanning", detail: "Trivy scans images and IaC for CVEs and misconfigurations before promotion.", icon: Bug },
  { name: "Secure CI/CD", detail: "Signed commits, protected branches, scoped pipeline tokens, provenance on artifacts.", icon: Workflow },
  { name: "Network Isolation", detail: "Private subnets for app and data tiers; databases hold no public route.", icon: Network },
  { name: "Automated Backups", detail: "Scheduled, encrypted, restore-tested snapshots with a defined retention policy.", icon: DatabaseBackup },
];

/** Section 10 — the Terraform workflow, step by step. */
export const IAC_STEPS: { label: string; detail: string; icon: LucideIcon }[] = [
  { label: "Infrastructure Configuration", detail: "Networks, clusters, databases and DNS described as declarative HCL.", icon: FileCode2 },
  { label: "Version Control", detail: "Every change is a reviewed pull request with a visible plan diff.", icon: GitBranch },
  { label: "Automated Provisioning", detail: "CI runs plan on PRs and apply on merge — no manual console clicking.", icon: Workflow },
  { label: "Reproducible Environment", detail: "Staging and production come from the same modules, differing only by variables.", icon: LayoutGrid },
];

/**
 * Section 10's "code-style visual" — generic, illustrative Terraform.
 * No real account IDs, hostnames, credentials or secrets: the sensitive
 * value is read from a variable, exactly as it should be in practice.
 * Tokens map to the same VS Code-ish palette used by CodeSnippetVisual.
 */
export interface CodeToken {
  text: string;
  color: string;
}
export const IAC_CODE_LINES: { indent: number; tokens: CodeToken[] }[] = [
  { indent: 0, tokens: [{ text: "resource ", color: "text-[#c586c0]" }, { text: '"kubernetes_deployment" ', color: "text-[#ce9178]" }, { text: '"api" ', color: "text-[#ce9178]" }, { text: "{", color: "text-[#d4d4d4]" }] },
  { indent: 1, tokens: [{ text: "metadata ", color: "text-[#9cdcfe]" }, { text: "{ name = ", color: "text-[#d4d4d4]" }, { text: "var", color: "text-[#9cdcfe]" }, { text: ".service_name ", color: "text-[#d4d4d4]" }, { text: "}", color: "text-[#d4d4d4]" }] },
  { indent: 1, tokens: [] },
  { indent: 1, tokens: [{ text: "spec ", color: "text-[#9cdcfe]" }, { text: "{", color: "text-[#d4d4d4]" }] },
  { indent: 2, tokens: [{ text: "replicas ", color: "text-[#9cdcfe]" }, { text: "= ", color: "text-[#d4d4d4]" }, { text: "var", color: "text-[#9cdcfe]" }, { text: ".replica_count", color: "text-[#d4d4d4]" }] },
  { indent: 2, tokens: [] },
  { indent: 2, tokens: [{ text: "strategy ", color: "text-[#9cdcfe]" }, { text: "{", color: "text-[#d4d4d4]" }] },
  { indent: 3, tokens: [{ text: "type ", color: "text-[#9cdcfe]" }, { text: "= ", color: "text-[#d4d4d4]" }, { text: '"RollingUpdate"', color: "text-[#ce9178]" }] },
  { indent: 3, tokens: [{ text: "rolling_update ", color: "text-[#9cdcfe]" }, { text: "{ max_unavailable = ", color: "text-[#d4d4d4]" }, { text: "0 ", color: "text-[#b5cea8]" }, { text: "}", color: "text-[#d4d4d4]" }] },
  { indent: 2, tokens: [{ text: "}", color: "text-[#d4d4d4]" }] },
  { indent: 2, tokens: [] },
  { indent: 2, tokens: [{ text: "container ", color: "text-[#9cdcfe]" }, { text: "{", color: "text-[#d4d4d4]" }] },
  { indent: 3, tokens: [{ text: "image ", color: "text-[#9cdcfe]" }, { text: "= ", color: "text-[#d4d4d4]" }, { text: '"${var.registry}/api"', color: "text-[#ce9178]" }] },
  { indent: 3, tokens: [{ text: "tag ", color: "text-[#9cdcfe]" }, { text: "  = ", color: "text-[#d4d4d4]" }, { text: "var", color: "text-[#9cdcfe]" }, { text: ".git_sha", color: "text-[#d4d4d4]" }] },
  { indent: 3, tokens: [] },
  { indent: 3, tokens: [{ text: "env ", color: "text-[#9cdcfe]" }, { text: "{", color: "text-[#d4d4d4]" }] },
  { indent: 4, tokens: [{ text: "name ", color: "text-[#9cdcfe]" }, { text: "      = ", color: "text-[#d4d4d4]" }, { text: '"DB_PASSWORD"', color: "text-[#ce9178]" }] },
  { indent: 4, tokens: [{ text: "value_from ", color: "text-[#9cdcfe]" }, { text: "= ", color: "text-[#d4d4d4]" }, { text: "var", color: "text-[#9cdcfe]" }, { text: ".db_secret", color: "text-[#d4d4d4]" }] },
  { indent: 3, tokens: [{ text: "}", color: "text-[#d4d4d4]" }] },
  { indent: 2, tokens: [{ text: "}", color: "text-[#d4d4d4]" }] },
  { indent: 1, tokens: [{ text: "}", color: "text-[#d4d4d4]" }] },
  { indent: 0, tokens: [{ text: "}", color: "text-[#d4d4d4]" }] },
];

/** Section 11 — "Built for Production" reliability capabilities (no invented stats). */
export const RELIABILITY_CAPABILITIES: { name: string; detail: string; icon: LucideIcon }[] = [
  { name: "High Availability", detail: "Redundant instances across availability zones behind a health-aware load balancer.", icon: HeartPulse },
  { name: "Auto Recovery", detail: "Failed containers and nodes are detected and replaced by the orchestrator automatically.", icon: RefreshCw },
  { name: "Health Checks", detail: "Liveness and readiness probes on every service gate both traffic and rollouts.", icon: Gauge },
  { name: "Automated Backups", detail: "Scheduled encrypted snapshots of every stateful store, retained to policy.", icon: DatabaseBackup },
  { name: "Disaster Recovery", detail: "Documented, rehearsed restore procedure with defined RPO and RTO targets.", icon: LifeBuoy },
  { name: "Rollback", detail: "Previous release kept warm; reverting is a single, fast, well-practised step.", icon: Undo2 },
  { name: "Monitoring", detail: "Golden signals — latency, traffic, errors, saturation — tracked on every tier.", icon: Activity },
  { name: "Alerting", detail: "Symptom-based alerts on SLO burn rate, routed to on-call with runbooks attached.", icon: Bell },
  { name: "Scalable Infrastructure", detail: "Horizontal autoscaling on real load signals, with headroom and upper bounds.", icon: TrendingUp },
];

export interface SiteStackGroup {
  category: string;
  note: string;
  items: string[];
  icon: LucideIcon;
}

/**
 * Section 12 — the architecture this very site runs on. Stated as the
 * preferred/target stack for the Devliora website; kept honest and
 * matching what the repo actually uses (Next.js + Tailwind frontend,
 * ASP.NET Core API).
 */
export const SITE_STACK: SiteStackGroup[] = [
  { category: "Frontend", note: "This page, server-rendered and statically optimised.", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"], icon: LayoutGrid },
  { category: "Backend", note: "APIs and admin services, where a backend is required.", items: ["ASP.NET Core", "Node.js"], icon: Server },
  { category: "Infrastructure", note: "Containerised and shipped through CI.", items: ["Docker", "Nginx", "Linux", "GitHub Actions"], icon: Boxes },
  { category: "Data", note: "Primary store plus a cache / queue, where required.", items: ["PostgreSQL", "Redis"], icon: Database },
  { category: "Monitoring", note: "Metrics, logs and traces in one place.", items: ["Prometheus", "Grafana", "Loki", "OpenTelemetry"], icon: LineChart },
  { category: "Security", note: "Enforced in the pipeline, not bolted on.", items: ["HTTPS", "Secrets Management", "SonarQube", "Trivy"], icon: ShieldCheck },
];

export type MetricStatus = "ok" | "warn";

export interface DashboardMetric {
  label: string;
  value: string;
  caption: string;
  status: MetricStatus;
  icon: LucideIcon;
  /** 0–100 sample series driving the mini chart. Illustrative only. */
  series: number[];
}

/**
 * Section 8 — mock monitoring dashboard. These numbers are ILLUSTRATIVE
 * and hard-coded; the component labels itself as a demo. When a real
 * Prometheus / Grafana backend is wired up, a component with this same
 * shape can be fed live values without any layout change.
 */
export const DASHBOARD_METRICS: DashboardMetric[] = [
  { label: "Server CPU", value: "38%", caption: "8 vCPU · 4 nodes", status: "ok", icon: Cpu, series: [30, 34, 41, 37, 45, 39, 36, 42, 38, 35, 40, 38] },
  { label: "Memory Usage", value: "61%", caption: "of 32 GiB", status: "ok", icon: MemoryStick, series: [55, 57, 60, 58, 62, 63, 61, 59, 64, 62, 60, 61] },
  { label: "Disk Usage", value: "72%", caption: "of 500 GiB SSD", status: "warn", icon: HardDrive, series: [66, 67, 68, 69, 70, 70, 71, 71, 72, 72, 72, 72] },
  { label: "Request Rate", value: "1.2k/s", caption: "rolling 1-minute", status: "ok", icon: Activity, series: [40, 55, 48, 62, 70, 58, 65, 72, 60, 68, 63, 66] },
  { label: "Response Time", value: "142 ms", caption: "p95 latency", status: "ok", icon: Timer, series: [50, 46, 52, 48, 44, 47, 45, 49, 43, 46, 42, 45] },
  { label: "Error Rate", value: "0.04%", caption: "5xx over 5 min", status: "ok", icon: TriangleAlert, series: [8, 6, 10, 5, 7, 4, 6, 5, 3, 5, 4, 4] },
  { label: "Uptime", value: "30d", caption: "since last restart", status: "ok", icon: CircleCheckBig, series: [90, 92, 91, 93, 94, 93, 95, 94, 96, 95, 96, 97] },
  { label: "Active Containers", value: "24", caption: "across 4 nodes", status: "ok", icon: Boxes, series: [20, 22, 21, 24, 23, 24, 24, 22, 25, 24, 24, 24] },
];
