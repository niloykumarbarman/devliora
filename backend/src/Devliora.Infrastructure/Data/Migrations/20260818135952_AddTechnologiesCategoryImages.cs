using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnologiesCategoryImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TechnologiesAiMlImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TechnologiesBackendImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TechnologiesCloudImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TechnologiesDatabaseImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TechnologiesDevOpsImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TechnologiesFrontendImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TechnologiesAiMlImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "TechnologiesBackendImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "TechnologiesCloudImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "TechnologiesDatabaseImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "TechnologiesDevOpsImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "TechnologiesFrontendImageUrl",
                table: "SiteSettings");
        }
    }
}
