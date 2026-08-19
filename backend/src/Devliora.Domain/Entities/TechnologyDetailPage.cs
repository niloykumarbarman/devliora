using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

// Admin-managed content for an individual technology's detail page
// (e.g. /technologies/dot-net-development, /technologies/java-development),
// rendered by the generic [slug] route using the same shared section
// components every such page already relies on (hero, feature grid,
// FAQ, etc.). Covers every piece of *text* content on the page, plus
// optional per-page image overrides (Industries, Services card) for the
// sections that have one. Non-image visual choices (the Services card's
// gradient/brand icon fallback, or a custom coded visual like Java's
// code-editor mockup) stay in a small per-slug lookup in the frontend
// route, not here — those are design decisions, not content admins are
// expected to author, and only apply when no image override is set.
public class TechnologyDetailPage : BaseEntity
{
    public string Slug { get; set; } = string.Empty;
    public string TechnologyName { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public string HeroTitle { get; set; } = string.Empty;

    // Optional per-page override for the hero banner background image.
    // Empty falls back to the shared SiteSettings.TechnologiesHeroImageUrl
    // (same image the /technologies index page uses).
    public string HeroImageUrl { get; set; } = string.Empty;

    public string OverviewHeading { get; set; } = string.Empty;
    public string OverviewHeadingAccent { get; set; } = string.Empty;
    public string OverviewParagraph { get; set; } = string.Empty;

    // Optional qualitative "stat banner" stand-in (e.g. Java's
    // "Battle-tested at enterprise scale") — empty headline hides the
    // section, matching pages like .NET's that don't have one.
    public string HighlightHeadline { get; set; } = string.Empty;
    public string HighlightParagraph { get; set; } = string.Empty;

    public string IndustriesParagraph { get; set; } = string.Empty;

    // Optional per-page override for the Industries & Verticals Served
    // image. Empty falls back to the shared SiteSettings.IndustriesImageUrl
    // (same image the /industries page uses) — that's still the default
    // for every page that hasn't set one of its own.
    public string IndustriesImageUrl { get; set; } = string.Empty;

    public string ServicesHeading { get; set; } = string.Empty;
    public string ServicesCardLabel { get; set; } = string.Empty;
    public string ServicesParagraph { get; set; } = string.Empty;

    // Optional per-page image for the "Development Services" card.
    // Empty falls back to the per-slug code default (gradient+brand icon
    // for .NET, a coded code-editor mockup for Java) in the frontend
    // route's lookup table.
    public string ServicesCardImageUrl { get; set; } = string.Empty;

    public ICollection<TechnologyDetailFeature> Features { get; set; } = new List<TechnologyDetailFeature>();
    public ICollection<TechnologyDetailFaq> Faqs { get; set; } = new List<TechnologyDetailFaq>();
    public ICollection<TechnologyDetailServiceCard> Services { get; set; } = new List<TechnologyDetailServiceCard>();
}
