using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

public class ServiceHighlight : BaseEntity
{
    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
