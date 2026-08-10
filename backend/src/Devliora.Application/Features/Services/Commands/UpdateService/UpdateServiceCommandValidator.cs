using FluentValidation;

namespace Devliora.Application.Features.Services.Commands.UpdateService;

public class UpdateServiceCommandValidator : AbstractValidator<UpdateServiceCommand>
{
    public UpdateServiceCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(200)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase, alphanumeric, hyphen-separated.");
        RuleFor(x => x.ShortDescription).NotEmpty().MaximumLength(500);
        RuleFor(x => x.FullDescription).NotEmpty();
        RuleFor(x => x.HeroImageUrl).MaximumLength(500);
        RuleFor(x => x.Includes).Must(list => list.Count <= 10)
            .WithMessage("Includes list cannot have more than 10 items.");
        RuleForEach(x => x.Includes).MaximumLength(300);
        RuleFor(x => x.ToolsHeading).MaximumLength(200);
        RuleFor(x => x.ToolsDescription).MaximumLength(500);
        RuleFor(x => x.ToolsTagline).MaximumLength(300);
        RuleFor(x => x.ToolNames).Must(list => list.Count <= 20)
            .WithMessage("ToolNames list cannot have more than 20 items.");
        RuleForEach(x => x.ToolNames).MaximumLength(50);
    }
}
