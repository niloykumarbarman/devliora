using Devliora.Application.Features.Industries.Common;

namespace Devliora.Application.Features.Industries.Queries.GetIndustryBySlug;

public class IndustryDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<IndustryStatItem> Stats { get; set; } = new();
}
