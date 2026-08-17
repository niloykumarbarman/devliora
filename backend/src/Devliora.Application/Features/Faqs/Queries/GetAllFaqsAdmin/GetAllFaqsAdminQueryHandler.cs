using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Faqs.Queries.GetAllFaqsAdmin;

public class GetAllFaqsAdminQueryHandler : IRequestHandler<GetAllFaqsAdminQuery, List<AdminFaqDto>>
{
    private readonly IAppDbContext _context;

    public GetAllFaqsAdminQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminFaqDto>> Handle(GetAllFaqsAdminQuery request, CancellationToken cancellationToken)
    {
        return await _context.FaqItems
            .Where(f => !f.IsDeleted)
            .OrderBy(f => f.DisplayOrder)
            .Select(f => new AdminFaqDto
            {
                Id = f.Id,
                Question = f.Question,
                Answer = f.Answer,
                DisplayOrder = f.DisplayOrder,
                IsActive = f.IsActive,
                ServiceSlug = f.ServiceSlug
            })
            .ToListAsync(cancellationToken);
    }
}
