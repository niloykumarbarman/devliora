using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Technologies.Queries.GetAllTechnologies;

public class GetAllTechnologiesQueryHandler : IRequestHandler<GetAllTechnologiesQuery, List<TechnologyDto>>
{
    private const string CacheKey = "technologies:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetAllTechnologiesQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<TechnologyDto>> Handle(GetAllTechnologiesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<TechnologyDto>>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var result = await _context.TechnologyItems
            .Where(t => t.IsActive && !t.IsDeleted)
            .OrderBy(t => t.DisplayOrder)
            .Select(t => new TechnologyDto
            {
                Id = t.Id,
                Name = t.Name,
                DisplayName = t.DisplayName,
                Category = t.Category,
                DisplayOrder = t.DisplayOrder,
                Frameworks = t.Frameworks
            })
            .ToListAsync(cancellationToken);

        await _cache.SetAsync(CacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
