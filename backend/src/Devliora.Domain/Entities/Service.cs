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
}
