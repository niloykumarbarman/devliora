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
export const MEGA_MENU_TECHNOLOGIES: string[] = [
  "AI Development",
  ".NET Development",
  "Java Development",
  "PHP Development",
  "Node.js Development",
  "Python",
  "Flutter Development",
  "Frontend Development",
  "SQL Server Development",
  "MySQL Development",
  "AWS Development",
  "Azure Development",
  "iOS Development",
  "Android Development",
  "VR Development",
  "eCommerce Development",
];
