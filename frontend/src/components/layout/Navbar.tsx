"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { fetchSiteSettings } from "@/lib/siteSettings";
import { resolveImageUrl } from "@/lib/hero";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/technologies", label: "Technologies" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/book-consultation", label: "Book Consultation" },
];

const MORE_LABELS = ["Industries", "Case Studies", "About", "Blog"];
const PRIMARY_LINKS = NAV_LINKS.filter((link) => !MORE_LABELS.includes(link.label));
const MORE_LINKS = NAV_LINKS.filter((link) => MORE_LABELS.includes(link.label));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const moreRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    fetchSiteSettings().then((settings) => {
      if (settings?.logoUrl) {
        setLogoUrl(settings.logoUrl);
      }
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

  return (
    <header className="sticky top-0 z-50 border-b border-wire/60 bg-paper/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center font-display text-lg font-semibold tracking-tight text-ink">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveImageUrl(logoUrl)} alt="Devliora" className="h-11 w-auto" />
          ) : (
            <>
              Devliora
              <span className="ml-0.5 text-signal">.</span>
            </>
          )}
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {PRIMARY_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative whitespace-nowrap font-mono text-sm text-graphite/70 transition-colors duration-300 hover:text-ink"
              >
                {link.label}
                <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
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
          className="hidden rounded-sm bg-ink px-5 py-2.5 font-mono text-sm text-paper shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-signal hover:shadow-lg hover:shadow-signal/25 md:inline-block"
        >
          Start a project
        </Link>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-wire/60 bg-paper md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-mono text-sm text-graphite/70 hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
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
