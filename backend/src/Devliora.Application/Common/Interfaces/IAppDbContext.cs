using Devliora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Service> Services { get; }
    DbSet<ServiceHighlight> ServiceHighlights { get; }
    DbSet<ServiceIndustryCard> ServiceIndustryCards { get; }
    DbSet<Portfolio> Portfolios { get; }
    DbSet<PortfolioImage> PortfolioImages { get; }
    DbSet<PortfolioMetric> PortfolioMetrics { get; }
    DbSet<CaseStudy> CaseStudies { get; }
    DbSet<BlogPost> BlogPosts { get; }
    DbSet<Testimonial> Testimonials { get; }
    DbSet<ContactMessage> ContactMessages { get; }
    DbSet<JobListing> JobListings { get; }
    DbSet<Admin> Admins { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<ConsultationRequest> ConsultationRequests { get; }
    DbSet<HeroContent> HeroContents { get; }
    DbSet<TechnologyItem> TechnologyItems { get; }
    DbSet<Industry> Industries { get; }
    DbSet<IndustryStat> IndustryStats { get; }
    DbSet<FaqItem> FaqItems { get; }
    DbSet<SiteSettings> SiteSettings { get; }
    DbSet<ChatConversation> ChatConversations { get; }
    DbSet<ChatMessage> ChatMessages { get; }
    DbSet<OfficeLocation> OfficeLocations { get; }
    DbSet<Partner> Partners { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
