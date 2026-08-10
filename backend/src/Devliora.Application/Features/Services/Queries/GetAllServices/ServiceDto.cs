using Devliora.Application.Features.Services.Common;

namespace Devliora.Application.Features.Services.Queries.GetAllServices;

public class ServiceDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public List<string> Includes { get; set; } = new();
    public string IconUrl { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public List<ServiceHighlightItem> Highlights { get; set; } = new();
    public string ToolsHeading { get; set; } = string.Empty;
    public string ToolsDescription { get; set; } = string.Empty;
    public string ToolsTagline { get; set; } = string.Empty;
    public List<string> ToolNames { get; set; } = new();
    public List<string> ProcessSteps { get; set; } = new();
    public int ProcessGroupStart { get; set; }
    public int ProcessGroupCount { get; set; }
    public string ProcessGroupLabel { get; set; } = string.Empty;
    public string IndustriesHeading { get; set; } = string.Empty;
    public string IndustriesTagline { get; set; } = string.Empty;
    public string IndustriesDescription { get; set; } = string.Empty;
    public List<ServiceIndustryCardItem> IndustryCards { get; set; } = new();
}
