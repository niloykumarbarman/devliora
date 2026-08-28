import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PortfolioHero from "@/components/sections/PortfolioHero";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import PortfolioCTA from "@/components/sections/PortfolioCTA";

export const metadata: Metadata = buildMetadata({
  title: "Software Development Portfolio",
  description:
    "A visual look at the systems we have shipped — browse our work and open any project for the full case study.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <PortfolioHero />
        <PortfolioGrid />
        <PortfolioCTA />
      </main>
      <Footer />
    </>
  );
}
