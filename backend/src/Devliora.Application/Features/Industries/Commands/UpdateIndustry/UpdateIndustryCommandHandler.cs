using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Industries.Commands.UpdateIndustry;

public class UpdateIndustryCommandHandler : IRequestHandler<UpdateIndustryCommand, Unit>
{
    private const string CacheKey = "industries:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public UpdateIndustryCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Unit> Handle(UpdateIndustryCommand request, CancellationToken cancellationToken)
    {
        var industry = await _context.Industries
            .FirstOrDefaultAsync(i => i.Id == request.Id && !i.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"Industry with Id '{request.Id}' was not found.");

        industry.Name = request.Name;
        industry.Slug = request.Slug;
        industry.Description = request.Description;
        industry.DisplayOrder = request.DisplayOrder;
        industry.IsActive = request.IsActive;
        industry.UpdatedAt = DateTime.UtcNow;

        // Explicit DbSet remove/add (instead of navigation-collection Clear()+Add())
        // avoids an EF Core change-tracker ambiguity that intermittently produced
        // DbUpdateConcurrencyException ("expected 1 row, affected 0") on this
        // replace-all-children pattern (see UpdatePortfolioCommandHandler).
        var existingStats = await _context.IndustryStats
            .Where(s => s.IndustryId == industry.Id)
            .ToListAsync(cancellationToken);
        _context.IndustryStats.RemoveRange(existingStats);

        foreach (var stat in request.Stats)
        {
            _context.IndustryStats.Add(new IndustryStat
            {
                IndustryId = industry.Id,
                Value = stat.Value,
                Label = stat.Label,
                Source = stat.Source,
                DisplayOrder = stat.DisplayOrder
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return Unit.Value;
    }
}
