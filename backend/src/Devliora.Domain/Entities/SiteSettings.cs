using Devliora.Domain.Common;
namespace Devliora.Domain.Entities;
public class SiteSettings : BaseEntity
{
    public string LogoUrl { get; set; } = string.Empty;
    public string SiteName { get; set; } = "Devliora";
    public string PortfolioHeroImageUrl { get; set; } = string.Empty;
    public string IndustriesImageUrl { get; set; } = string.Empty;
}
