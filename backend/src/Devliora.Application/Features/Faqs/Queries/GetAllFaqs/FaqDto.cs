namespace Devliora.Application.Features.Faqs.Queries.GetAllFaqs;

public class FaqDto
{
    public Guid Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public string ServiceSlug { get; set; } = string.Empty;
}
