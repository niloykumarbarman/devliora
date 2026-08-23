using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Devliora.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    // Seeds the Furniture eCommerce Software solution page — previously
    // a hand-written static page.tsx at
    // frontend/src/app/solutions/furniture-ecommerce-software — now that
    // the frontend's /solutions/[slug] route reads this content from the
    // database, matching the earlier cutover of the .NET/Java technology
    // pages. Content copied verbatim from that file so the live page
    // renders identically after the cutover.
    public partial class SeedFurnitureEcommerceSolutionPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var pageId = Guid.NewGuid();
            var now = DateTime.UtcNow;

            migrationBuilder.InsertData(
                table: "TechnologyDetailPages",
                columns: new[]
                {
                    "Id", "Slug", "TechnologyName", "MetaDescription", "DisplayOrder", "PageType",
                    "HeroTitle", "HeroImageUrl",
                    "OverviewHeading", "OverviewHeadingAccent", "OverviewHeadingSuffix", "OverviewParagraph",
                    "ShowTechnologiesShowcase",
                    "HighlightHeadline", "HighlightParagraph",
                    "IndustriesParagraph", "IndustriesImageUrl",
                    "ServicesHeading", "ServicesCardLabel", "ServicesParagraph", "ServicesCardImageUrl",
                    "CreatedAt", "UpdatedAt", "IsDeleted"
                },
                values: new object[,]
                {
                    {
                        pageId, "furniture-ecommerce-software", "Furniture eCommerce",
                        "AI-driven furniture eCommerce platforms with tailored inventory management, AR visualization, and integrated payments.",
                        0, "solution",
                        "Furniture eCommerce Software", "",
                        "Benefits of", "Furniture eCommerce", "Software",
                        "At Devliora, we harness the power of artificial intelligence to create intelligent solutions that drive innovation. Our expertise in AI enables us to enhance efficiency and automate processes — discover the benefits of adopting AI for your next furniture eCommerce project.",
                        true,
                        "Built to scale with your catalog",
                        "Modern eCommerce platforms are designed to handle growing product catalogs and traffic without a rewrite — the same principle we apply to every furniture eCommerce platform we build, from a boutique catalog to a full warehouse operation.",
                        "", "",
                        "Furniture eCommerce Software Services", "Furniture eCommerce",
                        "We build furniture-focused eCommerce software designed to handle complex catalogs, customization, and high-consideration buying journeys. Here's a snapshot of how our solutions support furniture brands and retailers.",
                        "",
                        now, null, false
                    }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailFeatures",
                columns: new[] { "Id", "TechnologyDetailPageId", "Title", "Body", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), pageId, "Tailored inventory management", "Our solutions include customized inventory systems that effectively track stock levels, ensuring your furniture collections are always up-to-date and available.", 0, now, null, false },
                    { Guid.NewGuid(), pageId, "Augmented reality features", "We integrate AR technology, enabling customers to visualize how furniture pieces fit into their spaces, enhancing their shopping experience.", 1, now, null, false },
                    { Guid.NewGuid(), pageId, "User-friendly design", "Our furniture eCommerce platforms prioritize intuitive navigation, making it easy for customers to browse, compare, and purchase products seamlessly.", 2, now, null, false },
                    { Guid.NewGuid(), pageId, "Robust analytics", "We equip your software with analytics tools that provide insights into customer behavior, helping you optimize your offerings and marketing strategies.", 3, now, null, false },
                    { Guid.NewGuid(), pageId, "Integrated payment solutions", "Our software supports multiple secure payment options, ensuring a smooth and trustworthy transaction process for your customers.", 4, now, null, false }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailFaqs",
                columns: new[] { "Id", "TechnologyDetailPageId", "Question", "Answer", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), pageId, "How long does it take to build a furniture-focused eCommerce platform?", "It depends on scope — catalog size, custom features, and how many integrations are involved. We scope every project individually and give you a realistic timeline before work begins, not a generic estimate.", 0, now, null, false },
                    { Guid.NewGuid(), pageId, "Why should I choose a specialized eCommerce solution for the furniture industry?", "Furniture requires advanced visualizations, large catalogs, custom attributes, delivery logic, and price variations — which standard eCommerce setups don't handle well.", 1, now, null, false },
                    { Guid.NewGuid(), pageId, "Can you integrate AR/3D previews, room visualizers, or custom configurators?", "Yes. We integrate AR modules, 3D viewers, color/size configurators, and product pairing tools to enhance the customer experience.", 2, now, null, false },
                    { Guid.NewGuid(), pageId, "What is the cost range for furniture eCommerce software?", "Cost depends on scope, complexity, and the visualization tools involved — a focused catalog site costs far less than a full AR/3D-configurator platform. We provide a clear, itemized estimate once we understand your requirements, with no hidden fees.", 3, now, null, false },
                    { Guid.NewGuid(), pageId, "Do you provide ongoing support for furniture eCommerce platforms?", "Absolutely. We handle updates, performance optimization, inventory sync, security patches, and continuous UX improvements.", 4, now, null, false }
                });

            migrationBuilder.InsertData(
                table: "TechnologyDetailServiceCards",
                columns: new[] { "Id", "TechnologyDetailPageId", "Title", "Description", "DisplayOrder", "CreatedAt", "UpdatedAt", "IsDeleted" },
                values: new object[,]
                {
                    { Guid.NewGuid(), pageId, "Catalog Management", "We design systems that handle large furniture catalogs, variants, materials, dimensions, and pricing with clarity and structure.", 0, now, null, false },
                    { Guid.NewGuid(), pageId, "Customization", "We enable product configuration features such as size, finish, fabric, and options to support personalized buying experiences.", 1, now, null, false },
                    { Guid.NewGuid(), pageId, "Shopping & Checkout Flow", "We build smooth browsing, cart, and checkout experiences optimized for high-value furniture purchases and conversions.", 2, now, null, false },
                    { Guid.NewGuid(), pageId, "Inventory & Order Handling", "We integrate inventory tracking, order management, and fulfillment workflows to support accurate availability and delivery.", 3, now, null, false },
                    { Guid.NewGuid(), pageId, "Platform Support & Scaling", "We provide ongoing support to keep furniture eCommerce platforms stable, scalable, and ready for business growth.", 4, now, null, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""TechnologyDetailPages"" WHERE ""Slug"" = 'furniture-ecommerce-software';");
        }
    }
}
