using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAiDevelopmentFaqAnswers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Swaps the AI Development FAQ answers for kaz.com.bd's own
            // wording and figures (8-20 week timeline, $15k-$100k price
            // range), per explicit request after being told these are
            // that company's specific business claims, not Devliora's
            // verified policy — going out under Devliora's name is a
            // deliberate choice made with that understanding. The last
            // answer's tail was cut off in the source screenshot, so
            // it's a reasonable original completion, not copied.
            var seedTimestamp = new DateTime(2026, 8, 17, 0, 0, 0, DateTimeKind.Utc);

            migrationBuilder.Sql($@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'AI projects typically take 8-20 weeks depending on data preparation, model complexity, and integration needs.', ""UpdatedAt"" = '{seedTimestamp:yyyy-MM-dd HH:mm:ss}'
                WHERE ""Id"" = '3cee8fe8-c7f2-495c-896e-d11634d30c17';
            ");
            migrationBuilder.Sql($@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'AI improves efficiency, automates repetitive tasks, enhances customer experience, and provides data-driven insights for smarter decision-making.', ""UpdatedAt"" = '{seedTimestamp:yyyy-MM-dd HH:mm:ss}'
                WHERE ""Id"" = '5478c937-b5de-4be5-ab91-4f1be06e54fa';
            ");
            migrationBuilder.Sql($@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'Yes. We integrate AI models with CRMs, ERPs, web platforms, mobile apps, and internal tools using APIs and cloud services.', ""UpdatedAt"" = '{seedTimestamp:yyyy-MM-dd HH:mm:ss}'
                WHERE ""Id"" = '7dbf0384-96bc-40c9-97ba-ab8650f82d1f';
            ");
            migrationBuilder.Sql($@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'Costs range from $15,000 to $100,000 depending on model type, data requirements, and deployment complexity.', ""UpdatedAt"" = '{seedTimestamp:yyyy-MM-dd HH:mm:ss}'
                WHERE ""Id"" = '644afb0a-8118-4982-8649-57584d411b03';
            ");
            migrationBuilder.Sql($@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'Absolutely. We handle retraining, performance tuning, data updates, and continuous monitoring to keep your AI models accurate and reliable over time.', ""UpdatedAt"" = '{seedTimestamp:yyyy-MM-dd HH:mm:ss}'
                WHERE ""Id"" = '6e752795-100e-49a6-a258-4844197ed4be';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'It depends on scope — a focused feature like a recommendation engine or a classification model can take a few weeks, while a full predictive-analytics pipeline integrated across your product takes longer. We scope this concretely during discovery rather than quoting a generic timeline upfront.'
                WHERE ""Id"" = '3cee8fe8-c7f2-495c-896e-d11634d30c17';
            ");
            migrationBuilder.Sql(@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'The honest answer: only where it solves a real problem. AI is worth investing in when it removes manual, repetitive work, surfaces patterns in data you already have, or personalizes an experience at a scale humans can''t manage — not as a feature for its own sake.'
                WHERE ""Id"" = '5478c937-b5de-4be5-ab91-4f1be06e54fa';
            ");
            migrationBuilder.Sql(@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'Yes — that''s the more common request, actually. We design AI features to plug into your existing product, data, and infrastructure rather than requiring a rebuild, and we''ll flag upfront if your current setup needs work first.'
                WHERE ""Id"" = '7dbf0384-96bc-40c9-97ba-ab8650f82d1f';
            ");
            migrationBuilder.Sql(@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'It scales with scope, same as timeline — a single well-defined model integration costs a lot less than an end-to-end AI-driven feature with ongoing retraining. We give you a real estimate after understanding what you''re trying to build, not a placeholder range.'
                WHERE ""Id"" = '644afb0a-8118-4982-8649-57584d411b03';
            ");
            migrationBuilder.Sql(@"
                UPDATE ""FaqItems"" SET ""Answer"" = 'Yes. Model performance drifts as real-world data changes, so we offer ongoing monitoring and retraining support after launch rather than treating delivery as the finish line.'
                WHERE ""Id"" = '6e752795-100e-49a6-a258-4844197ed4be';
            ");
        }
    }
}
