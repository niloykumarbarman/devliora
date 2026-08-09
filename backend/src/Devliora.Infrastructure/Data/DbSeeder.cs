using Devliora.Domain.Entities;
using Devliora.Domain.Enums;

namespace Devliora.Infrastructure.Data;

/// <summary>
/// Idempotent startup seeder. Safe to run on every application start:
/// it only inserts data when the relevant table is empty, so it will
/// never duplicate rows and will self-heal if data is ever lost
/// (e.g. accidental volume wipe) without requiring a manual script.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        await SeedTechnologiesAsync(context, cancellationToken);
        await SeedIndustriesAsync(context, cancellationToken);
    }

    private static async Task SeedTechnologiesAsync(AppDbContext context, CancellationToken cancellationToken)
    {
        if (context.TechnologyItems.Any())
        {
            return;
        }

        var technologies = new List<TechnologyItem>
        {
            Tech("aspnetcore", "ASP.NET Core", TechnologyCategory.BackendApis, 1),
            Tech("nodejs", "Node.js", TechnologyCategory.BackendApis, 2),
            Tech("csharp", "C#", TechnologyCategory.BackendApis, 3),
            Tech("mediatr", "MediatR", TechnologyCategory.BackendApis, 4),
            Tech("fluentvalidation", "FluentValidation", TechnologyCategory.BackendApis, 5),
            Tech("graphql", "GraphQL", TechnologyCategory.BackendApis, 6),

            Tech("nextjs", "Next.js", TechnologyCategory.FrontendUi, 1),
            Tech("react", "React", TechnologyCategory.FrontendUi, 2),
            Tech("typescript", "TypeScript", TechnologyCategory.FrontendUi, 3),
            Tech("tailwindcss", "Tailwind CSS", TechnologyCategory.FrontendUi, 4),
            Tech("framermotion", "Framer Motion", TechnologyCategory.FrontendUi, 5),
            Tech("vuejs", "Vue.js", TechnologyCategory.FrontendUi, 6),

            Tech("docker", "Docker", TechnologyCategory.CloudInfrastructure, 1),
            Tech("kubernetes", "Kubernetes", TechnologyCategory.CloudInfrastructure, 2),
            Tech("terraform", "Terraform", TechnologyCategory.CloudInfrastructure, 3),
            Tech("cloudflare", "Cloudflare", TechnologyCategory.CloudInfrastructure, 4),
            Tech("aws", "AWS", TechnologyCategory.CloudInfrastructure, 5),
            Tech("nginx", "NGINX", TechnologyCategory.CloudInfrastructure, 6),
            Tech("letsencrypt", "Let's Encrypt", TechnologyCategory.CloudInfrastructure, 7),

            Tech("postgresql", "PostgreSQL", TechnologyCategory.DatabasesCaching, 1),
            Tech("redis", "Redis", TechnologyCategory.DatabasesCaching, 2),
            Tech("mongodb", "MongoDB", TechnologyCategory.DatabasesCaching, 3),
            Tech("elasticsearch", "Elasticsearch", TechnologyCategory.DatabasesCaching, 4),
            Tech("kafka", "Apache Kafka", TechnologyCategory.DatabasesCaching, 5),

            Tech("githubactions", "GitHub Actions", TechnologyCategory.DevOpsCicd, 1),
            Tech("github", "GitHub", TechnologyCategory.DevOpsCicd, 2),
            Tech("golang", "Go", TechnologyCategory.DevOpsCicd, 3),
            Tech("rust", "Rust", TechnologyCategory.DevOpsCicd, 4),

            Tech("python", "Python", TechnologyCategory.AiMlData, 1),
            Tech("tensorflow", "TensorFlow", TechnologyCategory.AiMlData, 2),
            Tech("pytorch", "PyTorch", TechnologyCategory.AiMlData, 3),
            Tech("langchain", "LangChain", TechnologyCategory.AiMlData, 4),
            Tech("ollama", "Ollama", TechnologyCategory.AiMlData, 5),
        };

        context.TechnologyItems.AddRange(technologies);
        await context.SaveChangesAsync(cancellationToken);
    }

    // Same six industries already live on the /industries page (previously a
    // hardcoded frontend array) — seeded here as the starting content so the
    // new admin-managed Industry table isn't empty after migrating.
    private static async Task SeedIndustriesAsync(AppDbContext context, CancellationToken cancellationToken)
    {
        if (context.Industries.Any())
        {
            return;
        }

        // Descriptions and stats are illustrative starting content — replace
        // with real figures and sourcing from the admin panel before launch.
        var industries = new List<Industry>
        {
            new()
            {
                Name = "FinTech",
                Slug = "fintech",
                Description = "Payments, lending, and wealth platforms where uptime, auditability, and regulatory compliance aren't optional.",
                DisplayOrder = 1,
                IsActive = true,
                Stats = new List<IndustryStat>
                {
                    new() { Value = "PCI-DSS", Label = "compliance baseline we build to", DisplayOrder = 1 },
                    new() { Value = "99.95%", Label = "uptime target for payment paths", DisplayOrder = 2 },
                    new() { Value = "<200ms", Label = "p95 latency for transaction APIs", DisplayOrder = 3 },
                },
            },
            new()
            {
                Name = "Healthcare",
                Slug = "healthcare",
                Description = "Patient-facing and clinical systems built around HIPAA-grade data handling and interoperability.",
                DisplayOrder = 2,
                IsActive = true,
                Stats = new List<IndustryStat>
                {
                    new() { Value = "HIPAA", Label = "data-handling standard we build to", DisplayOrder = 1 },
                    new() { Value = "HL7/FHIR", Label = "interoperability formats supported", DisplayOrder = 2 },
                    new() { Value = "24/7", Label = "monitoring on clinical-facing systems", DisplayOrder = 3 },
                },
            },
            new()
            {
                Name = "E-commerce & Retail",
                Slug = "e-commerce-retail",
                Description = "Storefronts, checkout, and inventory systems engineered to hold up under peak-season traffic.",
                DisplayOrder = 3,
                IsActive = true,
                Stats = new List<IndustryStat>
                {
                    new() { Value = "10x", Label = "peak-traffic load we design for", DisplayOrder = 1 },
                    new() { Value = "<2s", Label = "target page load at checkout", DisplayOrder = 2 },
                    new() { Value = "PCI-DSS", Label = "payment compliance baseline", DisplayOrder = 3 },
                },
            },
            new()
            {
                Name = "Logistics & Supply Chain",
                Slug = "logistics-supply-chain",
                Description = "Fleet, warehouse, and tracking systems that stay accurate when the data source is a moving truck.",
                DisplayOrder = 4,
                IsActive = true,
                Stats = new List<IndustryStat>
                {
                    new() { Value = "Real-time", Label = "GPS/telemetry ingestion", DisplayOrder = 1 },
                    new() { Value = "99.9%", Label = "uptime target for tracking APIs", DisplayOrder = 2 },
                    new() { Value = "Multi-carrier", Label = "integrations we've shipped", DisplayOrder = 3 },
                },
            },
            new()
            {
                Name = "SaaS & B2B Platforms",
                Slug = "saas-b2b-platforms",
                Description = "Multi-tenant products built for scale from day one — auth, billing, and admin tooling included.",
                DisplayOrder = 5,
                IsActive = true,
                Stats = new List<IndustryStat>
                {
                    new() { Value = "Multi-tenant", Label = "architecture by default", DisplayOrder = 1 },
                    new() { Value = "SOC 2-ready", Label = "controls we design around", DisplayOrder = 2 },
                    new() { Value = "SSO/SAML", Label = "enterprise auth supported", DisplayOrder = 3 },
                },
            },
            new()
            {
                Name = "EdTech",
                Slug = "edtech",
                Description = "Learning platforms that hold up under classroom-scale concurrency and student-data privacy rules.",
                DisplayOrder = 6,
                IsActive = true,
                Stats = new List<IndustryStat>
                {
                    new() { Value = "FERPA", Label = "student-data standard we build to", DisplayOrder = 1 },
                    new() { Value = "WCAG 2.1", Label = "accessibility level targeted", DisplayOrder = 2 },
                    new() { Value = "Concurrent", Label = "classroom-scale load testing", DisplayOrder = 3 },
                },
            },
        };

        context.Industries.AddRange(industries);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static TechnologyItem Tech(string name, string displayName, TechnologyCategory category, int displayOrder)
        => new()
        {
            Name = name,
            DisplayName = displayName,
            Category = category,
            DisplayOrder = displayOrder,
            IsActive = true
        };
}
