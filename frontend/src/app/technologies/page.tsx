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
  title: "Technologies & Platforms We Build With",
  description:
    "The languages, frameworks and cloud platforms Devliora builds on — .NET, Java, Python, Node.js, React, AWS and Azure — and why we reach for each.",
  path: "/technologies",
});

export default function TechnologiesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
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
