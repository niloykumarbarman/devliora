using MediatR;

namespace Devliora.Application.Features.Industries.Commands.DeleteIndustry;

public class DeleteIndustryCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
