using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

// Singleton (one row) editorial content for the /about page. Headings
// are split into a plain part + an accent part (rendered in the signal
// colour) + an optional suffix, matching the hand-written markup the
// page used before it became admin-managed. Multi-paragraph bodies are
// stored as one string and split on blank lines when rendered.
public class AboutContent : BaseEntity
{
    // Hero
    public string HeroHeading { get; set; } = string.Empty;
    public string HeroHeadingAccent { get; set; } = string.Empty;
    public string HeroHeadingSuffix { get; set; } = string.Empty;
    public string HeroSubtitle { get; set; } = string.Empty;

    // Optional background photo behind the hero heading. Empty => the
    // plain dark grid backdrop.
    public string HeroImageUrl { get; set; } = string.Empty;

    // Mission
    public string MissionHeading { get; set; } = string.Empty;
    public string MissionHeadingAccent { get; set; } = string.Empty;
    public string MissionBody { get; set; } = string.Empty;
    public string MissionCardLabel { get; set; } = string.Empty;
    public string MissionCardBody { get; set; } = string.Empty;
    public string VisionCardLabel { get; set; } = string.Empty;
    public string VisionCardBody { get; set; } = string.Empty;

    // Founder
    public string FounderEyebrow { get; set; } = string.Empty;
    public string FounderName { get; set; } = string.Empty;
    public string FounderRole { get; set; } = string.Empty;
    public string FounderBody { get; set; } = string.Empty;
    public string FounderCtaText { get; set; } = string.Empty;
    public string FounderCtaUrl { get; set; } = string.Empty;

    // Principles
    public string PrinciplesHeading { get; set; } = string.Empty;
    public string PrinciplesHeadingAccent { get; set; } = string.Empty;

    // Closing CTA
    public string CtaHeading { get; set; } = string.Empty;
    public string CtaHeadingAccent { get; set; } = string.Empty;
    public string CtaBody { get; set; } = string.Empty;
    public string CtaButtonText { get; set; } = string.Empty;
    public string CtaButtonUrl { get; set; } = string.Empty;

    public ICollection<AboutFounderCard> FounderCards { get; set; } = new List<AboutFounderCard>();
    public ICollection<AboutPrinciple> Principles { get; set; } = new List<AboutPrinciple>();
}
