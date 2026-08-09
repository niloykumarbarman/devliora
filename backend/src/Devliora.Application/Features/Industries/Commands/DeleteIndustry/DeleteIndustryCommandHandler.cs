using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Industries.Commands.DeleteIndustry;

public class DeleteIndustryCommandHandler : IRequestHandler<DeleteIndustryCommand, Unit>
{
    private const string CacheKey = "industries:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public DeleteIndustryCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Unit> Handle(DeleteIndustryCommand request, CancellationToken cancellationToken)
    {
        var industry = await _context.Industries
            .FirstOrDefaultAsync(i => i.Id == request.Id && !i.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"Industry with Id '{request.Id}' was not found.");

        industry.IsDeleted = true;
        industry.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return Unit.Value;
    }
}
