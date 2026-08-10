using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDigitalDesignIndustriesGrid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "Crafting exceptional UI/UX across industries"
            // section on the Digital Design (DaaS) service page. Card
            // ImageUrl is deliberately left blank — the reference's photos
            // are KAZ's own assets, so real images need to be uploaded per
            // card via /admin/services rather than reused or faked.
            var seedTimestamp = new DateTime(2026, 8, 10, 0, 0, 0, DateTimeKind.Utc);
            const string digitalDesignServiceId = "9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1";

            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""IndustriesHeading"" = 'Crafting exceptional {UI/UX} across industries',
                    ""IndustriesTagline"" = 'Tailored experiences, industry-specific insights, lasting impact.',
                    ""IndustriesDescription"" = 'Our design expertise spans a diverse range of industries, where we bring intuitive and engaging user experiences to life. Whether it''s finance, healthcare, retail, or telecom, we tailor our UI/UX solutions to meet the unique needs of each sector, ensuring every interaction is seamless and impactful.'
                WHERE ""Id"" = '9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1';
            ");

            migrationBuilder.InsertData(
                table: "ServiceIndustryCards",
                columns: new[] { "Id", "ServiceId", "ImageUrl", "Title", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { "e6c893e7-8111-4f48-8eed-e62aa90f48a2", digitalDesignServiceId, "", "UI/UX Design", "Skilled designers ready to shape intuitive digital experiences.", 1, seedTimestamp, null, false },
                    { "24242317-c339-407f-b231-26803bc36abc", digitalDesignServiceId, "", "Product Design", "Experts who turn ideas into clear, usable product journeys.", 2, seedTimestamp, null, false },
                    { "be597413-62a9-414d-a36a-a3a1b93eb13c", digitalDesignServiceId, "", "Brand Design", "Creative specialists who bring your brand identity to life.", 3, seedTimestamp, null, false },
                    { "ff549482-8d1b-47ff-98eb-a79633963da1", digitalDesignServiceId, "", "Interaction Design", "Design pros focused on smooth, meaningful user interactions.", 4, seedTimestamp, null, false }
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
