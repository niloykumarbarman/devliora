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
        RuleFor(x => x.Includes).Must(list => list.Count <= 10)
            .WithMessage("Includes list cannot have more than 10 items.");
        RuleForEach(x => x.Includes).MaximumLength(300);
    }
}
