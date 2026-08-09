namespace Devliora.Application.Features.Industries.Queries.GetAllIndustries;

public class IndustryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
