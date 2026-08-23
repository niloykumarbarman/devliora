import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologiesHero from "@/components/sections/TechnologiesHero";
import TechnologyDetailPagesGrid from "@/components/sections/TechnologyDetailPagesGrid";
import TechnologiesDetailList from "@/components/sections/TechnologiesDetailList";
import TechnologiesOverview from "@/components/sections/TechnologiesOverview";
import TechnologiesMethodologies from "@/components/sections/TechnologiesMethodologies";
import TechnologiesCTA from "@/components/sections/TechnologiesCTA";

export const metadata: Metadata = buildMetadata({
  title: "Technologies | Devliora",
  description:
    "The tools and platforms Devliora relies on to build reliable, secure, and maintainable software.",
  path: "/technologies",
});

export default function TechnologiesPage() {
  return (
    <>
      <Navbar />
      <main>
        <TechnologiesHero />
        <TechnologyDetailPagesGrid
          pageType="technology"
          basePath="/technologies"
          heading="Explore our technology pages"
          subheading="An in-depth look at how we work with each technology."
        />
        <TechnologiesDetailList />
        <TechnologiesOverview />
        <TechnologiesMethodologies />
        <TechnologiesCTA />
      </main>
      <Footer />
    </>
  );
}
