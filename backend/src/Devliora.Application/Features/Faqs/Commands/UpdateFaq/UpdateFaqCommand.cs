using MediatR;

namespace Devliora.Application.Features.Faqs.Commands.UpdateFaq;

public class UpdateFaqCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public string ServiceSlug { get; set; } = string.Empty;
}
