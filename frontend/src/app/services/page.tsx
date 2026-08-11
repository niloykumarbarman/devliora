import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/sections/ServicesHero";
import ServicesCTA from "@/components/sections/ServicesCTA";

export const metadata: Metadata = buildMetadata({
  title: "Services | Devliora",
  description:
    "Platform engineering, API design, system migration, cloud infrastructure, security engineering, and performance engineering — scoped in detail.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesHero />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
