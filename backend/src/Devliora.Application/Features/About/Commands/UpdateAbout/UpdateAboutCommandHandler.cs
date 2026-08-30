using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.About.Commands.UpdateAbout;

public class UpdateAboutCommandHandler : IRequestHandler<UpdateAboutCommand, Unit>
{
    private const string CacheKey = "about:content";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public UpdateAboutCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Unit> Handle(UpdateAboutCommand request, CancellationToken cancellationToken)
    {
        var about = await _context.AboutContents
            .Include(a => a.FounderCards)
            .Include(a => a.Principles)
            .FirstOrDefaultAsync(a => a.Id == request.Id && !a.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"AboutContent with Id '{request.Id}' was not found.");

        about.HeroHeading = request.HeroHeading;
        about.HeroHeadingAccent = request.HeroHeadingAccent;
        about.HeroHeadingSuffix = request.HeroHeadingSuffix;
        about.HeroSubtitle = request.HeroSubtitle;
        about.HeroImageUrl = request.HeroImageUrl;

        about.MissionHeading = request.MissionHeading;
        about.MissionHeadingAccent = request.MissionHeadingAccent;
        about.MissionBody = request.MissionBody;
        about.MissionCardLabel = request.MissionCardLabel;
        about.MissionCardBody = request.MissionCardBody;
        about.VisionCardLabel = request.VisionCardLabel;
        about.VisionCardBody = request.VisionCardBody;

        about.FounderEyebrow = request.FounderEyebrow;
        about.FounderName = request.FounderName;
        about.FounderRole = request.FounderRole;
        about.FounderBody = request.FounderBody;
        about.FounderCtaText = request.FounderCtaText;
        about.FounderCtaUrl = request.FounderCtaUrl;

        about.PrinciplesHeading = request.PrinciplesHeading;
        about.PrinciplesHeadingAccent = request.PrinciplesHeadingAccent;

        about.CtaHeading = request.CtaHeading;
        about.CtaHeadingAccent = request.CtaHeadingAccent;
        about.CtaBody = request.CtaBody;
        about.CtaButtonText = request.CtaButtonText;
        about.CtaButtonUrl = request.CtaButtonUrl;

        about.UpdatedAt = DateTime.UtcNow;

        // Replace both card lists. Delete the old rows through the DbSet
        // and insert fresh ones through the DbSet (not the nav
        // collection) so EF unambiguously tracks the new rows as Added
        // rather than Modified.
        _context.AboutFounderCards.RemoveRange(about.FounderCards);
        _context.AboutPrinciples.RemoveRange(about.Principles);
        about.FounderCards.Clear();
        about.Principles.Clear();

        var fo = 0;
        foreach (var card in request.FounderCards)
        {
            _context.AboutFounderCards.Add(new AboutFounderCard
            {
                Id = Guid.NewGuid(),
                IconName = card.IconName,
                Title = card.Title,
                Body = card.Body,
                DisplayOrder = fo,
                AboutContentId = about.Id
            });
            fo++;
        }

        var po = 0;
        foreach (var card in request.Principles)
        {
            _context.AboutPrinciples.Add(new AboutPrinciple
            {
                Id = Guid.NewGuid(),
                IconName = card.IconName,
                Title = card.Title,
                Detail = card.Body,
                DisplayOrder = po,
                AboutContentId = about.Id
            });
            po++;
        }

        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return Unit.Value;
    }
}
