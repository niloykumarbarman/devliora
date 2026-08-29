using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDigitalDesignIndustriesGrid : Migration
    {
        // "Digital Design" is created via /admin/services, not by a
        // migration, so on a fresh database it does not exist here. The
        // ServiceIndustryCards insert is guarded with `WHERE EXISTS
        // (... "Services" ...)` so it no-ops on an empty DB instead of
        // violating FK_ServiceIndustryCards_Services_ServiceId; the
        // UPDATE on "Services" already affects 0 rows harmlessly when the
        // service is absent.
        private const string DigitalDesignServiceId = "9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "Crafting exceptional UI/UX across industries"
            // section on the Digital Design (DaaS) service page. Card
            // ImageUrl is deliberately left blank — real images can be
            // uploaded per card via /admin/services.
            migrationBuilder.Sql($@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = 'Crafting exceptional {{UI/UX}} across industries',
                    ""IndustriesTagline"" = 'Tailored experiences, industry-specific insights, lasting impact.',
                    ""IndustriesDescription"" = 'Our design expertise spans a diverse range of industries, where we bring intuitive and engaging user experiences to life. Whether it''s finance, healthcare, retail, or telecom, we tailor our UI/UX solutions to meet the unique needs of each sector, ensuring every interaction is seamless and impactful.'
                WHERE ""Id"" = '{DigitalDesignServiceId}';
            ");

            migrationBuilder.Sql($@"
                INSERT INTO ""ServiceIndustryCards""
                    (""Id"", ""ServiceId"", ""ImageUrl"", ""Title"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                SELECT v.""Id"", v.""ServiceId"", v.""ImageUrl"", v.""Title"", v.""Description"", v.""DisplayOrder"", v.""CreatedAt"", v.""UpdatedAt"", v.""IsDeleted""
                FROM (VALUES
                    ('e6c893e7-8111-4f48-8eed-e62aa90f48a2'::uuid, '{DigitalDesignServiceId}'::uuid, '', 'UI/UX Design', 'Skilled designers ready to shape intuitive digital experiences.', 1, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('24242317-c339-407f-b231-26803bc36abc'::uuid, '{DigitalDesignServiceId}'::uuid, '', 'Product Design', 'Experts who turn ideas into clear, usable product journeys.', 2, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('be597413-62a9-414d-a36a-a3a1b93eb13c'::uuid, '{DigitalDesignServiceId}'::uuid, '', 'Brand Design', 'Creative specialists who bring your brand identity to life.', 3, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false),
                    ('ff549482-8d1b-47ff-98eb-a79633963da1'::uuid, '{DigitalDesignServiceId}'::uuid, '', 'Interaction Design', 'Design pros focused on smooth, meaningful user interactions.', 4, '2026-08-10 00:00:00+00'::timestamptz, NULL::timestamptz, false)
                ) AS v(""Id"", ""ServiceId"", ""ImageUrl"", ""Title"", ""Description"", ""DisplayOrder"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                WHERE EXISTS (SELECT 1 FROM ""Services"" WHERE ""Id"" = '{DigitalDesignServiceId}'::uuid);
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
                    "e6c893e7-8111-4f48-8eed-e62aa90f48a2",
                    "24242317-c339-407f-b231-26803bc36abc",
                    "be597413-62a9-414d-a36a-a3a1b93eb13c",
                    "ff549482-8d1b-47ff-98eb-a79633963da1"
                });

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = '',
                    ""IndustriesTagline"" = '',
                    ""IndustriesDescription"" = ''
                WHERE ""Id"" = '9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1';
            ");
        }
    }
}
