using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Services.Commands.UpdateService;

public class UpdateServiceCommandHandler : IRequestHandler<UpdateServiceCommand, Unit>
{
    private const string CacheKey = "services:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public UpdateServiceCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Unit> Handle(UpdateServiceCommand request, CancellationToken cancellationToken)
    {
        var service = await _context.Services
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"Service with Id '{request.Id}' was not found.");

        service.Title = request.Title;
        service.Slug = request.Slug;
        service.ShortDescription = request.ShortDescription;
        service.FullDescription = request.FullDescription;
        service.Includes = request.Includes;
        service.IconUrl = request.IconUrl;
        service.HeroImageUrl = request.HeroImageUrl;
        service.DisplayOrder = request.DisplayOrder;
        service.IsActive = request.IsActive;
        service.ToolsHeading = request.ToolsHeading;
        service.ToolsDescription = request.ToolsDescription;
        service.ToolsTagline = request.ToolsTagline;
        service.ToolNames = request.ToolNames;
        service.UpdatedAt = DateTime.UtcNow;

        // Explicit DbSet remove/add (instead of navigation-collection Clear()+Add())
        // avoids an EF Core change-tracker ambiguity that intermittently produced
        // DbUpdateConcurrencyException ("expected 1 row, affected 0") on this
        // replace-all-children pattern (see UpdatePortfolioCommandHandler).
        var existingHighlights = await _context.ServiceHighlights
            .Where(h => h.ServiceId == service.Id)
            .ToListAsync(cancellationToken);
        _context.ServiceHighlights.RemoveRange(existingHighlights);

        foreach (var highlight in request.Highlights)
        {
            _context.ServiceHighlights.Add(new ServiceHighlight
            {
                ServiceId = service.Id,
                Label = highlight.Label,
                Description = highlight.Description,
                DisplayOrder = highlight.DisplayOrder
            });
        }

        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return Unit.Value;
    }
}
