import type { Metadata } from "next";
import { buildMetadata, personJsonLd, webPageJsonLd } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import AboutMission from "@/components/sections/AboutMission";
import AboutFounder from "@/components/sections/AboutFounder";
import AboutPrinciples from "@/components/sections/AboutPrinciples";
import AboutCTA from "@/components/sections/AboutCTA";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Devliora is a founder-led software engineering studio, run by Niloy Kumar Barman, built on production-grade security, transparency, and real engineering standards.",
  path: "/about",
});

const aboutPageLd = webPageJsonLd({
  path: "/about",
  name: "About Devliora",
  description:
    "Devliora is a founder-led software engineering studio, run by Niloy Kumar Barman.",
  type: "AboutPage",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageLd} />
      <JsonLd data={personJsonLd()} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <AboutHero />
        <AboutMission />
        <AboutFounder />
        <AboutPrinciples />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}
