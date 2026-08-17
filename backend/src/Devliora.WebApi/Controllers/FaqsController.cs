using Devliora.Application.Features.Faqs.Commands.CreateFaq;
using Devliora.Application.Features.Faqs.Commands.DeleteFaq;
using Devliora.Application.Features.Faqs.Commands.UpdateFaq;
using Devliora.Application.Features.Faqs.Queries.GetAllFaqs;
using Devliora.Application.Features.Faqs.Queries.GetAllFaqsAdmin;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Devliora.WebApi.Controllers;
[ApiController]
[Route("api/faqs")]
public class FaqsController : ControllerBase
{
    private readonly ISender _sender;
    public FaqsController(ISender sender)
    {
        _sender = sender;
    }
    [HttpGet]
    public async Task<ActionResult<List<FaqDto>>> GetAll([FromQuery] string? serviceSlug, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllFaqsQuery { ServiceSlug = serviceSlug }, cancellationToken);
        return Ok(result);
    }
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<AdminFaqDto>>> GetAllAdmin(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAllFaqsAdminQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Guid>> Create(CreateFaqCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetAll), new { id }, id);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, UpdateFaqCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest(new { error = "Route id and body id must match." });
        await _sender.Send(command, cancellationToken);
        return NoContent();
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteFaqCommand { Id = id }, cancellationToken);
        return NoContent();
    }
}
