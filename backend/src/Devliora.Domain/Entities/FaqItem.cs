using Devliora.Domain.Common;
namespace Devliora.Domain.Entities;
public class FaqItem : BaseEntity
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Empty (default) = shows in the site-wide FAQ section on the
    // homepage, same as before this field existed. Set to a service's
    // slug (e.g. "ai-development") to scope it to that service's detail
    // page instead — see GetAllFaqsQueryHandler's ServiceSlug filter.
    public string ServiceSlug { get; set; } = string.Empty;
}
