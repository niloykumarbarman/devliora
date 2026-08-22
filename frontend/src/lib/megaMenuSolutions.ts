// Static solution list for the Services mega-menu's "Solutions" column,
// matching kaz.com.bd's mega-menu exactly (order included) per explicit
// request — same pattern as lib/megaMenuTechnologies.ts. Deliberately
// NOT sourced from lib/solutions.ts's real SOLUTIONS list (Devliora's
// own 6 generic service categories, e.g. "Custom Software Development")
// — that list stays intact for /solutions and its own numbered mega-menu
// rendering that this replaces. These are specific packaged-product
// names from the reference; double-check they're genuine Devliora
// offerings before this goes out representing Devliora's catalog.
//
// Each item's href defaults to the generic /solutions listing — most of
// these are display-only labels with no dedicated page behind them.
// "Furniture eCommerce Software" is the one exception: it has its own
// page (/solutions/furniture-ecommerce-software), matching
// kaz.com.bd's per-solution page.
export type MegaMenuSolution = { label: string; href: string };

export const MEGA_MENU_SOLUTIONS: MegaMenuSolution[] = [
  { label: "Furniture eCommerce Software", href: "/solutions/furniture-ecommerce-software" },
  { label: "MIS Platforms", href: "/solutions" },
  { label: "Field Sales Force Solution", href: "/solutions" },
  { label: "CMS", href: "/solutions" },
  { label: "Drone-based Solution", href: "/solutions" },
];
