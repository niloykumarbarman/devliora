"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { User, CalendarDays } from "lucide-react";
import { fetchBlogPosts, type BlogPost } from "@/lib/blogPosts";
import { resolveImageUrl } from "@/lib/hero";

function formatDate(value: string | null): string {
  if (!value) return "Unpublished";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostList() {
  const shouldReduceMotion = useReducedMotion();
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

  return (
    <section className="relative bg-paper px-6 py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-ink sm:text-4xl">
          Latest <span className="text-signal">from the team</span>
        </h2>

        <div className="mt-12">
          {status === "loading" && (
            <p className="font-mono text-sm text-graphite">
              Loading articles...
            </p>
          )}

          {status === "error" && (
            <p className="font-mono text-sm text-graphite">
              We could not load articles right now. Please try again later.
            </p>
          )}

          {status === "success" && posts.length === 0 && (
            <div className="border border-ink/10 bg-ink/[0.02] px-8 py-14 text-center">
              <p className="font-display text-xl text-ink">
                No articles published yet
              </p>
              <p className="mx-auto mt-3 max-w-md text-graphite">
                We are working on our first pieces. Check back soon for
                engineering notes and case studies from the team.
              </p>
            </div>
          )}

          {status === "success" && posts.length > 0 && (
            <div
              className={`grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-graphite/10 bg-graphite/10 sm:grid-cols-2 ${
                posts.length >= 3 ? "lg:grid-cols-3" : ""
              }`}
            >
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={
                    shouldReduceMotion ? undefined : { opacity: 0, y: 20 }
                  }
                  whileInView={
                    shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex flex-col bg-paper"
                >
                  {/* Scale-only hover (no translate/rotate, and a plain
                      Tailwind :hover class rather than tilt-3d/whileHover):
                      this Link isn't itself Framer-Motion-animated so a
                      CSS class works fine, but the *parent* grid relies on
                      its own overflow-hidden for the gap-px hairline
                      mosaic trick — a bigger lift would just get clipped. */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative z-0 flex flex-1 flex-col transition-transform duration-300 hover:z-10 hover:scale-[1.03]"
                  >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-graphite/10">
                    {post.coverImageUrl && (
                      <Image
                        src={resolveImageUrl(post.coverImageUrl)}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-medium text-ink">
                      {post.title}
                    </h3>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite">
                      {post.excerpt}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-graphite/10 pt-4 font-mono text-xs uppercase tracking-wide text-graphite">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {post.authorName}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
