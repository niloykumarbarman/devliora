namespace Devliora.Application.Features.BlogPosts.Queries.GetBlogPostBySlug;

public class BlogPostDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public DateTime? PublishedAt { get; set; }

    // Last edit timestamp, for an accurate Article `dateModified`. Null
    // if the post has never been edited since publish.
    public DateTime? UpdatedAt { get; set; }
}
