using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.Services.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Services.Queries.GetAllServicesAdmin;

public class GetAllServicesAdminQueryHandler : IRequestHandler<GetAllServicesAdminQuery, List<AdminServiceDto>>
{
    private readonly IAppDbContext _context;

    public GetAllServicesAdminQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminServiceDto>> Handle(GetAllServicesAdminQuery request, CancellationToken cancellationToken)
    {
        // Admin view: no IsActive/IsDeleted filtering, and no caching, so
        // the admin panel always reflects the latest true database state.
        return await _context.Services
            .Where(s => !s.IsDeleted)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new AdminServiceDto
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
                IsActive = s.IsActive,
                Highlights = s.Highlights
                    .OrderBy(h => h.DisplayOrder)
                    .Select(h => new ServiceHighlightItem { Label = h.Label, Description = h.Description, DisplayOrder = h.DisplayOrder })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
