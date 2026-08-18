using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;

namespace Devliora.Application.Features.Technologies.Commands.CreateTechnology;

public class CreateTechnologyCommandHandler : IRequestHandler<CreateTechnologyCommand, Guid>
{
    private const string CacheKey = "technologies:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public CreateTechnologyCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Guid> Handle(CreateTechnologyCommand request, CancellationToken cancellationToken)
    {
        var technology = new TechnologyItem
        {
            Name = request.Name,
            DisplayName = request.DisplayName,
            Category = request.Category,
            DisplayOrder = request.DisplayOrder,
            Frameworks = request.Frameworks
        };

        _context.TechnologyItems.Add(technology);
        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return technology.Id;
    }
}
