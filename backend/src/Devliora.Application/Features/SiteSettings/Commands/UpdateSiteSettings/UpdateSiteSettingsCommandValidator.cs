using FluentValidation;

namespace Devliora.Application.Features.SiteSettings.Commands.UpdateSiteSettings;

public class UpdateSiteSettingsCommandValidator : AbstractValidator<UpdateSiteSettingsCommand>
{
    public UpdateSiteSettingsCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.LogoUrl).MaximumLength(500);
        RuleFor(x => x.SiteName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PortfolioHeroImageUrl).MaximumLength(500);
        RuleFor(x => x.IndustriesImageUrl).MaximumLength(500);
        RuleFor(x => x.ServicesImageUrl).MaximumLength(500);
        RuleFor(x => x.ServicesBannerImageUrl).MaximumLength(500);
        RuleFor(x => x.ServicesEngineeringImageUrl).MaximumLength(500);
        RuleFor(x => x.ServicesTechImageUrl).MaximumLength(500);
        RuleFor(x => x.ServicesSolutionsImageUrl).MaximumLength(500);
    }
}
