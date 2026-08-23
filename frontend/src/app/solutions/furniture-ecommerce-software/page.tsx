import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologyDetailHero from "@/components/sections/TechnologyDetailHero";
import SolutionDetailOverview from "@/components/sections/SolutionDetailOverview";
import TechnologyDetailHighlight from "@/components/sections/TechnologyDetailHighlight";
import SolutionDetailTechnologies from "@/components/sections/SolutionDetailTechnologies";
import FAQView from "@/components/sections/FAQView";
import TechnologyDetailSpotlight from "@/components/sections/TechnologyDetailSpotlight";
import UnlockProjectCTA from "@/components/sections/UnlockProjectCTA";
import DedicatedDevTeam from "@/components/sections/DedicatedDevTeam";
import DistributedTeamsCollaboration from "@/components/sections/DistributedTeamsCollaboration";
import TechnologyDetailServices from "@/components/sections/TechnologyDetailServices";
import TailoredTechSolutions from "@/components/sections/TailoredTechSolutions";
import SolutionsCTA from "@/components/sections/SolutionsCTA";
import { ShoppingCart } from "lucide-react";
import type { FaqDto } from "@/lib/faq";

export const metadata: Metadata = buildMetadata({
  title: "Furniture eCommerce Software | Devliora",
  description:
    "AI-driven furniture eCommerce platforms with tailored inventory management, AR visualization, and integrated payments.",
  path: "/solutions/furniture-ecommerce-software",
});

const FEATURES = [
  {
    title: "Tailored inventory management",
    body: "Our solutions include customized inventory systems that effectively track stock levels, ensuring your furniture collections are always up-to-date and available.",
  },
  {
    title: "Augmented reality features",
    body: "We integrate AR technology, enabling customers to visualize how furniture pieces fit into their spaces, enhancing their shopping experience.",
  },
  {
    title: "User-friendly design",
    body: "Our furniture eCommerce platforms prioritize intuitive navigation, making it easy for customers to browse, compare, and purchase products seamlessly.",
  },
  {
    title: "Robust analytics",
    body: "We equip your software with analytics tools that provide insights into customer behavior, helping you optimize your offerings and marketing strategies.",
  },
  {
    title: "Integrated payment solutions",
    body: "Our software supports multiple secure payment options, ensuring a smooth and trustworthy transaction process for your customers.",
  },
];

// Static, page-scoped FAQ — same reasoning as the technology pages'
// (lib/faq.ts only scopes to Services via serviceSlug, and this isn't
// one). Questions confirmed verbatim from the kaz.com.bd reference;
// answers too, except the timeline and cost-range ones, which named
// specific figures ("8–16 weeks", "$20,000–$120,000") that are Kaz's
// own unverified numbers, not Devliora's — replaced with the same
// honest, no-invented-numbers phrasing already used on the .NET/Java
// technology pages' FAQs.
const FAQS: FaqDto[] = [
  {
    id: "timeline",
    serviceSlug: "",
    displayOrder: 0,
    question: "How long does it take to build a furniture-focused eCommerce platform?",
    answer:
      "It depends on scope — catalog size, custom features, and how many integrations are involved. We scope every project individually and give you a realistic timeline before work begins, not a generic estimate.",
  },
  {
    id: "why-specialized",
    serviceSlug: "",
    displayOrder: 1,
    question: "Why should I choose a specialized eCommerce solution for the furniture industry?",
    answer:
      "Furniture requires advanced visualizations, large catalogs, custom attributes, delivery logic, and price variations — which standard eCommerce setups don't handle well.",
  },
  {
    id: "ar-configurators",
    serviceSlug: "",
    displayOrder: 2,
    question: "Can you integrate AR/3D previews, room visualizers, or custom configurators?",
    answer:
      "Yes. We integrate AR modules, 3D viewers, color/size configurators, and product pairing tools to enhance the customer experience.",
  },
  {
    id: "cost",
    serviceSlug: "",
    displayOrder: 3,
    question: "What is the cost range for furniture eCommerce software?",
    answer:
      "Cost depends on scope, complexity, and the visualization tools involved — a focused catalog site costs far less than a full AR/3D-configurator platform. We provide a clear, itemized estimate once we understand your requirements, with no hidden fees.",
  },
  {
    id: "support",
    serviceSlug: "",
    displayOrder: 4,
    question: "Do you provide ongoing support for furniture eCommerce platforms?",
    answer:
      "Absolutely. We handle updates, performance optimization, inventory sync, security patches, and continuous UX improvements.",
  },
];

// Confirmed verbatim from the kaz.com.bd reference — generic capability
// descriptions about a furniture eCommerce platform, no fabricated
// claims. No real photo asset for the card (this is a static page, not
// one of the admin-managed TechnologyDetailPage rows with an image
// field), so it falls back to a warm ember-toned gradient — thematically
// fitting for "furniture" on its own, same reasoning as the .NET/Java
// pages' brand-colored gradient fallback.
const FURNITURE_SERVICES = [
  {
    title: "Catalog Management",
    description:
      "We design systems that handle large furniture catalogs, variants, materials, dimensions, and pricing with clarity and structure.",
  },
  {
    title: "Customization",
    description:
      "We enable product configuration features such as size, finish, fabric, and options to support personalized buying experiences.",
  },
  {
    title: "Shopping & Checkout Flow",
    description:
      "We build smooth browsing, cart, and checkout experiences optimized for high-value furniture purchases and conversions.",
  },
  {
    title: "Inventory & Order Handling",
    description:
      "We integrate inventory tracking, order management, and fulfillment workflows to support accurate availability and delivery.",
  },
  {
    title: "Platform Support & Scaling",
    description:
      "We provide ongoing support to keep furniture eCommerce platforms stable, scalable, and ready for business growth.",
  },
];

export default function FurnitureEcommerceSoftwarePage() {
  return (
    <>
      <Navbar />
      <main>
        <TechnologyDetailHero
          title="Furniture eCommerce Software"
          parentLabel="Solutions"
          parentHref="/solutions"
          breadcrumbLabel="Furniture eCommerce"
        />
        <SolutionDetailOverview
          heading={
            <>
              Benefits of <span className="text-ember">Furniture eCommerce</span> Software
            </>
          }
          paragraph="At Devliora, we harness the power of artificial intelligence to create intelligent solutions that drive innovation. Our expertise in AI enables us to enhance efficiency and automate processes — discover the benefits of adopting AI for your next furniture eCommerce project."
          features={FEATURES}
        />
        <TechnologyDetailHighlight
          headline="Built to scale with your catalog"
          paragraph="Modern eCommerce platforms are designed to handle growing product catalogs and traffic without a rewrite — the same principle we apply to every furniture eCommerce platform we build, from a boutique catalog to a full warehouse operation."
          icon={ShoppingCart}
        />
        <SolutionDetailTechnologies />
        <FAQView faqs={FAQS} heading="Frequently asked questions" />
        <TechnologyDetailSpotlight />
        <UnlockProjectCTA />
        <DedicatedDevTeam />
        <UnlockProjectCTA />
        <DistributedTeamsCollaboration />
        <TechnologyDetailServices
          heading="Furniture eCommerce Software Services"
          cardLabel="Furniture eCommerce"
          paragraph="We build furniture-focused eCommerce software designed to handle complex catalogs, customization, and high-consideration buying journeys. Here's a snapshot of how our solutions support furniture brands and retailers."
          services={FURNITURE_SERVICES}
          gradient="linear-gradient(135deg, #2b1608 0%, #FF6B35 55%, #ffb088 100%)"
        />
        <UnlockProjectCTA />
        <TailoredTechSolutions />
        <SolutionsCTA />
      </main>
      <Footer />
    </>
  );
}
