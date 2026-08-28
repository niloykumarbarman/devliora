/**
 * Long-form, per-industry page content for the priority industries
 * Devliora targets. The admin-managed Industry model only carries a
 * name, a one-line description and a few stats; these pages need the
 * full problem → solution → capability → tech → security → FAQ
 * structure, and that content is structural rather than something an
 * editor is expected to rewrite — so it lives here, keyed by the
 * canonical industry slug, the same way per-slug design/content lookups
 * already work for the technology and solution routes.
 *
 * Any industry slug NOT in this map still renders (name, description,
 * stats, CTA) via the generic /industries/[slug] layout. Add an entry
 * here to upgrade one to the full page.
 *
 * Every entry must be genuinely distinct — different regulations,
 * standards, failure modes and stack emphasis per industry. Do not
 * template one from another.
 */

export interface IndustryContentBlock {
  title: string;
  body: string;
}

export interface IndustryContent {
  /** Overrides the route's default `<title>` when set (still gets " | Devliora"). */
  metaTitle?: string;
  metaDescription: string;
  /** Replaces the thin API description as the lead paragraph under the H1. */
  intro: string;
  /** Section 1 — Industry problems. */
  problems: IndustryContentBlock[];
  /** Section 2 — Devliora solutions (index-aligned in spirit with `problems`). */
  solutions: IndustryContentBlock[];
  /** Section 3 — Software capabilities. */
  capabilities: string[];
  /** Section 4 — Technology, grouped. */
  techGroups: { label: string; items: string[] }[];
  /** Section 5 — Security & compliance. */
  security: string[];
  /** Section 7 — FAQ. */
  faqs: { question: string; answer: string }[];
  /**
   * Section 6 — Case studies. Slugs of real /case-studies entries
   * relevant to this industry; empty is fine (the section then links
   * out to the case-studies and portfolio indexes instead of inventing
   * anything).
   */
  caseStudySlugs: string[];
}

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  fintech: {
    metaTitle: "FinTech Software Development Services",
    metaDescription:
      "Devliora builds payments, lending and wealth platforms — PCI-DSS-aligned, auditable, and built for the uptime and latency regulated finance demands.",
    intro:
      "We build the systems that move money and the systems regulators ask about afterwards — payment rails, lending workflows, ledgers and reporting — with the auditability, uptime and latency that financial services can't treat as optional.",
    problems: [
      {
        title: "Compliance is a moving target",
        body: "PCI-DSS, PSD2/SCA, KYC/AML and local licensing rules keep changing, and a platform that wasn't designed to gather evidence makes every audit a fire drill.",
      },
      {
        title: "Downtime is measured in lost transactions",
        body: "Payment and trading paths can't take a maintenance window; a five-minute outage is a support queue, a chargeback spike and a trust problem.",
      },
      {
        title: "Reconciliation breaks quietly",
        body: "Money movement spread across processors, banks and internal ledgers drifts out of balance, and teams hear about it from a customer, not a dashboard.",
      },
      {
        title: "Fraud scales with growth",
        body: "The same features that make onboarding fast make it attractive to fraud rings, and hand-written rules fall behind.",
      },
    ],
    solutions: [
      {
        title: "Audit-ready by construction",
        body: "Immutable event logs, append-only ledgers and per-request trace IDs, so a transaction's full history is one query rather than a reconstruction.",
      },
      {
        title: "Resilient money paths",
        body: "Idempotent APIs, queued settlement, circuit breakers around third-party processors and blue/green deploys, so releases don't interrupt payments.",
      },
      {
        title: "Automated reconciliation",
        body: "Continuous matching across processor, bank and internal ledger, with exceptions surfaced in real time instead of at month-end.",
      },
      {
        title: "Layered fraud controls",
        body: "Velocity checks, device and behavioural signals and a rules engine your risk team can tune without a deploy.",
      },
    ],
    capabilities: [
      "Payment gateway and processor integration (Stripe, Adyen, local acquirers)",
      "Double-entry ledgers and settlement engines",
      "Loan origination, servicing and repayment workflows",
      "KYC/KYB onboarding with document and sanctions screening",
      "Open banking and account-aggregation connections",
      "Regulatory and management reporting pipelines",
      "Real-time transaction APIs with p95 latency budgets",
    ],
    techGroups: [
      { label: "Backend", items: [".NET / ASP.NET Core", "Java / Spring", "Node.js", "Python"] },
      { label: "Data", items: ["PostgreSQL", "SQL Server", "Redis", "Kafka event streaming"] },
      { label: "Infrastructure", items: ["AWS / Azure", "Kubernetes", "Terraform", "Vault"] },
      { label: "Observability", items: ["OpenTelemetry", "Prometheus / Grafana", "structured audit logs"] },
    ],
    security: [
      "PCI-DSS-aligned segmentation and tokenization — no raw PAN storage",
      "Encryption in transit and at rest, keys held in a managed KMS or Vault",
      "Strong customer authentication (SCA) and step-up flows",
      "Least-privilege access, short-lived credentials and full admin-action audit trails",
      "Independent penetration testing and dependency scanning in CI",
    ],
    faqs: [
      {
        question: "Can you work within our existing compliance program?",
        answer:
          "Yes. We map controls to whatever you're audited against — PCI-DSS, SOC 2, ISO 27001, local licensing — and build the logging and access controls that produce evidence automatically.",
      },
      {
        question: "Do you integrate with our bank or card processor?",
        answer:
          "We integrate with major processors (Stripe, Adyen, Checkout.com), card networks, ACH/SEPA rails and direct bank APIs, including sandbox-to-production certification where it's required.",
      },
      {
        question: "How do you handle a processor outage?",
        answer:
          "Money paths degrade safely — requests queue, retries are idempotent, and where you have a second processor we can fail over to it rather than reject the transaction.",
      },
      {
        question: "Can you help us pass an upcoming audit?",
        answer:
          "Yes. We run a gap assessment against the target framework, close the technical findings, and set up ongoing evidence collection so the next audit is routine.",
      },
      {
        question: "Real-time or batch settlement?",
        answer:
          "Both, often as a hybrid — authorizations in real time, settlement and reconciliation on a schedule — with the ledger as the single source of truth.",
      },
    ],
    caseStudySlugs: ["multi-bank-settlement-api-modernization"],
  },

  healthcare: {
    metaTitle: "Healthcare Software Development Services",
    metaDescription:
      "Devliora builds patient platforms, clinical tools and integrations — HIPAA-aligned, interoperable via HL7/FHIR, and designed around clinicians' real workflows.",
    intro:
      "We build software that sits close to patient care — portals, scheduling, clinical documentation and the integrations that connect them — with the privacy controls, interoperability and reliability healthcare settings require.",
    problems: [
      {
        title: "Data is locked in incompatible systems",
        body: "EHRs, labs, imaging and billing each speak their own dialect, and moving a patient record between them is manual, slow, or simply not possible.",
      },
      {
        title: "Privacy rules constrain every feature",
        body: "HIPAA, GDPR and local health-data law shape what you can log, store and show — retrofitting that onto a finished product is expensive.",
      },
      {
        title: "Clinician time is the scarcest resource",
        body: "Tools that add clicks get worked around, and workarounds are where safety and data-quality problems start.",
      },
      {
        title: "Legacy systems can't be switched off",
        body: "The fifteen-year-old system still runs a critical workflow, and any modernization has to happen around it without downtime.",
      },
    ],
    solutions: [
      {
        title: "Interoperability via HL7 v2 and FHIR",
        body: "Standards-based interfaces to EHRs and ancillary systems so records move automatically, backed by an integration engine you can extend.",
      },
      {
        title: "Privacy designed in",
        body: "Field-level access control, consent tracking, de-identification for analytics and an audit log of every record access, from day one.",
      },
      {
        title: "Workflow-first design",
        body: "We shadow the actual clinical or administrative workflow and build to remove steps, not add screens.",
      },
      {
        title: "Incremental modernization",
        body: "A strangler-pattern migration that puts a modern interface and API in front of the legacy system, then moves functionality across piece by piece.",
      },
    ],
    capabilities: [
      "Patient portals, scheduling and intake",
      "Clinical documentation and care-plan tools",
      "EHR/EMR integration (Epic, Cerner, HL7/FHIR-capable systems)",
      "Telehealth and secure messaging",
      "Lab and imaging order/result interfaces",
      "Claims, eligibility and billing integration",
      "De-identified data pipelines for research and analytics",
    ],
    techGroups: [
      { label: "Backend", items: [".NET / ASP.NET Core", "Java", "Python", "Node.js"] },
      { label: "Interoperability", items: ["HL7 v2", "FHIR R4", "integration engines", "SMART on FHIR"] },
      { label: "Data", items: ["PostgreSQL", "SQL Server", "encrypted object storage"] },
      { label: "Infrastructure", items: ["AWS / Azure under a BAA", "Kubernetes", "Terraform"] },
    ],
    security: [
      "HIPAA-aligned safeguards: access controls, transmission security, audit controls",
      "PHI encrypted at rest and in transit, keys in a managed KMS",
      "Role- and attribute-based access with break-glass logging",
      "Consent capture and enforcement at the data-access layer",
      "Signed Business Associate Agreements with cloud providers; annual penetration testing",
    ],
    faqs: [
      {
        question: "Do you integrate with Epic, Cerner or our existing EHR?",
        answer:
          "Yes. We work through HL7 v2, FHIR and vendor APIs, and can run an integration engine that normalizes messages across every connected system.",
      },
      {
        question: "How do you handle HIPAA compliance?",
        answer:
          "We build the technical safeguards — access control, encryption, audit logging, transmission security — under a BAA with your cloud provider, and support SOC 2 and ISO 27001 where you need them.",
      },
      {
        question: "Can you modernize our legacy system without downtime?",
        answer:
          "Usually. We put an API and modern UI in front of the existing system, migrate workflows incrementally, and keep both running until the cutover is safe.",
      },
      {
        question: "Do you build telehealth features?",
        answer:
          "Yes — scheduling, waiting rooms, video visits, secure messaging and the clinical documentation around them, integrated with your records system.",
      },
      {
        question: "Can we use patient data for analytics or research?",
        answer:
          "With the right controls. We build de-identification and consent-aware pipelines so analytics and research datasets never expose PHI beyond what's permitted.",
      },
    ],
    caseStudySlugs: ["patient-records-modernization-healthcare-platform"],
  },

  "e-commerce-retail": {
    metaTitle: "E-commerce & Retail Software Development",
    metaDescription:
      "Devliora builds storefronts, checkout and the systems behind them — fast, conversion-focused front ends plus catalog, inventory, fulfillment and integration work.",
    intro:
      "We build commerce systems end to end — storefronts and checkout that convert, plus the catalog, inventory, pricing and fulfillment logic behind them — for retailers whose current platform is slowing them down.",
    problems: [
      {
        title: "The platform can't keep up with the roadmap",
        body: "Every change to checkout, promotions or catalog needs a workaround, and a monolithic SaaS platform charges more the more you grow.",
      },
      {
        title: "Peak traffic is a gamble",
        body: "A campaign or seasonal spike either falls over or costs a fortune in over-provisioned capacity.",
      },
      {
        title: "Stock and orders drift out of sync",
        body: "Storefront, warehouse, POS and marketplaces each hold their own view of inventory, and oversells and delays follow.",
      },
      {
        title: "Slow pages quietly cost sales",
        body: "Every 100ms of load time and every layout shift shows up in the conversion rate, but the current stack makes performance hard to fix.",
      },
    ],
    solutions: [
      {
        title: "Composable commerce",
        body: "A fast headless storefront over a commerce API, so front end and back end change independently and you can swap components you've outgrown.",
      },
      {
        title: "Scales with demand, not with cost",
        body: "CDN-served pages, cache-first data and autoscaling compute, so a traffic spike is a non-event and the bill tracks real usage.",
      },
      {
        title: "One inventory source of truth",
        body: "Real-time sync across storefront, OMS/warehouse, POS and marketplaces, with reservation logic that prevents oversells.",
      },
      {
        title: "Performance as a KPI",
        body: "Core Web Vitals budgets, image and font optimization and edge rendering, so pages are fast on the devices customers actually use.",
      },
    ],
    capabilities: [
      "Headless storefronts (Next.js) over Shopify, commercetools or custom APIs",
      "Checkout, payments, tax and fraud-screening integration",
      "Product information management and catalog syndication",
      "Order management, inventory sync and fulfillment workflows",
      "Promotions, pricing and loyalty logic",
      "Marketplace and ERP integration",
      "Search, merchandising and recommendations",
    ],
    techGroups: [
      { label: "Storefront", items: ["Next.js / React", "TypeScript", "edge rendering / CDN"] },
      { label: "Commerce", items: ["Shopify / Shopify Plus", "commercetools", "custom .NET / Node APIs"] },
      { label: "Data", items: ["PostgreSQL", "Redis", "Elasticsearch / OpenSearch"] },
      { label: "Infrastructure", items: ["AWS / Azure", "Kubernetes", "CDN + WAF"] },
    ],
    security: [
      "PCI-DSS scope kept minimal through hosted payment fields and tokenization",
      "WAF, bot mitigation and rate limiting on storefront and checkout",
      "PII encryption and least-privilege access to customer and order data",
      "Dependency and image scanning in CI; regular penetration testing",
    ],
    faqs: [
      {
        question: "Should we replatform or improve what we have?",
        answer:
          "It depends where the pain is. We assess first — sometimes a headless front end over your existing commerce backend gets most of the benefit without a full replatform.",
      },
      {
        question: "Do you work with Shopify?",
        answer:
          "Yes — Shopify and Shopify Plus, including headless builds on the Storefront API, custom apps and integrations. We also build fully custom commerce backends where a platform doesn't fit.",
      },
      {
        question: "Can you handle Black Friday-level traffic?",
        answer:
          "Yes. We load-test against realistic peak scenarios, serve as much as possible from cache and CDN, and autoscale the rest so cost tracks demand.",
      },
      {
        question: "How do you fix slow storefront performance?",
        answer:
          "We measure Core Web Vitals on real traffic, then work through image handling, JavaScript size, caching and rendering strategy — usually with a measurable conversion improvement.",
      },
      {
        question: "Can you connect the storefront to our ERP and warehouse?",
        answer:
          "Yes. Real-time inventory and order sync between storefront, OMS/ERP, POS and marketplaces is a core part of what we build.",
      },
    ],
    caseStudySlugs: [],
  },

  "logistics-supply-chain": {
    metaTitle: "Logistics & Supply Chain Software Development",
    metaDescription:
      "Devliora builds TMS, WMS, tracking and integration software for logistics — real-time visibility, EDI/API carrier connections and systems built for peak volume.",
    intro:
      "We build the software that keeps freight and inventory moving — transport and warehouse management, track-and-trace, route and load planning, and the carrier and ERP integrations that tie them together.",
    problems: [
      {
        title: "No single view of where things are",
        body: "Status lives in carrier portals, spreadsheets and email, and answering “where is my order” means three phone calls.",
      },
      {
        title: "Integration is endless",
        body: "Every carrier, 3PL and customs broker wants a different format — EDI, API, flat file — and each new partner is a project.",
      },
      {
        title: "Planning is manual and brittle",
        body: "Route, load and slot planning done by hand doesn't react to a delay, a cancellation or a demand spike.",
      },
      {
        title: "Peak season exposes the seams",
        body: "Volume that's fine in March overwhelms the same systems in November.",
      },
    ],
    solutions: [
      {
        title: "Real-time visibility layer",
        body: "One tracking model fed by carrier APIs, EDI, telematics and scan events, exposed to staff and customers through a live dashboard and API.",
      },
      {
        title: "An integration platform, not point-to-point",
        body: "A hub that normalizes EDI (X12/EDIFACT), API and file feeds once, so onboarding a new partner is configuration rather than code.",
      },
      {
        title: "Planning that reacts",
        body: "Route optimization, load building and dock-slot scheduling that re-plan automatically when conditions change.",
      },
      {
        title: "Built for volume",
        body: "Event-driven architecture and autoscaling, so throughput scales with the season instead of against it.",
      },
    ],
    capabilities: [
      "Transport management (TMS): orders, dispatch, carrier selection, freight audit",
      "Warehouse management (WMS): receiving, putaway, picking, packing, cycle counts",
      "Track-and-trace with customer-facing status and ETAs",
      "Route optimization and load planning",
      "EDI and API integration with carriers, 3PLs and marketplaces",
      "Customs, documentation and compliance workflows",
      "ERP and order-management integration",
    ],
    techGroups: [
      { label: "Backend", items: [".NET / ASP.NET Core", "Java", "Node.js", "Python"] },
      { label: "Integration", items: ["EDI X12 / EDIFACT", "REST / webhooks", "Kafka / RabbitMQ"] },
      { label: "Data", items: ["PostgreSQL", "SQL Server", "Redis", "PostGIS geospatial"] },
      { label: "Infrastructure", items: ["AWS / Azure", "Kubernetes", "Terraform"] },
    ],
    security: [
      "Partner API access scoped with per-key permissions and rate limits",
      "Encryption in transit and at rest; signed and validated EDI exchanges",
      "Audit trail of every shipment status change and document exchange",
      "Separate environments for partner onboarding and certification",
    ],
    faqs: [
      {
        question: "Do you work with EDI as well as modern APIs?",
        answer:
          "Yes. We handle X12 and EDIFACT alongside REST and webhooks, and normalize them into one internal model so downstream systems don't care which a partner uses.",
      },
      {
        question: "Can you integrate our carriers and 3PLs?",
        answer:
          "Yes — carrier rating, booking, tracking and freight audit across parcel and LTL/FTL carriers, plus 3PL and marketplace connections.",
      },
      {
        question: "Can you add tracking to our existing system?",
        answer:
          "Often without replacing it. We can build the visibility layer and customer-facing tracking on top of your current TMS/WMS and fill gaps from there.",
      },
      {
        question: "How do you handle peak-season volume?",
        answer:
          "Event-driven processing and autoscaling, load-tested against your peak scenarios, so throughput scales for the season and back down afterwards.",
      },
      {
        question: "Do you build route and load optimization?",
        answer:
          "Yes — using established optimization libraries or services, or custom logic where your constraints are unusual, with automatic re-planning when conditions change.",
      },
    ],
    caseStudySlugs: [],
  },

  "saas-b2b-platforms": {
    metaTitle: "SaaS Product Development Services",
    metaDescription:
      "Devliora builds and scales B2B SaaS platforms — multi-tenancy, billing, RBAC, integrations, and the reliability and performance work that keeps enterprise customers.",
    intro:
      "We build B2B SaaS platforms and help existing ones scale — multi-tenancy, subscription billing, granular permissions, an integration surface, and the performance and reliability work enterprise buyers put in the contract.",
    problems: [
      {
        title: "Multi-tenancy was an afterthought",
        body: "Tenant isolation bolted on later leaks data, complicates every query and makes per-customer configuration painful.",
      },
      {
        title: "Enterprise deals stall on the security review",
        body: "SSO, audit logs, data residency and a SOC 2 report become blockers because they weren't designed in.",
      },
      {
        title: "The platform slows as customers grow",
        body: "Queries that were fine at 10 tenants aren't at 500, and the largest customer's usage degrades everyone's.",
      },
      {
        title: "Every integration is custom work",
        body: "With no API strategy, each customer integration is a bespoke project and a standing support burden.",
      },
    ],
    solutions: [
      {
        title: "Tenancy as a first-class concern",
        body: "A clear isolation model — row-level, schema, or database per tenant — enforced at the data layer, with per-tenant config and safe noisy-neighbour limits.",
      },
      {
        title: "Enterprise-readiness built in",
        body: "SAML/OIDC SSO and SCIM, tenant-scoped audit logs, configurable retention and residency, and the controls a SOC 2 audit checks for.",
      },
      {
        title: "Performance headroom",
        body: "Query and index work, caching, async processing and per-tenant rate limits, so one large customer can't degrade the rest.",
      },
      {
        title: "A real API and webhook layer",
        body: "A versioned public API, webhooks and — where it fits — an app framework, so integrations are self-serve instead of services work.",
      },
    ],
    capabilities: [
      "Multi-tenant architecture and tenant lifecycle management",
      "Subscription billing and usage metering (Stripe Billing, usage-based pricing)",
      "SSO (SAML, OIDC), SCIM provisioning and RBAC/ABAC",
      "Public API, webhooks and integration framework",
      "Admin, analytics and customer-success tooling",
      "In-product onboarding, feature flags and entitlements",
      "Reliability engineering: SLOs, observability, load testing",
    ],
    techGroups: [
      { label: "Backend", items: [".NET / ASP.NET Core", "Node.js", "Python", "Java"] },
      { label: "Frontend", items: ["Next.js / React", "TypeScript", "design systems"] },
      { label: "Data", items: ["PostgreSQL", "Redis", "Kafka", "ClickHouse for analytics"] },
      { label: "Infrastructure", items: ["AWS / Azure", "Kubernetes", "Terraform", "GitOps"] },
    ],
    security: [
      "Enforced tenant isolation, with tests that prove data can't cross tenants",
      "SSO, MFA and least-privilege RBAC/ABAC across product and admin",
      "Tenant-scoped audit logging and configurable retention",
      "Encryption at rest and in transit; secrets in a managed KMS/Vault",
      "SOC 2 / ISO 27001 control support and third-party penetration testing",
    ],
    faqs: [
      {
        question: "Can you make our product enterprise-ready?",
        answer:
          "Yes — usually SSO and SCIM, audit logging, configurable retention and residency, hardened RBAC, and closing the technical gaps a SOC 2 audit would flag. We scope it against your target deals.",
      },
      {
        question: "What multi-tenancy model should we use?",
        answer:
          "It depends on isolation needs, customer size and compliance. We help you choose between row-level, schema-per-tenant and database-per-tenant, and can migrate between them as you grow.",
      },
      {
        question: "Can you help us scale an existing SaaS?",
        answer:
          "Yes. We profile the real workload, fix the query, caching and architecture bottlenecks, add per-tenant limits, and put SLOs and observability in place.",
      },
      {
        question: "Do you build the billing system?",
        answer:
          "We integrate Stripe Billing (or similar) for subscriptions, metering, proration and dunning, and build the entitlement logic that connects plans to features.",
      },
      {
        question: "Can you build our public API?",
        answer:
          "Yes — a versioned REST or GraphQL API, webhooks, API keys and OAuth, docs and rate limiting, designed so customer integrations don't become services work.",
      },
    ],
    caseStudySlugs: [
      "scaling-saas-platform-enterprise-workloads",
      "scalable-digital-platform-for-technology-agency",
    ],
  },

  edtech: {
    metaTitle: "EdTech Software Development Services",
    metaDescription:
      "Devliora builds learning platforms, assessment tools and school systems — standards-based (LTI, SCORM/xAPI), accessible, and built to scale for term-time peaks.",
    intro:
      "We build learning platforms, assessment and grading tools and the administrative systems around them — standards-based, accessible, and able to handle the traffic pattern where everyone logs in at 9am on the first day of term.",
    problems: [
      {
        title: "Tools don't talk to each other",
        body: "The LMS, the content library, the assessment tool and the SIS each hold part of the picture, and teachers re-enter data between them.",
      },
      {
        title: "Accessibility is a legal and practical requirement",
        body: "WCAG conformance isn't optional for public institutions, and retrofitting it after launch is costly.",
      },
      {
        title: "Usage is spiky and unforgiving",
        body: "Load concentrates at term start, assignment deadlines and exam windows — the rest of the calendar is quiet.",
      },
      {
        title: "Student data carries heavy obligations",
        body: "FERPA, GDPR and children's-privacy rules (COPPA) limit what you can collect, keep and show.",
      },
    ],
    solutions: [
      {
        title: "Standards-based interoperability",
        body: "LTI 1.3 for tool integration, SCORM and xAPI for content, OneRoster/SIS sync for rosters and grades — so the ecosystem connects instead of fragmenting.",
      },
      {
        title: "Accessible by default",
        body: "WCAG 2.2 AA built into the component library and tested with assistive technology, not audited at the end.",
      },
      {
        title: "Elastic for the academic calendar",
        body: "Cache-first delivery and autoscaling, so term-start and exam-window peaks are handled and off-peak cost stays low.",
      },
      {
        title: "Privacy-aware data handling",
        body: "Data minimization, consent and parental-consent flows, role-scoped access and retention aligned to FERPA/GDPR/COPPA.",
      },
    ],
    capabilities: [
      "Learning management and course delivery",
      "Assessment, quizzing, proctoring and grading workflows",
      "LTI 1.3 tool and content integration",
      "SCORM / xAPI content support and a learning record store",
      "SIS / OneRoster roster and grade sync",
      "Student and cohort analytics and progress tracking",
      "Institution admin, enrollment and reporting",
    ],
    techGroups: [
      { label: "Frontend", items: ["Next.js / React", "TypeScript", "accessible component libraries"] },
      { label: "Backend", items: [".NET / ASP.NET Core", "Node.js", "Python"] },
      { label: "Standards", items: ["LTI 1.3", "SCORM / xAPI", "OneRoster", "QTI"] },
      { label: "Infrastructure", items: ["AWS / Azure", "Kubernetes", "CDN", "Terraform"] },
    ],
    security: [
      "FERPA- and GDPR-aligned data handling with minimization and retention limits",
      "Parental/guardian consent flows where COPPA or local law applies",
      "Role-scoped access for students, teachers and administrators",
      "Encryption at rest and in transit; audit logging of record access",
      "Regular accessibility and penetration testing",
    ],
    faqs: [
      {
        question: "Do you support LTI and SCORM?",
        answer:
          "Yes. We build LTI 1.3 tool providers and consumers, support SCORM and xAPI content with a learning record store, and sync rosters and grades via OneRoster or direct SIS integration.",
      },
      {
        question: "Can you meet WCAG accessibility requirements?",
        answer:
          "Yes. We build to WCAG 2.2 AA — semantic markup, keyboard support and screen-reader testing — as part of development, and can provide a conformance report.",
      },
      {
        question: "How do you handle back-to-school traffic spikes?",
        answer:
          "Cache-first delivery, CDN and autoscaling sized against your peak windows, load-tested before term starts and scaled back down afterwards to keep cost down.",
      },
      {
        question: "How is student data protected?",
        answer:
          "We minimize what's collected, scope access by role, encrypt everything, log record access, and set retention to match FERPA, GDPR and children's-privacy rules.",
      },
      {
        question: "Can you integrate with our existing LMS or SIS?",
        answer:
          "Yes — Canvas, Moodle, Blackboard and common SIS platforms through LTI, OneRoster and their APIs, so a new tool fits the ecosystem you already run.",
      },
    ],
    caseStudySlugs: [],
  },
};
