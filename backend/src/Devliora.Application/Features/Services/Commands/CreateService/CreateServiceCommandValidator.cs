using FluentValidation;

namespace Devliora.Application.Features.Services.Commands.CreateService;

public class CreateServiceCommandValidator : AbstractValidator<CreateServiceCommand>
{
    public CreateServiceCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(200)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase, alphanumeric, hyphen-separated.");
        RuleFor(x => x.ShortDescription).NotEmpty().MaximumLength(500);
        RuleFor(x => x.FullDescription).NotEmpty();
        RuleFor(x => x.HeroImageUrl).MaximumLength(500);
        RuleFor(x => x.AiServicesImageUrl).MaximumLength(500);
        RuleFor(x => x.AdvancedTechnologiesImageUrl).MaximumLength(500);
        RuleFor(x => x.Includes).Must(list => list.Count <= 10)
            .WithMessage("Includes list cannot have more than 10 items.");
        RuleForEach(x => x.Includes).MaximumLength(300);
        RuleFor(x => x.HighlightsHeading).MaximumLength(200);
        RuleFor(x => x.HighlightsDescription).MaximumLength(600);
        RuleFor(x => x.ToolsHeading).MaximumLength(200);
        RuleFor(x => x.ToolsDescription).MaximumLength(500);
        RuleFor(x => x.ToolsTagline).MaximumLength(300);
        RuleFor(x => x.ToolNames).Must(list => list.Count <= 20)
            .WithMessage("ToolNames list cannot have more than 20 items.");
        RuleForEach(x => x.ToolNames).MaximumLength(50);
        RuleFor(x => x.ProcessSteps).Must(list => list.Count <= 12)
            .WithMessage("ProcessSteps list cannot have more than 12 items.");
        RuleForEach(x => x.ProcessSteps).MaximumLength(80);
        RuleFor(x => x.ProcessGroupStart).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ProcessGroupCount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ProcessGroupLabel).MaximumLength(80);
        RuleFor(x => x).Must(x => x.ProcessGroupStart + x.ProcessGroupCount <= x.ProcessSteps.Count)
            .WithMessage("ProcessGroupStart + ProcessGroupCount must not exceed the number of steps.")
            .WithName("ProcessGroupCount");
        RuleFor(x => x.IndustriesHeading).MaximumLength(200);
        RuleFor(x => x.IndustriesTagline).MaximumLength(300);
        RuleFor(x => x.IndustriesDescription).MaximumLength(600);
        RuleFor(x => x.IndustryCards).Must(list => list.Count <= 8)
            .WithMessage("IndustryCards list cannot have more than 8 items.");
    }
}
