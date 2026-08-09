using Devliora.Application.Features.Industries.Commands.CreateIndustry;
using Devliora.Application.Features.Industries.Commands.DeleteIndustry;
using Devliora.Application.Features.Industries.Commands.UpdateIndustry;
using Devliora.Application.Features.Industries.Queries.GetAllIndustries;
using Devliora.Application.Features.Industries.Queries.GetAllIndustriesAdmin;
using Devliora.Application.Features.Industries.Queries.GetIndustryBySlug;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Devliora.WebApi.Controllers;

[ApiController]
[Route("api/industries")]
public class IndustriesController : ControllerBase
{
    private readonly ISender _sender;

    public IndustriesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<List<IndustryDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllIndustriesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<IndustryDetailDto>> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetIndustryBySlugQuery { Slug = slug }, cancellationToken);
        if (result is null) return NotFound();
        return Ok(result);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<AdminIndustryDto>>> GetAllAdmin(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllIndustriesAdminQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Guid>> Create(CreateIndustryCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetAll), new { id }, id);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, UpdateIndustryCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest(new { error = "Route id and body id must match." });
        await _sender.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteIndustryCommand { Id = id }, cancellationToken);
        return NoContent();
    }
}
