using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedAiDevelopmentService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // New "AI Development" service, requested to give the site a real
            // /services/ai-development detail page (added to DETAIL_PAGE_SLUGS
            // in the frontend alongside this migration). Copy here is original
            // Devliora wording, not lifted from any competitor's page — no
            // fabricated stats, generic capability descriptions only.
            // DisplayOrder 10 is a placeholder past every known existing
            // service's order; reorder from /admin/services if it should sit
            // elsewhere. IconUrl/HeroImageUrl left blank — upload via the
            // admin panel rather than reusing another service's image.
            var seedTimestamp = new DateTime(2026, 8, 17, 0, 0, 0, DateTimeKind.Utc);
            const string serviceId = "eabd2e11-55cd-4f54-bda5-5b4cccd40404";

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
                    'AI Development',
                    'ai-development',
                    'Practical AI features that turn raw data into decisions, automation, and better user experiences.',
                    'We build AI-driven capabilities that fit into your existing product and data rather than bolting on for its own sake — from predictive models to intelligent automation — so your software gets smarter without getting harder to maintain.',
                    ARRAY[
                        'Machine learning model design and integration.',
                        'Natural language processing and text analysis.',
                        'Predictive analytics and forecasting.',
                        'Intelligent process automation.',
                        'Recommendation and personalization engines.',
                        'AI feature integration into existing products.'
                    ]::text[],
                    '', '', 10, true,
                    '', '', '', ARRAY[]::text[],
                    ARRAY[]::text[], 0, 0, '',
                    '', '', '',
                    '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                );
            ");

            // "AI Development at a glance" highlights — the page's
            // benefits/value-prop section, editable from /admin/services
            // going forward.
            migrationBuilder.Sql($@"
                INSERT INTO ""ServiceHighlights"" (
                    ""Id"", ""ServiceId"", ""Label"", ""Description"", ""DisplayOrder"",
                    ""CreatedAt"", ""UpdatedAt"", ""IsDeleted""
                )
                VALUES
                (
                    '6d5e66fc-c8eb-4bca-bacb-52b9276cb39b', '{serviceId}',
                    'Data-driven insights',
                    'We turn scattered data into models that surface real patterns, so decisions are backed by evidence instead of guesswork.',
                    1, '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                ),
                (
                    'ebd47f0c-3f09-4d91-81e5-d9a2feb1bac2', '{serviceId}',
                    'Smarter automation',
                    'AI-assisted workflows take over repetitive, rules-based work so your team can spend time on what actually needs human judgment.',
                    2, '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                ),
                (
                    '1b415348-51db-43ea-8852-238d8012e757', '{serviceId}',
                    'Personalized experiences',
                    'Recommendation and personalization logic tuned to how your users actually behave, not generic defaults.',
                    3, '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM ""ServiceHighlights""
                WHERE ""ServiceId"" = 'eabd2e11-55cd-4f54-bda5-5b4cccd40404';
            ");
            migrationBuilder.Sql(@"
                DELETE FROM ""Services""
                WHERE ""Id"" = 'eabd2e11-55cd-4f54-bda5-5b4cccd40404';
            ");
        }
    }
}
