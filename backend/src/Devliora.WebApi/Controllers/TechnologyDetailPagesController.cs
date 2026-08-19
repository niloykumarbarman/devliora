using Devliora.Application.Features.TechnologyDetailPages.Commands.CreateTechnologyDetailPage;
using Devliora.Application.Features.TechnologyDetailPages.Commands.DeleteTechnologyDetailPage;
using Devliora.Application.Features.TechnologyDetailPages.Commands.UpdateTechnologyDetailPage;
using Devliora.Application.Features.TechnologyDetailPages.Queries.GetAllTechnologyDetailPages;
using Devliora.Application.Features.TechnologyDetailPages.Queries.GetAllTechnologyDetailPagesAdmin;
using Devliora.Application.Features.TechnologyDetailPages.Queries.GetTechnologyDetailPageBySlug;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Devliora.WebApi.Controllers;

[ApiController]
[Route("api/technology-detail-pages")]
public class TechnologyDetailPagesController : ControllerBase
{
    private readonly ISender _sender;

    public TechnologyDetailPagesController(ISender sender)
    {
        _sender = sender;
    }

    // Lightweight public listing (slug/name/title only) — powers
    // /technologies' "Explore our technology pages" section so a newly
    // created page is discoverable without knowing its exact URL.
    [HttpGet]
    public async Task<ActionResult<List<TechnologyDetailPageSummaryDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllTechnologyDetailPagesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<TechnologyDetailPageDto>> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetTechnologyDetailPageBySlugQuery { Slug = slug }, cancellationToken);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<AdminTechnologyDetailPageDto>>> GetAllForAdmin(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllTechnologyDetailPagesAdminQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Guid>> Create(CreateTechnologyDetailPageCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetAllForAdmin), new { id }, id);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, UpdateTechnologyDetailPageCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest(new { error = "Route id and body id must match." });
        await _sender.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteTechnologyDetailPageCommand { Id = id }, cancellationToken);
        return NoContent();
    }
}
