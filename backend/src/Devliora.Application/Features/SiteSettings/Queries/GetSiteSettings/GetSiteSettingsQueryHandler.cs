using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.SiteSettings.Queries.GetSiteSettings;

public class GetSiteSettingsQueryHandler : IRequestHandler<GetSiteSettingsQuery, SiteSettingsDto>
{
    private const string CacheKey = "site-settings";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetSiteSettingsQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<SiteSettingsDto> Handle(GetSiteSettingsQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<SiteSettingsDto>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        // Singleton pattern: exactly one SiteSettings row is expected.
        // If none exists yet (e.g. fresh database), create a default row so
        // the public site always has settings to render and the admin panel
        // always has a row to edit.
        var settings = await _context.SiteSettings
            .Where(s => !s.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (settings is null)
        {
            settings = new Domain.Entities.SiteSettings
            {
                LogoUrl = "",
                SiteName = "Devliora",
                PortfolioHeroImageUrl = "",
                IndustriesImageUrl = "",
                ServicesImageUrl = "",
                ServicesBannerImageUrl = "",
                ServicesEngineeringImageUrl = "",
                ServicesTechImageUrl = "",
                ServicesSolutionsImageUrl = ""
            };
            _context.SiteSettings.Add(settings);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var result = new SiteSettingsDto
        {
            Id = settings.Id,
            LogoUrl = settings.LogoUrl,
            SiteName = settings.SiteName,
            PortfolioHeroImageUrl = settings.PortfolioHeroImageUrl,
            IndustriesImageUrl = settings.IndustriesImageUrl,
            ServicesImageUrl = settings.ServicesImageUrl,
            ServicesBannerImageUrl = settings.ServicesBannerImageUrl,
            ServicesEngineeringImageUrl = settings.ServicesEngineeringImageUrl,
            ServicesTechImageUrl = settings.ServicesTechImageUrl,
            ServicesSolutionsImageUrl = settings.ServicesSolutionsImageUrl
        };

        await _cache.SetAsync(CacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
