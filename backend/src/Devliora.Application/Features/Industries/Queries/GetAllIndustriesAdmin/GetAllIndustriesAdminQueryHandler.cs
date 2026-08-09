using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.Industries.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Industries.Queries.GetAllIndustriesAdmin;

public class GetAllIndustriesAdminQueryHandler : IRequestHandler<GetAllIndustriesAdminQuery, List<AdminIndustryDto>>
{
    private readonly IAppDbContext _context;

    public GetAllIndustriesAdminQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminIndustryDto>> Handle(GetAllIndustriesAdminQuery request, CancellationToken cancellationToken)
    {
        return await _context.Industries
            .Where(i => !i.IsDeleted)
            .OrderBy(i => i.DisplayOrder)
            .Select(i => new AdminIndustryDto
            {
                Id = i.Id,
                Name = i.Name,
                Slug = i.Slug,
                Description = i.Description,
                DisplayOrder = i.DisplayOrder,
                IsActive = i.IsActive,
                Stats = i.Stats
                    .OrderBy(s => s.DisplayOrder)
                    .Select(s => new IndustryStatItem { Value = s.Value, Label = s.Label, Source = s.Source, DisplayOrder = s.DisplayOrder })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
