using FluentValidation;

namespace Devliora.Application.Features.TechnologyDetailPages.Commands.CreateTechnologyDetailPage;

public class CreateTechnologyDetailPageCommandValidator : AbstractValidator<CreateTechnologyDetailPageCommand>
{
    public CreateTechnologyDetailPageCommandValidator()
    {
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(200)
            .Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase, alphanumeric, hyphen-separated.");
        RuleFor(x => x.TechnologyName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.MetaDescription).MaximumLength(500);
        RuleFor(x => x.PageType).NotEmpty().Must(t => t == "technology" || t == "solution")
            .WithMessage("PageType must be 'technology' or 'solution'.");
        RuleFor(x => x.HeroTitle).NotEmpty().MaximumLength(200);
        RuleFor(x => x.HeroImageUrl).MaximumLength(500);
        RuleFor(x => x.OverviewHeading).MaximumLength(200);
        RuleFor(x => x.OverviewHeadingAccent).MaximumLength(100);
        RuleFor(x => x.OverviewHeadingSuffix).MaximumLength(100);
        RuleFor(x => x.OverviewParagraph).MaximumLength(2000);
        RuleFor(x => x.HighlightHeadline).MaximumLength(200);
        RuleFor(x => x.HighlightParagraph).MaximumLength(1000);
        RuleFor(x => x.IndustriesParagraph).MaximumLength(1000);
        RuleFor(x => x.IndustriesImageUrl).MaximumLength(500);
        RuleFor(x => x.ServicesHeading).MaximumLength(200);
        RuleFor(x => x.ServicesCardLabel).MaximumLength(100);
        RuleFor(x => x.ServicesParagraph).MaximumLength(1000);
        RuleFor(x => x.ServicesCardImageUrl).MaximumLength(500);
    }
}
