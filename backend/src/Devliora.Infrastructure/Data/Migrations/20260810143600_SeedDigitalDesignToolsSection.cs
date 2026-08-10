using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDigitalDesignToolsSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "Tools we work with" section on the Digital
            // Design (DaaS) service page. Tool selection is limited to
            // brands with a real simple-icons entry (see techIcons.ts) —
            // Adobe XD, InVision, Balsamiq, and Axure from the KAZ
            // reference aren't available there, so they're left out
            // rather than faked.
            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""ToolsHeading"" = 'Power up your workflow with DaaS',
                    ""ToolsDescription"" = 'Streamline your creative process with an all-in-one DaaS solution, giving you access to experienced designers and modern tools like Figma, Sketch, and Framer to turn ideas into well-crafted outcomes.',
                    ""ToolsTagline"" = 'Instant access to top design tools, expert guidance, and seamless collaboration.',
                    ""ToolNames"" = ARRAY['figma','sketch','framer','marvelapp','miro','webflow','rive','abstract']::text[]
                WHERE ""Id"" = '9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1';
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
                WHERE ""Id"" = '9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1';
            ");
        }
    }
}
