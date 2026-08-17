using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Faqs.Queries.GetAllFaqs;

public class GetAllFaqsQueryHandler : IRequestHandler<GetAllFaqsQuery, List<FaqDto>>
{
    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetAllFaqsQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<FaqDto>> Handle(GetAllFaqsQuery request, CancellationToken cancellationToken)
    {
        var slug = request.ServiceSlug ?? string.Empty;
        var cacheKey = $"faqs:all:{slug}";

        var cached = await _cache.GetAsync<List<FaqDto>>(cacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var result = await _context.FaqItems
            .Where(f => f.IsActive && !f.IsDeleted && f.ServiceSlug == slug)
            .OrderBy(f => f.DisplayOrder)
            .Select(f => new FaqDto
            {
                Id = f.Id,
                Question = f.Question,
                Answer = f.Answer,
                DisplayOrder = f.DisplayOrder,
                ServiceSlug = f.ServiceSlug
            })
            .ToListAsync(cancellationToken);

        await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
