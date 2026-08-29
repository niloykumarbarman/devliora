import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/Reveal";
import BlogPostDetailHero from "@/components/sections/BlogPostDetailHero";
import BlogPostDetailContent from "@/components/sections/BlogPostDetailContent";
import BlogCTA from "@/components/sections/BlogCTA";
import { fetchBlogPostBySlug, fetchBlogPosts, type BlogPost } from "@/lib/blogPosts";
import { categoryForPost, tagsForPost } from "@/lib/blogContent";
import { blogCrossLinks } from "@/lib/crossLinks";
import { resolveImageUrl } from "@/lib/hero";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Article not found",
      description: "This article could not be found.",
      path: `/blog/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    // The excerpt is the meta description; fall back to a title-based
    // line so a post published without one still gets a non-empty,
    // unique description rather than inheriting the site default.
    description:
      post.excerpt?.trim() ||
      `${post.title} — insights from the Devliora engineering team.`,
    path: `/blog/${post.slug}`,
    image: post.coverImageUrl || undefined,
    type: "article",
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.authorName ? [post.authorName] : undefined,
    },
  });
}

/** Up to 3 other posts, preferring the same category. */
function relatedArticles(
  all: BlogPost[],
  current: BlogPost,
  categoryKey: string
): BlogPost[] {
  const others = all.filter((p) => p.slug !== current.slug);
  const sameCategory = others.filter(
    (p) => categoryForPost(p.slug, p.title).key === categoryKey
  );
  const pool = [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))];
  return pool.slice(0, 3);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    fetchBlogPostBySlug(slug),
    fetchBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const category = categoryForPost(post.slug, post.title);
  const tags = tagsForPost(post.slug);
  const crossLinks = blogCrossLinks(category.key);
  const related = relatedArticles(allPosts, post, category.key);

  const jsonLd = articleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    authorName: post.authorName,
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt,
    imageUrl: post.coverImageUrl || undefined,
    section: category.name,
    tags,
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <BlogPostDetailHero
          post={post}
          categoryName={category.name}
          updatedAt={post.updatedAt}
        />
        <BlogPostDetailContent post={post} />

        {/* Tags + related service */}
        <Reveal><section className="bg-paper pb-8">
          <div className="mx-auto max-w-3xl px-6">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-graphite/10 pt-8">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-graphite/15 px-3 py-1 font-mono text-xs text-graphite/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-6 text-sm text-graphite/70">
              Working on something like this?{" "}
              {crossLinks.map((link, i) => (
                <span key={link.href}>
                  {i > 0 && " · "}
                  <Link
                    href={link.href}
                    className="font-medium text-signal underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </section></Reveal>

        {/* Related articles */}
        {related.length > 0 && (
          <Reveal><section className="bg-paper py-16">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Related articles
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block overflow-hidden rounded-xl border border-graphite/10 transition-colors hover:border-signal/40"
                  >
                    <div className="relative aspect-[16/9] w-full bg-graphite/10">
                      {p.coverImageUrl && (
                        <Image
                          src={resolveImageUrl(p.coverImageUrl)}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-medium text-ink group-hover:text-signal">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section></Reveal>
        )}

        <BlogCTA />
      </main>
      <Footer />
    </>
  );
}
