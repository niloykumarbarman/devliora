using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.Services.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Services.Queries.GetAllServicesAdmin;

public class GetAllServicesAdminQueryHandler : IRequestHandler<GetAllServicesAdminQuery, List<AdminServiceDto>>
{
    private readonly IAppDbContext _context;

    public GetAllServicesAdminQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminServiceDto>> Handle(GetAllServicesAdminQuery request, CancellationToken cancellationToken)
    {
        // Admin view: no IsActive/IsDeleted filtering, and no caching, so
        // the admin panel always reflects the latest true database state.
        return await _context.Services
            .Where(s => !s.IsDeleted)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new AdminServiceDto
            {
                Id = s.Id,
                Title = s.Title,
                Slug = s.Slug,
                ShortDescription = s.ShortDescription,
                FullDescription = s.FullDescription,
                Includes = s.Includes,
                IconUrl = s.IconUrl,
                HeroImageUrl = s.HeroImageUrl,
                DisplayOrder = s.DisplayOrder,
                IsActive = s.IsActive,
                HighlightsHeading = s.HighlightsHeading,
                HighlightsDescription = s.HighlightsDescription,
                Highlights = s.Highlights
                    .OrderBy(h => h.DisplayOrder)
                    .Select(h => new ServiceHighlightItem { Label = h.Label, Description = h.Description, DisplayOrder = h.DisplayOrder })
                    .ToList(),
                ToolsHeading = s.ToolsHeading,
                ToolsDescription = s.ToolsDescription,
                ToolsTagline = s.ToolsTagline,
                ToolNames = s.ToolNames,
                ProcessSteps = s.ProcessSteps,
                ProcessGroupStart = s.ProcessGroupStart,
                ProcessGroupCount = s.ProcessGroupCount,
                ProcessGroupLabel = s.ProcessGroupLabel,
                IndustriesHeading = s.IndustriesHeading,
                IndustriesTagline = s.IndustriesTagline,
                IndustriesDescription = s.IndustriesDescription,
                IndustryCards = s.IndustryCards
                    .OrderBy(c => c.DisplayOrder)
                    .Select(c => new ServiceIndustryCardItem { ImageUrl = c.ImageUrl, Title = c.Title, Description = c.Description, DisplayOrder = c.DisplayOrder })
                    .ToList(),
                // Admin view intentionally skips the IsPublished/IsDeleted
                // filter GetAllServicesQueryHandler applies, so an admin
                // editing this service can still see (and fix) a
                // selection that points at an unpublished case study.
                TabCaseStudies = s.TabCaseStudies
                    .OrderBy(t => t.Tab).ThenBy(t => t.DisplayOrder)
                    .Select(t => new ServiceTabCaseStudyItem
                    {
                        Tab = t.Tab,
                        CaseStudyId = t.CaseStudyId,
                        DisplayOrder = t.DisplayOrder,
                        CaseStudyTitle = t.CaseStudy.Title,
                        CaseStudySlug = t.CaseStudy.Slug,
                        CaseStudyIndustry = t.CaseStudy.Industry,
                        CaseStudyResults = t.CaseStudy.Results,
                        CaseStudyCoverImageUrl = t.CaseStudy.CoverImageUrl
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
