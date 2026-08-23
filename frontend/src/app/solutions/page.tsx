import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SolutionsHero from "@/components/sections/SolutionsHero";
import TechnologyDetailPagesGrid from "@/components/sections/TechnologyDetailPagesGrid";
import SolutionsDetailList from "@/components/sections/SolutionsDetailList";
import SolutionsCTA from "@/components/sections/SolutionsCTA";

export const metadata: Metadata = buildMetadata({
  title: "Solutions | Devliora",
  description:
    "Outcome-focused solutions from Devliora: custom software, modernization, cloud, data, and AI integration.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main>
        <SolutionsHero />
        <TechnologyDetailPagesGrid
          pageType="solution"
          basePath="/solutions"
          heading="Explore our solution pages"
          subheading="An in-depth look at the packaged solutions we build."
        />
        <SolutionsDetailList />
        <SolutionsCTA />
      </main>
      <Footer />
    </>
  );
}
