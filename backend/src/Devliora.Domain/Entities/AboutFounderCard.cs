using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

// One "what the founder is accountable for" card in the /about Founder
// section. IconName is a kebab-case lucide-react icon key resolved to a
// component on the frontend (with a fallback), so admins pick from a
// known set without the backend caring about icon rendering.
public class AboutFounderCard : BaseEntity
{
    public string IconName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public Guid AboutContentId { get; set; }
    public AboutContent AboutContent { get; set; } = null!;
}
