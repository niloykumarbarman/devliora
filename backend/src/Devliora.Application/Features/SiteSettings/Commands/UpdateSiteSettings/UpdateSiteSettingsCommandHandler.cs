using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.SiteSettings.Commands.UpdateSiteSettings;

public class UpdateSiteSettingsCommandHandler : IRequestHandler<UpdateSiteSettingsCommand, Unit>
{
    private const string CacheKey = "site-settings";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public UpdateSiteSettingsCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Unit> Handle(UpdateSiteSettingsCommand request, CancellationToken cancellationToken)
    {
        var settings = await _context.SiteSettings
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"SiteSettings with Id '{request.Id}' was not found.");

        settings.LogoUrl = request.LogoUrl;
        settings.SiteName = request.SiteName;
        settings.PortfolioHeroImageUrl = request.PortfolioHeroImageUrl;
        settings.IndustriesImageUrl = request.IndustriesImageUrl;
        settings.ServicesImageUrl = request.ServicesImageUrl;
        settings.ServicesBannerImageUrl = request.ServicesBannerImageUrl;
        settings.ServicesEngineeringImageUrl = request.ServicesEngineeringImageUrl;
        settings.ServicesTechImageUrl = request.ServicesTechImageUrl;
        settings.ServicesSolutionsImageUrl = request.ServicesSolutionsImageUrl;
        settings.TechnologiesHeroImageUrl = request.TechnologiesHeroImageUrl;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return Unit.Value;
    }
}
