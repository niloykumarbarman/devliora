using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedXamarinMobileTech : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Xamarin was cut off the first Mobile Apps screenshot (only
            // Android/iOS/React Native/Flutter were visible) — a follow-up
            // screenshot confirmed it's the reference's 5th mobile entry.
            migrationBuilder.Sql(@"
                INSERT INTO ""TechnologyItems"" (""Id"", ""Name"", ""DisplayName"", ""Category"", ""DisplayOrder"", ""IsActive"", ""Frameworks"", ""CreatedAt"", ""IsDeleted"")
                VALUES ('5b377052-fedd-4563-a584-6eaf65683c0e', 'Xamarin', 'Xamarin', 6, 4, true, 'Xamarin.Forms, .NET MAUI, C#, shared codebases, native bindings, cross-platform deployment.', '2026-08-18 00:00:00', false);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""TechnologyItems"" WHERE ""Name"" = 'Xamarin';");
        }
    }
}
