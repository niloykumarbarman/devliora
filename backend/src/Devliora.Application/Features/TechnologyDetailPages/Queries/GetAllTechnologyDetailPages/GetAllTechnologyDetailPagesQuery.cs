using MediatR;

namespace Devliora.Application.Features.TechnologyDetailPages.Queries.GetAllTechnologyDetailPages;

public class GetAllTechnologyDetailPagesQuery : IRequest<List<TechnologyDetailPageSummaryDto>>
{
}
