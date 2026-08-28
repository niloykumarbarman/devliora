import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/**
 * Web app manifest, served at /manifest.webmanifest and auto-linked from
 * every page's <head> by Next. Gives the site an installable identity on
 * mobile ("Add to Home Screen") and satisfies the Lighthouse PWA/SEO
 * checks. Icons reuse the existing favicon PNGs in /public; theme/
 * background colours match the layout's themeColor (--color-ink) and the
 * site's paper background.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Custom Software Development`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F3F2ED",
    theme_color: "#0E1420",
    icons: [
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
