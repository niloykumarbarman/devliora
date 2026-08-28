/**
 * Blog taxonomy — category, tags and the related service for each post.
 *
 * The BlogPost CMS model has no category/tags fields, so this lives here
 * keyed by slug (the same per-slug pattern used for technology,
 * solution, industry and case-study enrichment). A post that isn't
 * listed still gets a sensible category from `categoryForPost()`'s
 * keyword heuristic, so publishing a new post doesn't require a code
 * change — but adding an explicit entry makes the category, tags and
 * related-service link exact.
 *
 * When the CMS gains real category/tags fields, migrate this map into
 * it and delete the heuristic.
 */

export interface BlogCategory {
  name: string;
  /** Used only as a stable key / analytics label — there are no
   *  /blog/category/[x] routes (faceted category pages are a thin-content
   *  risk and aren't part of the architecture). */
  key: string;
  relatedService: { label: string; href: string };
}

export const BLOG_CATEGORIES = {
  "custom-software": {
    name: "Custom Software",
    key: "custom-software",
    relatedService: {
      label: "Custom Software Development",
      href: "/custom-software-development",
    },
  },
  ai: {
    name: "AI",
    key: "ai",
    relatedService: { label: "AI Development", href: "/services/ai-development" },
  },
  "data-analytics": {
    name: "Data & Analytics",
    key: "data-analytics",
    relatedService: {
      label: "Software Engineering",
      href: "/services/software-engineering",
    },
  },
  devops: {
    name: "Cloud & DevOps",
    key: "devops",
    relatedService: {
      label: "Cloud Infrastructure & DevOps",
      href: "/cloud-devops",
    },
  },
  dotnet: {
    name: ".NET",
    key: "dotnet",
    relatedService: {
      label: "Software Engineering",
      href: "/services/software-engineering",
    },
  },
  engineering: {
    name: "Engineering",
    key: "engineering",
    relatedService: {
      label: "Software Engineering",
      href: "/services/software-engineering",
    },
  },
} as const satisfies Record<string, BlogCategory>;

export type BlogCategoryKey = keyof typeof BLOG_CATEGORIES;

interface BlogEntry {
  category: BlogCategoryKey;
  tags: string[];
  /** Overrides the category's default related service for this post. */
  relatedService?: { label: string; href: string };
}

export const BLOG_CONTENT: Record<string, BlogEntry> = {
  "ai-furniture-manufacturing": {
    category: "ai",
    tags: ["Computer vision", "Manufacturing", "Predictive maintenance"],
  },
  "drone-technology-agriculture-software": {
    category: "ai",
    tags: ["Drones", "Agritech", "Remote sensing"],
  },
  "smart-sensor-agriculture": {
    category: "ai",
    tags: ["IoT", "Agritech", "Sensor data"],
  },
  "ai-clinical-encounter-automation": {
    category: "ai",
    tags: ["Healthcare", "NLP", "Automation"],
  },
  "music-app-african-market": {
    category: "engineering",
    tags: ["Mobile", "Product", "Emerging markets"],
  },
  "big-data-analytics-platform": {
    category: "data-analytics",
    tags: ["Big data", "Data pipelines", "Analytics"],
  },
  "purchase-order-automation": {
    category: "ai",
    tags: ["Automation", "Document AI", "Procurement"],
  },
  "smart-city-iot-software": {
    category: "engineering",
    tags: ["IoT", "Smart city", "Real-time systems"],
  },
  "ethical-ai-for-children": {
    category: "ai",
    tags: ["Responsible AI", "Product design", "Compliance"],
  },
  "ai-regulatory-compliance": {
    category: "ai",
    tags: ["Compliance", "RegTech", "Governance"],
  },
  "saas-cross-platform-video-development": {
    category: "engineering",
    tags: ["SaaS", "Video", "Cross-platform"],
  },
  "machine-learning-fraud-detection": {
    category: "ai",
    tags: ["Machine learning", "Fraud", "FinTech"],
  },
  "business-spatial-analytics-location-intelligence": {
    category: "data-analytics",
    tags: ["Geospatial", "Location intelligence", "Analytics"],
  },
  "smarter-faster-accurate-tax-management": {
    category: "ai",
    tags: ["Automation", "Tax", "Document AI"],
  },
};

// Keyword → category fallback for posts not in BLOG_CONTENT. Ordered:
// first match wins.
const CATEGORY_KEYWORDS: [BlogCategoryKey, RegExp][] = [
  ["dotnet", /\b(\.net|dotnet|asp\.net|aspnet|c#|entity framework)\b/i],
  ["devops", /\b(devops|ci\/cd|cicd|kubernetes|docker|terraform|pipeline|cloud infrastructure|observability)\b/i],
  ["ai", /\b(ai|artificial intelligence|machine learning|ml|llm|genai|automation|computer vision|nlp)\b/i],
  ["data-analytics", /\b(data|analytics|etl|warehouse|pipeline|geospatial|big data)\b/i],
  ["custom-software", /\b(custom software|saas vs|legacy|modernization|modernisation|enterprise software|enterprise application|build vs buy|web app|web application|web development)\b/i],
];

export function categoryForPost(slug: string, title: string): BlogCategory {
  const entry = BLOG_CONTENT[slug];
  if (entry) return BLOG_CATEGORIES[entry.category];

  const haystack = `${slug} ${title}`;
  for (const [key, re] of CATEGORY_KEYWORDS) {
    if (re.test(haystack)) return BLOG_CATEGORIES[key];
  }
  return BLOG_CATEGORIES.engineering;
}

export function tagsForPost(slug: string): string[] {
  return BLOG_CONTENT[slug]?.tags ?? [];
}
