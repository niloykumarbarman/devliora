import { User, CalendarDays } from "lucide-react";
import type { BlogPostDetail } from "@/lib/blogPosts";

function formatDate(value: string | null): string {
  if (!value) return "Unpublished";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostDetailHero({
  post,
  categoryName,
  updatedAt,
}: {
  post: BlogPostDetail;
  categoryName?: string;
  updatedAt?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <div className="bg-grain absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-3xl px-6">
        {categoryName && (
          <p className="hero-fade-rise font-mono text-xs font-semibold uppercase tracking-widest text-signal">
            {categoryName}
          </p>
        )}

        <h1 className="hero-h1-rise mt-6 text-balance font-display text-3xl font-semibold text-paper sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        <div
          className="hero-fade-rise mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wide text-wire"
          style={{ animationDelay: "0.24s" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-signal" />
            {post.authorName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-signal" />
            {formatDate(post.publishedAt)}
          </span>
          {updatedAt && updatedAt !== post.publishedAt && (
            <span className="inline-flex items-center gap-1.5 text-wire/70">
              Updated {formatDate(updatedAt)}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
