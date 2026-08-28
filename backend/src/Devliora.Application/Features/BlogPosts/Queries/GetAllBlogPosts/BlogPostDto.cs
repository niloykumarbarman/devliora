namespace Devliora.Application.Features.BlogPosts.Queries.GetAllBlogPosts;

public class BlogPostDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public DateTime? PublishedAt { get; set; }

    // Last edit timestamp, exposed so the frontend can emit an accurate
    // Article `dateModified` and sitemap `lastmod`. Null for a post that
    // has never been edited since publish.
    public DateTime? UpdatedAt { get; set; }
}
