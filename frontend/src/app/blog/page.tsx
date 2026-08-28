import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import BlogPostList from "@/components/sections/BlogPostList";
import BlogCTA from "@/components/sections/BlogCTA";

export const metadata: Metadata = buildMetadata({
  title: "Engineering Blog",
  description:
    "Engineering practices, architecture decisions, and lessons from building enterprise systems.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <BlogHero />
        <BlogPostList />
        <BlogCTA />
      </main>
      <Footer />
    </>
  );
}
