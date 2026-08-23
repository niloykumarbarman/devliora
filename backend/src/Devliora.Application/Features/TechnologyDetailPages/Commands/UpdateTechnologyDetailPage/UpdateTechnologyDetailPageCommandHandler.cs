using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.TechnologyDetailPages.Commands.UpdateTechnologyDetailPage;

public class UpdateTechnologyDetailPageCommandHandler : IRequestHandler<UpdateTechnologyDetailPageCommand, Unit>
{
    private readonly IAppDbContext _context;

    public UpdateTechnologyDetailPageCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateTechnologyDetailPageCommand request, CancellationToken cancellationToken)
    {
        var page = await _context.TechnologyDetailPages
            .FirstOrDefaultAsync(p => p.Id == request.Id && !p.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"TechnologyDetailPage with Id '{request.Id}' was not found.");

        page.Slug = request.Slug;
        page.TechnologyName = request.TechnologyName;
        page.MetaDescription = request.MetaDescription;
        page.DisplayOrder = request.DisplayOrder;
        page.PageType = request.PageType;
        page.HeroTitle = request.HeroTitle;
        page.HeroImageUrl = request.HeroImageUrl;
        page.OverviewHeading = request.OverviewHeading;
        page.OverviewHeadingAccent = request.OverviewHeadingAccent;
        page.OverviewHeadingSuffix = request.OverviewHeadingSuffix;
        page.OverviewParagraph = request.OverviewParagraph;
        page.ShowTechnologiesShowcase = request.ShowTechnologiesShowcase;
        page.HighlightHeadline = request.HighlightHeadline;
        page.HighlightParagraph = request.HighlightParagraph;
        page.IndustriesParagraph = request.IndustriesParagraph;
        page.IndustriesImageUrl = request.IndustriesImageUrl;
        page.ServicesHeading = request.ServicesHeading;
        page.ServicesCardLabel = request.ServicesCardLabel;
        page.ServicesParagraph = request.ServicesParagraph;
        page.ServicesCardImageUrl = request.ServicesCardImageUrl;
        page.UpdatedAt = DateTime.UtcNow;

        // Explicit DbSet remove/add (instead of navigation-collection
        // Clear()+Add()) — same replace-all-children pattern as
        // UpdatePortfolioCommandHandler, for the same reason (avoids an
        // EF Core change-tracker ambiguity on this pattern).
        var existingFeatures = await _context.TechnologyDetailFeatures
            .Where(f => f.TechnologyDetailPageId == page.Id)
            .ToListAsync(cancellationToken);
        _context.TechnologyDetailFeatures.RemoveRange(existingFeatures);

        foreach (var feature in request.Features)
        {
            _context.TechnologyDetailFeatures.Add(new TechnologyDetailFeature
            {
                TechnologyDetailPageId = page.Id,
                Title = feature.Title,
                Body = feature.Body,
                DisplayOrder = feature.DisplayOrder
            });
        }

        var existingFaqs = await _context.TechnologyDetailFaqs
            .Where(f => f.TechnologyDetailPageId == page.Id)
            .ToListAsync(cancellationToken);
        _context.TechnologyDetailFaqs.RemoveRange(existingFaqs);

        foreach (var faq in request.Faqs)
        {
            _context.TechnologyDetailFaqs.Add(new TechnologyDetailFaq
            {
                TechnologyDetailPageId = page.Id,
                Question = faq.Question,
                Answer = faq.Answer,
                DisplayOrder = faq.DisplayOrder
            });
        }

        var existingServices = await _context.TechnologyDetailServiceCards
            .Where(s => s.TechnologyDetailPageId == page.Id)
            .ToListAsync(cancellationToken);
        _context.TechnologyDetailServiceCards.RemoveRange(existingServices);

        foreach (var service in request.Services)
        {
            _context.TechnologyDetailServiceCards.Add(new TechnologyDetailServiceCard
            {
                TechnologyDetailPageId = page.Id,
                Title = service.Title,
                Description = service.Description,
                DisplayOrder = service.DisplayOrder
            });
        }

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
