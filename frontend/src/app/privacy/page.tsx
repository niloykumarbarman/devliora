import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyHero from "@/components/sections/PrivacyHero";
import PrivacyContent from "@/components/sections/PrivacyContent";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Devliora",
  description:
    "Devliora's privacy policy: what personal and project information we collect through our website and services, how we use and store it, and the choices you have to access, correct, or delete it.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PrivacyHero />
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}
