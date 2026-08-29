import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import BlogPostList from "@/components/sections/BlogPostList";
import BlogCTA from "@/components/sections/BlogCTA";

export const metadata: Metadata = buildMetadata({
  title: "Software Engineering Blog & Architecture Notes",
  description:
    "Engineering practices, architecture decisions and lessons from building custom and enterprise software — written by the Devliora team, not ghostwritten.",
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
