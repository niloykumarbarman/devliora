using FluentValidation;

namespace Devliora.Application.Features.About.Commands.UpdateAbout;

public class UpdateAboutCommandValidator : AbstractValidator<UpdateAboutCommand>
{
    public UpdateAboutCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();

        RuleFor(x => x.HeroHeading).NotEmpty().MaximumLength(200);
        RuleFor(x => x.HeroHeadingAccent).MaximumLength(200);
        RuleFor(x => x.HeroHeadingSuffix).MaximumLength(200);
        RuleFor(x => x.HeroSubtitle).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.HeroImageUrl).MaximumLength(500);

        RuleFor(x => x.MissionHeading).NotEmpty().MaximumLength(200);
        RuleFor(x => x.MissionHeadingAccent).MaximumLength(200);
        RuleFor(x => x.MissionBody).MaximumLength(4000);
        RuleFor(x => x.MissionCardLabel).MaximumLength(100);
        RuleFor(x => x.MissionCardBody).MaximumLength(1000);
        RuleFor(x => x.VisionCardLabel).MaximumLength(100);
        RuleFor(x => x.VisionCardBody).MaximumLength(1000);

        RuleFor(x => x.FounderEyebrow).MaximumLength(100);
        RuleFor(x => x.FounderName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.FounderRole).MaximumLength(150);
        RuleFor(x => x.FounderBody).MaximumLength(4000);
        RuleFor(x => x.FounderCtaText).MaximumLength(150);
        RuleFor(x => x.FounderCtaUrl).MaximumLength(300);

        RuleFor(x => x.PrinciplesHeading).NotEmpty().MaximumLength(200);
        RuleFor(x => x.PrinciplesHeadingAccent).MaximumLength(200);

        RuleFor(x => x.CtaHeading).NotEmpty().MaximumLength(200);
        RuleFor(x => x.CtaHeadingAccent).MaximumLength(200);
        RuleFor(x => x.CtaBody).MaximumLength(1000);
        RuleFor(x => x.CtaButtonText).MaximumLength(100);
        RuleFor(x => x.CtaButtonUrl).MaximumLength(300);

        RuleForEach(x => x.FounderCards).ChildRules(c =>
        {
            c.RuleFor(i => i.Title).NotEmpty().MaximumLength(150);
            c.RuleFor(i => i.Body).NotEmpty().MaximumLength(600);
            c.RuleFor(i => i.IconName).MaximumLength(50);
        });
        RuleForEach(x => x.Principles).ChildRules(c =>
        {
            c.RuleFor(i => i.Title).NotEmpty().MaximumLength(150);
            c.RuleFor(i => i.Body).NotEmpty().MaximumLength(600);
            c.RuleFor(i => i.IconName).MaximumLength(50);
        });
    }
}
