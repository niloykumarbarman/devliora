using Devliora.Application.Features.TechnologyDetailPages.Common;
using MediatR;

namespace Devliora.Application.Features.TechnologyDetailPages.Commands.UpdateTechnologyDetailPage;

public class UpdateTechnologyDetailPageCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string TechnologyName { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public string HeroTitle { get; set; } = string.Empty;

    public string OverviewHeading { get; set; } = string.Empty;
    public string OverviewHeadingAccent { get; set; } = string.Empty;
    public string OverviewParagraph { get; set; } = string.Empty;

    public string HighlightHeadline { get; set; } = string.Empty;
    public string HighlightParagraph { get; set; } = string.Empty;

    public string IndustriesParagraph { get; set; } = string.Empty;
    public string IndustriesImageUrl { get; set; } = string.Empty;

    public string ServicesHeading { get; set; } = string.Empty;
    public string ServicesCardLabel { get; set; } = string.Empty;
    public string ServicesParagraph { get; set; } = string.Empty;

    public List<TechnologyDetailFeatureItem> Features { get; set; } = new();
    public List<TechnologyDetailFaqItem> Faqs { get; set; } = new();
    public List<TechnologyDetailServiceItem> Services { get; set; } = new();
}
