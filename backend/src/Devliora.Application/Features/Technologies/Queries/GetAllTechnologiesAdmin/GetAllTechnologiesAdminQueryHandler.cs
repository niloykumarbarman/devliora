using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Technologies.Queries.GetAllTechnologiesAdmin;

public class GetAllTechnologiesAdminQueryHandler : IRequestHandler<GetAllTechnologiesAdminQuery, List<AdminTechnologyDto>>
{
    private readonly IAppDbContext _context;

    public GetAllTechnologiesAdminQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminTechnologyDto>> Handle(GetAllTechnologiesAdminQuery request, CancellationToken cancellationToken)
    {
        return await _context.TechnologyItems
            .Where(t => !t.IsDeleted)
            .OrderBy(t => t.DisplayOrder)
            .Select(t => new AdminTechnologyDto
            {
                Id = t.Id,
                Name = t.Name,
                DisplayName = t.DisplayName,
                Category = t.Category,
                DisplayOrder = t.DisplayOrder,
                IsActive = t.IsActive,
                Frameworks = t.Frameworks
            })
            .ToListAsync(cancellationToken);
    }
}
