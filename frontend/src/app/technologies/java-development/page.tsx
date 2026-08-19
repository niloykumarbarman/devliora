import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologyDetailHero from "@/components/sections/TechnologyDetailHero";
import TechnologyDetailOverview from "@/components/sections/TechnologyDetailOverview";
import TechnologyDetailHighlight from "@/components/sections/TechnologyDetailHighlight";
import TechnologyDetailIndustries from "@/components/sections/TechnologyDetailIndustries";
import { ShieldCheck } from "lucide-react";
import TechnologyDetailSelectedWork from "@/components/sections/TechnologyDetailSelectedWork";
import TechnologyDetailSpotlight from "@/components/sections/TechnologyDetailSpotlight";
import FAQView from "@/components/sections/FAQView";
import DedicatedDevTeam from "@/components/sections/DedicatedDevTeam";
import UnlockProjectCTA from "@/components/sections/UnlockProjectCTA";
import DistributedTeamsCollaboration from "@/components/sections/DistributedTeamsCollaboration";
import TechnologyDetailServices from "@/components/sections/TechnologyDetailServices";
import CodeSnippetVisual from "@/components/sections/CodeSnippetVisual";
import TransformTeamCTA from "@/components/sections/TransformTeamCTA";
import TailoredTechSolutions from "@/components/sections/TailoredTechSolutions";
import TechnologiesCTA from "@/components/sections/TechnologiesCTA";
import type { FaqDto } from "@/lib/faq";

export const metadata: Metadata = buildMetadata({
  title: "Java Development | Devliora",
  description:
    "Reliable, scalable Java applications built on a mature ecosystem, designed for long-term stability and maintainability.",
  path: "/technologies/java-development",
});

// Static, page-scoped FAQ content — same reasoning as the .NET
// Development page (lib/faq.ts only scopes to Services via serviceSlug,
// and Java Development isn't a Service record). Questions confirmed
// verbatim from the kaz.com.bd/technologies/java-development reference
// screenshot (including its final answer, generic capability copy with
// no invented numbers); the other answers follow the same honest,
// no-fabrication approach as the .NET page's FAQ.
const FAQS: FaqDto[] = [
  {
    id: "timeline",
    serviceSlug: "",
    displayOrder: 0,
    question: "How long does it take to develop a Java application?",
    answer:
      "It depends on scope. A focused internal tool can take a few weeks; a full enterprise platform with multiple integrations can take several months. We scope every project individually and give you a realistic timeline before work begins, not a generic estimate.",
  },
  {
    id: "why-java",
    serviceSlug: "",
    displayOrder: 1,
    question: "Why should I choose Java for my software project?",
    answer:
      "Java gives you a mature, battle-tested platform with strong performance, a large talent pool, and decades of enterprise adoption behind it. Its \"write once, run anywhere\" model, robust security tooling, and vast library ecosystem make it a dependable choice for software you'll be running for years.",
  },
  {
    id: "integration",
    serviceSlug: "",
    displayOrder: 2,
    question: "Can you integrate a Java application with my existing systems?",
    answer:
      "Yes. Java's ecosystem is built for integration — we regularly connect Java applications to existing ERPs, CRMs, and databases through REST APIs, message queues, or direct data access, without disrupting systems that are already running in production.",
  },
  {
    id: "cost",
    serviceSlug: "",
    displayOrder: 3,
    question: "What is the cost range for developing a Java application?",
    answer:
      "Cost depends on scope, complexity, and timeline — a small internal tool costs far less than a multi-service enterprise platform. We provide a clear, itemized estimate once we understand your requirements, with no hidden fees.",
  },
  {
    id: "support",
    serviceSlug: "",
    displayOrder: 4,
    question: "Do you offer ongoing support and maintenance for Java apps?",
    answer:
      "Absolutely. We provide continuous monitoring, code optimization, updates, bug fixes, and feature enhancements to keep your Java application running smoothly.",
  },
];

const JAVA_SERVICES = [
  {
    title: "Java Consulting",
    description:
      "We help define architecture, technology choices, and development approach, ensuring your Java solution aligns with business goals, scalability needs, and long-term roadmap.",
  },
  {
    title: "Custom Java Development",
    description:
      "Our team builds tailored web, desktop, and backend applications using modern Java frameworks like Spring, focused on reliability, performance, and clean code practices.",
  },
  {
    title: "UI/UX for Java Applications",
    description:
      "We design intuitive interfaces that integrate seamlessly with Java applications, supporting usability, accessibility, and consistent user experiences.",
  },
  {
    title: "Modernization & Migration",
    description:
      "We upgrade legacy Java systems with improved performance, updated architecture, and cloud readiness, including refactoring and framework upgrades.",
  },
  {
    title: "Support & Maintenance",
    description:
      "Our ongoing support ensures your Java applications remain stable, secure, and up to date as your business and technical requirements evolve.",
  },
];

// Confirmed verbatim from the kaz.com.bd/technologies/java-development
// reference screenshot (heading, paragraph, and all 5 feature cards).
const FEATURES = [
  {
    title: "Cross-device functionality",
    body: "Java's “write once, run anywhere” capability allows us to create applications that operate on any device with a Java Virtual Machine (JVM), ensuring versatility.",
  },
  {
    title: "Strong security framework",
    body: "Java provides robust security features, including a security manager and bytecode verifier, safeguarding applications against potential threats.",
  },
  {
    title: "Comprehensive toolset",
    body: "Our Java solutions can effortlessly expand as your business grows, supporting high traffic and increasing user demands without compromising performance.",
  },
  {
    title: "Vibrant community support",
    body: "With a large, active community, Java offers a wealth of resources and documentation, ensuring ongoing support and fostering innovation.",
  },
  {
    title: "Rich development ecosystem",
    body: "Java's extensive libraries and frameworks enable us to build feature-rich applications tailored to your specific business needs.",
  },
];

export default function JavaDevelopmentPage() {
  return (
    <>
      <Navbar />
      <main>
        <TechnologyDetailHero title="Java Development" />
        <TechnologyDetailOverview
          heading="Enterprise-grade application development with"
          headingAccent="Java"
          paragraph="Java is used to build reliable, scalable applications across a range of industries. By working with its mature ecosystem and proven capabilities, solutions are designed for long-term stability and maintainability. Explore how Java can support durable, enterprise-ready systems."
          features={FEATURES}
        />
        <TechnologyDetailHighlight
          headline="Battle-tested at enterprise scale"
          paragraph="Java has powered mission-critical backend systems for decades — across banking, e-commerce, and large-scale platforms — thanks to its proven performance, mature tooling, and long-term platform stability. It's a dependable foundation for software that can't afford downtime."
          icon={ShieldCheck}
        />
        <TechnologyDetailIndustries paragraph="With experience across a wide range of sectors, we help clients innovate, scale, and succeed with Java, from fast-growing startups to established enterprises." />
        <TechnologyDetailSelectedWork />
        <FAQView faqs={FAQS} heading="Frequently asked questions" />
        <TechnologyDetailSpotlight />
        <DedicatedDevTeam />
        <UnlockProjectCTA />
        <DistributedTeamsCollaboration />
        <TechnologyDetailServices
          heading="Java Development Services"
          cardLabel="Java"
          paragraph="At Devliora, we build reliable, scalable Java solutions designed to support complex business needs. Here's a snapshot of how our Java expertise helps teams build and grow with confidence."
          services={JAVA_SERVICES}
          gradient="linear-gradient(135deg, #2b1608 0%, #ED8B00 55%, #f0a83d 100%)"
          visual={<CodeSnippetVisual />}
        />
        <TransformTeamCTA />
        <TailoredTechSolutions />
        <TechnologiesCTA />
      </main>
      <Footer />
    </>
  );
}
