using Devliora.Application.Features.Industries.Common;
using MediatR;

namespace Devliora.Application.Features.Industries.Commands.CreateIndustry;

public class CreateIndustryCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public List<IndustryStatItem> Stats { get; set; } = new();
}
