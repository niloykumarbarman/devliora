using Devliora.Domain.Enums;
using MediatR;

namespace Devliora.Application.Features.Technologies.Commands.CreateTechnology;

public class CreateTechnologyCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public TechnologyCategory Category { get; set; }
    public int DisplayOrder { get; set; }
    public string Frameworks { get; set; } = string.Empty;
}
