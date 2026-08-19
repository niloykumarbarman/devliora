using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

// One card in the "<Technology> Development Services" expandable grid
// (e.g. "Java Consulting", "Custom Java Development").
public class TechnologyDetailServiceCard : BaseEntity
{
    public Guid TechnologyDetailPageId { get; set; }
    public TechnologyDetailPage TechnologyDetailPage { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
