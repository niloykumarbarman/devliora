using MediatR;

namespace Devliora.Application.Features.Industries.Queries.GetAllIndustries;

public class GetAllIndustriesQuery : IRequest<List<IndustryDto>>
{
}
