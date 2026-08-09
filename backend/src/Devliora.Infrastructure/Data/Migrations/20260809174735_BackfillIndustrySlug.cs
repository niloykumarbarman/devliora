using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class BackfillIndustrySlug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Industry rows created before the Slug column existed (e.g. via the
            // original DbSeeder) got the column's "" default when it was added,
            // which breaks every /industries/{slug} link. Backfill from Name
            // using the same slugify rules as the frontend's slugify.ts, and
            // de-dupe with a numeric suffix if two names collide.
            migrationBuilder.Sql(@"
                WITH slugged AS (
                    SELECT ""Id"",
                           trim(both '-' from regexp_replace(lower(replace(""Name"", '&', ' ')), '[^a-z0-9]+', '-', 'g')) AS base_slug,
                           ROW_NUMBER() OVER (
                               PARTITION BY trim(both '-' from regexp_replace(lower(replace(""Name"", '&', ' ')), '[^a-z0-9]+', '-', 'g'))
                               ORDER BY ""DisplayOrder"", ""Id""
                           ) AS rn
                    FROM ""Industries""
                    WHERE ""Slug"" = '' OR ""Slug"" IS NULL
                )
                UPDATE ""Industries"" i
                SET ""Slug"" = CASE WHEN s.rn = 1 THEN s.base_slug ELSE s.base_slug || '-' || s.rn END
                FROM slugged s
                WHERE i.""Id"" = s.""Id"";
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Data backfill — not reversible.
        }
    }
}
