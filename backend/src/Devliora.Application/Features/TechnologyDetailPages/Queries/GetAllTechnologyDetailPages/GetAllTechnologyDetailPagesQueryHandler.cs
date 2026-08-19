using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.TechnologyDetailPages.Queries.GetAllTechnologyDetailPages;

public class GetAllTechnologyDetailPagesQueryHandler
    : IRequestHandler<GetAllTechnologyDetailPagesQuery, List<TechnologyDetailPageSummaryDto>>
{
    private readonly IAppDbContext _context;

    public GetAllTechnologyDetailPagesQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TechnologyDetailPageSummaryDto>> Handle(
        GetAllTechnologyDetailPagesQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.TechnologyDetailPages
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new TechnologyDetailPageSummaryDto
            {
                Slug = p.Slug,
                TechnologyName = p.TechnologyName,
                HeroTitle = p.HeroTitle,
                DisplayOrder = p.DisplayOrder
            })
            .ToListAsync(cancellationToken);
    }
}
