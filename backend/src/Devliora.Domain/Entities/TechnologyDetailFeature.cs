using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

public class TechnologyDetailFeature : BaseEntity
{
    public Guid TechnologyDetailPageId { get; set; }
    public TechnologyDetailPage TechnologyDetailPage { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
