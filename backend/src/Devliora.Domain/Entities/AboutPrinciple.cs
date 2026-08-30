using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

// One card in the /about "How Devliora actually works" principles grid.
// IconName: kebab-case lucide-react key, resolved on the frontend.
public class AboutPrinciple : BaseEntity
{
    public string IconName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public Guid AboutContentId { get; set; }
    public AboutContent AboutContent { get; set; } = null!;
}
