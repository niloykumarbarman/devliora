using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDigitalDesignProcessSection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Populates the "Process" timeline on the Digital Design (DaaS)
            // service page, matching the KAZ reference's step sequence:
            // the 4 middle steps (indices 1-4) are grouped under a dashed
            // "Design iteration" box, same as the reference.
            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""ProcessSteps"" = ARRAY[
                        'UX research',
                        'Sketching / brainstorming',
                        'Wireframing',
                        'Prototyping',
                        'Usability testing',
                        'Handover & support for implementation'
                    ]::text[],
                    ""ProcessGroupStart"" = 1,
                    ""ProcessGroupCount"" = 4,
                    ""ProcessGroupLabel"" = 'Design iteration'
                WHERE ""Id"" = '9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""Services""
                SET ""ProcessSteps"" = ARRAY[]::text[],
                    ""ProcessGroupStart"" = 0,
                    ""ProcessGroupCount"" = 0,
                    ""ProcessGroupLabel"" = ''
                WHERE ""Id"" = '9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1';
            ");
        }
    }
}
