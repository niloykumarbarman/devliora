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
import StatementBand from "@/components/sections/cluster/StatementBand";
import PhasedProcess from "@/components/sections/cluster/PhasedProcess";
import ClusterCTA from "@/components/sections/cluster/ClusterCTA";
import FAQView from "@/components/sections/FAQView";
import RelatedLinks from "@/components/sections/RelatedLinks";
import * as C from "@/lib/enterpriseApplicationDevelopment";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: `${C.PAGE_TITLE} Services`,
  description: C.PAGE_DESCRIPTION,
  path: C.PAGE_PATH,
});

export default function EnterpriseApplicationDevelopmentPage() {
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
          id="what-counts"
          eyebrow={C.DEFINE_EYEBROW}
          titleParts={C.DEFINE_TITLE}
          intro={C.DEFINE_INTRO}
          items={C.DEFINE_ITEMS}
          aside={C.DEFINE_ASIDE}
        />

        <CapabilityGrid
          id="capabilities"
          eyebrow={C.CAPS_EYEBROW}
          titleParts={C.CAPS_TITLE}
          intro={C.CAPS_INTRO}
          items={C.CAPS_ITEMS}
          columns={3}
        />

        <SplitFeature
          id="integration-identity"
          eyebrow={C.INTEGRATION_EYEBROW}
          titleParts={C.INTEGRATION_TITLE}
          intro={C.INTEGRATION_INTRO}
          items={C.INTEGRATION_ITEMS}
          aside={C.INTEGRATION_ASIDE}
        />

        <CapabilityGrid
          id="security-compliance"
          eyebrow={C.SECURITY_EYEBROW}
          titleParts={C.SECURITY_TITLE}
          intro={C.SECURITY_INTRO}
          items={C.SECURITY_ITEMS}
          columns={3}
        />

        <StatementBand
          id="scale-reliability"
          titleParts={C.SCALE_TITLE}
          body={C.SCALE_BODY}
          points={C.SCALE_POINTS}
        />

        <PhasedProcess
          id="process"
          eyebrow={C.PROCESS_EYEBROW}
          titleParts={C.PROCESS_TITLE}
          intro={C.PROCESS_INTRO}
          steps={C.PROCESS_STEPS}
          tone="light"
        />

        <FAQView faqs={C.FAQS} heading={C.FAQ_HEADING} />

        <RelatedLinks groups={clusterCrossLinks("enterprise")} dark />

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
