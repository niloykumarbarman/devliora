using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedITMaintenanceIndustriesGrid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "End-to-end software maintenance expertise"
            // image-card grid on the IT Maintenance & Support service
            // page — reuses the same generic industryCards section already
            // built for Digital Design and IT Consulting. Card ImageUrl is
            // deliberately left blank — the reference's photos are stock
            // images unrelated to Devliora, so real images (or different
            // stock choices) need to be uploaded per card via
            // /admin/services rather than reused or faked.
            var seedTimestamp = new DateTime(2026, 8, 12, 0, 0, 0, DateTimeKind.Utc);
            const string itMaintenanceServiceId = "496ca142-fd6a-4603-9dbc-14e149408609";

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = 'End-to-end software maintenance expertise',
                    ""IndustriesTagline"" = 'Tailored maintenance strategies, adaptive solutions, sustainable growth.',
                    ""IndustriesDescription"" = 'Choose a maintenance strategy that addresses the needs of your IT ecosystem and supports sustainable growth across digital operations. The focus is on reliability, continuity, and minimizing long-term operational risk.'
                WHERE ""Id"" = '496ca142-fd6a-4603-9dbc-14e149408609';
            ");

            migrationBuilder.InsertData(
                table: "ServiceIndustryCards",
                columns: new[] { "Id", "ServiceId", "ImageUrl", "Title", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { "8fadc863-7a66-49d2-86d6-83998b0c7534", itMaintenanceServiceId, "", "Adaptive", "We adjust applications and tools to adapt to changing environments, ensuring stability and usability.", 1, seedTimestamp, null, false },
                    { "7865e23c-933a-4302-ae34-fedb83fe5a43", itMaintenanceServiceId, "", "Perfective", "Our team enhances your solution, adding new features and resolving performance bottlenecks to extend its lifespan.", 2, seedTimestamp, null, false },
                    { "1c265b02-26d1-4577-ac63-7109fce5a337", itMaintenanceServiceId, "", "Corrective", "We identify and fix bugs or glitches, improving software functionality and user experience, with both scheduled and emergency repairs.", 3, seedTimestamp, null, false },
                    { "011e5eee-196d-4a75-9a00-65941f3f6248", itMaintenanceServiceId, "", "Preventive", "We future-proof your software by re-engineering it to be resilient, embedding relevant features, and removing obsolete ones.", 4, seedTimestamp, null, false }
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
