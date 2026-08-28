import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/**
 * Every public page is crawlable. Only genuinely private or
 * machine-only paths are blocked:
 *   /admin    — auth-gated CMS UI, also X-Robots-Tag: noindex (next.config)
 *   /api/     — JSON endpoints served on this origin by the backend;
 *               nothing to index and a waste of crawl budget
 *   /scalar   — the OpenAPI reference playground, a developer tool
 *
 * Note: Cloudflare prepends its own "Managed content" block (AI-crawler
 * rules + Content-Signal) to the served /robots.txt from the dashboard.
 * That is not controlled here; this function only produces the
 * site-owned section.
 */
export default function robots(): MetadataRoute.Robots {
  const host = new URL(siteConfig.url).host;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/scalar"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host,
  };
}
