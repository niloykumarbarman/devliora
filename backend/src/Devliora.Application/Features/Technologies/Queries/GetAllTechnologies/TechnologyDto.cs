using Devliora.Domain.Enums;

namespace Devliora.Application.Features.Technologies.Queries.GetAllTechnologies;

public class TechnologyDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public TechnologyCategory Category { get; set; }
    public int DisplayOrder { get; set; }
    public string Frameworks { get; set; } = string.Empty;
}
