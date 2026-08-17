using FluentValidation;

namespace Devliora.Application.Features.Faqs.Commands.UpdateFaq;

public class UpdateFaqCommandValidator : AbstractValidator<UpdateFaqCommand>
{
    public UpdateFaqCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Question).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Answer).NotEmpty();
        RuleFor(x => x.ServiceSlug).MaximumLength(200);
    }
}
