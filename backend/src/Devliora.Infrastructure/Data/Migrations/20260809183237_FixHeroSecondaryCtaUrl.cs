using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixHeroSecondaryCtaUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // The HeroContent singleton row was originally seeded with
            // SecondaryCtaUrl = "#portfolio", a same-page anchor that never
            // matched any element id on the homepage (the actual work
            // showcase section is id="work"), so the "View Our Work" button
            // did nothing. Point it at the real My Work page instead. Only
            // touches rows still holding that stale default — anyone who
            // has since customized it via the admin panel is left alone.
            migrationBuilder.Sql(@"
                UPDATE ""HeroContents""
                SET ""SecondaryCtaUrl"" = '/portfolio'
                WHERE ""SecondaryCtaUrl"" = '#portfolio';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Data fix — not reversible.
        }
    }
}
