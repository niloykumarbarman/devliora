import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologyDetailHero from "@/components/sections/TechnologyDetailHero";
import TechnologyDetailOverview from "@/components/sections/TechnologyDetailOverview";
import TechnologyDetailIndustries from "@/components/sections/TechnologyDetailIndustries";
import TechnologyDetailSelectedWork from "@/components/sections/TechnologyDetailSelectedWork";
import TechnologyDetailSpotlight from "@/components/sections/TechnologyDetailSpotlight";
import FAQView from "@/components/sections/FAQView";
import DedicatedDevTeam from "@/components/sections/DedicatedDevTeam";
import UnlockProjectCTA from "@/components/sections/UnlockProjectCTA";
import DistributedTeamsCollaboration from "@/components/sections/DistributedTeamsCollaboration";
import TechnologyDetailServices from "@/components/sections/TechnologyDetailServices";
import TransformTeamCTA from "@/components/sections/TransformTeamCTA";
import TailoredTechSolutions from "@/components/sections/TailoredTechSolutions";
import TechnologiesCTA from "@/components/sections/TechnologiesCTA";
import type { FaqDto } from "@/lib/faq";

export const metadata: Metadata = buildMetadata({
  title: ".NET Development | Devliora",
  description:
    "Secure, high-performing .NET applications built for reliability, scalability, and long-term maintainability.",
  path: "/technologies/dot-net-development",
});

// Static, page-scoped FAQ content — the site's admin-managed FAQ system
// (lib/faq.ts) only scopes items to a Service via serviceSlug, and .NET
// Development isn't a Service record, so these aren't sourced from the
// backend the way the homepage/service FAQs are. Answers are written to
// be honestly true for Devliora without inventing numbers (e.g. no
// specific price figures — cost is scoped per project, matching how
// PricingModels.tsx already avoids quoting numbers).
const FAQS: FaqDto[] = [
  {
    id: "timeline",
    serviceSlug: "",
    displayOrder: 0,
    question: "How long does it take to build a .NET application?",
    answer:
      "It depends on scope. A focused internal tool can take a few weeks; a full enterprise platform with multiple integrations can take several months. We scope every project individually and give you a realistic timeline before work begins, not a generic estimate.",
  },
  {
    id: "why-dotnet",
    serviceSlug: "",
    displayOrder: 1,
    question: "Why should I choose .NET for my enterprise software project?",
    answer:
      ".NET gives you a mature, well-supported platform with strong performance, built-in security, and first-class tooling for large codebases. It runs cross-platform via .NET Core, integrates cleanly with the rest of the Microsoft ecosystem, and has the long-term backing to support software you'll be running for years.",
  },
  {
    id: "integration",
    serviceSlug: "",
    displayOrder: 2,
    question: "Can you integrate a .NET application with my existing systems (ERP, CRM, databases)?",
    answer:
      "Yes. ASP.NET Core is built for integration — we regularly connect .NET applications to existing ERPs, CRMs, and databases through REST APIs, message queues, or direct data access, without disrupting systems that are already running in production.",
  },
  {
    id: "cost",
    serviceSlug: "",
    displayOrder: 3,
    question: "What is the cost range for developing a .NET solution?",
    answer:
      "Cost depends on scope, complexity, and timeline — a small internal tool costs far less than a multi-service enterprise platform. We provide a clear, itemized estimate once we understand your requirements, with no hidden fees.",
  },
  {
    id: "support",
    serviceSlug: "",
    displayOrder: 4,
    question: "Do you provide ongoing support and maintenance for .NET applications?",
    answer:
      "Yes — through our IT Maintenance & Support service we handle monitoring, security patches, performance tuning, and feature updates after launch, so your application stays reliable long after the initial release.",
  },
];

const DOTNET_SERVICES = [
  {
    title: ".NET Consulting",
    description:
      "We help define architecture, technology choices, and development approach, ensuring your .NET solution aligns with business goals, scalability needs, and long-term roadmap.",
  },
  {
    title: "Custom .NET Development",
    description:
      "Our team builds tailored web, desktop, and backend applications using modern .NET frameworks, focused on reliability, performance, and clean code practices.",
  },
  {
    title: "UI/UX for .NET Applications",
    description:
      "We design intuitive interfaces that integrate seamlessly with .NET applications, supporting usability, accessibility, and consistent user experiences.",
  },
  {
    title: "Modernization & Migration",
    description:
      "We upgrade legacy .NET systems with improved performance, updated architecture, and cloud readiness, including refactoring and framework upgrades.",
  },
  {
    title: "Support & Maintenance",
    description:
      "Our ongoing support ensures your .NET applications remain stable, secure, and up to date as your business and technical requirements evolve.",
  },
];

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
        <TechnologyDetailIndustries paragraph="With experience across a wide range of sectors, we help clients innovate, scale, and succeed with .NET, from fast-growing startups to established enterprises." />
        <TechnologyDetailSelectedWork />
        <FAQView faqs={FAQS} heading="Frequently asked questions" />
        <TechnologyDetailSpotlight />
        <DedicatedDevTeam />
        <UnlockProjectCTA />
        <DistributedTeamsCollaboration />
        <TechnologyDetailServices
          heading=".NET Development Services"
          cardLabel=".NET Core"
          paragraph="At Devliora, we deliver end-to-end .NET solutions built for performance, security, and long-term maintainability. Here's a snapshot of what our .NET expertise covers."
          services={DOTNET_SERVICES}
        />
        <TransformTeamCTA />
        <TailoredTechSolutions />
        <TechnologiesCTA />
      </main>
      <Footer />
    </>
  );
}
