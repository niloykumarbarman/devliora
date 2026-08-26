import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";
import CloudDevOpsHero from "@/components/sections/cloud-devops/CloudDevOpsHero";
import CloudPlatforms from "@/components/sections/cloud-devops/CloudPlatforms";
import DevOpsStack from "@/components/sections/cloud-devops/DevOpsStack";
import CiCdPipeline from "@/components/sections/cloud-devops/CiCdPipeline";
import CloudArchitecture from "@/components/sections/cloud-devops/CloudArchitecture";
import InfrastructureAsCode from "@/components/sections/cloud-devops/InfrastructureAsCode";
import CloudSecurity from "@/components/sections/cloud-devops/CloudSecurity";
import ProductionDeployment from "@/components/sections/cloud-devops/ProductionDeployment";
import MonitoringDashboard from "@/components/sections/cloud-devops/MonitoringDashboard";
import BuiltForProduction from "@/components/sections/cloud-devops/BuiltForProduction";
import SiteTechArchitecture from "@/components/sections/cloud-devops/SiteTechArchitecture";
import DevOpsServices from "@/components/sections/cloud-devops/DevOpsServices";
import CloudDevOpsCTA from "@/components/sections/cloud-devops/CloudDevOpsCTA";

const PAGE_PATH = "/cloud-devops";
const PAGE_TITLE = "Cloud Infrastructure & DevOps Engineering | Devliora";
const PAGE_DESCRIPTION =
  "Devliora designs, automates and operates production cloud infrastructure — AWS, Azure, Google Cloud, Kubernetes, Terraform, CI/CD pipelines, monitoring, observability and cloud security for teams that need reliable software delivery.";

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
});

export default function CloudDevOpsPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Services", path: "/services" },
    { name: "Cloud Infrastructure & DevOps", path: PAGE_PATH },
  ]);
  const service = serviceJsonLd({
    name: "Cloud Infrastructure & DevOps Engineering",
    description:
      "Cloud architecture, CI/CD automation, Docker and Kubernetes, cloud migration, Infrastructure as Code, monitoring and observability, cloud security and high-availability engineering.",
    path: PAGE_PATH,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <Navbar />
      <main>
        <CloudDevOpsHero />
        <CloudPlatforms />
        <DevOpsStack />
        <CiCdPipeline />
        <CloudArchitecture />
        <InfrastructureAsCode />
        <CloudSecurity />
        <ProductionDeployment />
        <MonitoringDashboard />
        <BuiltForProduction />
        <SiteTechArchitecture />
        <DevOpsServices />
        <CloudDevOpsCTA />
      </main>
      <Footer />
    </>
  );
}
