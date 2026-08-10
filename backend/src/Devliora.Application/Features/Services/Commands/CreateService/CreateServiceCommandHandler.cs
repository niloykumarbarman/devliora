using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using MediatR;

namespace Devliora.Application.Features.Services.Commands.CreateService;

public class CreateServiceCommandHandler : IRequestHandler<CreateServiceCommand, Guid>
{
    private const string CacheKey = "services:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public CreateServiceCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Guid> Handle(CreateServiceCommand request, CancellationToken cancellationToken)
    {
        var service = new Service
        {
            Title = request.Title,
            Slug = request.Slug,
            ShortDescription = request.ShortDescription,
            FullDescription = request.FullDescription,
            Includes = request.Includes,
            IconUrl = request.IconUrl,
            HeroImageUrl = request.HeroImageUrl,
            DisplayOrder = request.DisplayOrder,
            ToolsHeading = request.ToolsHeading,
            ToolsDescription = request.ToolsDescription,
            ToolsTagline = request.ToolsTagline,
            ToolNames = request.ToolNames,
            ProcessSteps = request.ProcessSteps,
            ProcessGroupStart = request.ProcessGroupStart,
            ProcessGroupCount = request.ProcessGroupCount,
            ProcessGroupLabel = request.ProcessGroupLabel,
            IndustriesHeading = request.IndustriesHeading,
            IndustriesTagline = request.IndustriesTagline,
            IndustriesDescription = request.IndustriesDescription
        };

        foreach (var highlight in request.Highlights)
        {
            service.Highlights.Add(new ServiceHighlight
            {
                Label = highlight.Label,
                Description = highlight.Description,
                DisplayOrder = highlight.DisplayOrder
            });
        }

        foreach (var card in request.IndustryCards)
        {
            service.IndustryCards.Add(new ServiceIndustryCard
            {
                ImageUrl = card.ImageUrl,
                Title = card.Title,
                Description = card.Description,
                DisplayOrder = card.DisplayOrder
            });
        }

        _context.Services.Add(service);
        await _context.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync(CacheKey, cancellationToken);

        return service.Id;
    }
}
