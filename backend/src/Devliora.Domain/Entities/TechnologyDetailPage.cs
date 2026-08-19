using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

// Admin-managed content for an individual technology's detail page
// (e.g. /technologies/dot-net-development, /technologies/java-development),
// rendered by the generic [slug] route using the same shared section
// components every such page already relies on (hero, feature grid,
// FAQ, etc.). Covers every piece of *text* content on the page; visual
// choices that aren't text (card gradient, brand icon, or a custom
// visual like Java's code-editor mockup) stay in a small per-slug
// lookup in the frontend route, not here — those are design decisions,
// not content admins are expected to author.
public class TechnologyDetailPage : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string TechnologyName { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public string HeroTitle { get; set; } = string.Empty;

    public string OverviewHeading { get; set; } = string.Empty;
    public string OverviewHeadingAccent { get; set; } = string.Empty;
    public string OverviewParagraph { get; set; } = string.Empty;

    // Optional qualitative "stat banner" stand-in (e.g. Java's
    // "Battle-tested at enterprise scale") — empty headline hides the
    // section, matching pages like .NET's that don't have one.
    public string HighlightHeadline { get; set; } = string.Empty;
    public string HighlightParagraph { get; set; } = string.Empty;

    public string IndustriesParagraph { get; set; } = string.Empty;

    public string ServicesHeading { get; set; } = string.Empty;
    public string ServicesCardLabel { get; set; } = string.Empty;
    public string ServicesParagraph { get; set; } = string.Empty;

    public ICollection<TechnologyDetailFeature> Features { get; set; } = new List<TechnologyDetailFeature>();
    public ICollection<TechnologyDetailFaq> Faqs { get; set; } = new List<TechnologyDetailFaq>();
    public ICollection<TechnologyDetailServiceCard> Services { get; set; } = new List<TechnologyDetailServiceCard>();
}
