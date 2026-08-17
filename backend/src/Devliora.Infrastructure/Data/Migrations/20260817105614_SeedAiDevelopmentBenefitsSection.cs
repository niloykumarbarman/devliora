using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedAiDevelopmentBenefitsSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Opts the AI Development service into the new "Benefits of X"
            // card-grid design (HighlightsHeading set) instead of the older
            // "{title} at a glance" list — requested to match kaz.com.bd's
            // AI Development page layout. Adds 2 more highlight cards
            // (5 total) so the grid wraps 3-then-2, same as the reference.
            // Wording throughout is original, not copied from the
            // reference's page copy.
            const string serviceId = "eabd2e11-55cd-4f54-bda5-5b4cccd40404";
            var seedTimestamp = new DateTime(2026, 8, 17, 0, 0, 0, DateTimeKind.Utc);

            migrationBuilder.Sql($@"
                UPDATE ""Services""
                SET
                    ""HighlightsHeading"" = 'Benefits of {{AI}} Development',
                    ""HighlightsDescription"" = 'Adopting AI isn''t about novelty — it''s about faster decisions, less manual work, and products that adapt to how people actually use them. Here''s what that looks like in practice.',
                    ""UpdatedAt"" = '{seedTimestamp:yyyy-MM-dd HH:mm:ss}'
                WHERE ""Id"" = '{serviceId}';
            ");

            migrationBuilder.Sql($@"
                INSERT INTO ""ServiceHighlights"" (
                    ""Id"", ""ServiceId"", ""Label"", ""Description"", ""DisplayOrder"",
                    ""CreatedAt"", ""UpdatedAt"", ""IsDeleted""
                )
                VALUES
                (
                    'e4bcc8cd-9e42-410e-9f74-521236db2948', '{serviceId}',
                    'Predictive analytics',
                    'Forecasting models that flag likely trends and outcomes early enough to act on, not just report on them after the fact.',
                    4, '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                ),
                (
                    '7d4dc126-9e5a-4933-a669-c504ca6cb438', '{serviceId}',
                    'Cost savings',
                    'Automating the manual, repetitive parts of a process tends to pay for itself — less rework, fewer errors, less time spent babysitting routine tasks.',
                    5, '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', NULL, false
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM ""ServiceHighlights""
                WHERE ""Id"" IN (
                    'e4bcc8cd-9e42-410e-9f74-521236db2948',
                    '7d4dc126-9e5a-4933-a669-c504ca6cb438'
                );
            ");
            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""HighlightsHeading"" = '', ""HighlightsDescription"" = ''
                WHERE ""Id"" = 'eabd2e11-55cd-4f54-bda5-5b4cccd40404';
            ");
        }
    }
}
