using Devliora.Application.Features.Industries.Common;

namespace Devliora.Application.Features.Industries.Queries.GetAllIndustriesAdmin;

public class AdminIndustryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public List<IndustryStatItem> Stats { get; set; } = new();
}
