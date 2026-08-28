import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { clusterCrossLinks } from "@/lib/crossLinks";
import ClusterHero from "@/components/sections/cluster/ClusterHero";
import ClusterBackLink from "@/components/sections/cluster/ClusterBackLink";
import SplitFeature from "@/components/sections/cluster/SplitFeature";
import CapabilityGrid from "@/components/sections/cluster/CapabilityGrid";
import PhasedProcess from "@/components/sections/cluster/PhasedProcess";
import ClusterCTA from "@/components/sections/cluster/ClusterCTA";
import ModernizationApproach from "@/components/sections/legacy-modernization/ModernizationApproach";
import FAQView from "@/components/sections/FAQView";
import RelatedLinks from "@/components/sections/RelatedLinks";
import * as C from "@/lib/legacyModernization";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: `${C.PAGE_TITLE} Services`,
  description: C.PAGE_DESCRIPTION,
  path: C.PAGE_PATH,
});

export default function LegacyModernizationPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Custom Software Development", path: "/custom-software-development" },
    { name: C.PAGE_TITLE, path: C.PAGE_PATH },
  ]);
  const service = serviceJsonLd({
    name: C.PAGE_TITLE,
    description: C.PAGE_DESCRIPTION,
    path: C.PAGE_PATH,
  });
  const webPage = webPageJsonLd({
    path: C.PAGE_PATH,
    name: `${C.PAGE_TITLE} Services`,
    description: C.PAGE_DESCRIPTION,
  });
  const faq = faqPageJsonLd(
    C.FAQS.map((f) => ({ question: f.question, answer: f.answer })),
    C.PAGE_PATH
  );

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={service} />
      <JsonLd data={webPage} />
      {faq && (
        <JsonLd data={faq} />
      )}

      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <ClusterHero
          eyebrow={C.HERO_EYEBROW}
          breadcrumb={C.HERO_BREADCRUMB}
          titleParts={C.HERO_TITLE}
          intro={C.HERO_INTRO}
          primaryCta={C.HERO_PRIMARY_CTA}
          secondaryCta={C.HERO_SECONDARY_CTA}
          chips={C.HERO_CHIPS}
        />
        <ClusterBackLink label={C.BACK_LINK_LABEL} />

        <SplitFeature
          id="signs"
          eyebrow={C.SIGNS_EYEBROW}
          titleParts={C.SIGNS_TITLE}
          intro={C.SIGNS_INTRO}
          items={C.SIGNS_ITEMS}
          aside={C.SIGNS_ASIDE}
        />

        <CapabilityGrid
          id="assessment"
          eyebrow={C.ASSESS_EYEBROW}
          titleParts={C.ASSESS_TITLE}
          intro={C.ASSESS_INTRO}
          items={C.ASSESS_ITEMS}
          columns={3}
        />

        <ModernizationApproach />

        <CapabilityGrid
          id="risk-controls"
          eyebrow={C.RISK_EYEBROW}
          titleParts={C.RISK_TITLE}
          intro={C.RISK_INTRO}
          items={C.RISK_ITEMS}
          columns={2}
        />

        <PhasedProcess
          id="process"
          eyebrow={C.PROCESS_EYEBROW}
          titleParts={C.PROCESS_TITLE}
          intro={C.PROCESS_INTRO}
          steps={C.PROCESS_STEPS}
          tone="dark"
        />

        <FAQView faqs={C.FAQS} heading={C.FAQ_HEADING} />

        <RelatedLinks groups={clusterCrossLinks("legacy")} dark />

        <ClusterCTA
          titleParts={C.CTA_TITLE}
          body={C.CTA_BODY}
          primaryCta={C.CTA_PRIMARY}
          secondaryCta={C.CTA_SECONDARY}
        />
      </main>
      <Footer />
    </>
  );
}
