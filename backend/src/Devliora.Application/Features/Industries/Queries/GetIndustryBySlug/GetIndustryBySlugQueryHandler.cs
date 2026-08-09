using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.Industries.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Industries.Queries.GetIndustryBySlug;

public class GetIndustryBySlugQueryHandler : IRequestHandler<GetIndustryBySlugQuery, IndustryDetailDto?>
{
    private readonly IAppDbContext _context;

    public GetIndustryBySlugQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<IndustryDetailDto?> Handle(GetIndustryBySlugQuery request, CancellationToken cancellationToken)
    {
        return await _context.Industries
            .Where(i => i.Slug == request.Slug && i.IsActive && !i.IsDeleted)
            .Select(i => new IndustryDetailDto
            {
                Id = i.Id,
                Name = i.Name,
                Slug = i.Slug,
                Description = i.Description,
                Stats = i.Stats
                    .OrderBy(s => s.DisplayOrder)
                    .Select(s => new IndustryStatItem { Value = s.Value, Label = s.Label, Source = s.Source, DisplayOrder = s.DisplayOrder })
                    .ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
