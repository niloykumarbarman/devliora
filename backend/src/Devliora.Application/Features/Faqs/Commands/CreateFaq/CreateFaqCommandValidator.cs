using FluentValidation;

namespace Devliora.Application.Features.Faqs.Commands.CreateFaq;

public class CreateFaqCommandValidator : AbstractValidator<CreateFaqCommand>
{
    public CreateFaqCommandValidator()
    {
        RuleFor(x => x.Question).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Answer).NotEmpty();
        RuleFor(x => x.ServiceSlug).MaximumLength(200);
    }
}
