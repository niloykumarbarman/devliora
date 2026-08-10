using Devliora.Application.Features.Services.Common;
using MediatR;

namespace Devliora.Application.Features.Services.Commands.CreateService;

public class CreateServiceCommand : IRequest<Guid>
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public List<string> Includes { get; set; } = new();
    public string IconUrl { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public List<ServiceHighlightItem> Highlights { get; set; } = new();
}
