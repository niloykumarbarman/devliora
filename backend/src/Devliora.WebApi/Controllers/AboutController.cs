using Devliora.Application.Features.About.Commands.UpdateAbout;
using Devliora.Application.Features.About.Queries.GetAbout;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Devliora.WebApi.Controllers;

[ApiController]
[Route("api/about")]
public class AboutController : ControllerBase
{
    private readonly ISender _sender;

    public AboutController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<AboutDto>> Get(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAboutQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(UpdateAboutCommand command, CancellationToken cancellationToken)
    {
        await _sender.Send(command, cancellationToken);
        return NoContent();
    }
}
