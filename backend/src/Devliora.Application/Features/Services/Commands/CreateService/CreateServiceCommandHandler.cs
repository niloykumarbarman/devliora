using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;

namespace Devliora.Application.Features.Services.Commands.CreateService;

public class CreateServiceCommandHandler : IRequestHandler<CreateServiceCommand, Guid>
{
    private const string CacheKey = "services:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public CreateServiceCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Guid> Handle(CreateServiceCommand request, CancellationToken cancellationToken)
    {
        var service = new Service
        {
            Title = request.Title,
            Slug = request.Slug,
            ShortDescription = request.ShortDescription,
            FullDescription = request.FullDescription,
            Includes = request.Includes,
            IconUrl = request.IconUrl,
            HeroImageUrl = request.HeroImageUrl,
            DisplayOrder = request.DisplayOrder
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return service.Id;
    }
}
