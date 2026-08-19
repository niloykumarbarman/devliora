using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;

namespace Devliora.Application.Features.TechnologyDetailPages.Commands.CreateTechnologyDetailPage;

public class CreateTechnologyDetailPageCommandHandler : IRequestHandler<CreateTechnologyDetailPageCommand, Guid>
{
    private readonly IAppDbContext _context;

    public CreateTechnologyDetailPageCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateTechnologyDetailPageCommand request, CancellationToken cancellationToken)
    {
        var page = new TechnologyDetailPage
        {
            Slug = request.Slug,
            TechnologyName = request.TechnologyName,
            MetaDescription = request.MetaDescription,
            DisplayOrder = request.DisplayOrder,
            HeroTitle = request.HeroTitle,
            OverviewHeading = request.OverviewHeading,
            OverviewHeadingAccent = request.OverviewHeadingAccent,
            OverviewParagraph = request.OverviewParagraph,
            HighlightHeadline = request.HighlightHeadline,
            HighlightParagraph = request.HighlightParagraph,
            IndustriesParagraph = request.IndustriesParagraph,
            IndustriesImageUrl = request.IndustriesImageUrl,
            ServicesHeading = request.ServicesHeading,
            ServicesCardLabel = request.ServicesCardLabel,
            ServicesParagraph = request.ServicesParagraph
        };

        foreach (var feature in request.Features)
        {
            page.Features.Add(new TechnologyDetailFeature
            {
                Title = feature.Title,
                Body = feature.Body,
                DisplayOrder = feature.DisplayOrder
            });
        }

        foreach (var faq in request.Faqs)
        {
            page.Faqs.Add(new TechnologyDetailFaq
            {
                Question = faq.Question,
                Answer = faq.Answer,
                DisplayOrder = faq.DisplayOrder
            });
        }

        foreach (var service in request.Services)
        {
            page.Services.Add(new TechnologyDetailServiceCard
            {
                Title = service.Title,
                Description = service.Description,
                DisplayOrder = service.DisplayOrder
            });
        }

        _context.TechnologyDetailPages.Add(page);
        await _context.SaveChangesAsync(cancellationToken);

        return page.Id;
    }
}
