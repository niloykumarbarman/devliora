import { API_BASE_URL } from "./apiConfig";
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  authorName: string;
  publishedAt: string | null;
  /** Last edit timestamp; null if never edited since publish. */
  updatedAt: string | null;
}

export const BLOG_POSTS_API_URL = `${API_BASE_URL}/blog-posts`;

// Returns [] on any failure — same contract as the other listing
// fetchers (services, industries), so a briefly-unavailable API
// degrades the blog list to an empty state rather than an error.
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(BLOG_POSTS_API_URL, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }
    return (await res.json()) as BlogPost[];
  } catch {
    return [];
  }
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPostDetail | null> {
  const res = await fetch(`${BLOG_POSTS_API_URL}/${slug}`, {
    cache: "no-store",
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch blog post: ${res.status}`);
  }
  return res.json();
}
