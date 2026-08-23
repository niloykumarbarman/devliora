using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnologyDetailPagePageTypeAndHeadingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OverviewHeadingSuffix",
                table: "TechnologyDetailPages",
                type: "text",
                nullable: false,
                defaultValue: "");

            // Defaults to "technology" (not "") so the 12 existing rows —
            // seeded before this column existed — are correctly backfilled
            // as technology pages rather than landing in neither bucket.
            migrationBuilder.AddColumn<string>(
                name: "PageType",
                table: "TechnologyDetailPages",
                type: "text",
                nullable: false,
                defaultValue: "technology");

            migrationBuilder.AddColumn<bool>(
                name: "ShowTechnologiesShowcase",
                table: "TechnologyDetailPages",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OverviewHeadingSuffix",
                table: "TechnologyDetailPages");

            migrationBuilder.DropColumn(
                name: "PageType",
                table: "TechnologyDetailPages");

            migrationBuilder.DropColumn(
                name: "ShowTechnologiesShowcase",
                table: "TechnologyDetailPages");
        }
    }
}
