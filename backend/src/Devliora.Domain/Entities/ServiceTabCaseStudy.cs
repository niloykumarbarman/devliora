using Devliora.Domain.Common;

namespace Devliora.Domain.Entities;

// Curates which real, admin-managed CaseStudy entries show in a given
// Service's per-tab (Web/Mobile/Enterprise — matches the frontend's
// SERVICE_TABS labels) "Success Stats" case-studies grid, instead of
// always falling back to the site's newest 4 case studies on every tab.
public class ServiceTabCaseStudy : BaseEntity
{
    public Guid ServiceId { get; set; }
    public Service Service { get; set; } = null!;
    public string Tab { get; set; } = string.Empty;
    public Guid CaseStudyId { get; set; }
    public CaseStudy CaseStudy { get; set; } = null!;
    public int DisplayOrder { get; set; }
}
