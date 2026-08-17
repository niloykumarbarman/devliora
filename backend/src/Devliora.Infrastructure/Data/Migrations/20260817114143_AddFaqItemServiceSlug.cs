using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFaqItemServiceSlug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ServiceSlug",
                table: "FaqItems",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceSlug",
                table: "FaqItems");
        }
    }
}
