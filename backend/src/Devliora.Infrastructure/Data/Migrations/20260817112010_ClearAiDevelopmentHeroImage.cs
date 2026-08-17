using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ClearAiDevelopmentHeroImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // AI Development's HeroImageUrl had been set (via the admin
            // panel, outside this codebase) to a photo of a robot arm and
            // a neural-network graphic that is the exact hero image from
            // kaz.com.bd's own AI Development page — a competitor's image
            // asset, not something Devliora has rights to use. Clearing it
            // per explicit request; combined with the earlier fix that
            // also suppresses the shared site-wide hero fallback for this
            // one slug, the hero now shows just the plain dark background
            // + title until a real, owned image is uploaded via
            // /admin/services. The uploaded file itself is left on disk
            // (just unreferenced) rather than deleted here.
            var seedTimestamp = new DateTime(2026, 8, 17, 0, 0, 0, DateTimeKind.Utc);

            migrationBuilder.Sql($@"
                UPDATE ""Services""
                SET ""HeroImageUrl"" = '', ""UpdatedAt"" = '{seedTimestamp:yyyy-MM-dd HH:mm:ss}'
                WHERE ""Id"" = 'eabd2e11-55cd-4f54-bda5-5b4cccd40404';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""HeroImageUrl"" = '/uploads/9e7487ae79e145008ec5cb875f003e53.webp'
                WHERE ""Id"" = 'eabd2e11-55cd-4f54-bda5-5b4cccd40404';
            ");
        }
    }
}
