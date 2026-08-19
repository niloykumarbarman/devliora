using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Infrastructure.Data;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Service> Services => Set<Service>();
    public DbSet<ServiceHighlight> ServiceHighlights => Set<ServiceHighlight>();
    public DbSet<ServiceIndustryCard> ServiceIndustryCards => Set<ServiceIndustryCard>();
    public DbSet<ServiceTabCaseStudy> ServiceTabCaseStudies => Set<ServiceTabCaseStudy>();
    public DbSet<Portfolio> Portfolios => Set<Portfolio>();
    public DbSet<PortfolioImage> PortfolioImages => Set<PortfolioImage>();
    public DbSet<PortfolioMetric> PortfolioMetrics => Set<PortfolioMetric>();
    public DbSet<CaseStudy> CaseStudies => Set<CaseStudy>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<JobListing> JobListings => Set<JobListing>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<ConsultationRequest> ConsultationRequests => Set<ConsultationRequest>();
    public DbSet<HeroContent> HeroContents => Set<HeroContent>();
    public DbSet<TechnologyItem> TechnologyItems => Set<TechnologyItem>();
    public DbSet<TechnologyDetailPage> TechnologyDetailPages => Set<TechnologyDetailPage>();
    public DbSet<TechnologyDetailFeature> TechnologyDetailFeatures => Set<TechnologyDetailFeature>();
    public DbSet<TechnologyDetailFaq> TechnologyDetailFaqs => Set<TechnologyDetailFaq>();
    public DbSet<TechnologyDetailServiceCard> TechnologyDetailServiceCards => Set<TechnologyDetailServiceCard>();
    public DbSet<Industry> Industries => Set<Industry>();
    public DbSet<IndustryStat> IndustryStats => Set<IndustryStat>();
    public DbSet<FaqItem> FaqItems => Set<FaqItem>();
    public DbSet<HeroTelemetryPill> HeroTelemetryPills => Set<HeroTelemetryPill>();
    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();
    public DbSet<ChatConversation> ChatConversations => Set<ChatConversation>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<OfficeLocation> OfficeLocations => Set<OfficeLocation>();
    public DbSet<Partner> Partners => Set<Partner>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        modelBuilder.Entity<Admin>().HasIndex(a => a.Email).IsUnique();
        modelBuilder.Entity<AuditLog>().HasIndex(a => a.Timestamp);
        modelBuilder.Entity<AuditLog>().HasIndex(a => a.UserId);
        modelBuilder.Entity<RefreshToken>().HasIndex(rt => rt.TokenHash).IsUnique();
        modelBuilder.Entity<RefreshToken>().HasIndex(rt => rt.AdminId);
    }
}
