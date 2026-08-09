using MediatR;

namespace Devliora.Application.Features.Industries.Queries.GetIndustryBySlug;

public class GetIndustryBySlugQuery : IRequest<IndustryDetailDto?>
{
    public string Slug { get; set; } = string.Empty;
}
