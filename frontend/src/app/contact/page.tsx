import type { Metadata } from "next";
import { buildMetadata, webPageJsonLd, ORGANIZATION_ID, siteConfig } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/sections/ContactHero";
import ContactForm from "@/components/sections/ContactForm";
import ContactLocations from "@/components/sections/ContactLocations";
import { fetchOfficeLocations } from "@/lib/officeLocations";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Tell Devliora about your project. We respond within 48 hours with a clear, honest read on scope, timeline, and approach.",
  path: "/contact",
});

const contactPageLd = {
  ...webPageJsonLd({
    path: "/contact",
    name: "Contact Devliora",
    description:
      "Contact details for Devliora and a project enquiry form.",
    type: "ContactPage",
  }),
  // The org's real contact channel, pinned to the same values used in
  // the sitewide Organization schema so the two never disagree.
  mainEntity: {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhone,
    url: siteConfig.url,
  },
};

export default async function ContactPage() {
  const offices = await fetchOfficeLocations();
  return (
    <>
      <JsonLd data={contactPageLd} />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <ContactHero />
        <ContactForm />
        <ContactLocations offices={offices} />
      </main>
      <Footer />
    </>
  );
}
