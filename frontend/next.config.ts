import type { NextConfig } from "next";

// Single canonical host for the whole site. Every other SEO surface
// (siteConfig.url, canonical tags, sitemap, JSON-LD, llms.txt) uses this
// same non-www origin; the redirect below makes the server agree.
const CANONICAL_HOST = "devliora.com";

const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy for the HTML pages served by this app. The
// backend API sets its own (much tighter) CSP on /api responses; this
// one has to accommodate what the marketing site actually loads:
//   - Next.js' own inline bootstrap/flight scripts and the GA4 / Clarity
//     inline init snippets  -> 'unsafe-inline' in script-src (no nonce
//     pipeline; revisit if one is added).
//   - Tailwind's stylesheet + React inline style props -> style-src
//     'self' 'unsafe-inline'.
//   - GA4 + Microsoft Clarity: script hosts, plus their beacon/ingest
//     endpoints in connect-src and img-src.
//   - The Google Maps office embeds in ContactLocations -> frame-src.
//   - Remote image hosts in next.config `images.remotePatterns`.
// Fonts are self-hosted by next/font, so font-src is just 'self'.
// 'unsafe-eval' is deliberately absent (only Turbopack dev needs it, and
// this CSP is production-only).
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://placehold.co https://media.istockphoto.com https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms",
  "frame-src https://www.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Applied to every route. HSTS + CSP are production-only: HSTS must not
// be sent over plain-HTTP local dev, and the CSP above would break
// Turbopack's eval-based HMR.
const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
        { key: "Content-Security-Policy", value: CSP },
      ]
    : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Tree-shake large barrel packages down to just the modules actually
  // imported. `lucide-react` is on Next's default list already; pinned
  // here so it stays explicit. `framer-motion` was removed entirely in
  // Phase 15 — scroll reveals are CSS now (globals.css / Reveal.tsx).
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Default is already false, but pin it: Next then 308-redirects any
  // "/path/" to "/path", so a URL has exactly one form and canonical
  // tags / sitemap entries (all emitted without a trailing slash) can
  // never disagree with the address bar.
  trailingSlash: false,
  // Don't advertise the framework.
  poweredByHeader: false,
  // Host canonicalization. Historically both devliora.com and
  // www.devliora.com answered 200 (nginx serves them from one block),
  // which splits ranking signals and lets Google index both. This is a
  // portable backstop that 301s www -> non-www for every path; the same
  // rule also lives in infra/nginx so it fires at the edge before the
  // app is even hit. `has` host match means it never loops (after the
  // redirect the host no longer matches).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },

      // Canonical service-URL architecture. These slugs are the common
      // search-intent names for services Devliora already delivers, each
      // under one canonical page. Rather than spin up thin, near-duplicate
      // "doorway" pages, every synonym 301s to the real service so the URL
      // resolves and any link equity consolidates onto a single page. The
      // synonym keywords are targeted in the destination pages' own copy,
      // not with extra URLs. Reverse any of these if a genuinely distinct
      // page is later authored for that slug.
      // Phase 21 authored genuinely distinct pages for these topics, so
      // these synonyms now point at the real pages instead of folding
      // into /services/software-engineering (see the note above).
      {
        source: "/services/custom-software-development",
        destination: "/custom-software-development",
        permanent: true,
      },
      {
        source: "/custom-software",
        destination: "/custom-software-development",
        permanent: true,
      },
      {
        source: "/software-development",
        destination: "/custom-software-development",
        permanent: true,
      },
      {
        source: "/services/web-development",
        destination: "/web-development",
        permanent: true,
      },
      {
        source: "/web-app-development",
        destination: "/web-development",
        permanent: true,
      },
      {
        source: "/services/web-app-development",
        destination: "/web-development",
        permanent: true,
      },
      {
        source: "/legacy-software-modernization",
        destination: "/legacy-modernization",
        permanent: true,
      },
      {
        source: "/application-modernization",
        destination: "/legacy-modernization",
        permanent: true,
      },
      {
        source: "/services/legacy-modernization",
        destination: "/legacy-modernization",
        permanent: true,
      },
      {
        source: "/enterprise-applications",
        destination: "/enterprise-application-development",
        permanent: true,
      },
      {
        source: "/enterprise-software",
        destination: "/enterprise-application-development",
        permanent: true,
      },
      {
        source: "/services/enterprise-application-development",
        destination: "/enterprise-application-development",
        permanent: true,
      },
      {
        source: "/services/software-testing",
        destination: "/services/software-quality-assurance",
        permanent: true,
      },
      {
        source: "/services/performance-testing",
        destination: "/services/performance-reliability-engineering",
        permanent: true,
      },
      {
        source: "/services/software-maintenance",
        destination: "/services/it-maintenance-support",
        permanent: true,
      },
      {
        // Cloud & DevOps has its own dedicated capability page outside the
        // /services/[slug] system.
        source: "/services/devops-cloud",
        destination: "/cloud-devops",
        permanent: true,
      },

      // Canonical technology-URL architecture. Every /technologies/[slug]
      // page follows one naming convention, `<tech>-development`. These
      // 301s map the common short names people actually search and link
      // to onto that canonical slug, so both forms resolve to the one
      // real page rather than a duplicate. The four infra/runtime pages
      // (nextjs, postgresql, docker, kubernetes) are seeded in the
      // backend — see 20260828120000_SeedInfraTechnologyDetailPages.
      { source: "/technologies/aspnet-core", destination: "/technologies/dot-net-development", permanent: true },
      { source: "/technologies/dotnet", destination: "/technologies/dot-net-development", permanent: true },
      { source: "/technologies/react", destination: "/technologies/frontend-development", permanent: true },
      { source: "/technologies/reactjs", destination: "/technologies/frontend-development", permanent: true },
      { source: "/technologies/nodejs", destination: "/technologies/node-js-development", permanent: true },
      { source: "/technologies/node", destination: "/technologies/node-js-development", permanent: true },
      { source: "/technologies/python", destination: "/technologies/python-development", permanent: true },
      { source: "/technologies/php", destination: "/technologies/php-development", permanent: true },
      { source: "/technologies/java", destination: "/technologies/java-development", permanent: true },
      { source: "/technologies/flutter", destination: "/technologies/flutter-development", permanent: true },
      { source: "/technologies/mysql", destination: "/technologies/mysql-development", permanent: true },
      { source: "/technologies/sql-server", destination: "/technologies/sql-server-development", permanent: true },
      { source: "/technologies/sqlserver", destination: "/technologies/sql-server-development", permanent: true },
      { source: "/technologies/aws", destination: "/technologies/aws-development", permanent: true },
      { source: "/technologies/azure", destination: "/technologies/azure-development", permanent: true },
      { source: "/technologies/nextjs", destination: "/technologies/nextjs-development", permanent: true },
      { source: "/technologies/next-js", destination: "/technologies/nextjs-development", permanent: true },
      { source: "/technologies/postgresql", destination: "/technologies/postgresql-development", permanent: true },
      { source: "/technologies/postgres", destination: "/technologies/postgresql-development", permanent: true },
      { source: "/technologies/docker", destination: "/technologies/docker-development", permanent: true },
      { source: "/technologies/kubernetes", destination: "/technologies/kubernetes-development", permanent: true },
      { source: "/technologies/k8s", destination: "/technologies/kubernetes-development", permanent: true },

      // Canonical industry-URL architecture. fintech, healthcare and
      // edtech are already the real slugs; these map the short names
      // people search for onto the existing longer slugs so there's one
      // page per industry, never a duplicate.
      { source: "/industries/ecommerce", destination: "/industries/e-commerce-retail", permanent: true },
      { source: "/industries/e-commerce", destination: "/industries/e-commerce-retail", permanent: true },
      { source: "/industries/retail", destination: "/industries/e-commerce-retail", permanent: true },
      { source: "/industries/logistics", destination: "/industries/logistics-supply-chain", permanent: true },
      { source: "/industries/supply-chain", destination: "/industries/logistics-supply-chain", permanent: true },
      { source: "/industries/saas", destination: "/industries/saas-b2b-platforms", permanent: true },
      { source: "/industries/saas-b2b", destination: "/industries/saas-b2b-platforms", permanent: true },
      { source: "/industries/fin-tech", destination: "/industries/fintech", permanent: true },
      { source: "/industries/health-tech", destination: "/industries/healthcare", permanent: true },
      { source: "/industries/ed-tech", destination: "/industries/edtech", permanent: true },

      // Market/location pages — one canonical slug each, common name
      // variants folded in.
      { source: "/locations/us", destination: "/locations/usa", permanent: true },
      { source: "/locations/united-states", destination: "/locations/usa", permanent: true },
      { source: "/locations/america", destination: "/locations/usa", permanent: true },
      { source: "/locations/gb", destination: "/locations/uk", permanent: true },
      { source: "/locations/united-kingdom", destination: "/locations/uk", permanent: true },
      { source: "/locations/britain", destination: "/locations/uk", permanent: true },
      { source: "/locations/ca", destination: "/locations/canada", permanent: true },
      { source: "/locations/au", destination: "/locations/australia", permanent: true },
    ];
  },
  // /admin is a client-rendered, auth-gated area with no public value.
  // It's disallowed in robots.txt, but that only asks crawlers not to
  // fetch it — this header tells anything that does reach the URL (a
  // stray external link, a non-Google bot) to keep it out of the index.
  async headers() {
    return [
      {
        // Security headers on every response this app serves.
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    // In local dev, Next's image optimizer blocks "localhost" because it
    // resolves to a loopback/private IP (SSRF protection), even though
    // remotePatterns explicitly allows it. Disabling optimization only in
    // development sidesteps this; production (devliora.com, a public
    // domain) keeps full optimization.
    unoptimized: process.env.NODE_ENV === "development",
    // Serve AVIF first, then WebP, then fall back to the source format —
    // the optimizer picks per the browser's Accept header. AVIF is ~20%
    // smaller than WebP for photos at equivalent quality.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5240",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "devliora.com",
      },
    ],
  },
};

export default nextConfig;
