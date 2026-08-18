import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologyDetailHero from "@/components/sections/TechnologyDetailHero";
import TechnologyDetailOverview from "@/components/sections/TechnologyDetailOverview";
import TechnologiesCTA from "@/components/sections/TechnologiesCTA";

export const metadata: Metadata = buildMetadata({
  title: ".NET Development | Devliora",
  description:
    "Secure, high-performing .NET applications built for reliability, scalability, and long-term maintainability.",
  path: "/technologies/dot-net-development",
});

const FEATURES = [
  {
    title: "Cross-platform compatibility",
    body: "With .NET Core, we build applications that run seamlessly on Windows, macOS, and Linux, giving your users broader accessibility without extra engineering overhead.",
  },
  {
    title: "Accelerated development",
    body: ".NET's extensive libraries and tooling speed up the development process, letting us deliver production-ready solutions quickly without cutting corners on quality.",
  },
  {
    title: "Robust security measures",
    body: ".NET ships with built-in security features that protect your applications from common threats while keeping user and business data safe.",
  },
  {
    title: "Seamless scalability",
    body: "Our .NET solutions are architected to scale effortlessly, handling growing traffic and increasing user demand without a rewrite.",
  },
  {
    title: "Comprehensive toolset",
    body: "We draw on the full breadth of the .NET ecosystem, from ASP.NET Core to Entity Framework, to extend functionality and keep development moving smoothly from first sprint to launch.",
  },
];

export default function DotNetDevelopmentPage() {
  return (
    <>
      <Navbar />
      <main>
        <TechnologyDetailHero title=".NET Development" />
        <TechnologyDetailOverview
          heading="Build Powerful Solutions with"
          headingAccent=".NET"
          paragraph="From enterprise-grade platforms to fast-moving internal tools, .NET gives us the reliability and performance modern businesses need. With deep experience across the .NET ecosystem, we deliver secure, high-performing applications built to your exact specification, with seamless integration and architecture that holds up as requirements change."
          features={FEATURES}
        />
        <TechnologiesCTA />
      </main>
      <Footer />
    </>
  );
}
