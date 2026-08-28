import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CaseStudiesHero from "@/components/sections/CaseStudiesHero";
import CaseStudiesList from "@/components/sections/CaseStudiesList";
import CaseStudiesCTA from "@/components/sections/CaseStudiesCTA";

export const metadata: Metadata = buildMetadata({
  title: "Software Engineering Case Studies",
  description:
    "Walk-throughs of Devliora's engineering work — the constraint, the system built, and the outcome. Confidential engagements are shown as illustrative examples.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <CaseStudiesHero />
        <CaseStudiesList />
        <CaseStudiesCTA />
      </main>
      <Footer />
    </>
  );
}
