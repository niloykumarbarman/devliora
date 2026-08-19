import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { fetchTechnologyDetailPageBySlug } from "@/lib/technologyDetailPages";
import type { SiteSettingsDto } from "@/lib/siteSettings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologyDetailHero from "@/components/sections/TechnologyDetailHero";
import TechnologyDetailOverview from "@/components/sections/TechnologyDetailOverview";
import TechnologyDetailHighlight from "@/components/sections/TechnologyDetailHighlight";
import TechnologyDetailIndustries from "@/components/sections/TechnologyDetailIndustries";
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
import EnhanceTeamCTA from "@/components/sections/EnhanceTeamCTA";
import TechnologiesCTA from "@/components/sections/TechnologiesCTA";
import { ShieldCheck } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Per-slug *design* choices for the "Development Services" card — not
// text content, so not part of the admin-managed TechnologyDetailPage
// model (see lib/technologyDetailPages.ts's header comment). Any slug
// not listed here (e.g. a brand-new page created entirely through the
// admin panel) falls back to DEFAULT_VISUAL, a generic Devliora-blue
// gradient, so the page still looks intentional without needing a code
// change first.
const SERVICES_VISUALS: Record<
  string,
  { gradient: string; iconName?: string; visual?: ReactNode; settingsImageKey?: keyof SiteSettingsDto }
> = {
  "dot-net-development": {
    gradient: "linear-gradient(135deg, #241056 0%, #512BD4 55%, #8b6cf0 100%)",
    iconName: ".NET",
    settingsImageKey: "technologiesDotNetImageUrl",
  },
  "java-development": {
    gradient: "linear-gradient(135deg, #2b1608 0%, #ED8B00 55%, #f0a83d 100%)",
    visual: <CodeSnippetVisual />,
  },
};

const DEFAULT_VISUAL = {
  gradient: "linear-gradient(135deg, #0E1420 0%, #3D5AFE 55%, #7c8fff 100%)",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchTechnologyDetailPageBySlug(slug);

  if (!page) {
    return buildMetadata({
      title: "Technology | Devliora",
      description: "Technologies Devliora builds with.",
      path: `/technologies/${slug}`,
    });
  }

  return buildMetadata({
    title: `${page.heroTitle} | Devliora`,
    description: page.metaDescription || page.overviewParagraph,
    path: `/technologies/${page.slug}`,
  });
}

export default async function TechnologyDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchTechnologyDetailPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const servicesVisual = SERVICES_VISUALS[page.slug] ?? DEFAULT_VISUAL;

  const faqs = page.faqs.map((faq, i) => ({
    id: `${page.slug}-faq-${i}`,
    serviceSlug: "",
    displayOrder: faq.displayOrder,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <>
      <Navbar />
      <main>
        <TechnologyDetailHero title={page.heroTitle} />
        <TechnologyDetailOverview
          heading={page.overviewHeading}
          headingAccent={page.overviewHeadingAccent}
          paragraph={page.overviewParagraph}
          features={page.features}
        />
        {page.highlightHeadline && (
          <TechnologyDetailHighlight
            headline={page.highlightHeadline}
            paragraph={page.highlightParagraph}
            icon={ShieldCheck}
          />
        )}
        <TechnologyDetailIndustries paragraph={page.industriesParagraph} imageUrl={page.industriesImageUrl} />
        <TechnologyDetailSelectedWork />
        {faqs.length > 0 && <FAQView faqs={faqs} heading="Frequently asked questions" />}
        <TechnologyDetailSpotlight />
        <DedicatedDevTeam />
        <UnlockProjectCTA />
        <DistributedTeamsCollaboration />
        {page.services.length > 0 && (
          <TechnologyDetailServices
            heading={page.servicesHeading}
            cardLabel={page.servicesCardLabel}
            paragraph={page.servicesParagraph}
            services={page.services}
            gradient={servicesVisual.gradient}
            iconName={servicesVisual.iconName}
            imageUrl={page.servicesCardImageUrl}
            visual={servicesVisual.visual}
            settingsImageKey={servicesVisual.settingsImageKey}
          />
        )}
        <TransformTeamCTA />
        <TailoredTechSolutions />
        <EnhanceTeamCTA />
        <TechnologyDetailSelectedWork heading="More from our portfolio" start={4} />
        <TechnologiesCTA />
      </main>
      <Footer />
    </>
  );
}
