using Devliora.Domain.Common;
namespace Devliora.Domain.Entities;
public class Industry : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<IndustryStat> Stats { get; set; } = new List<IndustryStat>();
}
