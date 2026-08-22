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
// of to a page that wouldn't show anything about it. Most of the rest
// now have their own admin-managed pages too (/technologies/[slug], via
// the Technology Pages admin panel — check /admin/technology-detail-pages
// for the current slug list, since more get added there over time).
// Only Android, VR, and eCommerce Development still fall back to the
// generic listing as of this writing.
export type MegaMenuTechnology = { label: string; href: string };

export const MEGA_MENU_TECHNOLOGIES: MegaMenuTechnology[] = [
  { label: "AI Development", href: "/services/ai-development" },
  { label: ".NET Development", href: "/technologies/dot-net-development" },
  { label: "Java Development", href: "/technologies/java-development" },
  { label: "PHP Development", href: "/technologies/php-development" },
  { label: "Node.js Development", href: "/technologies/node-js-development" },
  { label: "Python", href: "/technologies/python-development" },
  { label: "Flutter Development", href: "/technologies/flutter-development" },
  { label: "Frontend Development", href: "/technologies/frontend-development" },
  { label: "SQL Server Development", href: "/technologies/sql-server-development" },
  { label: "MySQL Development", href: "/technologies/mysql-development" },
  { label: "AWS Development", href: "/technologies/aws-development" },
  { label: "Azure Development", href: "/technologies/azure-development" },
  { label: "iOS Development", href: "/technologies/ios-development" },
  { label: "Android Development", href: "/technologies" },
  { label: "VR Development", href: "/technologies" },
  { label: "eCommerce Development", href: "/technologies" },
];
