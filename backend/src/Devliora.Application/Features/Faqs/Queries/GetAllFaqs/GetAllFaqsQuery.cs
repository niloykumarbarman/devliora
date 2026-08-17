using MediatR;

namespace Devliora.Application.Features.Faqs.Queries.GetAllFaqs;

public class GetAllFaqsQuery : IRequest<List<FaqDto>>
{
    // Null/empty = the site-wide FAQ section (only FaqItems with no
    // ServiceSlug). Set to a service's slug to get that service's
    // scoped FAQ items instead.
    public string? ServiceSlug { get; set; }
}
