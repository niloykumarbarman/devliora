using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.About.Queries.GetAbout;

public class GetAboutQueryHandler : IRequestHandler<GetAboutQuery, AboutDto>
{
    private const string CacheKey = "about:content";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetAboutQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<AboutDto> Handle(GetAboutQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<AboutDto>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        // Singleton: one AboutContent row. Seed it from the copy the page
        // shipped with so a fresh database renders /about unchanged and
        // the admin panel has a row to edit.
        var about = await _context.AboutContents
            .Include(a => a.FounderCards)
            .Include(a => a.Principles)
            .Where(a => !a.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (about is null)
        {
            about = BuildDefault();
            _context.AboutContents.Add(about);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var result = new AboutDto
        {
            Id = about.Id,
            HeroHeading = about.HeroHeading,
            HeroHeadingAccent = about.HeroHeadingAccent,
            HeroHeadingSuffix = about.HeroHeadingSuffix,
            HeroSubtitle = about.HeroSubtitle,
            HeroImageUrl = about.HeroImageUrl,
            MissionHeading = about.MissionHeading,
            MissionHeadingAccent = about.MissionHeadingAccent,
            MissionBody = about.MissionBody,
            MissionCardLabel = about.MissionCardLabel,
            MissionCardBody = about.MissionCardBody,
            VisionCardLabel = about.VisionCardLabel,
            VisionCardBody = about.VisionCardBody,
            FounderEyebrow = about.FounderEyebrow,
            FounderName = about.FounderName,
            FounderRole = about.FounderRole,
            FounderBody = about.FounderBody,
            FounderCtaText = about.FounderCtaText,
            FounderCtaUrl = about.FounderCtaUrl,
            PrinciplesHeading = about.PrinciplesHeading,
            PrinciplesHeadingAccent = about.PrinciplesHeadingAccent,
            CtaHeading = about.CtaHeading,
            CtaHeadingAccent = about.CtaHeadingAccent,
            CtaBody = about.CtaBody,
            CtaButtonText = about.CtaButtonText,
            CtaButtonUrl = about.CtaButtonUrl,
            FounderCards = about.FounderCards
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new AboutCardDto
                {
                    Id = c.Id,
                    IconName = c.IconName,
                    Title = c.Title,
                    Body = c.Body,
                    DisplayOrder = c.DisplayOrder
                })
                .ToList(),
            Principles = about.Principles
                .OrderBy(p => p.DisplayOrder)
                .Select(p => new AboutCardDto
                {
                    Id = p.Id,
                    IconName = p.IconName,
                    Title = p.Title,
                    Body = p.Detail,
                    DisplayOrder = p.DisplayOrder
                })
                .ToList()
        };

        await _cache.SetAsync(CacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }

    private static AboutContent BuildDefault() => new()
    {
        HeroHeading = "Founder-led.",
        HeroHeadingAccent = "Production-grade.",
        HeroHeadingSuffix = "No shortcuts.",
        HeroSubtitle =
            "Devliora is built and led by Niloy Kumar Barman — a software engineer who believes enterprise clients deserve the same security, transparency, and engineering rigor that large teams promise but rarely deliver in full.",

        MissionHeading = "Most agencies sell a team.",
        MissionHeadingAccent = "Devliora sells a standard.",
        MissionBody = string.Join("\n\n", new[]
        {
            "Devliora started from a simple frustration: enterprise clients are routinely sold “best practices” that never make it past the sales deck — rate-limited auth that isn’t actually rate-limited, audit logs that don’t audit anything, caching layers that were never cache-invalidated correctly.",
            "Every claim on this site is backed by a running system: this website and its API, which use the same refresh-token rotation with revocation, per-IP rate limiting, Redis cache-aside, and reviewable commit history that client engagements do.",
            "The goal isn’t to look like a large agency. It’s to build software the way a large agency should, without the overhead — and to be honest about what that does and doesn’t mean for you as a client."
        }),
        MissionCardLabel = "Our Mission",
        MissionCardBody =
            "To build enterprise software the way it’s specified, not the way it’s marketed — security that’s actually enforced, performance that holds under real load, and a commit history a client can read for themselves.",
        VisionCardLabel = "Our Vision",
        VisionCardBody =
            "A standard where no enterprise client ever has to wonder if their vendor actually did the work they paid for.",

        FounderEyebrow = "Who runs it",
        FounderName = "Niloy Kumar Barman",
        FounderRole = "Founder & Software Engineer",
        FounderBody = string.Join("\n\n", new[]
        {
            "Devliora is founder-led. Niloy started it to work the way he thought enterprise software should be built — with security, performance, and transparency treated as requirements rather than things to discuss later — and without the layers of account management that put distance between a client and the people writing the code.",
            "He sets the engineering standards the company works to and stays hands-on with architecture across engagements, supported by delivery teams in Bangladesh and Australia. This website and the API behind it are Devliora’s own build, end to end — a working reference for the practices described on this page rather than a claim about them."
        }),
        FounderCtaText = "Talk to the person who would build it",
        FounderCtaUrl = "/contact",

        PrinciplesHeading = "How Devliora",
        PrinciplesHeadingAccent = "actually works.",

        CtaHeading = "Want to see how this",
        CtaHeadingAccent = "holds up under your project?",
        CtaBody = "Send a message and Niloy will personally reply within 48 hours with an honest read on scope and approach.",
        CtaButtonText = "Get in touch",
        CtaButtonUrl = "/contact",

        FounderCards = new List<AboutFounderCard>
        {
            new() { IconName = "boxes", Title = "Architecture on every engagement", DisplayOrder = 0,
                Body = "The data model, service boundaries, and API contracts on client work are reviewed and signed off by the founder, not delegated and hoped for." },
            new() { IconName = "shield-check", Title = "The security defaults", DisplayOrder = 1,
                Body = "Short-lived access tokens, refresh-token rotation with revocation, per-IP rate limiting on auth, and audit logging on every mutation ship as the baseline — the same setup this site runs on." },
            new() { IconName = "git-branch", Title = "How the work is shown", DisplayOrder = 2,
                Body = "Small, reviewable commits on a visible cadence, CI on every change, and client access to the real history and build results throughout." }
        },
        Principles = new List<AboutPrinciple>
        {
            new() { IconName = "shield-check", Title = "Security by default", DisplayOrder = 0,
                Detail = "Password hashing, short-lived access tokens, rotating and revocable refresh tokens, per-IP rate limiting on auth endpoints — configured before a single feature is built." },
            new() { IconName = "git-commit", Title = "Transparent history", DisplayOrder = 1,
                Detail = "Every feature ships as a reviewable commit on a public, linear history. No squashed mystery commits, no hidden branches." },
            new() { IconName = "gauge", Title = "Performance as a requirement", DisplayOrder = 2,
                Detail = "Redis cache-aside on every domain entity from day one, not bolted on after a client complains about load times." },
            new() { IconName = "message-square", Title = "Direct communication", DisplayOrder = 3,
                Detail = "One engineer, one point of contact. Questions get a real answer within 48 hours, not routed through account managers." }
        }
    };
}
