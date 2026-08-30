"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { fetchBlogPosts, type BlogPost } from "@/lib/blogPosts";
import { categoryForPost } from "@/lib/blogContent";
import { resolveImageUrl } from "@/lib/hero";

/** "5 days ago" / "3 weeks ago" — compact relative date, with an
 *  absolute-date fallback for anything older than ~2 months. */
function relativeTime(value: string | null): string {
  if (!value) return "Unpublished";
  const then = new Date(value).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 56) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    fetchBlogPosts()
      .then((data) => {
        if (!cancelled) {
          setPosts(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hasGrid = status === "success" && posts.length > 0;

  return (
    <section className="relative bg-paper px-6 pb-24 sm:pb-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)",
        }}
      />

      {/* Pulled up so the cards overlap the dark hero, matching the
          reference layout. */}
      <div className="relative z-10 mx-auto -mt-28 max-w-6xl sm:-mt-36">
        <h2 className="sr-only">Latest articles</h2>

        {status === "loading" && (
          <p className="rounded-2xl bg-paper px-6 py-10 font-mono text-sm text-graphite shadow-sm">
            Loading articles...
          </p>
        )}

        {status === "error" && (
          <p className="rounded-2xl bg-paper px-6 py-10 font-mono text-sm text-graphite shadow-sm">
            We could not load articles right now. Please try again later.
          </p>
        )}

        {status === "success" && posts.length === 0 && (
          <div className="rounded-2xl bg-paper px-8 py-14 text-center shadow-sm">
            <p className="font-display text-xl text-ink">
              No articles published yet
            </p>
            <p className="mx-auto mt-3 max-w-md text-graphite">
              We are working on our first pieces. Check back soon for
              engineering notes and case studies from the team.
            </p>
          </div>
        )}

        {hasGrid && (
          <div
            className={`grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-graphite/10 bg-graphite/10 shadow-[0_24px_60px_-24px_rgba(14,20,32,0.45)] sm:grid-cols-2 ${
              posts.length >= 3 ? "lg:grid-cols-3" : ""
            }`}
          >
            {posts.map((post, i) => {
              const category = categoryForPost(post.slug, post.title).name;

              return (
                <Reveal
                  key={post.id}
                  as="article"
                  delay={i * 0.06}
                  className="flex flex-col bg-paper"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group relative z-0 flex flex-1 flex-col transition-transform duration-300 hover:z-10 hover:scale-[1.02]"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink">
                      {post.coverImageUrl ? (
                        <Image
                          src={resolveImageUrl(post.coverImageUrl)}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        // Branded fallback for posts published without a
                        // cover image, so a card never looks broken.
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_60%)]">
                          <span className="font-display text-lg font-medium text-paper/70">
                            Devliora
                          </span>
                        </div>
                      )}
                      <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-widest text-paper backdrop-blur-sm">
                        {category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="font-mono text-xs uppercase tracking-wide text-graphite/70">
                        {relativeTime(post.publishedAt)}
                        <span className="mx-2 text-graphite/30">/</span>
                        {post.authorName}
                      </p>

                      <h3 className="mt-2 font-display text-lg font-medium text-ink transition-colors group-hover:text-signal">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-graphite">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
