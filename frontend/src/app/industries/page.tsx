import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IndustriesHero from "@/components/sections/IndustriesHero";
import IndustriesDetailList from "@/components/sections/IndustriesDetailList";
import IndustriesCTA from "@/components/sections/IndustriesCTA";

export const metadata: Metadata = buildMetadata({
  title: "Industry-Specific Software Development",
  description:
    "The industries where Devliora has the deepest domain context — FinTech, Healthcare, E-commerce, Logistics, SaaS and EdTech — and how that shapes each build.",
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
