using FluentValidation;

namespace Devliora.Application.Features.Industries.Commands.CreateIndustry;

public class CreateIndustryCommandValidator : AbstractValidator<CreateIndustryCommand>
{
    public CreateIndustryCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(200)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase, alphanumeric, hyphen-separated.");
        RuleFor(x => x.Description).MaximumLength(2000);
    }
}
