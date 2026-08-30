using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAboutContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AboutContents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    HeroHeading = table.Column<string>(type: "text", nullable: false),
                    HeroHeadingAccent = table.Column<string>(type: "text", nullable: false),
                    HeroHeadingSuffix = table.Column<string>(type: "text", nullable: false),
                    HeroSubtitle = table.Column<string>(type: "text", nullable: false),
                    MissionHeading = table.Column<string>(type: "text", nullable: false),
                    MissionHeadingAccent = table.Column<string>(type: "text", nullable: false),
                    MissionBody = table.Column<string>(type: "text", nullable: false),
                    MissionCardLabel = table.Column<string>(type: "text", nullable: false),
                    MissionCardBody = table.Column<string>(type: "text", nullable: false),
                    VisionCardLabel = table.Column<string>(type: "text", nullable: false),
                    VisionCardBody = table.Column<string>(type: "text", nullable: false),
                    FounderEyebrow = table.Column<string>(type: "text", nullable: false),
                    FounderName = table.Column<string>(type: "text", nullable: false),
                    FounderRole = table.Column<string>(type: "text", nullable: false),
                    FounderBody = table.Column<string>(type: "text", nullable: false),
                    FounderCtaText = table.Column<string>(type: "text", nullable: false),
                    FounderCtaUrl = table.Column<string>(type: "text", nullable: false),
                    PrinciplesHeading = table.Column<string>(type: "text", nullable: false),
                    PrinciplesHeadingAccent = table.Column<string>(type: "text", nullable: false),
                    CtaHeading = table.Column<string>(type: "text", nullable: false),
                    CtaHeadingAccent = table.Column<string>(type: "text", nullable: false),
                    CtaBody = table.Column<string>(type: "text", nullable: false),
                    CtaButtonText = table.Column<string>(type: "text", nullable: false),
                    CtaButtonUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutContents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AboutFounderCards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IconName = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Body = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    AboutContentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutFounderCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutFounderCards_AboutContents_AboutContentId",
                        column: x => x.AboutContentId,
                        principalTable: "AboutContents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AboutPrinciples",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IconName = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Detail = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    AboutContentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutPrinciples", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutPrinciples_AboutContents_AboutContentId",
                        column: x => x.AboutContentId,
                        principalTable: "AboutContents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AboutFounderCards_AboutContentId",
                table: "AboutFounderCards",
                column: "AboutContentId");

            migrationBuilder.CreateIndex(
                name: "IX_AboutPrinciples_AboutContentId",
                table: "AboutPrinciples",
                column: "AboutContentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutFounderCards");

            migrationBuilder.DropTable(
                name: "AboutPrinciples");

            migrationBuilder.DropTable(
                name: "AboutContents");
        }
    }
}
