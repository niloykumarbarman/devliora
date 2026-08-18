using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTechnologiesMobileImageAndSeedMobileTech : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TechnologiesMobileImageUrl",
                table: "SiteSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            // New "Mobile Apps" TechnologyCategory (added to the enum, no
            // schema change needed since it's stored as an int) needs real
            // entries to render — matching kaz.com.bd/technologies'
            // "Modern mobile experiences" section: Android, iOS, React
            // Native, Flutter, each with its own real, well-known framework
            // sub-list (confirmed verbatim from the reference screenshot —
            // generic, non-attributable tech facts, and Devliora already
            // claims iOS/Android/Flutter capability elsewhere on the site,
            // e.g. ServicesHero's tech list).
            var seedTimestamp = new DateTime(2026, 8, 18, 0, 0, 0, DateTimeKind.Utc);
            var mobileTech = new (string Id, string Name, string Frameworks, int DisplayOrder)[]
            {
                ("bb5a2e34-f46c-4ed6-82f3-8b16ad702a7b", "Android", "Kotlin, Java, Android SDK, Jetpack Components, Material Design, Firebase, REST APIs.", 0),
                ("afe952dd-7d41-430d-bf92-484294a319ef", "iOS", "Swift, Objective-C, iOS SDK, UIKit, SwiftUI, Core Data, Apple Human Interface Guidelines, REST APIs.", 1),
                ("9274b31b-f8fc-4d50-8b11-220ced0166cb", "React Native", "React Native, JavaScript, TypeScript, Expo, Native Modules, REST APIs, third-party integrations.", 2),
                ("6ae918ce-44cf-44a4-a740-1288d6e166b5", "Flutter", "Dart, Flutter SDK, Material & Cupertino widgets, Firebase integration, REST APIs.", 3),
            };

            foreach (var (id, name, frameworks, displayOrder) in mobileTech)
            {
                var escapedName = name.Replace("'", "''");
                var escapedFrameworks = frameworks.Replace("'", "''");
                migrationBuilder.Sql($@"
                    INSERT INTO ""TechnologyItems"" (""Id"", ""Name"", ""DisplayName"", ""Category"", ""DisplayOrder"", ""IsActive"", ""Frameworks"", ""CreatedAt"", ""IsDeleted"")
                    VALUES ('{id}', '{escapedName}', '{escapedName}', 6, {displayOrder}, true, '{escapedFrameworks}', '{seedTimestamp:yyyy-MM-dd HH:mm:ss}', false);
                ");
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""TechnologyItems"" WHERE ""Category"" = 6;");

            migrationBuilder.DropColumn(
                name: "TechnologiesMobileImageUrl",
                table: "SiteSettings");
        }
    }
}
