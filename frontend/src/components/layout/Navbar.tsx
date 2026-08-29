"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { useExploreMenuData } from "@/lib/useExploreMenuData";
import { serviceHref } from "@/lib/services";
import { fetchIndustries, type IndustryDto } from "@/lib/industries";
import MegaMenu from "./MegaMenu";
import IndustriesMenu from "./IndustriesMenu";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/portfolio", label: "My Work" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/book-consultation", label: "Book Consultation" },
];

// Solutions and Technologies no longer get their own top-level nav
// items — they're reachable as columns inside the Services mega-menu
// (and from its "View all" links), matching kaz.com.bd's nav, which
// only has one mega-menu trigger.
const MORE_LABELS = ["Case Studies", "About", "Blog"];
const MEGA_LABELS = ["Services"];
const INDUSTRIES_LABEL = "Industries";
const PRIMARY_LINKS = NAV_LINKS.filter((link) => !MORE_LABELS.includes(link.label));
const MORE_LINKS = NAV_LINKS.filter((link) => MORE_LABELS.includes(link.label));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [industriesImageUrl, setIndustriesImageUrl] = useState("");
  const [servicesImageUrl, setServicesImageUrl] = useState("");
  const [industries, setIndustries] = useState<IndustryDto[]>([]);
  const [industriesLoaded, setIndustriesLoaded] = useState(false);
  // Pixel offset from the top of the viewport to the bottom of the nav
  // bar — where the fixed mobile panel starts. Measured, not hard-coded,
  // so it stays correct if the bar's height ever changes.
  const [menuTop, setMenuTop] = useState(72);
  const navRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLLIElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const industriesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exploreMenu = useExploreMenuData();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    fetchSiteSettings().then((settings) => {
      if (settings?.logoUrl) {
        setLogoUrl(settings.logoUrl);
      }
      if (settings?.industriesImageUrl) {
        setIndustriesImageUrl(settings.industriesImageUrl);
      }
      if (settings?.servicesImageUrl) {
        setServicesImageUrl(settings.servicesImageUrl);
      }
    });
  }, []);

  useEffect(() => {
    fetchIndustries().then((data) => {
      setIndustries(data);
      setIndustriesLoaded(true);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (megaCloseTimer.current) {
        clearTimeout(megaCloseTimer.current);
      }
      if (industriesCloseTimer.current) {
        clearTimeout(industriesCloseTimer.current);
      }
    };
  }, []);

  const openMega = () => {
    if (megaCloseTimer.current) {
      clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const openIndustries = () => {
    if (industriesCloseTimer.current) {
      clearTimeout(industriesCloseTimer.current);
      industriesCloseTimer.current = null;
    }
    setIndustriesOpen(true);
  };

  const scheduleCloseIndustries = () => {
    industriesCloseTimer.current = setTimeout(() => setIndustriesOpen(false), 150);
  };

  // Show every active service — previously capped at 6, which silently
  // hid anything past that (e.g. Digital Design at position 7).
  const visibleMobileServices = [...exploreMenu.services].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileExpanded(null);
  };

  // While the mobile menu is open:
  //   1. Freeze the background page (`overflow:hidden` on <html>, not
  //      <body>, and without touching scrollTop — avoids the iOS Safari
  //      "jump to top" that body / position:fixed locking causes). The
  //      menu panel is a `position:fixed` element with its own
  //      `overflow-y:auto` + `overscroll-contain`, so every item stays
  //      reachable by scrolling the panel — it is the ONLY scroll
  //      container, no nested scrollers, no max-height on its content.
  //   2. Keep the panel anchored just below the (measured) nav bar, and
  //      re-measure on resize / orientation change.
  //   3. Close on a resize past the desktop breakpoint so the lock can
  //      never outlive a switch to the always-visible desktop nav.
  useEffect(() => {
    if (!open) return;

    const measure = () => {
      const bottom = navRef.current?.getBoundingClientRect().bottom;
      if (typeof bottom === "number") setMenuTop(Math.round(bottom));
    };
    measure();

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleBreakpoint = () => {
      if (desktopQuery.matches) {
        setOpen(false);
        setMobileExpanded(null);
      } else {
        measure();
      }
    };
    // Escape closes the menu and returns focus to the toggle button, so a
    // keyboard user is never stranded inside the open panel.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMobileExpanded(null);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("resize", handleBreakpoint);
    window.addEventListener("orientationchange", handleBreakpoint);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener("resize", handleBreakpoint);
      window.removeEventListener("orientationchange", handleBreakpoint);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-wire/60 bg-paper/90 backdrop-blur-sm">
      <nav
        ref={navRef}
        aria-label="Primary"
        className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4"
      >
        <Link href="/" className="flex items-center font-display text-lg font-semibold tracking-tight text-ink">
          {logoUrl ? (
            <span className="relative block h-11 w-[213px] overflow-hidden">
              <Image
                src={resolveImageUrl(logoUrl)}
                alt="Devliora"
                width={334}
                height={472}
                priority
                className="absolute -left-[56px] -top-[202px] h-[472px] w-[334px] max-w-none"
              />
            </span>
          ) : (
            <>
              Devliora
              <span className="ml-0.5 text-signal">.</span>
            </>
          )}
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {PRIMARY_LINKS.map((link) => {
            const active = isActive(link.href);
            const linkClass = `group relative flex items-center gap-1 whitespace-nowrap font-mono text-sm transition-colors duration-300 hover:text-ink ${
              active ? "text-ink" : "text-graphite/70"
            }`;
            const underline = (
              <span
                className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
              />
            );
            if (MEGA_LABELS.includes(link.label)) {
              return (
                <li
                  key={link.href}
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleCloseMega}
                  onFocus={openMega}
                  onBlur={scheduleCloseMega}
                >
                  <Link
                    href={link.href}
                    className={linkClass}
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    {underline}
                  </Link>
                </li>
              );
            }
            if (link.label === INDUSTRIES_LABEL) {
              return (
                <li
                  key={link.href}
                  onMouseEnter={openIndustries}
                  onMouseLeave={scheduleCloseIndustries}
                  onFocus={openIndustries}
                  onBlur={scheduleCloseIndustries}
                >
                  <Link
                    href={link.href}
                    className={linkClass}
                    aria-haspopup="true"
                    aria-expanded={industriesOpen}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${industriesOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                    {underline}
                  </Link>
                </li>
              );
            }
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={linkClass}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {underline}
                </Link>
              </li>
            );
          })}
          <li className="relative" ref={moreRef} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setMoreOpen(false);
          }}>
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              onKeyDown={(e) => e.key === "Escape" && setMoreOpen(false)}
              className="flex items-center gap-1 whitespace-nowrap font-mono text-sm text-graphite/70 transition-colors hover:text-ink"
              aria-haspopup="true"
              aria-expanded={moreOpen}
            >
              More
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {moreOpen && (
              <ul className="absolute right-0 top-full mt-2 w-48 rounded-sm border border-wire/60 bg-paper py-2 shadow-lg">
                {MORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className="block px-4 py-2 font-mono text-sm text-graphite/70 transition-colors hover:bg-wire/20 hover:text-ink aria-[current=page]:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <Link
          href="/contact"
          aria-current={isActive("/contact") ? "page" : undefined}
          className="hidden rounded-sm bg-ink px-5 py-2.5 font-mono text-sm text-paper shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-signal hover:shadow-lg hover:shadow-signal/25 lg:inline-block"
        >
          Start a project
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-ink lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>

        <MegaMenu
          open={megaOpen}
          services={exploreMenu.services}
          technologies={exploreMenu.technologies}
          solutions={exploreMenu.solutions}
          loaded={exploreMenu.loaded}
          imageUrl={servicesImageUrl}
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
          onNavigate={() => setMegaOpen(false)}
        />

        <IndustriesMenu
          open={industriesOpen}
          industries={industries}
          imageUrl={industriesImageUrl}
          loaded={industriesLoaded}
          onMouseEnter={openIndustries}
          onMouseLeave={scheduleCloseIndustries}
          onNavigate={() => setIndustriesOpen(false)}
        />
      </nav>
    </header>

    {/* Rendered as a sibling of <header>, not a child: the header has
        `backdrop-blur`, which would make it the containing block for a
        `position: fixed` descendant and break the panel's full-height
        anchoring. As a direct child of <body> the panel is truly
        viewport-anchored. */}
    {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          // Single fixed scroll container: anchored just under the nav
          // bar, running to the bottom of the screen, scrolling its own
          // content. No max-height / fixed height / overflow:hidden on
          // anything inside, so every Service / Technology / Solution row
          // is reachable by scrolling this panel.
          className="fixed inset-x-0 z-40 overflow-y-auto overscroll-contain bg-paper [-webkit-overflow-scrolling:touch] lg:hidden"
          style={{ top: menuTop, bottom: 0 }}
        >
          <ul className="flex flex-col gap-1 px-6 pt-3 pb-[calc(2rem+env(safe-area-inset-bottom))]">
            {NAV_LINKS.map((link) =>
              MEGA_LABELS.includes(link.label) ? (
                <li key={link.href} className="border-b border-wire/40 pb-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className="block flex-1 py-3 font-mono text-sm text-graphite/80 hover:text-ink aria-[current=page]:text-ink"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded((prev) => (prev === link.label ? null : link.label))
                      }
                      aria-label={`${mobileExpanded === link.label ? "Collapse" : "Expand"} ${link.label} submenu`}
                      aria-expanded={mobileExpanded === link.label}
                      className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-graphite/60 hover:text-ink"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobileExpanded === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {mobileExpanded === link.label && (
                    <div className="mb-2 ml-1 space-y-5 border-l border-wire/60 pb-2 pl-4 pt-1">
                      <div>
                        <p className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-graphite/60">
                          Services
                        </p>
                        <ul className="mt-1">
                          {visibleMobileServices.map((service) => (
                            <li key={service.id}>
                              <Link
                                href={serviceHref(service.slug)}
                                onClick={closeMobileMenu}
                                className="block py-2 font-mono text-xs text-graphite/70 hover:text-ink"
                              >
                                {service.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-graphite/60">
                          Technologies
                        </p>
                        <ul className="mt-1">
                          {exploreMenu.technologies.map((tech) => (
                            <li key={tech.href}>
                              <Link
                                href={tech.href}
                                onClick={closeMobileMenu}
                                className="block py-2 font-mono text-xs text-graphite/70 hover:text-ink"
                              >
                                {tech.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-graphite/60">
                          Solutions
                        </p>
                        <ul className="mt-1">
                          {exploreMenu.solutions.map((solution) => (
                            <li key={solution.href}>
                              <Link
                                href={solution.href}
                                onClick={closeMobileMenu}
                                className="block py-2 font-mono text-xs text-graphite/70 hover:text-ink"
                              >
                                {solution.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={link.href} className="border-b border-wire/40">
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className="block py-3 font-mono text-sm text-graphite/80 hover:text-ink aria-[current=page]:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
            <li className="pt-4">
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                aria-current={isActive("/contact") ? "page" : undefined}
                className="block rounded-sm bg-ink px-5 py-3.5 text-center font-mono text-sm text-paper"
              >
                Start a project
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
