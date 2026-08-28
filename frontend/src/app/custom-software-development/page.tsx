import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  serviceJsonLd,
  siteConfig,
  webPageJsonLd,
} from "@/lib/seo";
import { clusterCrossLinks } from "@/lib/crossLinks";
import ClusterHero from "@/components/sections/cluster/ClusterHero";
import SplitFeature from "@/components/sections/cluster/SplitFeature";
import CapabilityGrid from "@/components/sections/cluster/CapabilityGrid";
import ClusterHub from "@/components/sections/cluster/ClusterHub";
import PhasedProcess from "@/components/sections/cluster/PhasedProcess";
import ComparisonRows from "@/components/sections/cluster/ComparisonRows";
import ClusterCTA from "@/components/sections/cluster/ClusterCTA";
import FAQView from "@/components/sections/FAQView";
import RelatedLinks from "@/components/sections/RelatedLinks";
import * as C from "@/lib/customSoftwareDevelopment";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: `${C.PAGE_TITLE} Services`,
  description: C.PAGE_DESCRIPTION,
  path: C.PAGE_PATH,
});

export default function CustomSoftwareDevelopmentPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Services", path: "/services" },
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

  // Visible ClusterHub ⇄ this ItemList: the supporting topics of the
  // pillar, in the same order, as an explicit structured signal that
  // these pages form one cluster.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}${C.PAGE_PATH}#cluster`,
    name: "Custom software development — supporting topics",
    itemListElement: C.CLUSTER_TOPICS.map((topic, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: topic.label,
      url: `${siteConfig.url}${topic.href.split("#")[0]}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={service} />
      <JsonLd data={webPage} />
      <JsonLd data={itemList} />
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

        <SplitFeature
          id="when-custom"
          eyebrow={C.WHEN_CUSTOM_EYEBROW}
          titleParts={C.WHEN_CUSTOM_TITLE}
          intro={C.WHEN_CUSTOM_INTRO}
          items={C.WHEN_CUSTOM_ITEMS}
          aside={C.WHEN_CUSTOM_ASIDE}
        />

        <CapabilityGrid
          id="what-we-build"
          eyebrow={C.CAPABILITIES_EYEBROW}
          titleParts={C.CAPABILITIES_TITLE}
          intro={C.CAPABILITIES_INTRO}
          items={C.CAPABILITIES}
          columns={4}
        />

        <ClusterHub
          eyebrow={C.CLUSTER_EYEBROW}
          titleParts={C.CLUSTER_TITLE}
          intro={C.CLUSTER_INTRO}
          topics={C.CLUSTER_TOPICS}
        />

        <PhasedProcess
          id="process"
          eyebrow={C.PROCESS_EYEBROW}
          titleParts={C.PROCESS_TITLE}
          intro={C.PROCESS_INTRO}
          steps={C.PROCESS_STEPS}
          tone="dark"
        />

        <CapabilityGrid
          id="standards"
          eyebrow={C.STANDARDS_EYEBROW}
          titleParts={C.STANDARDS_TITLE}
          intro={C.STANDARDS_INTRO}
          items={C.STANDARDS}
          columns={3}
        />

        <ComparisonRows
          id="custom-vs-off-the-shelf"
          eyebrow={C.COMPARE_EYEBROW}
          titleParts={C.COMPARE_TITLE}
          intro={C.COMPARE_INTRO}
          leftHeading={C.COMPARE_LEFT}
          rightHeading={C.COMPARE_RIGHT}
          rows={C.COMPARE_ROWS}
        />

        <CapabilityGrid
          id="engagement-models"
          eyebrow={C.MODELS_EYEBROW}
          titleParts={C.MODELS_TITLE}
          intro={C.MODELS_INTRO}
          items={C.MODELS}
          columns={3}
        />

        <FAQView faqs={C.FAQS} heading={C.FAQ_HEADING} />

        <RelatedLinks groups={clusterCrossLinks("pillar")} dark />

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
