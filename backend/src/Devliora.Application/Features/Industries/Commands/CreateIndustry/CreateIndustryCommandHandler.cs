using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;

namespace Devliora.Application.Features.Industries.Commands.CreateIndustry;

public class CreateIndustryCommandHandler : IRequestHandler<CreateIndustryCommand, Guid>
{
    private const string CacheKey = "industries:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public CreateIndustryCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Guid> Handle(CreateIndustryCommand request, CancellationToken cancellationToken)
    {
        var industry = new Industry
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            DisplayOrder = request.DisplayOrder
        };

        foreach (var stat in request.Stats)
        {
            industry.Stats.Add(new IndustryStat
            {
                Value = stat.Value,
                Label = stat.Label,
                Source = stat.Source,
                DisplayOrder = stat.DisplayOrder
            });
        }

        _context.Industries.Add(industry);
        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return industry.Id;
    }
}
