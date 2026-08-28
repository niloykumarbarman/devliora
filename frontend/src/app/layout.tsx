import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { organizationJsonLd, websiteJsonLd, siteConfig } from "@/lib/seo";
import Analytics from "@/components/Analytics";
import AssistantChatLoader from "@/components/AssistantChatLoader";
import JsonLd from "@/components/JsonLd";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Site-ownership verification tokens for Google Search Console and Bing
// Webmaster Tools. These are NOT secrets — they end up as public <meta>
// tags in every page's <head> — but they're kept in env vars so the
// value isn't hard-coded and each environment can carry its own (or
// none). Rendered only when set, so no empty `content=""` tag appears.
// See README "Environment variables" and infra/docker/.env.example.
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

const verification: Metadata["verification"] = {
  ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
  ...(bingSiteVerification
    ? { other: { "msvalidate.01": bingSiteVerification } }
    : {}),
};

// Root layout metadata is deliberately minimal: metadataBase, the title
// template/fallback, a brand-level description, icons, and the
// site-verification tokens (which are genuinely site-wide). Per-page
// title, canonical, robots, Open Graph and Twitter tags all come from
// buildMetadata in each route (the homepage's live in app/page.tsx).
// buildMetadata never sets `verification`, so the value here survives
// Next's shallow per-route merge onto every page. Keeping
// `robots`/`openGraph` out of here means a notFound() response inherits
// only Next's own `noindex` rather than a stray "index" tag.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Custom Software Development Company | Devliora",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  ...(Object.keys(verification).length > 0 ? { verification } : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

// Explicit mobile viewport. Next's implicit default is already
// `width=device-width, initial-scale=1`; spelling it out here also lets
// the page use the full screen on notched phones (`viewport-fit=cover`,
// paired with `env(safe-area-inset-*)` padding in globals.css) and never
// blocks pinch-zoom (accessibility — no `maximum-scale`/`user-scalable`).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E1420",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-graphite">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Analytics />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
        <AssistantChatLoader />
      </body>
    </html>
  );
}
