using Devliora.Domain.Common;
namespace Devliora.Domain.Entities;
public class SiteSettings : BaseEntity
{
    public string LogoUrl { get; set; } = string.Empty;
    public string SiteName { get; set; } = "Devliora";
    public string PortfolioHeroImageUrl { get; set; } = string.Empty;
    public string IndustriesImageUrl { get; set; } = string.Empty;
    public string ServicesImageUrl { get; set; } = string.Empty;

    // Separate, independently-editable images for the four image slots on
    // the /services page itself (distinct from ServicesImageUrl above,
    // which is the navbar mega-menu's Services dropdown image).
    public string ServicesBannerImageUrl { get; set; } = string.Empty;
    public string ServicesEngineeringImageUrl { get; set; } = string.Empty;
    public string ServicesTechImageUrl { get; set; } = string.Empty;
    public string ServicesSolutionsImageUrl { get; set; } = string.Empty;

    // Hero banner image for the /technologies page (dark photo behind
    // the "Technologies" title), matching kaz.com.bd/technologies.
    public string TechnologiesHeroImageUrl { get; set; } = string.Empty;

    // One image per /technologies category section (index matches
    // TechnologyCategory / CATEGORY_ORDER on the frontend), shown beside
    // that section's tech list — matching kaz.com.bd/technologies' own
    // per-section photo.
    public string TechnologiesBackendImageUrl { get; set; } = string.Empty;
    public string TechnologiesFrontendImageUrl { get; set; } = string.Empty;
    public string TechnologiesCloudImageUrl { get; set; } = string.Empty;
    public string TechnologiesDatabaseImageUrl { get; set; } = string.Empty;
    public string TechnologiesDevOpsImageUrl { get; set; } = string.Empty;
    public string TechnologiesAiMlImageUrl { get; set; } = string.Empty;
    public string TechnologiesMobileImageUrl { get; set; } = string.Empty;

    // Decorative image for the ".NET Core" card on the
    // /technologies/dot-net-development page's "Development Services"
    // section. Falls back to a coded gradient (using .NET's real brand
    // purple, #512BD4) when unset, so this is optional.
    public string TechnologiesDotNetImageUrl { get; set; } = string.Empty;
}
