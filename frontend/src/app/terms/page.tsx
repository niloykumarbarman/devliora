import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TermsHero from "@/components/sections/TermsHero";
import TermsContent from "@/components/sections/TermsContent";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Devliora",
  description:
    "The terms and conditions governing your use of the Devliora website, including acceptable use, intellectual property, service engagements, and limitation of liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <TermsHero />
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}
