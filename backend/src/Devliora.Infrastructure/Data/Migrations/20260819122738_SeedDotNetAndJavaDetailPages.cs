using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    // Seeds the two TechnologyDetailPage rows (dot-net-development,
    // java-development) that previously lived as hand-written static
    // page.tsx files, now that the frontend's /technologies/[slug] route
    // reads this content from the database instead. Content copied
    // verbatim from those files so the live pages render identically
    // after the cutover — see git history on
    // frontend/src/app/technologies/{dot-net-development,java-development}/page.tsx
    // for where each string originally came from.
    public partial class SeedDotNetAndJavaDetailPages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var dotNetId = Guid.NewGuid();
            var javaId = Guid.NewGuid();
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
                        dotNetId, "dot-net-development", ".NET",
                        "Secure, high-performing .NET applications built for reliability, scalability, and long-term maintainability.",
                        0, ".NET Development",
                        "Build Powerful Solutions with", ".NET",
                        "From enterprise-grade platforms to fast-moving internal tools, .NET gives us the reliability and performance modern businesses need. With deep experience across the .NET ecosystem, we deliver secure, high-performing applications built to your exact specification, with seamless integration and architecture that holds up as requirements change.",
                        "", "",
                        "With experience across a wide range of sectors, we help clients innovate, scale, and succeed with .NET, from fast-growing startups to established enterprises.",
                        ".NET Development Services", ".NET Core",
                        "At Devliora, we deliver end-to-end .NET solutions built for performance, security, and long-term maintainability. Here's a snapshot of what our .NET expertise covers.",
                        now, null, false
                    },
                    {
                        javaId, "java-development", "Java",
                        "Reliable, scalable Java applications built on a mature ecosystem, designed for long-term stability and maintainability.",
                        1, "Java Development",
                        "Enterprise-grade application development with", "Java",
                        "Java is used to build reliable, scalable applications across a range of industries. By working with its mature ecosystem and proven capabilities, solutions are designed for long-term stability and maintainability. Explore how Java can support durable, enterprise-ready systems.",
                        "Battle-tested at enterprise scale",
                        "Java has powered mission-critical backend systems for decades — across banking, e-commerce, and large-scale platforms — thanks to its proven performance, mature tooling, and long-term platform stability. It's a dependable foundation for software that can't afford downtime.",
                        "With experience across a wide range of sectors, we help clients innovate, scale, and succeed with Java, from fast-growing startups to established enterprises.",
                        "Java Development Services", "Java",
                        "At Devliora, we build reliable, scalable Java solutions designed to support complex business needs. Here's a snapshot of how our Java expertise helps teams build and grow with confidence.",
                        now, null, false
                    }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailFeatures",
                columns: new[] { "Id", "TechnologyDetailPageId", "Title", "Body", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), dotNetId, "Cross-platform compatibility", "With .NET Core, we build applications that run seamlessly on Windows, macOS, and Linux, giving your users broader accessibility without extra engineering overhead.", 0, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Accelerated development", ".NET's extensive libraries and tooling speed up the development process, letting us deliver production-ready solutions quickly without cutting corners on quality.", 1, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Robust security measures", ".NET ships with built-in security features that protect your applications from common threats while keeping user and business data safe.", 2, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Seamless scalability", "Our .NET solutions are architected to scale effortlessly, handling growing traffic and increasing user demand without a rewrite.", 3, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Comprehensive toolset", "We draw on the full breadth of the .NET ecosystem, from ASP.NET Core to Entity Framework, to extend functionality and keep development moving smoothly from first sprint to launch.", 4, now, null, false },

                    { Guid.NewGuid(), javaId, "Cross-device functionality", "Java's “write once, run anywhere” capability allows us to create applications that operate on any device with a Java Virtual Machine (JVM), ensuring versatility.", 0, now, null, false },
                    { Guid.NewGuid(), javaId, "Strong security framework", "Java provides robust security features, including a security manager and bytecode verifier, safeguarding applications against potential threats.", 1, now, null, false },
                    { Guid.NewGuid(), javaId, "Comprehensive toolset", "Our Java solutions can effortlessly expand as your business grows, supporting high traffic and increasing user demands without compromising performance.", 2, now, null, false },
                    { Guid.NewGuid(), javaId, "Vibrant community support", "With a large, active community, Java offers a wealth of resources and documentation, ensuring ongoing support and fostering innovation.", 3, now, null, false },
                    { Guid.NewGuid(), javaId, "Rich development ecosystem", "Java's extensive libraries and frameworks enable us to build feature-rich applications tailored to your specific business needs.", 4, now, null, false }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailFaqs",
                columns: new[] { "Id", "TechnologyDetailPageId", "Question", "Answer", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), dotNetId, "How long does it take to build a .NET application?", "It depends on scope. A focused internal tool can take a few weeks; a full enterprise platform with multiple integrations can take several months. We scope every project individually and give you a realistic timeline before work begins, not a generic estimate.", 0, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Why should I choose .NET for my enterprise software project?", ".NET gives you a mature, well-supported platform with strong performance, built-in security, and first-class tooling for large codebases. It runs cross-platform via .NET Core, integrates cleanly with the rest of the Microsoft ecosystem, and has the long-term backing to support software you'll be running for years.", 1, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Can you integrate a .NET application with my existing systems (ERP, CRM, databases)?", "Yes. ASP.NET Core is built for integration — we regularly connect .NET applications to existing ERPs, CRMs, and databases through REST APIs, message queues, or direct data access, without disrupting systems that are already running in production.", 2, now, null, false },
                    { Guid.NewGuid(), dotNetId, "What is the cost range for developing a .NET solution?", "Cost depends on scope, complexity, and timeline — a small internal tool costs far less than a multi-service enterprise platform. We provide a clear, itemized estimate once we understand your requirements, with no hidden fees.", 3, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Do you provide ongoing support and maintenance for .NET applications?", "Yes — through our IT Maintenance & Support service we handle monitoring, security patches, performance tuning, and feature updates after launch, so your application stays reliable long after the initial release.", 4, now, null, false },

                    { Guid.NewGuid(), javaId, "How long does it take to develop a Java application?", "It depends on scope. A focused internal tool can take a few weeks; a full enterprise platform with multiple integrations can take several months. We scope every project individually and give you a realistic timeline before work begins, not a generic estimate.", 0, now, null, false },
                    { Guid.NewGuid(), javaId, "Why should I choose Java for my software project?", "Java gives you a mature, battle-tested platform with strong performance, a large talent pool, and decades of enterprise adoption behind it. Its “write once, run anywhere” model, robust security tooling, and vast library ecosystem make it a dependable choice for software you'll be running for years.", 1, now, null, false },
                    { Guid.NewGuid(), javaId, "Can you integrate a Java application with my existing systems?", "Yes. Java's ecosystem is built for integration — we regularly connect Java applications to existing ERPs, CRMs, and databases through REST APIs, message queues, or direct data access, without disrupting systems that are already running in production.", 2, now, null, false },
                    { Guid.NewGuid(), javaId, "What is the cost range for developing a Java application?", "Cost depends on scope, complexity, and timeline — a small internal tool costs far less than a multi-service enterprise platform. We provide a clear, itemized estimate once we understand your requirements, with no hidden fees.", 3, now, null, false },
                    { Guid.NewGuid(), javaId, "Do you offer ongoing support and maintenance for Java apps?", "Absolutely. We provide continuous monitoring, code optimization, updates, bug fixes, and feature enhancements to keep your Java application running smoothly.", 4, now, null, false }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailServiceCards",
                columns: new[] { "Id", "TechnologyDetailPageId", "Title", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), dotNetId, ".NET Consulting", "We help define architecture, technology choices, and development approach, ensuring your .NET solution aligns with business goals, scalability needs, and long-term roadmap.", 0, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Custom .NET Development", "Our team builds tailored web, desktop, and backend applications using modern .NET frameworks, focused on reliability, performance, and clean code practices.", 1, now, null, false },
                    { Guid.NewGuid(), dotNetId, "UI/UX for .NET Applications", "We design intuitive interfaces that integrate seamlessly with .NET applications, supporting usability, accessibility, and consistent user experiences.", 2, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Modernization & Migration", "We upgrade legacy .NET systems with improved performance, updated architecture, and cloud readiness, including refactoring and framework upgrades.", 3, now, null, false },
                    { Guid.NewGuid(), dotNetId, "Support & Maintenance", "Our ongoing support ensures your .NET applications remain stable, secure, and up to date as your business and technical requirements evolve.", 4, now, null, false },

                    { Guid.NewGuid(), javaId, "Java Consulting", "We help define architecture, technology choices, and development approach, ensuring your Java solution aligns with business goals, scalability needs, and long-term roadmap.", 0, now, null, false },
                    { Guid.NewGuid(), javaId, "Custom Java Development", "Our team builds tailored web, desktop, and backend applications using modern Java frameworks like Spring, focused on reliability, performance, and clean code practices.", 1, now, null, false },
                    { Guid.NewGuid(), javaId, "UI/UX for Java Applications", "We design intuitive interfaces that integrate seamlessly with Java applications, supporting usability, accessibility, and consistent user experiences.", 2, now, null, false },
                    { Guid.NewGuid(), javaId, "Modernization & Migration", "We upgrade legacy Java systems with improved performance, updated architecture, and cloud readiness, including refactoring and framework upgrades.", 3, now, null, false },
                    { Guid.NewGuid(), javaId, "Support & Maintenance", "Our ongoing support ensures your Java applications remain stable, secure, and up to date as your business and technical requirements evolve.", 4, now, null, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""TechnologyDetailPages"" WHERE ""Slug"" IN ('dot-net-development', 'java-development');");
        }
    }
}
