using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Devliora.Application.Features.BlogPosts.Queries.GetAllBlogPosts;

public class GetAllBlogPostsQueryHandler : IRequestHandler<GetAllBlogPostsQuery, List<BlogPostDto>>
{
    private const string CacheKey = "blogposts:all";

    private readonly IAppDbContext _context;
    private readonly ICacheService _cache;

    public GetAllBlogPostsQueryHandler(IAppDbContext context, ICacheService cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<List<BlogPostDto>> Handle(GetAllBlogPostsQuery request, CancellationToken cancellationToken)
    {
        var cached = await _cache.GetAsync<List<BlogPostDto>>(CacheKey, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var result = await _context.BlogPosts
            .Where(b => b.Status == BlogPostStatus.Published && !b.IsDeleted)
            .OrderByDescending(b => b.PublishedAt)
            .Select(b => new BlogPostDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                Excerpt = b.Excerpt,
                CoverImageUrl = b.CoverImageUrl,
                AuthorName = b.AuthorName,
                PublishedAt = b.PublishedAt,
                UpdatedAt = b.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        await _cache.SetAsync(CacheKey, result, TimeSpan.FromMinutes(5), cancellationToken);

        return result;
    }
}
