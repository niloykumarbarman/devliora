using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

public class TechnologyDetailFaq : BaseEntity
{
    public Guid TechnologyDetailPageId { get; set; }
    public TechnologyDetailPage TechnologyDetailPage { get; set; } = null!;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
