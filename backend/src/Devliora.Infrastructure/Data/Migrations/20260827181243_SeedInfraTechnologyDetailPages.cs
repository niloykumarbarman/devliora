using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    // Seeds four TechnologyDetailPage rows for the runtime/infrastructure
    // technologies Devliora actually builds and ships on but that had no
    // /technologies/[slug] page yet: Next.js (this site runs on it),
    // PostgreSQL (default database), Docker and Kubernetes (the
    // /cloud-devops capability page is built around them). Same shape and
    // editorial voice as the existing hand-seeded pages — see
    // 20260819122738_SeedDotNetAndJavaDetailPages. Content is written to be
    // genuinely useful (each page fills the full hero / overview / why /
    // expertise / services / industries / FAQ structure the shared
    // [slug] route renders), not a stub to mint a URL. Editable afterwards
    // in /admin/technology-detail-pages like every other row.
    public partial class SeedInfraTechnologyDetailPages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var nextId = Guid.NewGuid();
            var pgId = Guid.NewGuid();
            var dockerId = Guid.NewGuid();
            var k8sId = Guid.NewGuid();
            var now = DateTime.UtcNow;

            migrationBuilder.InsertData(
                table: "TechnologyDetailPages",
                columns: new[]
                {
                    "Id", "Slug", "TechnologyName", "MetaDescription", "DisplayOrder", "HeroTitle",
                    "OverviewHeading", "OverviewHeadingAccent", "OverviewParagraph",
                    "HighlightHeadline", "HighlightParagraph", "IndustriesParagraph",
                    "ServicesHeading", "ServicesCardLabel", "ServicesParagraph",
                    "CreatedAt", "UpdatedAt", "IsDeleted"
                },
                values: new object[,]
                {
                    {
                        nextId, "nextjs-development", "Next.js",
                        "Next.js development services for fast, SEO-friendly web applications — server rendering, the App Router, API routes, Core Web Vitals, and production deployment.",
                        30, "Next.js Development",
                        "Build Fast, SEO-Ready Web Applications with", "Next.js",
                        "Devliora builds production web applications with Next.js — the React framework for teams that need fast first loads, strong SEO, and one codebase for both the rendered page and the API behind it. We use the App Router, React Server Components, and streaming to keep pages quick on real devices and networks, not just in a benchmark.\n\nEvery build ships with the standards we apply everywhere: typed code, automated tests, image and font optimization, structured metadata, and a deployment pipeline that makes releases boring. Whether it's a marketing site that has to rank, a customer portal, or a full SaaS front end, we treat performance and search visibility as requirements, not afterthoughts.",
                        "One framework for rendering, routing, and APIs",
                        "Next.js removes the usual gap between a React front end and the services behind it. Server rendering and static generation give search engines and users fully-formed HTML; route handlers put lightweight APIs in the same project; and incremental regeneration keeps content fresh without a full rebuild. Devliora pairs that with a CDN-friendly deployment model so the same application stays fast whether it serves a hundred users or a spike of a hundred thousand.",
                        "We build Next.js applications for SaaS platforms, e-commerce, fintech, healthcare, media, and B2B services — anywhere a web front end has to load quickly, rank in search, and stay maintainable as features grow. The rendering strategy is chosen per route: static for content that rarely changes, server-rendered for personalized or fast-moving data, so each page gets the approach that fits its job.",
                        "Next.js Development Services", "Next.js Engineering",
                        "From a greenfield build to migrating an aging React or WordPress front end, Devliora provides end-to-end Next.js engineering — architecture, component systems, API routes, authentication, CMS integration, Core Web Vitals work, and deployment on a managed platform or a self-hosted Node runtime.",
                        now, null, false
                    },
                    {
                        pgId, "postgresql-development", "PostgreSQL",
                        "PostgreSQL development and consulting — schema design, query optimization, migrations, replication, and production database operations for growing applications.",
                        31, "PostgreSQL Development",
                        "Design a Data Layer That Holds Up with", "PostgreSQL",
                        "Devliora uses PostgreSQL as the default database for the systems we build — an open-source relational engine that stays correct under concurrency, handles JSON alongside relational data, and scales from a single instance to replicated, partitioned deployments. We design schemas that model the business accurately, with the constraints and indexes that keep data trustworthy as an application grows.\n\nWe also take on existing PostgreSQL databases: profiling slow queries, fixing lock contention and table bloat, planning zero-downtime migrations, and setting up backups, monitoring, and replication so the database is something the team relies on rather than worries about.",
                        "Relational integrity, without giving up flexibility",
                        "PostgreSQL gives you real transactions, foreign keys, and check constraints — so invalid states are rejected by the database, not just by application code — while also supporting JSONB, full-text search, geospatial data, and extensions when a feature needs them. Devliora leans on that combination to keep the core model strict where it matters and flexible where the domain genuinely varies.",
                        "We build and operate PostgreSQL databases for fintech, healthcare, logistics, SaaS, e-commerce, and analytics workloads — domains where data has to be accurate, auditable, and available. Schema design, indexing strategy, retention, and access controls are shaped around each industry's reporting, compliance, and integration needs.",
                        "PostgreSQL Development Services", "PostgreSQL Engineering",
                        "From first schema to production operations, Devliora covers data modeling, query and index optimization, migrations from other databases, high-availability setup, and ongoing performance tuning — for PostgreSQL running self-managed or on Amazon RDS, Google Cloud SQL, or Azure Database.",
                        now, null, false
                    },
                    {
                        dockerId, "docker-development", "Docker",
                        "Docker containerization services — reproducible builds, multi-stage images, Docker Compose environments, image hardening, and container pipelines for reliable delivery.",
                        32, "Docker & Containerization",
                        "Ship the Same Build Everywhere with", "Docker",
                        "Devliora containerizes applications with Docker so the artifact that passes tests is the exact artifact that runs in production — no \"works on my machine\", no environment drift. We write lean, multi-stage Dockerfiles, keep images small and rebuildable, and define local environments with Docker Compose so a new engineer is productive on day one.\n\nContainers are the packaging step, not the whole story. We wire them into CI so every commit produces a versioned image, push to a registry with vulnerability scanning, and hand off to whatever runs them — a single host, a managed container service, or Kubernetes — with health checks, resource limits, and logging already in place.",
                        "Reproducible builds are the foundation for everything else",
                        "Once an application is packaged as a well-built container image, most delivery problems get simpler: environments match, a rollback is the previous image tag, scaling is running more copies, and CI can test the real artifact. Devliora treats a clean Docker setup as the groundwork that makes CI/CD, cloud deployment, and orchestration straightforward rather than fragile.",
                        "We containerize workloads for SaaS, fintech, healthcare, logistics, and data-heavy platforms — teams that need consistent deployments, clean separation between services, and the freedom to move between hosting providers without rewriting how the application is packaged.",
                        "Docker & Container Services", "Containerization",
                        "Devliora covers the full container path — Dockerfiles and image optimization, Compose-based local environments, registry and scanning setup, and integration into CI/CD — for applications heading to a single server, a managed container service, or Kubernetes.",
                        now, null, false
                    },
                    {
                        k8sId, "kubernetes-development", "Kubernetes",
                        "Kubernetes engineering services — cluster setup, Helm-based deployments, GitOps, autoscaling, observability, and production operations on EKS, AKS, and GKE.",
                        33, "Kubernetes Engineering",
                        "Run Containers in Production with", "Kubernetes",
                        "Devliora designs and operates Kubernetes platforms for teams whose container workloads have outgrown a single host — services that need self-healing, rolling deployments, horizontal autoscaling, and clean isolation between environments. We set up clusters on EKS, AKS, or GKE, package applications with Helm, and codify the whole platform so it's reproducible rather than hand-built.\n\nWe're also deliberate about when Kubernetes is the right tool. For many applications a managed container service is simpler and cheaper, and we'll say so. When Kubernetes does fit, we keep it maintainable — sensible resource requests, network policies, secrets management, observability, and a GitOps workflow so changes are reviewed and auditable.",
                        "Powerful, but only worth it when the workload calls for it",
                        "Kubernetes earns its complexity when you're running many services, need fine-grained scaling and rollout control, or want one consistent platform across clouds. Devliora helps you make that call honestly, and if the answer is yes, builds a cluster the team can actually operate — not a black box only one person understands.",
                        "We run Kubernetes for SaaS platforms, fintech, healthcare, logistics, and high-traffic consumer products — workloads with real scaling demands, multiple services, and uptime requirements that justify an orchestration layer and the operational practices that come with it.",
                        "Kubernetes Engineering Services", "Kubernetes & Orchestration",
                        "Devliora covers cluster architecture and provisioning, Helm charts and GitOps delivery, autoscaling and cost control, network and secrets policy, observability, and ongoing cluster operations — on managed Kubernetes (EKS, AKS, GKE) or self-managed.",
                        now, null, false
                    }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailFeatures",
                columns: new[] { "Id", "TechnologyDetailPageId", "Title", "Body", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), nextId, "App Router architecture", "We structure applications around the App Router — server components, nested layouts, and route groups — so data loads close to where it's rendered and the client bundle stays small.", 0, now, null, false },
                    { Guid.NewGuid(), nextId, "Core Web Vitals as a target", "LCP, CLS, and INP are budgeted from the first sprint, using image optimization, font strategy, code splitting, and streaming to hit good scores on mid-range mobile.", 1, now, null, false },
                    { Guid.NewGuid(), nextId, "Rendering chosen per route", "Static generation, server rendering, and incremental regeneration are mixed deliberately, so each page balances freshness, speed, and server cost.", 2, now, null, false },
                    { Guid.NewGuid(), nextId, "SEO built in", "Structured metadata, canonical URLs, sitemaps, and JSON-LD are part of the build, not bolted on, so pages are crawlable and eligible for rich results from day one.", 3, now, null, false },
                    { Guid.NewGuid(), nextId, "Typed, tested, and deployable", "TypeScript end to end, automated tests around routes and server actions, and a CI pipeline that previews every change before it reaches production.", 4, now, null, false },

                    { Guid.NewGuid(), pgId, "Schema design that prevents bad data", "Normalized models with the right constraints, foreign keys, and enums so the database rejects invalid states instead of relying on application checks alone.", 0, now, null, false },
                    { Guid.NewGuid(), pgId, "Query and index optimization", "We read execution plans, add the indexes that matter, rewrite slow queries, and remove the ones that only add write cost.", 1, now, null, false },
                    { Guid.NewGuid(), pgId, "Safe migrations", "Schema and data migrations planned for zero or minimal downtime, with reversible steps and a tested rollback path.", 2, now, null, false },
                    { Guid.NewGuid(), pgId, "High availability and backups", "Streaming replication, automated backups, point-in-time recovery, and failover tested before you need it.", 3, now, null, false },
                    { Guid.NewGuid(), pgId, "Extensions where they earn their place", "PostGIS, pg_trgm, full-text search, and others added deliberately when a requirement calls for them, not by default.", 4, now, null, false },

                    { Guid.NewGuid(), dockerId, "Lean, multi-stage images", "Build and runtime are separated so production images carry only what they need — smaller, faster to pull, and with less to attack.", 0, now, null, false },
                    { Guid.NewGuid(), dockerId, "Consistent local environments", "Docker Compose definitions that stand up the whole stack — app, database, cache, queues — with one command, matching production closely.", 1, now, null, false },
                    { Guid.NewGuid(), dockerId, "Images built in CI", "Every commit produces a versioned, scanned image pushed to a registry, so deployments promote a known artifact instead of rebuilding.", 2, now, null, false },
                    { Guid.NewGuid(), dockerId, "Secure by default", "Non-root users, pinned base images, minimal layers, and vulnerability scanning wired into the pipeline.", 3, now, null, false },
                    { Guid.NewGuid(), dockerId, "Ready for whatever runs it", "Health checks, resource limits, graceful shutdown, and structured logging set up so the container behaves well under an orchestrator.", 4, now, null, false },

                    { Guid.NewGuid(), k8sId, "Clusters as code", "Cluster and platform configuration defined in Terraform and Helm, so environments are reproducible and upgrades are reviewed changes, not manual work.", 0, now, null, false },
                    { Guid.NewGuid(), k8sId, "GitOps delivery", "Deployments driven from Git with Argo CD or Flux — every change to what's running is a reviewed, auditable commit with an easy rollback.", 1, now, null, false },
                    { Guid.NewGuid(), k8sId, "Autoscaling and cost control", "Horizontal pod and cluster autoscaling tuned with realistic resource requests, plus right-sizing so you're not paying for idle capacity.", 2, now, null, false },
                    { Guid.NewGuid(), k8sId, "Security and isolation", "Network policies, RBAC, pod security standards, and a real secrets solution (External Secrets, Vault, or cloud KMS) rather than plain manifests.", 3, now, null, false },
                    { Guid.NewGuid(), k8sId, "Observability from the start", "Metrics, logs, and traces wired in — Prometheus, Grafana, and the OpenTelemetry collector — with alerts on the signals that matter.", 4, now, null, false }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailFaqs",
                columns: new[] { "Id", "TechnologyDetailPageId", "Question", "Answer", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), nextId, "What is Next.js used for?", "Next.js is a React framework for web applications that need server rendering or static generation, fast page loads, strong SEO, and a place to put API endpoints — marketing sites, dashboards, storefronts, and SaaS front ends.", 0, now, null, false },
                    { Guid.NewGuid(), nextId, "Is Next.js good for SEO?", "Yes. Because Next.js can send fully-rendered HTML and structured metadata for every route, search engines can crawl and index pages without executing JavaScript, which a client-only React app makes harder.", 1, now, null, false },
                    { Guid.NewGuid(), nextId, "Can you migrate our existing React site to Next.js?", "Yes. We migrate Create React App, Vite, and older Next.js (Pages Router) front ends incrementally — route by route so the site keeps working throughout, then remove the old shell once everything is ported.", 2, now, null, false },
                    { Guid.NewGuid(), nextId, "Should we self-host Next.js or use a managed platform?", "Both work. A managed platform is the fastest path and handles caching and edge delivery for you; a self-hosted Node or container deployment gives more control and can be cheaper at scale. We help you choose and set up either.", 3, now, null, false },
                    { Guid.NewGuid(), nextId, "Do you build the backend too, or just the front end?", "Both. Next.js route handlers cover lightweight APIs; for heavier systems we build a dedicated backend — for example ASP.NET Core or Node — and connect it cleanly to the Next.js front end.", 4, now, null, false },

                    { Guid.NewGuid(), pgId, "Why PostgreSQL over MySQL?", "Both are solid. PostgreSQL tends to win on strict SQL compliance, richer data types (JSONB, arrays, geospatial), advanced indexing, and complex query performance. We work with either and recommend based on your workload.", 0, now, null, false },
                    { Guid.NewGuid(), pgId, "Can you fix a slow PostgreSQL database?", "Yes. We profile the real query load, examine execution plans and locks, address index and schema issues, tune configuration, and deal with table bloat — usually with measurable improvement early on.", 1, now, null, false },
                    { Guid.NewGuid(), pgId, "Can you migrate us from another database to PostgreSQL?", "Yes. We migrate from MySQL, SQL Server, Oracle, and MongoDB — mapping the schema, moving data in a controlled cutover, and adjusting the application's data-access layer.", 2, now, null, false },
                    { Guid.NewGuid(), pgId, "Do you handle database operations, or just development?", "Both. We set up replication, backups, monitoring, and upgrade procedures, and can either hand over runbooks or stay on for ongoing operations.", 3, now, null, false },
                    { Guid.NewGuid(), pgId, "Which hosting do you support?", "Self-managed PostgreSQL on your own servers or containers, and managed services — Amazon RDS and Aurora, Google Cloud SQL, and Azure Database for PostgreSQL.", 4, now, null, false },

                    { Guid.NewGuid(), dockerId, "What does containerizing our application involve?", "Writing a Dockerfile that builds your app into an image, defining supporting services (database, cache) for local use, wiring image builds into CI, and setting up health checks and configuration so the container runs cleanly wherever it's deployed.", 0, now, null, false },
                    { Guid.NewGuid(), dockerId, "Do we need Docker if we're not using Kubernetes?", "Often yes. Docker is valuable on its own for consistent environments and simple deployments to a single host or a managed service like ECS or Cloud Run. Kubernetes is a separate decision on top of that.", 1, now, null, false },
                    { Guid.NewGuid(), dockerId, "Can you containerize a legacy application?", "Usually. We containerize older monoliths and stateful apps too — sometimes as a straight lift, sometimes alongside small changes to configuration and file handling so the app fits the container model.", 2, now, null, false },
                    { Guid.NewGuid(), dockerId, "Will Docker make our app faster?", "Docker itself adds negligible overhead. The gains are in reliability and delivery speed — matching environments, quick rollbacks, and testable build artifacts — rather than raw runtime performance.", 3, now, null, false },
                    { Guid.NewGuid(), dockerId, "Do you help with deployment after containerizing?", "Yes. We take it through to a running deployment — CI pipeline, registry, and the target platform — and can continue with orchestration or cloud infrastructure from there.", 4, now, null, false },

                    { Guid.NewGuid(), k8sId, "Do we actually need Kubernetes?", "Not always. If you run a handful of services, a managed platform like ECS, Cloud Run, or App Service is usually simpler and cheaper. Kubernetes pays off with many services, complex scaling or rollout needs, or a multi-cloud strategy. We give a straight recommendation.", 0, now, null, false },
                    { Guid.NewGuid(), k8sId, "Which managed Kubernetes do you work with?", "Amazon EKS, Azure AKS, and Google GKE, plus self-managed clusters where there's a reason for them. The Helm charts and GitOps setup carry across all of them.", 1, now, null, false },
                    { Guid.NewGuid(), k8sId, "Can you take over an existing cluster?", "Yes. We audit the current setup — security, resource usage, upgrade status, observability — fix what's fragile, document it, and either hand back runbooks or stay on for operations.", 2, now, null, false },
                    { Guid.NewGuid(), k8sId, "How do you handle deployments and rollbacks?", "GitOps: the desired state lives in Git, a controller reconciles the cluster to match, and a rollback is reverting a commit. Rollouts are progressive with health checks so a bad release is caught early.", 3, now, null, false },
                    { Guid.NewGuid(), k8sId, "Can you help control Kubernetes costs?", "Yes. Right-sizing requests and limits, autoscaling configuration, spot or preemptible node pools where appropriate, and cleanup of unused resources typically bring meaningful savings.", 4, now, null, false }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailServiceCards",
                columns: new[] { "Id", "TechnologyDetailPageId", "Title", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), nextId, "Next.js Consulting & Architecture", "We define rendering strategy, folder structure, data-fetching patterns, and deployment target so the application starts on a foundation that scales.", 0, now, null, false },
                    { Guid.NewGuid(), nextId, "Custom Next.js Application Development", "Full builds — component library, App Router pages, server actions, authentication, and CMS or API integration — delivered with tests and a release pipeline.", 1, now, null, false },
                    { Guid.NewGuid(), nextId, "React to Next.js Migration", "Incremental migration of existing React front ends to Next.js, route by route, with no big-bang cutover and measurable performance gains.", 2, now, null, false },
                    { Guid.NewGuid(), nextId, "Performance & Core Web Vitals", "Audits and fixes for slow LCP, layout shift, and interaction delay — image handling, bundle size, caching, and rendering strategy.", 3, now, null, false },
                    { Guid.NewGuid(), nextId, "Headless CMS & Commerce Integration", "Next.js front ends wired to headless CMS, commerce, and search platforms, with preview, revalidation, and structured content.", 4, now, null, false },

                    { Guid.NewGuid(), pgId, "Database Design & Modeling", "Schema design for new applications — entities, relationships, constraints, indexing strategy, and a migration workflow the team can maintain.", 0, now, null, false },
                    { Guid.NewGuid(), pgId, "Performance Tuning & Optimization", "Query analysis, index redesign, configuration tuning, and bloat cleanup for databases that have slowed down under real load.", 1, now, null, false },
                    { Guid.NewGuid(), pgId, "Migration to PostgreSQL", "Controlled migrations from MySQL, SQL Server, Oracle, or MongoDB, including data-access-layer changes and a tested cutover.", 2, now, null, false },
                    { Guid.NewGuid(), pgId, "High Availability & Backup", "Replication, automated backups, point-in-time recovery, and failover procedures set up and verified.", 3, now, null, false },
                    { Guid.NewGuid(), pgId, "Ongoing Database Support", "Monitoring, capacity planning, version upgrades, and on-call support to keep the database healthy as the application grows.", 4, now, null, false },

                    { Guid.NewGuid(), dockerId, "Application Containerization", "We package your application into production-ready Docker images with multi-stage builds, small footprints, and secure defaults.", 0, now, null, false },
                    { Guid.NewGuid(), dockerId, "Local Environment Setup", "Docker Compose environments that reproduce the full stack for development and testing, close to what runs in production.", 1, now, null, false },
                    { Guid.NewGuid(), dockerId, "Container CI/CD Integration", "Image builds, tagging, vulnerability scanning, and registry pushes wired into your pipeline so every commit yields a deployable artifact.", 2, now, null, false },
                    { Guid.NewGuid(), dockerId, "Image Optimization & Hardening", "Reducing image size and build time, pinning and updating base images, and closing common container security gaps.", 3, now, null, false },
                    { Guid.NewGuid(), dockerId, "Migration to Containers", "Moving existing applications — including legacy and stateful services — onto Docker with the configuration and process changes that requires.", 4, now, null, false },

                    { Guid.NewGuid(), k8sId, "Cluster Design & Setup", "Architecture and provisioning of production Kubernetes on EKS, AKS, or GKE — networking, node pools, RBAC, and namespaces defined as code.", 0, now, null, false },
                    { Guid.NewGuid(), k8sId, "Application Deployment & Helm", "Packaging your services as Helm charts with sane defaults, configuration, health checks, and progressive rollout.", 1, now, null, false },
                    { Guid.NewGuid(), k8sId, "GitOps & CI/CD", "Argo CD or Flux set up so deployments are Git-driven, reviewed, and auditable, with automated promotion between environments.", 2, now, null, false },
                    { Guid.NewGuid(), k8sId, "Observability & Reliability", "Prometheus, Grafana, and tracing wired in, with alerting, dashboards, and autoscaling tuned to real traffic.", 3, now, null, false },
                    { Guid.NewGuid(), k8sId, "Cluster Operations & Cost Optimization", "Upgrades, security hardening, capacity and cost management, and on-call support for running clusters.", 4, now, null, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""TechnologyDetailPages"" WHERE ""Slug"" IN ('nextjs-development', 'postgresql-development', 'docker-development', 'kubernetes-development');");
        }
    }
}
