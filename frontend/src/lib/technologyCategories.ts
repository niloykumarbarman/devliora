import {
  Server,
  LayoutTemplate,
  Cloud,
  Database,
  GitBranch,
  BrainCircuit,
} from "lucide-react";

export type CategoryMeta = {
  icon: typeof Server;
  title: string;
  slug: string;
  description: string;
};

export const CATEGORY_META: Record<number, CategoryMeta> = {
  0: {
    icon: Server,
    title: "Backend & APIs",
    slug: "backend-apis",
    description:
      "Type-safe, well-tested services built for correctness and long-term maintainability.",
  },
  1: {
    icon: LayoutTemplate,
    title: "Frontend & UI",
    slug: "frontend-ui",
    description:
      "Fast, accessible interfaces that hold up across devices and screen sizes.",
  },
  2: {
    icon: Cloud,
    title: "Cloud & Infrastructure",
    slug: "cloud-infrastructure",
    description:
      "Infrastructure that scales predictably and fails gracefully under load.",
  },
  3: {
    icon: Database,
    title: "Databases & Caching",
    slug: "databases-caching",
    description:
      "Data layers chosen for consistency, speed, and the access patterns that matter.",
  },
  4: {
    icon: GitBranch,
    title: "DevOps & CI/CD",
    slug: "devops-cicd",
    description:
      "Automated pipelines so every release ships the same way, every time.",
  },
  5: {
    icon: BrainCircuit,
    title: "AI/ML & Data",
    slug: "ai-ml-data",
    description:
      "Practical AI integration focused on real workflows, not novelty.",
  },
};

export const CATEGORY_ORDER = [0, 1, 2, 3, 4, 5];
