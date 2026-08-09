export interface SolutionItem {
  id: string;
  title: string;
  description: string;
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: "01",
    title: "Custom Software Development",
    description:
      "Bespoke applications built around your exact workflows, not forced into an off-the-shelf template — from internal tools to customer-facing platforms.",
  },
  {
    id: "02",
    title: "Legacy System Modernization",
    description:
      "Careful, incremental migration of aging systems onto modern, maintainable architectures — without disrupting the business that depends on them.",
  },
  {
    id: "03",
    title: "Cloud & DevOps Modernization",
    description:
      "Containerized, CI/CD-driven infrastructure that ships faster and fails safer, with observability and rollback built in from day one.",
  },
  {
    id: "04",
    title: "Digital Transformation Consulting",
    description:
      "A pragmatic assessment of where technology is holding your business back, and a phased roadmap to fix it without a full rebuild.",
  },
  {
    id: "05",
    title: "Data & Analytics",
    description:
      "Turning scattered operational data into dashboards and pipelines that decision-makers actually trust and use.",
  },
  {
    id: "06",
    title: "AI / ML Integration",
    description:
      "Practical, scoped AI features — not hype — added where they measurably reduce manual work or improve a product experience.",
  },
];
