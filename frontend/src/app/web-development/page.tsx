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
import CapabilityGrid from "@/components/sections/cluster/CapabilityGrid";
import SplitFeature from "@/components/sections/cluster/SplitFeature";
import PhasedProcess from "@/components/sections/cluster/PhasedProcess";
import ClusterCTA from "@/components/sections/cluster/ClusterCTA";
import FAQView from "@/components/sections/FAQView";
import RelatedLinks from "@/components/sections/RelatedLinks";
import * as C from "@/lib/webDevelopment";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: `${C.PAGE_TITLE} Services`,
  description: C.PAGE_DESCRIPTION,
  path: C.PAGE_PATH,
});

export default function WebDevelopmentPage() {
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

        <CapabilityGrid
          id="app-types"
          eyebrow={C.TYPES_EYEBROW}
          titleParts={C.TYPES_TITLE}
          intro={C.TYPES_INTRO}
          items={C.APP_TYPES}
          columns={3}
        />

        <SplitFeature
          id="stack"
          eyebrow={C.STACK_EYEBROW}
          titleParts={C.STACK_TITLE}
          intro={C.STACK_INTRO}
          items={C.STACK_ITEMS}
          aside={C.STACK_ASIDE}
        />

        <CapabilityGrid
          id="web-quality"
          eyebrow={C.QUALITY_EYEBROW}
          titleParts={C.QUALITY_TITLE}
          intro={C.QUALITY_INTRO}
          items={C.QUALITY}
          columns={3}
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

        <RelatedLinks groups={clusterCrossLinks("web")} dark />

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
