using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedPerformanceReliabilityIndustriesGrid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "Performance team, ready to test." image-card
            // grid on the Performance & Reliability Engineering service
            // page — reuses the same generic industryCards section already
            // built for Digital Design, IT Consulting, and IT Maintenance
            // & Support. Card ImageUrl is deliberately left blank — the
            // reference's photos are stock images unrelated to Devliora,
            // so real images need to be uploaded per card via
            // /admin/services rather than reused or faked. The reference
            // also bolds/highlights part of each card's description
            // (e.g. "Certified JMeter engineers" / "Get Your Load
            // Expert."), but the shared industryCards component only
            // renders card.description as plain text, so the full
            // sentence is kept as-is rather than adding one-off markup
            // support for a single page.
            var seedTimestamp = new DateTime(2026, 8, 13, 0, 0, 0, DateTimeKind.Utc);
            const string serviceId = "711a4f4a-df92-4f0b-b794-ced8eac97c42";

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = 'Performance team, ready to test.',
                    ""IndustriesTagline"" = 'Skilled in JMeter, fluent in load testing, and deployed on demand.',
                    ""IndustriesDescription"" = 'Whether it''s a one-time performance audit or an ongoing testing partnership, we assemble your ideal team, integrate seamlessly with your workflow, and hit the ground running to uncover what breaks your system under load.'
                WHERE ""Id"" = '711a4f4a-df92-4f0b-b794-ced8eac97c42';
            ");

            migrationBuilder.InsertData(
                table: "ServiceIndustryCards",
                columns: new[] { "Id", "ServiceId", "ImageUrl", "Title", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { "559cdc34-615c-4d36-a75f-10da34129bdd", serviceId, "", "Performance Testing", "Certified JMeter engineers ready to stress-test your platform. Get Your Load Expert.", 1, seedTimestamp, null, false },
                    { "c56c2919-704c-4292-8e8a-3b0664258a43", serviceId, "", "API & Backend Testing", "Specialists in API performance and server-side bottlenecks. Deploy API Testers.", 2, seedTimestamp, null, false },
                    { "8c014508-c14d-41f2-946f-325c120d4a5c", serviceId, "", "E-Commerce Load Testing", "Experienced in Magento, high-traffic platforms, and peak load scenarios. Bring in E-Com Testers.", 3, seedTimestamp, null, false },
                    { "b8f4932d-d079-44e1-b145-19f43399aefc", serviceId, "", "Infrastructure & Reporting", "AWS-ready engineers who test, analyse, and deliver actionable reports. Activate Infra Pros.", 4, seedTimestamp, null, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ServiceIndustryCards",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    "559cdc34-615c-4d36-a75f-10da34129bdd",
                    "c56c2919-704c-4292-8e8a-3b0664258a43",
                    "8c014508-c14d-41f2-946f-325c120d4a5c",
                    "b8f4932d-d079-44e1-b145-19f43399aefc"
                });

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = '',
                    ""IndustriesTagline"" = '',
                    ""IndustriesDescription"" = ''
                WHERE ""Id"" = '711a4f4a-df92-4f0b-b794-ced8eac97c42';
            ");
        }
    }
}
