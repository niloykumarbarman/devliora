using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDigitalDesignHighlights : Migration
    {
        // The "Digital Design" service row is created through /admin/services,
        // not by an earlier migration, so on a fresh/empty database it does
        // not exist when this migration runs. The original InsertData call
        // failed the FK_ServiceHighlights_Services_ServiceId constraint in
        // that case. The insert is now guarded with
        // `WHERE EXISTS (SELECT 1 FROM "Services" ...)` so it is a clean
        // no-op on an empty DB and seeds exactly as before on a database
        // where the service already exists with this id.
        private const string DigitalDesignServiceId = "9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Placeholder "at a glance" highlights for the Digital Design
            // (DaaS) service page — process/capability claims only, no
            // fabricated years-in-business/team-size/retention numbers.
            // Replace via /admin/services before launch.
            migrationBuilder.Sql($@"
                INSERT INTO ""ServiceHighlights""
                    (""Id"", ""ServiceId"", ""Label"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                SELECT v.""Id"", v.""ServiceId"", v.""Label"", v.""Description"", v.""DisplayOrder"", v.""CreatedAt"", v.""UpdatedAt"", v.""IsDeleted""
                FROM (VALUES
                    ('bb6bea5d-5b4d-4608-ad56-6a68f1327940'::uuid, '{DigitalDesignServiceId}'::uuid, 'Ongoing Design Partnership', 'Continuous UI/UX support that scales with your roadmap, not a one-time handoff.', 1, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('0211eab6-1f85-4ff0-8f42-e65f1e6f1d84'::uuid, '{DigitalDesignServiceId}'::uuid, 'Design Systems Built In', 'Reusable component libraries so new features ship consistent by default.', 2, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('fa33b10a-3693-46e2-bb70-f417ee06186b'::uuid, '{DigitalDesignServiceId}'::uuid, 'Research-Backed Decisions', 'User research and usability testing built into the process, not skipped under deadline.', 3, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('523f8b88-5a0c-440d-ae24-b36d8b4cf1d0'::uuid, '{DigitalDesignServiceId}'::uuid, 'Fast Onboarding', 'New design requests typically picked up within days, not weeks.', 4, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('6d62e519-ba5a-4c85-a251-5c84a3f3eef0'::uuid, '{DigitalDesignServiceId}'::uuid, 'Modern Tooling', 'Figma-based workflows that hand off cleanly to engineering.', 5, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('ddf53bb6-7560-4faa-8e55-dad170b4e00f'::uuid, '{DigitalDesignServiceId}'::uuid, 'End-to-End Coverage', 'From wireframes to production-ready UI, one team the whole way.', 6, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false)
                ) AS v(""Id"", ""ServiceId"", ""Label"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                WHERE EXISTS (SELECT 1 FROM ""Services"" WHERE ""Id"" = '{DigitalDesignServiceId}'::uuid);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ServiceHighlights",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    "bb6bea5d-5b4d-4608-ad56-6a68f1327940",
                    "0211eab6-1f85-4ff0-8f42-e65f1e6f1d84",
                    "fa33b10a-3693-46e2-bb70-f417ee06186b",
                    "523f8b88-5a0c-440d-ae24-b36d8b4cf1d0",
                    "6d62e519-ba5a-4c85-a251-5c84a3f3eef0",
                    "ddf53bb6-7560-4faa-8e55-dad170b4e00f"
                });
        }
    }
}
