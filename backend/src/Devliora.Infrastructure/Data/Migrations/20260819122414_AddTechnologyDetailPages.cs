using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnologyDetailPages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TechnologyDetailPages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    TechnologyName = table.Column<string>(type: "text", nullable: false),
                    MetaDescription = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    HeroTitle = table.Column<string>(type: "text", nullable: false),
                    OverviewHeading = table.Column<string>(type: "text", nullable: false),
                    OverviewHeadingAccent = table.Column<string>(type: "text", nullable: false),
                    OverviewParagraph = table.Column<string>(type: "text", nullable: false),
                    HighlightHeadline = table.Column<string>(type: "text", nullable: false),
                    HighlightParagraph = table.Column<string>(type: "text", nullable: false),
                    IndustriesParagraph = table.Column<string>(type: "text", nullable: false),
                    ServicesHeading = table.Column<string>(type: "text", nullable: false),
                    ServicesCardLabel = table.Column<string>(type: "text", nullable: false),
                    ServicesParagraph = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyDetailPages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyDetailFaqs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnologyDetailPageId = table.Column<Guid>(type: "uuid", nullable: false),
                    Question = table.Column<string>(type: "text", nullable: false),
                    Answer = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyDetailFaqs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyDetailFaqs_TechnologyDetailPages_TechnologyDetail~",
                        column: x => x.TechnologyDetailPageId,
                        principalTable: "TechnologyDetailPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyDetailFeatures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnologyDetailPageId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Body = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyDetailFeatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyDetailFeatures_TechnologyDetailPages_TechnologyDe~",
                        column: x => x.TechnologyDetailPageId,
                        principalTable: "TechnologyDetailPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnologyDetailServiceCards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnologyDetailPageId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologyDetailServiceCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TechnologyDetailServiceCards_TechnologyDetailPages_Technolo~",
                        column: x => x.TechnologyDetailPageId,
                        principalTable: "TechnologyDetailPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyDetailFaqs_TechnologyDetailPageId",
                table: "TechnologyDetailFaqs",
                column: "TechnologyDetailPageId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyDetailFeatures_TechnologyDetailPageId",
                table: "TechnologyDetailFeatures",
                column: "TechnologyDetailPageId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnologyDetailServiceCards_TechnologyDetailPageId",
                table: "TechnologyDetailServiceCards",
                column: "TechnologyDetailPageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TechnologyDetailFaqs");

            migrationBuilder.DropTable(
                name: "TechnologyDetailFeatures");

            migrationBuilder.DropTable(
                name: "TechnologyDetailServiceCards");

            migrationBuilder.DropTable(
                name: "TechnologyDetailPages");
        }
    }
}
