using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Technologies.Commands.UpdateTechnology;

public class UpdateTechnologyCommandHandler : IRequestHandler<UpdateTechnologyCommand, Unit>
{
    private const string CacheKey = "technologies:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public UpdateTechnologyCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Unit> Handle(UpdateTechnologyCommand request, CancellationToken cancellationToken)
    {
        var technology = await _context.TechnologyItems
            .FirstOrDefaultAsync(t => t.Id == request.Id && !t.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"TechnologyItem with Id '{request.Id}' was not found.");

        technology.Name = request.Name;
        technology.DisplayName = request.DisplayName;
        technology.Category = request.Category;
        technology.DisplayOrder = request.DisplayOrder;
        technology.IsActive = request.IsActive;
        technology.Frameworks = request.Frameworks;
        technology.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return Unit.Value;
    }
}
