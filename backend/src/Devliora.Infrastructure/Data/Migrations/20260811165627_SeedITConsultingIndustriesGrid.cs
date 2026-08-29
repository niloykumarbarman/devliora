using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedITConsultingIndustriesGrid : Migration
    {
        // "IT Consulting" is created via /admin/services, not by a
        // migration, so on a fresh database it does not exist here. The
        // ServiceIndustryCards insert is guarded with `WHERE EXISTS
        // (... "Services" ...)` so it no-ops on an empty DB instead of
        // violating FK_ServiceIndustryCards_Services_ServiceId; the
        // UPDATE on "Services" already affects 0 rows harmlessly when the
        // service is absent.
        private const string ItConsultingServiceId = "2a7fa087-d037-4996-8cfe-c5090fa9fe20";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the industries image-card grid on the IT Consulting
            // service page. Card ImageUrl is left blank — real images can be
            // uploaded per card via /admin/services.
            migrationBuilder.Sql($@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = 'Transform your technology with focused IT consulting',
                    ""IndustriesTagline"" = 'Cloud, Security, Transformation, Infrastructure.',
                    ""IndustriesDescription"" = 'Our IT consulting services help streamline operations, strengthen security, and align technology with business objectives. The focus is on building scalable, resilient systems that are prepared for change. Through clear guidance and practical execution, we support meaningful and sustainable digital transformation.'
                WHERE ""Id"" = '{ItConsultingServiceId}';
            ");

            migrationBuilder.Sql($@"
                INSERT INTO ""ServiceIndustryCards""
                    (""Id"", ""ServiceId"", ""ImageUrl"", ""Title"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                SELECT v.""Id"", v.""ServiceId"", v.""ImageUrl"", v.""Title"", v.""Description"", v.""DisplayOrder"", v.""CreatedAt"", v.""UpdatedAt"", v.""IsDeleted""
                FROM (VALUES
                    ('bb4ef045-ed7f-4d55-9543-3c9b73bf04dc'::uuid, '{ItConsultingServiceId}'::uuid, '', 'Cloud', 'We help you move to the cloud smoothly, ensuring performance and data security.', 1, '2026-08-11 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('79212630-865a-4a36-b4d0-e704803df579'::uuid, '{ItConsultingServiceId}'::uuid, '', 'Security', 'Protect your systems with custom cybersecurity solutions against modern threats.', 2, '2026-08-11 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('a6d6de1c-5022-4379-82f6-1bc828bf9ae0'::uuid, '{ItConsultingServiceId}'::uuid, '', 'Transformation', 'Streamline your digital transformation, aligning tech with your goals.', 3, '2026-08-11 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('5d09b85e-bc38-4561-bb2b-8e5021db87d0'::uuid, '{ItConsultingServiceId}'::uuid, '', 'Infrastructure', 'Optimize your IT setup for better performance and scalability.', 4, '2026-08-11 00:00:00+00'::timestamptz, NULL::timestamptz, false)
                ) AS v(""Id"", ""ServiceId"", ""ImageUrl"", ""Title"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                WHERE EXISTS (SELECT 1 FROM ""Services"" WHERE ""Id"" = '{ItConsultingServiceId}'::uuid);
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
                    "bb4ef045-ed7f-4d55-9543-3c9b73bf04dc",
                    "79212630-865a-4a36-b4d0-e704803df579",
                    "a6d6de1c-5022-4379-82f6-1bc828bf9ae0",
                    "5d09b85e-bc38-4561-bb2b-8e5021db87d0"
                });

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = '',
                    ""IndustriesTagline"" = '',
                    ""IndustriesDescription"" = ''
                WHERE ""Id"" = '2a7fa087-d037-4996-8cfe-c5090fa9fe20';
            ");
        }
    }
}
