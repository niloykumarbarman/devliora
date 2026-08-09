namespace Devliora.Application.Features.SiteSettings.Queries.GetSiteSettings;

public class SiteSettingsDto
{
    public Guid Id { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string SiteName { get; set; } = string.Empty;
    public string PortfolioHeroImageUrl { get; set; } = string.Empty;
    public string IndustriesImageUrl { get; set; } = string.Empty;
    public string ServicesImageUrl { get; set; } = string.Empty;
}
