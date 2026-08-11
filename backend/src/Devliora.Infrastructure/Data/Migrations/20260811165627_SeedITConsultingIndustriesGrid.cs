using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedITConsultingIndustriesGrid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the industries image-card grid on the IT Consulting
            // service page. Card ImageUrl is deliberately left blank — the
            // reference's photos are KAZ's own assets, same reasoning as
            // SeedDigitalDesignIndustriesGrid; real images can be uploaded
            // per card via /admin/services.
            var seedTimestamp = new DateTime(2026, 8, 11, 0, 0, 0, DateTimeKind.Utc);
            const string itConsultingServiceId = "2a7fa087-d037-4996-8cfe-c5090fa9fe20";

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = 'Transform your technology with focused IT consulting',
                    ""IndustriesTagline"" = 'Cloud, Security, Transformation, Infrastructure.',
                    ""IndustriesDescription"" = 'Our IT consulting services help streamline operations, strengthen security, and align technology with business objectives. The focus is on building scalable, resilient systems that are prepared for change. Through clear guidance and practical execution, we support meaningful and sustainable digital transformation.'
                WHERE ""Id"" = '2a7fa087-d037-4996-8cfe-c5090fa9fe20';
            ");

            migrationBuilder.InsertData(
                table: "ServiceIndustryCards",
                columns: new[] { "Id", "ServiceId", "ImageUrl", "Title", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { "bb4ef045-ed7f-4d55-9543-3c9b73bf04dc", itConsultingServiceId, "", "Cloud", "We help you move to the cloud smoothly, ensuring performance and data security.", 1, seedTimestamp, null, false },
                    { "79212630-865a-4a36-b4d0-e704803df579", itConsultingServiceId, "", "Security", "Protect your systems with custom cybersecurity solutions against modern threats.", 2, seedTimestamp, null, false },
                    { "a6d6de1c-5022-4379-82f6-1bc828bf9ae0", itConsultingServiceId, "", "Transformation", "Streamline your digital transformation, aligning tech with your goals.", 3, seedTimestamp, null, false },
                    { "5d09b85e-bc38-4561-bb2b-8e5021db87d0", itConsultingServiceId, "", "Infrastructure", "Optimize your IT setup for better performance and scalability.", 4, seedTimestamp, null, false }
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
