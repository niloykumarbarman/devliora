using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddServicesPageImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ServicesBannerImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ServicesEngineeringImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ServicesSolutionsImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ServicesTechImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            // Backfill: seed the 4 new independent fields with whatever
            // image was already set, so the /services page doesn't go
            // blank in the four image slots the moment this deploys —
            // the admin can then replace each independently at their
            // own pace via /admin/settings.
            migrationBuilder.Sql(
                @"UPDATE ""SiteSettings""
                  SET ""ServicesBannerImageUrl"" = ""ServicesImageUrl"",
                      ""ServicesEngineeringImageUrl"" = ""ServicesImageUrl"",
                      ""ServicesTechImageUrl"" = ""ServicesImageUrl"",
                      ""ServicesSolutionsImageUrl"" = ""ServicesImageUrl""
                  WHERE ""ServicesImageUrl"" <> '';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServicesBannerImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "ServicesEngineeringImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "ServicesSolutionsImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "ServicesTechImageUrl",
                table: "SiteSettings");
        }
    }
}
