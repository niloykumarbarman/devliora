namespace Devliora.Application.Features.SiteSettings.Queries.GetSiteSettings;

public class SiteSettingsDto
{
    public Guid Id { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string SiteName { get; set; } = string.Empty;
    public string PortfolioHeroImageUrl { get; set; } = string.Empty;
    public string IndustriesImageUrl { get; set; } = string.Empty;
    public string ServicesImageUrl { get; set; } = string.Empty;
    public string ServicesBannerImageUrl { get; set; } = string.Empty;
    public string ServicesEngineeringImageUrl { get; set; } = string.Empty;
    public string ServicesTechImageUrl { get; set; } = string.Empty;
    public string ServicesSolutionsImageUrl { get; set; } = string.Empty;
    public string TechnologiesHeroImageUrl { get; set; } = string.Empty;
}
