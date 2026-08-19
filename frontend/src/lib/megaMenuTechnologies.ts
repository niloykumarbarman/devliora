// Static technology list for the Services mega-menu's "Technologies"
// column, matching kaz.com.bd's mega-menu exactly (order included) per
// explicit, repeated request. Deliberately NOT sourced from the real
// admin-managed Technologies list (see lib/technologies.ts) — that list
// stays intact for /technologies and its own "View all technologies"
// link here. Same caveat as ServicesHero.tsx's TECH_COLUMNS, which this
// duplicates for consistency between the two surfaces: a few of these
// (PHP, Flutter, iOS/Android, VR, SQL Server) aren't in Devliora's real
// admin-managed Technologies list, so double-check they're genuine
// capabilities before this goes out representing Devliora's stack.
//
// Each item's href defaults to the generic /technologies listing — most
// of these are display-only labels with no dedicated page behind them.
// "AI Development" is the one exception: it's also a real, admin-managed
// Service (/services/ai-development), so it links straight there instead
// of to a page that wouldn't show anything about it. ".NET Development",
// "Java Development", and "PHP Development" now have their own
// admin-managed pages too (/technologies/[slug], via the Technology
// Pages admin panel), matching kaz.com.bd's per-technology pages.
// NOTE: PHP's slug currently has a typo ("php-developmentf", entered
// through the admin form) — update this href to match once that's
// corrected in /admin/technology-detail-pages.
export type MegaMenuTechnology = { label: string; href: string };

export const MEGA_MENU_TECHNOLOGIES: MegaMenuTechnology[] = [
  { label: "AI Development", href: "/services/ai-development" },
  { label: ".NET Development", href: "/technologies/dot-net-development" },
  { label: "Java Development", href: "/technologies/java-development" },
  { label: "PHP Development", href: "/technologies/php-developmentf" },
  { label: "Node.js Development", href: "/technologies" },
  { label: "Python", href: "/technologies" },
  { label: "Flutter Development", href: "/technologies" },
  { label: "Frontend Development", href: "/technologies" },
  { label: "SQL Server Development", href: "/technologies" },
  { label: "MySQL Development", href: "/technologies" },
  { label: "AWS Development", href: "/technologies" },
  { label: "Azure Development", href: "/technologies" },
  { label: "iOS Development", href: "/technologies" },
  { label: "Android Development", href: "/technologies" },
  { label: "VR Development", href: "/technologies" },
  { label: "eCommerce Development", href: "/technologies" },
];
