using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.Services.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Services.Queries.GetAllServices;

public class GetAllServicesQueryHandler : IRequestHandler<GetAllServicesQuery, List<ServiceDto>>
{
    private const string CacheKey = "services:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetAllServicesQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<ServiceDto>> Handle(GetAllServicesQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<ServiceDto>>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var result = await _context.Services
            .Where(s => s.IsActive && !s.IsDeleted)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Title = s.Title,
                Slug = s.Slug,
                ShortDescription = s.ShortDescription,
                FullDescription = s.FullDescription,
                Includes = s.Includes,
                IconUrl = s.IconUrl,
                HeroImageUrl = s.HeroImageUrl,
                DisplayOrder = s.DisplayOrder,
                Highlights = s.Highlights
                    .OrderBy(h => h.DisplayOrder)
                    .Select(h => new ServiceHighlightItem { Label = h.Label, Description = h.Description, DisplayOrder = h.DisplayOrder })
                    .ToList(),
                ToolsHeading = s.ToolsHeading,
                ToolsDescription = s.ToolsDescription,
                ToolsTagline = s.ToolsTagline,
                ToolNames = s.ToolNames,
                ProcessSteps = s.ProcessSteps,
                ProcessGroupStart = s.ProcessGroupStart,
                ProcessGroupCount = s.ProcessGroupCount,
                ProcessGroupLabel = s.ProcessGroupLabel,
                IndustriesHeading = s.IndustriesHeading,
                IndustriesTagline = s.IndustriesTagline,
                IndustriesDescription = s.IndustriesDescription,
                IndustryCards = s.IndustryCards
                    .OrderBy(c => c.DisplayOrder)
                    .Select(c => new ServiceIndustryCardItem { ImageUrl = c.ImageUrl, Title = c.Title, Description = c.Description, DisplayOrder = c.DisplayOrder })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        await _cache.SetAsync(CacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
