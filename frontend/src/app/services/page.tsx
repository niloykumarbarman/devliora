import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/sections/ServicesHero";
import ServicesCTA from "@/components/sections/ServicesCTA";

export const metadata: Metadata = buildMetadata({
  // Distinct from the /custom-software-development pillar page, which owns
  // the exact "Custom Software Development" head term. This hub page
  // covers the full service range, so its title reflects the breadth.
  title: "Software Development & Technology Services",
  description:
    "Software development, AI, cloud, DevOps, QA and IT consulting — every Devliora service scoped in detail, with the engineering standards behind it.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <ServicesHero />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
