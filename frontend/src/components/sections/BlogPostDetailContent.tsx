import Image from "next/image";
import type { BlogPostDetail } from "@/lib/blogPosts";
import { resolveImageUrl } from "@/lib/hero";

export default function BlogPostDetailContent({
  post,
}: {
  post: BlogPostDetail;
}) {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        {post.coverImageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-graphite/10">
            <Image
              src={resolveImageUrl(post.coverImageUrl)}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <p className="mt-8 text-lg leading-relaxed text-graphite">
          {post.excerpt}
        </p>

        <div className="mt-8 whitespace-pre-line break-words text-base leading-relaxed text-ink">
          {post.content}
        </div>
      </div>
    </section>
  );
}
