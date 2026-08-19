using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.TechnologyDetailPages.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.TechnologyDetailPages.Queries.GetAllTechnologyDetailPagesAdmin;

public class GetAllTechnologyDetailPagesAdminQueryHandler
    : IRequestHandler<GetAllTechnologyDetailPagesAdminQuery, List<AdminTechnologyDetailPageDto>>
{
    private readonly IAppDbContext _context;

    public GetAllTechnologyDetailPagesAdminQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminTechnologyDetailPageDto>> Handle(
        GetAllTechnologyDetailPagesAdminQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.TechnologyDetailPages
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new AdminTechnologyDetailPageDto
            {
                Id = p.Id,
                Slug = p.Slug,
                TechnologyName = p.TechnologyName,
                MetaDescription = p.MetaDescription,
                DisplayOrder = p.DisplayOrder,
                HeroTitle = p.HeroTitle,
                HeroImageUrl = p.HeroImageUrl,
                OverviewHeading = p.OverviewHeading,
                OverviewHeadingAccent = p.OverviewHeadingAccent,
                OverviewParagraph = p.OverviewParagraph,
                HighlightHeadline = p.HighlightHeadline,
                HighlightParagraph = p.HighlightParagraph,
                IndustriesParagraph = p.IndustriesParagraph,
                IndustriesImageUrl = p.IndustriesImageUrl,
                ServicesHeading = p.ServicesHeading,
                ServicesCardLabel = p.ServicesCardLabel,
                ServicesParagraph = p.ServicesParagraph,
                ServicesCardImageUrl = p.ServicesCardImageUrl,
                Features = p.Features
                    .OrderBy(f => f.DisplayOrder)
                    .Select(f => new TechnologyDetailFeatureItem { Title = f.Title, Body = f.Body, DisplayOrder = f.DisplayOrder })
                    .ToList(),
                Faqs = p.Faqs
                    .OrderBy(f => f.DisplayOrder)
                    .Select(f => new TechnologyDetailFaqItem { Question = f.Question, Answer = f.Answer, DisplayOrder = f.DisplayOrder })
                    .ToList(),
                Services = p.Services
                    .OrderBy(s => s.DisplayOrder)
                    .Select(s => new TechnologyDetailServiceItem { Title = s.Title, Description = s.Description, DisplayOrder = s.DisplayOrder })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
