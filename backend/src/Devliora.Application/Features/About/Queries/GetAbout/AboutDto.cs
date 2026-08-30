namespace Devliora.Application.Features.About.Queries.GetAbout;

public class AboutCardDto
{
    public Guid Id { get; set; }
    public string IconName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class AboutDto
{
    public Guid Id { get; set; }

    public string HeroHeading { get; set; } = string.Empty;
    public string HeroHeadingAccent { get; set; } = string.Empty;
    public string HeroHeadingSuffix { get; set; } = string.Empty;
    public string HeroSubtitle { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;

    public string MissionHeading { get; set; } = string.Empty;
    public string MissionHeadingAccent { get; set; } = string.Empty;
    public string MissionBody { get; set; } = string.Empty;
    public string MissionCardLabel { get; set; } = string.Empty;
    public string MissionCardBody { get; set; } = string.Empty;
    public string VisionCardLabel { get; set; } = string.Empty;
    public string VisionCardBody { get; set; } = string.Empty;

    public string FounderEyebrow { get; set; } = string.Empty;
    public string FounderName { get; set; } = string.Empty;
    public string FounderRole { get; set; } = string.Empty;
    public string FounderBody { get; set; } = string.Empty;
    public string FounderCtaText { get; set; } = string.Empty;
    public string FounderCtaUrl { get; set; } = string.Empty;

    public string PrinciplesHeading { get; set; } = string.Empty;
    public string PrinciplesHeadingAccent { get; set; } = string.Empty;

    public string CtaHeading { get; set; } = string.Empty;
    public string CtaHeadingAccent { get; set; } = string.Empty;
    public string CtaBody { get; set; } = string.Empty;
    public string CtaButtonText { get; set; } = string.Empty;
    public string CtaButtonUrl { get; set; } = string.Empty;

    public List<AboutCardDto> FounderCards { get; set; } = new();
    public List<AboutCardDto> Principles { get; set; } = new();
}
