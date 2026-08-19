using Devliora.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.TechnologyDetailPages.Commands.DeleteTechnologyDetailPage;

public class DeleteTechnologyDetailPageCommandHandler : IRequestHandler<DeleteTechnologyDetailPageCommand, Unit>
{
    private readonly IAppDbContext _context;

    public DeleteTechnologyDetailPageCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteTechnologyDetailPageCommand request, CancellationToken cancellationToken)
    {
        var page = await _context.TechnologyDetailPages
            .FirstOrDefaultAsync(p => p.Id == request.Id && !p.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException($"TechnologyDetailPage with Id '{request.Id}' was not found.");

        page.IsDeleted = true;
        page.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
