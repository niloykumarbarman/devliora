using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedITMaintenanceIndustriesGrid : Migration
    {
        // "IT Maintenance & Support" is created via /admin/services, not by
        // a migration, so on a fresh database it does not exist here. The
        // ServiceIndustryCards insert is guarded with `WHERE EXISTS
        // (... "Services" ...)` so it no-ops on an empty DB instead of
        // violating FK_ServiceIndustryCards_Services_ServiceId; the
        // UPDATE on "Services" already affects 0 rows harmlessly when the
        // service is absent.
        private const string ItMaintenanceServiceId = "496ca142-fd6a-4603-9dbc-14e149408609";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "End-to-end software maintenance expertise"
            // image-card grid on the IT Maintenance & Support service page.
            // Card ImageUrl is left blank — real images can be uploaded per
            // card via /admin/services.
            migrationBuilder.Sql($@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = 'End-to-end software maintenance expertise',
                    ""IndustriesTagline"" = 'Tailored maintenance strategies, adaptive solutions, sustainable growth.',
                    ""IndustriesDescription"" = 'Choose a maintenance strategy that addresses the needs of your IT ecosystem and supports sustainable growth across digital operations. The focus is on reliability, continuity, and minimizing long-term operational risk.'
                WHERE ""Id"" = '{ItMaintenanceServiceId}';
            ");

            migrationBuilder.Sql($@"
                INSERT INTO ""ServiceIndustryCards""
                    (""Id"", ""ServiceId"", ""ImageUrl"", ""Title"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                SELECT v.""Id"", v.""ServiceId"", v.""ImageUrl"", v.""Title"", v.""Description"", v.""DisplayOrder"", v.""CreatedAt"", v.""UpdatedAt"", v.""IsDeleted""
                FROM (VALUES
                    ('8fadc863-7a66-49d2-86d6-83998b0c7534'::uuid, '{ItMaintenanceServiceId}'::uuid, '', 'Adaptive', 'We adjust applications and tools to adapt to changing environments, ensuring stability and usability.', 1, '2026-08-12 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('7865e23c-933a-4302-ae34-fedb83fe5a43'::uuid, '{ItMaintenanceServiceId}'::uuid, '', 'Perfective', 'Our team enhances your solution, adding new features and resolving performance bottlenecks to extend its lifespan.', 2, '2026-08-12 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('1c265b02-26d1-4577-ac63-7109fce5a337'::uuid, '{ItMaintenanceServiceId}'::uuid, '', 'Corrective', 'We identify and fix bugs or glitches, improving software functionality and user experience, with both scheduled and emergency repairs.', 3, '2026-08-12 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('011e5eee-196d-4a75-9a00-65941f3f6248'::uuid, '{ItMaintenanceServiceId}'::uuid, '', 'Preventive', 'We future-proof your software by re-engineering it to be resilient, embedding relevant features, and removing obsolete ones.', 4, '2026-08-12 00:00:00+00'::timestamptz, NULL::timestamptz, false)
                ) AS v(""Id"", ""ServiceId"", ""ImageUrl"", ""Title"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                WHERE EXISTS (SELECT 1 FROM ""Services"" WHERE ""Id"" = '{ItMaintenanceServiceId}'::uuid);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ServiceIndustryCards",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    "8fadc863-7a66-49d2-86d6-83998b0c7534",
                    "7865e23c-933a-4302-ae34-fedb83fe5a43",
                    "1c265b02-26d1-4577-ac63-7109fce5a337",
                    "011e5eee-196d-4a75-9a00-65941f3f6248"
                });

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = '',
                    ""IndustriesTagline"" = '',
                    ""IndustriesDescription"" = ''
                WHERE ""Id"" = '496ca142-fd6a-4603-9dbc-14e149408609';
            ");
        }
    }
}
