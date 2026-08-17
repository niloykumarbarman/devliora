using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedAiDevelopmentFaqs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // AI Development's "Frequently asked questions" section,
            // scoped via the new FaqItem.ServiceSlug field so it doesn't
            // affect the homepage's site-wide FAQ list. Questions cover
            // the same general topics as kaz.com.bd's AI Development
            // FAQ (timeline, ROI, integration, cost, ongoing support),
            // but every answer here is original Devliora wording, not
            // copied from theirs — no fabricated pricing or timelines,
            // kept qualitative on purpose.
            var seedTimestamp = new DateTime(2026, 8, 17, 0, 0, 0, DateTimeKind.Utc);

            migrationBuilder.Sql($@"
                INSERT INTO ""FaqItems"" (
                    ""Id"", ""Question"", ""Answer"", ""DisplayOrder"", ""IsActive"", ""ServiceSlug"",
                    ""CreatedAt"", ""UpdatedAt"", ""IsDeleted""
                )
                VALUES
                (
                    '3cee8fe8-c7f2-495c-896e-d11634d30c17',
                    'How long does it take to build an AI solution?',
                    'It depends on scope — a focused feature like a recommendation engine or a classification model can take a few weeks, while a full predictive-analytics pipeline integrated across your product takes longer. We scope this concretely during discovery rather than quoting a generic timeline upfront.',
                    1, true, 'ai-development',
                    '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                ),
                (
                    '5478c937-b5de-4be5-ab91-4f1be06e54fa',
                    'Why should I invest in AI for my business?',
                    'The honest answer: only where it solves a real problem. AI is worth investing in when it removes manual, repetitive work, surfaces patterns in data you already have, or personalizes an experience at a scale humans can''t manage — not as a feature for its own sake.',
                    2, true, 'ai-development',
                    '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                ),
                (
                    '7dbf0384-96bc-40c9-97ba-ab8650f82d1f',
                    'Can you integrate AI into my existing systems?',
                    'Yes — that''s the more common request, actually. We design AI features to plug into your existing product, data, and infrastructure rather than requiring a rebuild, and we''ll flag upfront if your current setup needs work first.',
                    3, true, 'ai-development',
                    '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                ),
                (
                    '644afb0a-8118-4982-8649-57584d411b03',
                    'What is the cost range for AI development?',
                    'It scales with scope, same as timeline — a single well-defined model integration costs a lot less than an end-to-end AI-driven feature with ongoing retraining. We give you a real estimate after understanding what you''re trying to build, not a placeholder range.',
                    4, true, 'ai-development',
                    '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                ),
                (
                    '6e752795-100e-49a6-a258-4844197ed4be',
                    'Do you provide ongoing monitoring and updates for AI models?',
                    'Yes. Model performance drifts as real-world data changes, so we offer ongoing monitoring and retraining support after launch rather than treating delivery as the finish line.',
                    5, true, 'ai-development',
                    '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM ""FaqItems""
                WHERE ""Id"" IN (
                    '3cee8fe8-c7f2-495c-896e-d11634d30c17',
                    '5478c937-b5de-4be5-ab91-4f1be06e54fa',
                    '7dbf0384-96bc-40c9-97ba-ab8650f82d1f',
                    '644afb0a-8118-4982-8649-57584d411b03',
                    '6e752795-100e-49a6-a258-4844197ed4be'
                );
            ");
        }
    }
}
