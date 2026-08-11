"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, LayoutGrid } from "lucide-react";
import { resolveImageUrl } from "@/lib/hero";
import { serviceHref } from "@/lib/services";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/technologyCategories";
import { SOLUTIONS } from "@/lib/solutions";
import { slugify } from "@/lib/slugify";
import type { ExploreService } from "@/lib/useExploreMenuData";

type MegaMenuProps = {
  open: boolean;
  services: ExploreService[];
  technologyCounts: Record<number, number>;
  loaded: boolean;
  imageUrl?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
};

const columnHeadingClass =
  "font-mono text-xs font-semibold uppercase tracking-widest text-graphite/50";
const linkClass =
  "group flex items-center gap-2 font-mono text-sm text-graphite/70 transition-colors duration-200 hover:text-ink";
const viewAllClass =
  "mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-signal transition-colors hover:text-ink";

export default function MegaMenu({
  open,
  services,
  technologyCounts,
  loaded,
  imageUrl,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: MegaMenuProps) {
  if (!open) return null;

  // Show every active service — previously capped at 6, which silently
  // hid anything past that (e.g. Digital Design at position 7).
  const visibleServices = [...services].sort((a, b) => a.displayOrder - b.displayOrder);

  const visibleCategories = CATEGORY_ORDER.filter(
    (id) => (technologyCounts[id] ?? 0) > 0 || !loaded
  );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full z-40 hidden border-t border-wire/60 bg-paper shadow-lg lg:block"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-[1fr_2fr]">
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-lg bg-wire/10 md:block">
          {imageUrl ? (
            <Image
              src={resolveImageUrl(imageUrl)}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 0px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-graphite/30">
              <LayoutGrid className="h-10 w-10" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <h3 className={columnHeadingClass}>Services</h3>
            <ul className="mt-4 space-y-3">
              {visibleServices.map((service) => (
                <li key={service.id}>
                  <Link href={serviceHref(service.slug)} onClick={onNavigate} className={linkClass}>
                    {service.iconUrl ? (
                      <Image
                        src={resolveImageUrl(service.iconUrl)}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 shrink-0 object-contain"
                      />
                    ) : (
                      <Layers className="h-4 w-4 shrink-0 text-signal" strokeWidth={1.75} />
                    )}
                    {service.title}
                  </Link>
                </li>
              ))}
              {!loaded && <li className="font-mono text-sm text-graphite/40">Loading…</li>}
            </ul>
            <Link href="/services" onClick={onNavigate} className={viewAllClass}>
              View all services
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div>
            <h3 className={columnHeadingClass}>Technologies</h3>
            <ul className="mt-4 space-y-3">
              {visibleCategories.map((categoryId) => {
                const meta = CATEGORY_META[categoryId];
                const Icon = meta.icon;
                return (
                  <li key={categoryId}>
                    <Link
                      href={`/technologies#${meta.slug}`}
                      onClick={onNavigate}
                      className={linkClass}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-signal" strokeWidth={1.75} />
                      {meta.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link href="/technologies" onClick={onNavigate} className={viewAllClass}>
              View all technologies
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div>
            <h3 className={columnHeadingClass}>Solutions</h3>
            <ul className="mt-4 space-y-3">
              {SOLUTIONS.map((solution) => (
                <li key={solution.id}>
                  <Link
                    href={`/solutions#${slugify(solution.title)}`}
                    onClick={onNavigate}
                    className={linkClass}
                  >
                    <span className="font-mono text-xs text-signal">{solution.id}</span>
                    {solution.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/solutions" onClick={onNavigate} className={viewAllClass}>
              View all solutions
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
