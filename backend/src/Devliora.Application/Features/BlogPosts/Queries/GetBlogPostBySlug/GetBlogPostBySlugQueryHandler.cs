using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.BlogPosts.Queries.GetBlogPostBySlug;

public class GetBlogPostBySlugQueryHandler : IRequestHandler<GetBlogPostBySlugQuery, BlogPostDetailDto?>
{
    private const string CacheKeyPrefix = "blogposts:slug:";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetBlogPostBySlugQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<BlogPostDetailDto?> Handle(GetBlogPostBySlugQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = CacheKeyPrefix + request.Slug;

        var cached = await _cache.GetAsync<BlogPostDetailDto>(cacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var result = await _context.BlogPosts
            .Where(b => b.Status == BlogPostStatus.Published && !b.IsDeleted && b.Slug == request.Slug)
            .Select(b => new BlogPostDetailDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                Excerpt = b.Excerpt,
                Content = b.Content,
                CoverImageUrl = b.CoverImageUrl,
                AuthorName = b.AuthorName,
                PublishedAt = b.PublishedAt,
                UpdatedAt = b.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (result is not null)
        {
            await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);
        }

        return result;
    }
}
