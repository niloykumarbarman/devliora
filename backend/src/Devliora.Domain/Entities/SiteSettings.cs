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
}
