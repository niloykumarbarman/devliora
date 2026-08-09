using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

public class IndustryStat : BaseEntity
{
    public Guid IndustryId { get; set; }
    public Industry Industry { get; set; } = null!;
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
