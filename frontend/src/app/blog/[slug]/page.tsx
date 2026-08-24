import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPostDetailHero from "@/components/sections/BlogPostDetailHero";
import BlogPostDetailContent from "@/components/sections/BlogPostDetailContent";
import BlogCTA from "@/components/sections/BlogCTA";
import { fetchBlogPostBySlug } from "@/lib/blogPosts";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article not found | Devliora" };
  }

  return buildMetadata({
    title: `${post.title} | Devliora`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImageUrl || undefined,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = articleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    authorName: post.authorName,
    publishedAt: post.publishedAt,
    imageUrl: post.coverImageUrl || undefined,
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <main>
        <BlogPostDetailHero post={post} />
        <BlogPostDetailContent post={post} />
        <BlogCTA />
      </main>
      <Footer />
    </>
  );
}
