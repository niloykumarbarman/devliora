namespace Devliora.Application.Features.Services.Common;

// Shared shape for both read (ServiceDto/AdminServiceDto — denormalized
// CaseStudy fields included so the frontend/admin can render without a
// second lookup) and write (Update/CreateServiceCommand — only Tab,
// CaseStudyId, and DisplayOrder are consumed; the rest are ignored).
public class ServiceTabCaseStudyItem
{
    public string Tab { get; set; } = string.Empty;
    public Guid CaseStudyId { get; set; }
    public int DisplayOrder { get; set; }
    public string CaseStudyTitle { get; set; } = string.Empty;
    public string CaseStudySlug { get; set; } = string.Empty;
    public string CaseStudyIndustry { get; set; } = string.Empty;
    public string CaseStudyResults { get; set; } = string.Empty;
    public string CaseStudyCoverImageUrl { get; set; } = string.Empty;
}
