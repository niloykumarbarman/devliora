import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { fetchTechnologyDetailPageBySlug } from "@/lib/technologyDetailPages";
import type { SiteSettingsDto } from "@/lib/siteSettings";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TechnologyDetailHero from "@/components/sections/TechnologyDetailHero";
import TechnologyDetailOverview from "@/components/sections/TechnologyDetailOverview";
import TechnologyDetailHighlight from "@/components/sections/TechnologyDetailHighlight";
import SolutionDetailTechnologies from "@/components/sections/SolutionDetailTechnologies";
import TechnologyDetailIndustries from "@/components/sections/TechnologyDetailIndustries";
import FAQView from "@/components/sections/FAQView";
import TechnologyDetailSpotlight from "@/components/sections/TechnologyDetailSpotlight";
import UnlockProjectCTA from "@/components/sections/UnlockProjectCTA";
import DedicatedDevTeam from "@/components/sections/DedicatedDevTeam";
import DistributedTeamsCollaboration from "@/components/sections/DistributedTeamsCollaboration";
import TechnologyDetailServices from "@/components/sections/TechnologyDetailServices";
import TailoredTechSolutions from "@/components/sections/TailoredTechSolutions";
import TechnologyDetailSelectedWork from "@/components/sections/TechnologyDetailSelectedWork";
import SolutionsCTA from "@/components/sections/SolutionsCTA";
import { ShoppingCart, TrendingUp } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Per-slug *design* choices — not text content, so not part of the
// admin-managed TechnologyDetailPage model (see
// lib/technologyDetailPages.ts's header comment). Any slug not listed
// here (e.g. a brand-new solution page created entirely through the
// admin panel) falls back to the DEFAULT_* values, so the page still
// looks intentional without needing a code change first.
const SERVICES_VISUALS: Record<
  string,
  { gradient: string; iconName?: string; visual?: ReactNode; settingsImageKey?: keyof SiteSettingsDto }
> = {
  "furniture-ecommerce-software": {
    gradient: "linear-gradient(135deg, #2b1608 0%, #FF6B35 55%, #ffb088 100%)",
  },
};
const DEFAULT_SERVICES_VISUAL = {
  gradient: "linear-gradient(135deg, #0E1420 0%, #3D5AFE 55%, #7c8fff 100%)",
};

const HIGHLIGHT_ICONS: Record<string, typeof ShoppingCart> = {
  "furniture-ecommerce-software": ShoppingCart,
};
const DEFAULT_HIGHLIGHT_ICON = TrendingUp;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchTechnologyDetailPageBySlug(slug);

  if (!page || page.pageType !== "solution") {
    return buildMetadata({
      title: "Solution | Devliora",
      description: "Solutions Devliora builds.",
      path: `/solutions/${slug}`,
    });
  }

  return buildMetadata({
    title: `${page.heroTitle} | Devliora`,
    description: page.metaDescription || page.overviewParagraph,
    path: `/solutions/${page.slug}`,
  });
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchTechnologyDetailPageBySlug(slug);

  if (!page || page.pageType !== "solution") {
    notFound();
  }

  const servicesVisual = SERVICES_VISUALS[page.slug] ?? DEFAULT_SERVICES_VISUAL;
  const HighlightIcon = HIGHLIGHT_ICONS[page.slug] ?? DEFAULT_HIGHLIGHT_ICON;

  const faqs = page.faqs.map((faq, i) => ({
    id: `${page.slug}-faq-${i}`,
    serviceSlug: "",
    displayOrder: faq.displayOrder,
    question: faq.question,
    answer: faq.answer,
  }));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Solutions", path: "/solutions" },
    { name: page.heroTitle, path: `/solutions/${page.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Navbar />
      <main>
        <TechnologyDetailHero
          title={page.heroTitle}
          imageUrl={page.heroImageUrl}
          parentLabel="Solutions"
          parentHref="/solutions"
        />
        <TechnologyDetailOverview
          heading={page.overviewHeading}
          headingAccent={page.overviewHeadingAccent}
          headingSuffix={page.overviewHeadingSuffix}
          paragraph={page.overviewParagraph}
          features={page.features}
        />
        {page.highlightHeadline && (
          <TechnologyDetailHighlight
            headline={page.highlightHeadline}
            paragraph={page.highlightParagraph}
            icon={HighlightIcon}
          />
        )}
        {page.showTechnologiesShowcase && <SolutionDetailTechnologies />}
        {page.industriesParagraph && (
          <TechnologyDetailIndustries paragraph={page.industriesParagraph} imageUrl={page.industriesImageUrl} />
        )}
        {faqs.length > 0 && <FAQView faqs={faqs} heading="Frequently asked questions" />}
        <TechnologyDetailSpotlight />
        <UnlockProjectCTA />
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
        <UnlockProjectCTA />
        <TailoredTechSolutions />
        <TechnologyDetailSelectedWork />
        <SolutionsCTA />
      </main>
      <Footer />
    </>
  );
}
