import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CareersHero from "@/components/sections/CareersHero";
import CareersJobList from "@/components/sections/CareersJobList";
import CareersCTA from "@/components/sections/CareersCTA";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Join Devliora. See our current openings or reach out even if there isn't a role listed right now.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <CareersHero />
        <CareersJobList />
        <CareersCTA />
      </main>
      <Footer />
    </>
  );
}
