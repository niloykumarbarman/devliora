import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IndustriesHero from "@/components/sections/IndustriesHero";
import IndustriesDetailList from "@/components/sections/IndustriesDetailList";
import IndustriesCTA from "@/components/sections/IndustriesCTA";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Build Software For",
  description:
    "Industries where Devliora has built the deepest domain context: FinTech, Healthcare, E-commerce, Logistics, SaaS, and EdTech.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <IndustriesHero />
        <IndustriesDetailList />
        <IndustriesCTA />
      </main>
      <Footer />
    </>
  );
}
