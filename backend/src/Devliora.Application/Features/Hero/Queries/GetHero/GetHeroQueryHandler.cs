using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Hero.Queries.GetHero;

public class GetHeroQueryHandler : IRequestHandler<GetHeroQuery, HeroDto>
{
    private const string CacheKey = "hero:content";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetHeroQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<HeroDto> Handle(GetHeroQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<HeroDto>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        // Singleton pattern: exactly one HeroContent row is expected.
        // If none exists yet (e.g. fresh database), create a default row so
        // the public site always has content to render and the admin panel
        // always has a row to edit.
        var hero = await _context.HeroContents
            .Include(h => h.TelemetryPills)
            .Where(h => !h.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (hero is null)
        {
            hero = new HeroContent
            {
                Title = "Enterprise Software, Engineered Right",
                Subtitle = "We design, build, and scale mission-critical systems for ambitious companies.",
                PrimaryCtaText = "Book a Consultation",
                PrimaryCtaUrl = "#contact",
                SecondaryCtaText = "View Our Work",
                SecondaryCtaUrl = "/portfolio",
                BackgroundImageUrl = "/uploads/hero-placeholder.jpg",
                BackgroundVideoUrl = ""
            };
            _context.HeroContents.Add(hero);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var result = new HeroDto
        {
            Id = hero.Id,
            Title = hero.Title,
            Subtitle = hero.Subtitle,
            PrimaryCtaText = hero.PrimaryCtaText,
            PrimaryCtaUrl = hero.PrimaryCtaUrl,
            SecondaryCtaText = hero.SecondaryCtaText,
            SecondaryCtaUrl = hero.SecondaryCtaUrl,
            BackgroundImageUrl = hero.BackgroundImageUrl,
            BackgroundVideoUrl = hero.BackgroundVideoUrl,
            TelemetryPills = hero.TelemetryPills
                .OrderBy(p => p.DisplayOrder)
                .Select(p => new TelemetryPillDto
                {
                    Id = p.Id,
                    Label = p.Label,
                    Accent = p.Accent.ToString(),
                    Top = p.Top,
                    Left = p.Left,
                    DisplayOrder = p.DisplayOrder
                })
                .ToList()
        };

        await _cache.SetAsync(CacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
