using MediatR;

namespace Devliora.Application.Features.TechnologyDetailPages.Commands.DeleteTechnologyDetailPage;

public class DeleteTechnologyDetailPageCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}
