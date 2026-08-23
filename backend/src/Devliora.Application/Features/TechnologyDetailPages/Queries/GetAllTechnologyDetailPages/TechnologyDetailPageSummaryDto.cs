namespace Devliora.Application.Features.TechnologyDetailPages.Queries.GetAllTechnologyDetailPages;

// Lightweight public listing shape — just enough to link to each page
// (e.g. from /technologies), not the full page content.
public class TechnologyDetailPageSummaryDto
{
    public string Slug { get; set; } = string.Empty;
    public string TechnologyName { get; set; } = string.Empty;
    public string HeroTitle { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public string PageType { get; set; } = "technology";
}
