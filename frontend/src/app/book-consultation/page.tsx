import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookConsultationHero from "@/components/sections/BookConsultationHero";
import BookConsultationForm from "@/components/sections/BookConsultationForm";
import BookConsultationCTA from "@/components/sections/BookConsultationCTA";

export const metadata: Metadata = buildMetadata({
  title: "Book a Free Consultation",
  description:
    "Book a free consultation with Devliora. Tell us about your project and preferred timing, and one of our engineers will reach out to schedule a focused session.",
  path: "/book-consultation",
});

export default function BookConsultationPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <BookConsultationHero />
        <BookConsultationForm />
        <BookConsultationCTA />
      </main>
      <Footer />
    </>
  );
}
