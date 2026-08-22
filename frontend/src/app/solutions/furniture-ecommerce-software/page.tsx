import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologyDetailHero from "@/components/sections/TechnologyDetailHero";
import SolutionDetailOverview from "@/components/sections/SolutionDetailOverview";
import SolutionsCTA from "@/components/sections/SolutionsCTA";

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
        <SolutionsCTA />
      </main>
      <Footer />
    </>
  );
}
