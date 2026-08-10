using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedDigitalDesignHighlights : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Placeholder "at a glance" highlights for the Digital Design
            // (DaaS) service page — process/capability claims only, no
            // fabricated years-in-business/team-size/retention numbers
            // (those were KAZ's own stated credentials, not Devliora's).
            // Replace via /admin/services before launch.
            var seedTimestamp = new DateTime(2026, 8, 10, 0, 0, 0, DateTimeKind.Utc);
            const string digitalDesignServiceId = "9429eb3b-ad5f-43ce-aef0-8dfc469b2ec1";

            migrationBuilder.InsertData(
                table: "ServiceHighlights",
                columns: new[] { "Id", "ServiceId", "Label", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { "bb6bea5d-5b4d-4608-ad56-6a68f1327940", digitalDesignServiceId, "Ongoing Design Partnership", "Continuous UI/UX support that scales with your roadmap, not a one-time handoff.", 1, seedTimestamp, null, false },
                    { "0211eab6-1f85-4ff0-8f42-e65f1e6f1d84", digitalDesignServiceId, "Design Systems Built In", "Reusable component libraries so new features ship consistent by default.", 2, seedTimestamp, null, false },
                    { "fa33b10a-3693-46e2-bb70-f417ee06186b", digitalDesignServiceId, "Research-Backed Decisions", "User research and usability testing built into the process, not skipped under deadline.", 3, seedTimestamp, null, false },
                    { "523f8b88-5a0c-440d-ae24-b36d8b4cf1d0", digitalDesignServiceId, "Fast Onboarding", "New design requests typically picked up within days, not weeks.", 4, seedTimestamp, null, false },
                    { "6d62e519-ba5a-4c85-a251-5c84a3f3eef0", digitalDesignServiceId, "Modern Tooling", "Figma-based workflows that hand off cleanly to engineering.", 5, seedTimestamp, null, false },
                    { "ddf53bb6-7560-4faa-8e55-dad170b4e00f", digitalDesignServiceId, "End-to-End Coverage", "From wireframes to production-ready UI, one team the whole way.", 6, seedTimestamp, null, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ServiceHighlights",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    "bb6bea5d-5b4d-4608-ad56-6a68f1327940",
                    "0211eab6-1f85-4ff0-8f42-e65f1e6f1d84",
                    "fa33b10a-3693-46e2-bb70-f417ee06186b",
                    "523f8b88-5a0c-440d-ae24-b36d8b4cf1d0",
                    "6d62e519-ba5a-4c85-a251-5c84a3f3eef0",
                    "ddf53bb6-7560-4faa-8e55-dad170b4e00f"
                });
        }
    }
}
