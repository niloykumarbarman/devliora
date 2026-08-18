using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedTechnologyFrameworks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the Frameworks field just added for every existing
            // TechnologyItem, matching the depth of kaz.com.bd/technologies'
            // per-language sub-lists (e.g. "Django, FastAPI, Flask, Celery"
            // under Python) — real, well-known, non-fabricated tools
            // genuinely associated with each entry, written directly rather
            // than left blank pending manual admin data entry. A few Name
            // values have stray leading whitespace already in the live data
            // (" .NET", " Java", " React", "  TypeScript"), so matched via
            // TRIM() rather than exact equality.
            var frameworks = new (string Name, string Frameworks)[]
            {
                ("Python", "Django, Flask, FastAPI, Celery"),
                ("Node.js", "Express, NestJS, Fastify, Socket.IO"),
                (".NET", "ASP.NET Core, Entity Framework Core, Minimal APIs, SignalR"),
                ("Java", "Spring Boot, Hibernate, Maven, JUnit"),

                ("React", "React Router, Redux Toolkit, React Query, Zustand"),
                ("Next.js", "App Router, Server Components, Middleware, ISR"),
                ("TypeScript", "Zod, tRPC, ESLint, ts-node"),
                ("JavaScript", "ES2023+, Web APIs, Vite, Jest"),

                ("AWS", "EC2, S3, Lambda, RDS, CloudFront"),
                ("Azure", "App Service, Azure Functions, Blob Storage, Azure SQL"),
                ("GCP", "Cloud Run, Cloud Storage, BigQuery, Compute Engine"),
                ("Docker", "Docker Compose, Buildx, Multi-stage builds"),
                ("Kubernetes", "Helm, Ingress, HPA, kubectl"),

                ("MySQL", "InnoDB, Replication, Percona Toolkit"),
                ("MongoDB", "Aggregation Pipeline, Mongoose, Atlas"),
                ("PostgreSQL", "PL/pgSQL, Extensions, Logical Replication"),
                ("Redis", "Pub/Sub, Streams, Redis Cluster"),

                ("GitHub Actions", "Reusable Workflows, Matrix Builds, Self-hosted Runners"),
                ("Terraform", "Modules, Remote State, Workspaces"),
                ("SonarQube", "Quality Gates, Code Smells, Coverage Reports"),
                ("Jenkins", "Pipelines, Shared Libraries, Blue Ocean"),
                ("NGINX", "Reverse Proxy, Load Balancing, Rate Limiting"),
                ("Traefik", "Auto-discovery, Let's Encrypt, Middleware"),
                ("Snyk", "Dependency Scanning, Container Scanning, IaC Scanning"),
                ("Trivy", "Image Scanning, Filesystem Scanning, SBOM"),

                ("TensorFlow", "Keras, TensorBoard, TF Serving"),
                ("Pandas", "DataFrames, GroupBy, Time Series"),
                ("PyTorch", "TorchVision, Lightning, TorchScript"),
                ("Scikit-learn", "Pipelines, GridSearchCV, Model Selection"),
                ("NumPy", "Vectorized Ops, Broadcasting, Linear Algebra"),
                ("OpenAI", "GPT API, Embeddings, Function Calling"),
            };

            foreach (var (name, value) in frameworks)
            {
                var escapedName = name.Replace("'", "''");
                var escapedValue = value.Replace("'", "''");
                migrationBuilder.Sql($@"
                    UPDATE ""TechnologyItems"" SET ""Frameworks"" = '{escapedValue}', ""UpdatedAt"" = NOW()
                    WHERE TRIM(""Name"") = '{escapedName}' AND ""Frameworks"" = '';
                ");
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE ""TechnologyItems"" SET ""Frameworks"" = '';");
        }
    }
}
