using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

public class Service : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public List<string> Includes { get; set; } = new();
    public string IconUrl { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // "Benefits of X" card grid (heading + intro description, then each
    // Highlight rendered as its own underlined title + paragraph, in a
    // 3-column grid that wraps to 2 on the last row) — set HighlightsHeading
    // to opt into this design; leave it blank and the section falls back
    // to the older "{title} at a glance" 2-column label/description list,
    // so services that already have Highlights entered (e.g. Digital
    // Design) keep rendering exactly as before. HighlightsHeading supports
    // wrapping a segment in {curly braces} to render it in the ember
    // accent color, same convention as IndustriesHeading below.
    public string HighlightsHeading { get; set; } = string.Empty;
    public string HighlightsDescription { get; set; } = string.Empty;
    public ICollection<ServiceHighlight> Highlights { get; set; } = new List<ServiceHighlight>();

    // "Tools we work with" section: heading/description (2-column intro),
    // an italic tagline underneath, and a row of tool brand icons
    // (ToolNames entries are lowercase techIcons.ts keys; anything with
    // no matching icon renders as a plain text badge instead).
    public string ToolsHeading { get; set; } = string.Empty;
    public string ToolsDescription { get; set; } = string.Empty;
    public string ToolsTagline { get; set; } = string.Empty;
    public List<string> ToolNames { get; set; } = new();

    // "Process" horizontal timeline: ordered step labels, with an optional
    // contiguous sub-range (start index + count) drawn as a dashed
    // "iteration" box — e.g. steps 1-4 of 6 grouped under "Design iteration".
    // ProcessGroupCount = 0 means no group box is drawn.
    public List<string> ProcessSteps { get; set; } = new();
    public int ProcessGroupStart { get; set; }
    public int ProcessGroupCount { get; set; }
    public string ProcessGroupLabel { get; set; } = string.Empty;

    // "Crafting exceptional ... across industries" image-card grid:
    // heading (wrap a segment in {curly braces} to render it in the
    // ember accent color), italic tagline, description, then the cards.
    public string IndustriesHeading { get; set; } = string.Empty;
    public string IndustriesTagline { get; set; } = string.Empty;
    public string IndustriesDescription { get; set; } = string.Empty;
    public ICollection<ServiceIndustryCard> IndustryCards { get; set; } = new List<ServiceIndustryCard>();

    // Per-tab curated case studies for the tab-specific "Success Stats"
    // grid — see ServiceTabCaseStudy.
    public ICollection<ServiceTabCaseStudy> TabCaseStudies { get; set; } = new List<ServiceTabCaseStudy>();
}
