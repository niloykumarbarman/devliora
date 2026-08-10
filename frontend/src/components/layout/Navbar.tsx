"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";
import { useExploreMenuData } from "@/lib/useExploreMenuData";
import { serviceHref } from "@/lib/services";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/technologyCategories";
import { SOLUTIONS } from "@/lib/solutions";
import { slugify } from "@/lib/slugify";
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
  const moreRef = useRef<HTMLLIElement>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const industriesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exploreMenu = useExploreMenuData();

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

  const visibleMobileCategories = CATEGORY_ORDER.filter(
    (id) => (exploreMenu.technologyCounts[id] ?? 0) > 0 || !exploreMenu.loaded
  );

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileExpanded(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-wire/60 bg-paper/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center font-display text-lg font-semibold tracking-tight text-ink">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <span className="relative block h-11 w-[213px] overflow-hidden">
              <img
                src={resolveImageUrl(logoUrl)}
                alt="Devliora"
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
            if (MEGA_LABELS.includes(link.label)) {
              return (
                <li key={link.href} onMouseEnter={openMega} onMouseLeave={scheduleCloseMega}>
                  <Link
                    href={link.href}
                    className="group relative flex items-center gap-1 whitespace-nowrap font-mono text-sm text-graphite/70 transition-colors duration-300 hover:text-ink"
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                </li>
              );
            }
            if (link.label === INDUSTRIES_LABEL) {
              return (
                <li key={link.href} onMouseEnter={openIndustries} onMouseLeave={scheduleCloseIndustries}>
                  <Link
                    href={link.href}
                    className="group relative flex items-center gap-1 whitespace-nowrap font-mono text-sm text-graphite/70 transition-colors duration-300 hover:text-ink"
                    aria-haspopup="true"
                    aria-expanded={industriesOpen}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${industriesOpen ? "rotate-180" : ""}`}
                    />
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                </li>
              );
            }
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative whitespace-nowrap font-mono text-sm text-graphite/70 transition-colors duration-300 hover:text-ink"
                >
                  {link.label}
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </Link>
              </li>
            );
          })}
          <li className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className="flex items-center gap-1 whitespace-nowrap font-mono text-sm text-graphite/70 transition-colors hover:text-ink"
              aria-haspopup="true"
              aria-expanded={moreOpen}
            >
              More
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <ul className="absolute right-0 top-full mt-2 w-48 rounded-sm border border-wire/60 bg-paper py-2 shadow-lg">
                {MORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 font-mono text-sm text-graphite/70 transition-colors hover:bg-wire/20 hover:text-ink"
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
          className="hidden rounded-sm bg-ink px-5 py-2.5 font-mono text-sm text-paper shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-signal hover:shadow-lg hover:shadow-signal/25 lg:inline-block"
        >
          Start a project
        </Link>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
        </button>

        <MegaMenu
          open={megaOpen}
          services={exploreMenu.services}
          technologyCounts={exploreMenu.technologyCounts}
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

      {open && (
        <div className="border-t border-wire/60 bg-paper lg:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) =>
              MEGA_LABELS.includes(link.label) ? (
                <li key={link.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="block py-2 font-mono text-sm text-graphite/70 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded((prev) => (prev === link.label ? null : link.label))
                      }
                      aria-label={`Toggle ${link.label} submenu`}
                      aria-expanded={mobileExpanded === link.label}
                      className="p-2 text-graphite/60 hover:text-ink"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobileExpanded === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {mobileExpanded === link.label && (
                    <div className="ml-2 space-y-4 border-l border-wire/60 py-2 pl-4">
                      <div>
                        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-graphite/40">
                          Services
                        </p>
                        <ul className="mt-1.5 space-y-1.5">
                          {visibleMobileServices.map((service) => (
                            <li key={service.id}>
                              <Link
                                href={serviceHref(service.slug)}
                                onClick={closeMobileMenu}
                                className="block py-0.5 font-mono text-xs text-graphite/70 hover:text-ink"
                              >
                                {service.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-graphite/40">
                          Technologies
                        </p>
                        <ul className="mt-1.5 space-y-1.5">
                          {visibleMobileCategories.map((categoryId) => (
                            <li key={categoryId}>
                              <Link
                                href={`/technologies#${CATEGORY_META[categoryId].slug}`}
                                onClick={closeMobileMenu}
                                className="block py-0.5 font-mono text-xs text-graphite/70 hover:text-ink"
                              >
                                {CATEGORY_META[categoryId].title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-graphite/40">
                          Solutions
                        </p>
                        <ul className="mt-1.5 space-y-1.5">
                          {SOLUTIONS.map((solution) => (
                            <li key={solution.id}>
                              <Link
                                href={`/solutions#${slugify(solution.title)}`}
                                onClick={closeMobileMenu}
                                className="block py-0.5 font-mono text-xs text-graphite/70 hover:text-ink"
                              >
                                {solution.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block py-2 font-mono text-sm text-graphite/70 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
            <li className="pt-2">
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block rounded-sm bg-ink px-5 py-2.5 text-center font-mono text-sm text-paper"
              >
                Start a project
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
