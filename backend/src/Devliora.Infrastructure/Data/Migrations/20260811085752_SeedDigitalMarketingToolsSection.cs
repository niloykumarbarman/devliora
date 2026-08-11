using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDigitalMarketingToolsSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "Tools we work with" section on the Digital
            // Marketing service page. None of these brands (Canva,
            // Salesforce, Hootsuite, HubSpot, Marketo, Buffer,
            // SproutSocial) have a hand-verified simple-icons path in
            // techIcons.ts yet, so they render as plain text badges via
            // the existing fallback UI rather than risk shipping an
            // incorrect/malformed brand icon. Matched by Slug rather
            // than a hardcoded Id since this service already existed
            // before this migration (unlike the DaaS one it mirrors).
            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""ToolsHeading"" = 'Key marketing tools that support growth',
                    ""ToolsDescription"" = 'In today''s digital landscape, having the right marketing tools supports effective execution. From social media management to SEO optimization, these platforms help strengthen online presence and streamline day-to-day marketing activities.',
                    ""ToolsTagline"" = 'The right tools, working together to grow your reach.',
                    ""ToolNames"" = ARRAY['Canva','Salesforce','Hootsuite','HubSpot','Marketo','Buffer','SproutSocial']::text[]
                WHERE ""Slug"" = 'digital-marketing';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""ToolsHeading"" = '',
                    ""ToolsDescription"" = '',
                    ""ToolsTagline"" = '',
                    ""ToolNames"" = ARRAY[]::text[]
                WHERE ""Slug"" = 'digital-marketing';
            ");
        }
    }
}
