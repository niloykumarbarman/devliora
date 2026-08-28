/**
 * Strategic internal-linking helpers. One place to define the
 * descriptive anchor text for each cross-link destination and the
 * service ⇄ industry ⇄ technology ⇄ case-study ⇄ blog relationships
 * that the technology, service and blog detail pages surface.
 *
 * Anchor text is varied on purpose — the same destination gets a
 * different, context-appropriate label in different link groups rather
 * than the same exact-match phrase everywhere.
 */

export interface CrossLink {
  label: string;
  href: string;
}

export interface CrossLinkGroup {
  heading: string;
  links: CrossLink[];
}

// --- Canonical destinations, with a default descriptive anchor --------

const S = {
  pillar: { label: "Custom software development", href: "/custom-software-development" },
  engineering: { label: "Software engineering", href: "/services/software-engineering" },
  web: { label: "Web application development", href: "/web-development" },
  legacy: { label: "Legacy system modernization", href: "/legacy-modernization" },
  enterprise: { label: "Enterprise application development", href: "/enterprise-application-development" },
  ai: { label: "AI development services", href: "/services/ai-development" },
  cloud: { label: "Cloud & DevOps engineering", href: "/cloud-devops" },
  qa: { label: "QA & software testing", href: "/services/software-quality-assurance" },
  perf: { label: "Performance testing", href: "/services/performance-reliability-engineering" },
  staffAug: { label: "Dedicated development teams", href: "/services/staff-augmentation" },
  consulting: { label: "IT consulting", href: "/services/it-consulting" },
  design: { label: "Product & UI design", href: "/services/digital-design" },
  marketing: { label: "Digital marketing", href: "/services/digital-marketing" },
  support: { label: "Maintenance & support", href: "/services/it-maintenance-support" },
} as const;

const I = {
  fintech: { label: "FinTech software", href: "/industries/fintech" },
  healthcare: { label: "Healthcare software", href: "/industries/healthcare" },
  ecommerce: { label: "E-commerce & retail", href: "/industries/e-commerce-retail" },
  logistics: { label: "Logistics & supply chain", href: "/industries/logistics-supply-chain" },
  saas: { label: "SaaS & B2B platforms", href: "/industries/saas-b2b-platforms" },
  edtech: { label: "EdTech", href: "/industries/edtech" },
} as const;

const T = {
  dotnet: { label: ".NET development", href: "/technologies/dot-net-development" },
  java: { label: "Java development", href: "/technologies/java-development" },
  node: { label: "Node.js development", href: "/technologies/node-js-development" },
  python: { label: "Python development", href: "/technologies/python-development" },
  php: { label: "PHP development", href: "/technologies/php-development" },
  frontend: { label: "Frontend development", href: "/technologies/frontend-development" },
  nextjs: { label: "Next.js development", href: "/technologies/nextjs-development" },
  react: { label: "React development", href: "/technologies/frontend-development" },
  aws: { label: "AWS", href: "/technologies/aws-development" },
  azure: { label: "Azure", href: "/technologies/azure-development" },
  docker: { label: "Docker & containers", href: "/technologies/docker-development" },
  kubernetes: { label: "Kubernetes", href: "/technologies/kubernetes-development" },
  postgres: { label: "PostgreSQL", href: "/technologies/postgresql-development" },
  sqlserver: { label: "SQL Server", href: "/technologies/sql-server-development" },
  mysql: { label: "MySQL", href: "/technologies/mysql-development" },
} as const;

const PROOF: CrossLink[] = [
  { label: "Read the case studies", href: "/case-studies" },
  { label: "Engineering articles", href: "/blog" },
];

// --- Technology pages: link to services, industries, case studies, blog

type TechCategory = "backend" | "frontend" | "mobile" | "cloud" | "data" | "commerce" | "other";

const TECH_CATEGORY: Record<string, TechCategory> = {
  "dot-net-development": "backend",
  "java-development": "backend",
  "node-js-development": "backend",
  "php-development": "backend",
  "python-development": "backend",
  "frontend-development": "frontend",
  "nextjs-development": "frontend",
  "android-development": "mobile",
  "ios-development": "mobile",
  "flutter-development": "mobile",
  "aws-development": "cloud",
  "azure-development": "cloud",
  "docker-development": "cloud",
  "kubernetes-development": "cloud",
  "mysql-development": "data",
  "sql-server-development": "data",
  "postgresql-development": "data",
  "ecommerce-development": "commerce",
  "vr-development": "other",
};

const TECH_BY_CATEGORY: Record<TechCategory, { services: CrossLink[]; industries: CrossLink[] }> = {
  backend: { services: [S.engineering, S.qa, S.cloud], industries: [I.fintech, I.saas, I.healthcare] },
  frontend: { services: [S.pillar, S.web, S.engineering, S.design], industries: [I.ecommerce, I.saas] },
  mobile: { services: [S.engineering, S.qa], industries: [I.ecommerce, I.healthcare] },
  cloud: { services: [S.cloud, S.engineering, S.perf], industries: [I.saas, I.fintech, I.logistics] },
  data: { services: [S.engineering, S.perf], industries: [I.fintech, I.logistics, I.saas] },
  commerce: { services: [S.engineering, S.marketing], industries: [I.ecommerce] },
  other: { services: [S.engineering], industries: [I.saas] },
};

export function techCrossLinks(slug: string): CrossLinkGroup[] {
  const cat = TECH_CATEGORY[slug] ?? "other";
  const { services, industries } = TECH_BY_CATEGORY[cat];
  return [
    { heading: "Services", links: services },
    { heading: "Industries", links: industries },
    { heading: "Proof", links: PROOF },
  ];
}

// --- Service pages: siblings, industries, technologies, proof ---------

const SERVICE_CROSS: Record<
  string,
  { services: CrossLink[]; industries: CrossLink[]; technologies: CrossLink[] }
> = {
  "software-engineering": {
    services: [S.pillar, S.web, S.ai, S.cloud],
    industries: [I.fintech, I.saas, I.healthcare],
    technologies: [T.dotnet, T.nextjs, T.python],
  },
  "ai-development": {
    services: [S.pillar, S.engineering, S.cloud, S.consulting],
    industries: [I.saas, I.fintech, I.healthcare],
    technologies: [T.python, T.node, T.dotnet],
  },
  "software-quality-assurance": {
    services: [S.pillar, S.engineering, S.perf, S.staffAug],
    industries: [I.fintech, I.healthcare, I.ecommerce],
    technologies: [T.dotnet, T.java, T.node],
  },
  "performance-reliability-engineering": {
    services: [S.qa, S.cloud, S.engineering],
    industries: [I.saas, I.fintech, I.logistics],
    technologies: [T.kubernetes, T.postgres, T.dotnet],
  },
  "staff-augmentation": {
    services: [S.engineering, S.qa, S.consulting],
    industries: [I.saas, I.fintech, I.healthcare],
    technologies: [T.dotnet, T.node, T.react],
  },
  "it-consulting": {
    services: [S.engineering, S.cloud, S.support],
    industries: [I.healthcare, I.fintech, I.logistics],
    technologies: [T.aws, T.azure, T.dotnet],
  },
  "it-maintenance-support": {
    services: [S.engineering, S.cloud, S.qa],
    industries: [I.saas, I.ecommerce, I.logistics],
    technologies: [T.dotnet, T.node, T.aws],
  },
  "digital-design": {
    services: [S.engineering, S.marketing],
    industries: [I.ecommerce, I.saas, I.edtech],
    technologies: [T.nextjs, T.frontend],
  },
  "digital-marketing": {
    services: [S.design, S.engineering],
    industries: [I.ecommerce, I.saas],
    technologies: [T.nextjs, T.frontend],
  },
};

const SERVICE_CROSS_FALLBACK = {
  services: [S.engineering, S.ai, S.cloud],
  industries: [I.fintech, I.saas, I.healthcare],
  technologies: [T.dotnet, T.nextjs, T.aws],
};

export function serviceCrossLinks(slug: string): CrossLinkGroup[] {
  const c = SERVICE_CROSS[slug] ?? SERVICE_CROSS_FALLBACK;
  return [
    { heading: "Related services", links: c.services },
    { heading: "Industries", links: c.industries },
    { heading: "Technologies", links: c.technologies },
    { heading: "See our work", links: PROOF },
  ];
}

// --- Content cluster: the "Custom Software Development" pillar --------
//
// One pillar page (/custom-software-development) plus eight supporting
// topic pages. `clusterCrossLinks()` builds the RelatedLinks block for
// each: topic pages link *up* to the pillar and *sideways* to two or
// three siblings (varied anchors), then out to relevant technologies and
// proof. The pillar's own block fans out to every topic instead.

const CLUSTER_UP: CrossLink = { label: "Our custom software practice", href: "/custom-software-development" };
const DEVOPS_TOPIC: CrossLink = { label: "DevOps automation", href: "/cloud-devops#devops-services" };

const CLUSTER_TOPIC_LINKS: Record<string, { siblings: CrossLink[]; technologies: CrossLink[] }> = {
  pillar: {
    siblings: [S.engineering, S.web, S.ai, S.cloud, DEVOPS_TOPIC, S.qa, S.legacy, S.enterprise],
    technologies: [T.dotnet, T.nextjs, T.python, T.aws],
  },
  "software-engineering": {
    siblings: [S.web, S.enterprise, S.legacy],
    technologies: [T.dotnet, T.node, T.python],
  },
  web: {
    siblings: [S.engineering, S.ai, S.enterprise],
    technologies: [T.nextjs, T.frontend, T.node],
  },
  ai: {
    siblings: [S.engineering, S.web, S.cloud],
    technologies: [T.python, T.node],
  },
  cloud: {
    siblings: [S.engineering, S.legacy, S.enterprise],
    technologies: [T.aws, T.azure, T.kubernetes],
  },
  testing: {
    siblings: [S.engineering, S.enterprise, S.perf],
    technologies: [T.dotnet, T.node],
  },
  legacy: {
    siblings: [S.engineering, S.cloud, S.enterprise],
    technologies: [T.dotnet, T.aws, T.postgres],
  },
  enterprise: {
    siblings: [S.engineering, S.legacy, S.cloud],
    technologies: [T.dotnet, T.java, T.sqlserver],
  },
};

export function clusterCrossLinks(topicKey: string): CrossLinkGroup[] {
  const c = CLUSTER_TOPIC_LINKS[topicKey] ?? CLUSTER_TOPIC_LINKS.pillar;
  const primary: CrossLinkGroup =
    topicKey === "pillar"
      ? { heading: "Explore the practice", links: c.siblings }
      : { heading: "Custom software development", links: [CLUSTER_UP, ...c.siblings] };
  return [
    primary,
    { heading: "Technologies", links: c.technologies },
    { heading: "Proof", links: PROOF },
  ];
}

// --- Blog articles: a related service, technology and industry -------

const BLOG_CATEGORY_LINKS: Record<string, { service: CrossLink; technology?: CrossLink }> = {
  ai: { service: S.ai, technology: T.python },
  devops: { service: S.cloud, technology: T.kubernetes },
  dotnet: { service: S.engineering, technology: T.dotnet },
  "custom-software": { service: S.pillar, technology: T.nextjs },
  "web-development": { service: S.web, technology: T.nextjs },
  legacy: { service: S.legacy, technology: T.dotnet },
  enterprise: { service: S.enterprise, technology: T.dotnet },
  "data-analytics": { service: S.engineering, technology: T.postgres },
  engineering: { service: S.engineering, technology: T.nextjs },
};

export function blogCrossLinks(categoryKey: string): CrossLink[] {
  const c = BLOG_CATEGORY_LINKS[categoryKey] ?? BLOG_CATEGORY_LINKS.engineering;
  const links = [c.service];
  if (c.technology) links.push(c.technology);
  return links;
}
