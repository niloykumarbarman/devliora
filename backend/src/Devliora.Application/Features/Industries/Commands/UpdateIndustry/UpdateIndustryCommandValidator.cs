using FluentValidation;

namespace Devliora.Application.Features.Industries.Commands.UpdateIndustry;

public class UpdateIndustryCommandValidator : AbstractValidator<UpdateIndustryCommand>
{
    public UpdateIndustryCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(200)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase, alphanumeric, hyphen-separated.");
        RuleFor(x => x.Description).MaximumLength(2000);
    }
}
