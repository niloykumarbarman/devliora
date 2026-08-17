using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.Faqs.Commands.UpdateFaq;

public class UpdateFaqCommandHandler : IRequestHandler<UpdateFaqCommand, Unit>
{
    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public UpdateFaqCommandHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Unit> Handle(UpdateFaqCommand request, CancellationToken cancellationToken)
    {
        var faq = await _context.FaqItems
            .FirstOrDefaultAsync(f => f.Id == request.Id && !f.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"FaqItem with Id '{request.Id}' was not found.");

        var previousServiceSlug = faq.ServiceSlug;

        faq.Question = request.Question;
        faq.Answer = request.Answer;
        faq.DisplayOrder = request.DisplayOrder;
        faq.IsActive = request.IsActive;
        faq.ServiceSlug = request.ServiceSlug;
        faq.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Invalidate both the old and new ServiceSlug's cached list, in
        // case this edit moved the FAQ between the site-wide list and a
        // service-scoped one (or vice versa).
        await _cache.RemoveAsync($"faqs:all:{previousServiceSlug}", cancellationToken);
        if (request.ServiceSlug != previousServiceSlug)
        {
            await _cache.RemoveAsync($"faqs:all:{request.ServiceSlug}", cancellationToken);
        }

        return Unit.Value;
    }
}
