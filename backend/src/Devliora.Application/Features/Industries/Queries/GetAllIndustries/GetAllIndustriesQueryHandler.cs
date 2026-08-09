using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Industries.Queries.GetAllIndustries;

public class GetAllIndustriesQueryHandler : IRequestHandler<GetAllIndustriesQuery, List<IndustryDto>>
{
    private const string CacheKey = "industries:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetAllIndustriesQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<IndustryDto>> Handle(GetAllIndustriesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<IndustryDto>>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var result = await _context.Industries
            .Where(i => i.IsActive && !i.IsDeleted)
            .OrderBy(i => i.DisplayOrder)
            .Select(i => new IndustryDto
            {
                Id = i.Id,
                Name = i.Name,
                Slug = i.Slug,
                DisplayOrder = i.DisplayOrder
            })
            .ToListAsync(cancellationToken);

        await _cache.SetAsync(CacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
