using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedPerformanceReliabilityEngineeringService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // "Performance & Reliability Engineering" has been listed in
            // STATIC_SERVICE_LINKS (frontend nav) with displayOrder 4 all
            // along, but the row itself was never created — confirmed by
            // displayOrder 4 being the only gap in the sequence (3, [4
            // missing], 5, 6, 7...). This creates the real Service record
            // so the new /services/performance-reliability-engineering
            // detail page can render. Copy is generic capability
            // description (same style as the other services' Includes),
            // no fabricated numbers. IconUrl/HeroImageUrl left blank —
            // upload via /admin/services rather than reusing another
            // service's image.
            var seedTimestamp = new DateTime(2026, 8, 13, 0, 0, 0, DateTimeKind.Utc);
            const string serviceId = "711a4f4a-df92-4f0b-b794-ced8eac97c42";

            migrationBuilder.Sql($@"
                INSERT INTO ""Services"" (
                    ""Id"", ""Title"", ""Slug"", ""ShortDescription"", ""FullDescription"",
                    ""Includes"", ""IconUrl"", ""HeroImageUrl"", ""DisplayOrder"", ""IsActive"",
                    ""ToolsHeading"", ""ToolsDescription"", ""ToolsTagline"", ""ToolNames"",
                    ""ProcessSteps"", ""ProcessGroupStart"", ""ProcessGroupCount"", ""ProcessGroupLabel"",
                    ""IndustriesHeading"", ""IndustriesTagline"", ""IndustriesDescription"",
                    ""CreatedAt"", ""UpdatedAt"", ""IsDeleted""
                )
                VALUES (
                    '{serviceId}',
                    'Performance & Reliability Engineering',
                    'performance-reliability-engineering',
                    'Ensuring your software performs reliably under real-world load, from first user to peak traffic.',
                    'Speed and stability aren''t optional — they''re what keeps users engaged and systems trustworthy. We combine load testing, performance profiling, and reliability engineering practices to help your software handle real-world traffic and stay resilient as it scales.',
                    ARRAY[
                        'Load and stress testing.',
                        'Performance profiling and bottleneck analysis.',
                        'Scalability and capacity planning.',
                        'Reliability engineering and fault tolerance.',
                        'Infrastructure and application-layer diagnostics.',
                        'Continuous performance monitoring.'
                    ]::text[],
                    '', '', 4, true,
                    '', '', '', ARRAY[]::text[],
                    ARRAY[]::text[], 0, 0, '',
                    '', '', '',
                    '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM ""Services""
                WHERE ""Id"" = '711a4f4a-df92-4f0b-b794-ced8eac97c42';
            ");
        }
    }
}
