import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import ClientShowcase from "@/components/sections/ClientShowcase";
import Services from "@/components/sections/Services";
import Partners from "@/components/sections/Partners";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Process from "@/components/sections/Process";
import Technologies from "@/components/sections/Technologies";
import Portfolio from "@/components/sections/Portfolio";
import CaseStudies from "@/components/sections/CaseStudies";
import Testimonials from "@/components/sections/Testimonials";
import TrustGuarantees from "@/components/sections/TrustGuarantees";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Capabilities />
        {/* Moved ahead of ClientShowcase — a Feb-2026 external audit
            flagged the homepage as needing stronger trust signals higher
            up. ClientShowcase's "engagements" are explicitly labeled
            illustrative (real public case studies are still in
            progress), so leading with TrustGuarantees' actual, concrete
            commitments (security defaults, response-time guarantee,
            commit visibility) establishes credibility with something
            real before the illustrative examples, rather than after. */}
        <TrustGuarantees />
        <ClientShowcase />
        <Services />
        <Partners />
        <WhyChooseUs />
        <Process />
        <Technologies />
        <Portfolio />
        <CaseStudies />
        <Testimonials />
        <FAQ />
      <Contact />
      </main>
      <Footer />
    </>
  );
}
