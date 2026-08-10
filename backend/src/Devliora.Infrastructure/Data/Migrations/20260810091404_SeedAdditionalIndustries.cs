using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdditionalIndustries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Rounds out the original 6-industry seed list (FinTech, Healthcare,
            // E-commerce & Retail, Logistics & Supply Chain, SaaS & B2B
            // Platforms, EdTech) with 9 more, matching the breadth requested.
            // Descriptions/stats are illustrative starting content — replace
            // with real figures and sourcing from the admin panel before launch.
            var seedTimestamp = new DateTime(2026, 8, 10, 0, 0, 0, DateTimeKind.Utc);

            migrationBuilder.InsertData(
                table: "Industries",
                columns: new[] { "Id", "Name", "Slug", "Description", "DisplayOrder", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { "e3f3f5fc-5ab8-4041-8e0b-52dd4e9dbc93", "Tax and Trade", "tax-trade", "Compliance-heavy filing, customs, and reporting systems where a rounding error or a missed deadline has real financial consequences.", 7, true, seedTimestamp, null, false },
                    { "9ffbc282-c337-46af-b32b-3ebb409e5589", "Manufacturing", "manufacturing", "MES, inventory, and shop-floor systems that stay accurate when the data source is a machine, not a form.", 8, true, seedTimestamp, null, false },
                    { "e32057f5-de04-4cca-a67e-6d3be5ff7154", "NGO", "ngo", "Donor management, grant tracking, and reporting platforms built for lean teams and strict funder accountability.", 9, true, seedTimestamp, null, false },
                    { "374c543d-fa19-4b84-a201-2b3ac582951f", "Startups", "startups", "MVPs and early platforms built to prove the model fast, then scale without a rebuild.", 10, true, seedTimestamp, null, false },
                    { "4f198b4c-3527-4cd5-bb4b-b72e8e0df650", "Government", "government", "Public-sector systems built to procurement, accessibility, and data-residency requirements from day one.", 11, true, seedTimestamp, null, false },
                    { "7128859c-6f85-418d-bd9a-e312a9e7e943", "Telecom", "telecom", "Billing, provisioning, and network-ops platforms that handle high transaction volume without dropping a request.", 12, true, seedTimestamp, null, false },
                    { "acbb2462-faf8-4f1e-811d-bec0773d6b68", "Enterprise", "enterprise", "Internal platforms and legacy modernization for organizations where every integration has a dozen stakeholders.", 13, true, seedTimestamp, null, false },
                    { "c9297af7-40e6-413f-bddd-8c88e81fc9be", "Publishing", "publishing", "Content management and distribution systems built for editorial teams, not just developers.", 14, true, seedTimestamp, null, false },
                    { "0ae9b2d1-a845-4af1-a11d-40f6fa5a70fc", "Gaming", "gaming", "Backend services, matchmaking, and live-ops systems built to hold up under launch-day traffic.", 15, true, seedTimestamp, null, false }
                });

            migrationBuilder.InsertData(
                table: "IndustryStats",
                columns: new[] { "Id", "IndustryId", "Value", "Label", "Source", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { "99e2bb07-2651-4a4e-952d-ec1df71ca898", "e3f3f5fc-5ab8-4041-8e0b-52dd4e9dbc93", "e-Filing", "integrations we build for tax authorities", "", 1, seedTimestamp, null, false },
                    { "e2381416-8251-4bad-ac72-c0c2f259584d", "e3f3f5fc-5ab8-4041-8e0b-52dd4e9dbc93", "Audit trail", "on every calculation and submission", "", 2, seedTimestamp, null, false },
                    { "d8553bd3-53e2-47e4-bb85-d501e8964915", "e3f3f5fc-5ab8-4041-8e0b-52dd4e9dbc93", "Multi-jurisdiction", "tax logic we've shipped", "", 3, seedTimestamp, null, false },
                    { "c18392ea-78af-44fd-84b2-2a9c55a2210c", "9ffbc282-c337-46af-b32b-3ebb409e5589", "Real-time", "shop-floor data ingestion", "", 1, seedTimestamp, null, false },
                    { "3a613e50-f092-453a-a958-164ea4e48548", "9ffbc282-c337-46af-b32b-3ebb409e5589", "ERP-integrated", "inventory and production sync", "", 2, seedTimestamp, null, false },
                    { "e794153b-e56f-4426-96a9-287d4b1cabfd", "9ffbc282-c337-46af-b32b-3ebb409e5589", "99.9%", "uptime target for plant-floor systems", "", 3, seedTimestamp, null, false },
                    { "3a31f783-3dc5-4404-a270-e9374472472e", "e32057f5-de04-4cca-a67e-6d3be5ff7154", "Grant-ready", "reporting built to funder standards", "", 1, seedTimestamp, null, false },
                    { "2b32decd-28c8-4482-96df-c23bfbdcf569", "e32057f5-de04-4cca-a67e-6d3be5ff7154", "Multi-currency", "donor and grant tracking", "", 2, seedTimestamp, null, false },
                    { "047ea9f4-2d13-4a2b-815a-8b568e6c100b", "e32057f5-de04-4cca-a67e-6d3be5ff7154", "Low-maintenance", "systems built for lean ops teams", "", 3, seedTimestamp, null, false },
                    { "89e9b309-6905-433c-9442-9176084e7ab8", "374c543d-fa19-4b84-a201-2b3ac582951f", "Weeks, not months", "typical MVP delivery window", "", 1, seedTimestamp, null, false },
                    { "da5427a7-e135-45d0-b0a4-6b42cecab5d0", "374c543d-fa19-4b84-a201-2b3ac582951f", "Scale-ready", "architecture from day one", "", 2, seedTimestamp, null, false },
                    { "25d95326-1af8-452a-9c41-608ea15f7a84", "374c543d-fa19-4b84-a201-2b3ac582951f", "Fixed & flexible", "engagement models for early-stage teams", "", 3, seedTimestamp, null, false },
                    { "1f003433-c44d-47bc-ad28-0b2b9a21bd09", "4f198b4c-3527-4cd5-bb4b-b72e8e0df650", "WCAG 2.1", "accessibility level targeted", "", 1, seedTimestamp, null, false },
                    { "ba2d9e63-b003-4a3a-a810-027bf32cafb0", "4f198b4c-3527-4cd5-bb4b-b72e8e0df650", "Data residency", "controls built in by default", "", 2, seedTimestamp, null, false },
                    { "2cb5be8e-8f34-453a-9d63-f0e6a7961651", "4f198b4c-3527-4cd5-bb4b-b72e8e0df650", "Audit-ready", "logging on every transaction", "", 3, seedTimestamp, null, false },
                    { "ca662e0a-3aa9-4540-b6eb-b8f20e0e09fb", "7128859c-6f85-418d-bd9a-e312a9e7e943", "High-throughput", "billing & provisioning pipelines", "", 1, seedTimestamp, null, false },
                    { "646d77da-015a-4617-8b4b-37166abb8fcb", "7128859c-6f85-418d-bd9a-e312a9e7e943", "Real-time", "usage and rating data", "", 2, seedTimestamp, null, false },
                    { "8f4a6bee-2edc-4658-8e0d-6962992815fc", "7128859c-6f85-418d-bd9a-e312a9e7e943", "99.95%", "uptime target for billing systems", "", 3, seedTimestamp, null, false },
                    { "0b577d2a-69b5-4559-b100-3fad8c2f167d", "acbb2462-faf8-4f1e-811d-bec0773d6b68", "SSO/SAML", "enterprise auth supported", "", 1, seedTimestamp, null, false },
                    { "bc2e10fb-9811-4f91-813a-b3a8b028833e", "acbb2462-faf8-4f1e-811d-bec0773d6b68", "Legacy-aware", "migrations with zero downtime", "", 2, seedTimestamp, null, false },
                    { "43709e3d-2a9f-4860-b49f-863fb3b46d2b", "acbb2462-faf8-4f1e-811d-bec0773d6b68", "SOC 2-ready", "controls we design around", "", 3, seedTimestamp, null, false },
                    { "c60a8667-73d2-429f-91a4-0b6413137ea3", "c9297af7-40e6-413f-bddd-8c88e81fc9be", "Headless CMS", "editorial workflows we build", "", 1, seedTimestamp, null, false },
                    { "ccf83d93-f104-416c-8a3e-8ebefd6c3f5f", "c9297af7-40e6-413f-bddd-8c88e81fc9be", "Multi-channel", "web, app, and syndication delivery", "", 2, seedTimestamp, null, false },
                    { "94bff010-6971-419f-bf1b-c1d6a58202db", "c9297af7-40e6-413f-bddd-8c88e81fc9be", "SEO-first", "content architecture", "", 3, seedTimestamp, null, false },
                    { "4f6ff42f-d29e-4f39-a498-ed8ce9a26920", "0ae9b2d1-a845-4af1-a11d-40f6fa5a70fc", "Low-latency", "matchmaking & session infra", "", 1, seedTimestamp, null, false },
                    { "c3bfdfd6-3638-4384-9836-4c3cb96d7a04", "0ae9b2d1-a845-4af1-a11d-40f6fa5a70fc", "Live-ops ready", "events, economies, leaderboards", "", 2, seedTimestamp, null, false },
                    { "47ea6d51-f6e9-40b9-b7a9-726c53a08e42", "0ae9b2d1-a845-4af1-a11d-40f6fa5a70fc", "10x", "launch-day load we design for", "", 3, seedTimestamp, null, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "IndustryStats",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    "99e2bb07-2651-4a4e-952d-ec1df71ca898",
                    "e2381416-8251-4bad-ac72-c0c2f259584d",
                    "d8553bd3-53e2-47e4-bb85-d501e8964915",
                    "c18392ea-78af-44fd-84b2-2a9c55a2210c",
                    "3a613e50-f092-453a-a958-164ea4e48548",
                    "e794153b-e56f-4426-96a9-287d4b1cabfd",
                    "3a31f783-3dc5-4404-a270-e9374472472e",
                    "2b32decd-28c8-4482-96df-c23bfbdcf569",
                    "047ea9f4-2d13-4a2b-815a-8b568e6c100b",
                    "89e9b309-6905-433c-9442-9176084e7ab8",
                    "da5427a7-e135-45d0-b0a4-6b42cecab5d0",
                    "25d95326-1af8-452a-9c41-608ea15f7a84",
                    "1f003433-c44d-47bc-ad28-0b2b9a21bd09",
                    "ba2d9e63-b003-4a3a-a810-027bf32cafb0",
                    "2cb5be8e-8f34-453a-9d63-f0e6a7961651",
                    "ca662e0a-3aa9-4540-b6eb-b8f20e0e09fb",
                    "646d77da-015a-4617-8b4b-37166abb8fcb",
                    "8f4a6bee-2edc-4658-8e0d-6962992815fc",
                    "0b577d2a-69b5-4559-b100-3fad8c2f167d",
                    "bc2e10fb-9811-4f91-813a-b3a8b028833e",
                    "43709e3d-2a9f-4860-b49f-863fb3b46d2b",
                    "c60a8667-73d2-429f-91a4-0b6413137ea3",
                    "ccf83d93-f104-416c-8a3e-8ebefd6c3f5f",
                    "94bff010-6971-419f-bf1b-c1d6a58202db",
                    "4f6ff42f-d29e-4f39-a498-ed8ce9a26920",
                    "c3bfdfd6-3638-4384-9836-4c3cb96d7a04",
                    "47ea6d51-f6e9-40b9-b7a9-726c53a08e42"
                });

            migrationBuilder.DeleteData(
                table: "Industries",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    "e3f3f5fc-5ab8-4041-8e0b-52dd4e9dbc93",
                    "9ffbc282-c337-46af-b32b-3ebb409e5589",
                    "e32057f5-de04-4cca-a67e-6d3be5ff7154",
                    "374c543d-fa19-4b84-a201-2b3ac582951f",
                    "4f198b4c-3527-4cd5-bb4b-b72e8e0df650",
                    "7128859c-6f85-418d-bd9a-e312a9e7e943",
                    "acbb2462-faf8-4f1e-811d-bec0773d6b68",
                    "c9297af7-40e6-413f-bddd-8c88e81fc9be",
                    "0ae9b2d1-a845-4af1-a11d-40f6fa5a70fc"
                });
        }
    }
}
