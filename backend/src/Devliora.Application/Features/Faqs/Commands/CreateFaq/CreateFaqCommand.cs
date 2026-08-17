using MediatR;

namespace Devliora.Application.Features.Faqs.Commands.CreateFaq;

public class CreateFaqCommand : IRequest<Guid>
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public string ServiceSlug { get; set; } = string.Empty;
}
