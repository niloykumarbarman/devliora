using MediatR;

namespace Devliora.Application.Features.TechnologyDetailPages.Queries.GetTechnologyDetailPageBySlug;

public class GetTechnologyDetailPageBySlugQuery : IRequest<TechnologyDetailPageDto?>
{
    public string Slug { get; set; } = string.Empty;
}
