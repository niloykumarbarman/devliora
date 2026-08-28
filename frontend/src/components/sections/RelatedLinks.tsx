import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { CrossLinkGroup } from "@/lib/crossLinks";

/**
 * Compact cross-link block for detail pages — a few columns of
 * descriptive links into services, industries, technologies, case
 * studies and the blog. Rendered near the end of a page, before its CTA.
 */
export default function RelatedLinks({
  groups,
  heading = "Explore related",
  dark = false,
}: {
  groups: CrossLinkGroup[];
  heading?: string;
  dark?: boolean;
}) {
  const visible = groups.filter((g) => g.links.length > 0);
  if (visible.length === 0) return null;

  const bg = dark ? "bg-ink text-paper" : "bg-paper text-ink";
  const sub = dark ? "text-wire" : "text-graphite/70";
  const label = dark ? "text-signal" : "text-graphite/65";

  return (
    <Reveal>
      <section className={`${bg} py-16 md:py-20`}>
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl font-semibold">{heading}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((group) => (
              <div key={group.heading}>
                <p className={`font-mono text-xs font-semibold uppercase tracking-widest ${label}`}>
                  {group.heading}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={`${group.heading}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className={`${sub} underline-offset-4 transition-colors hover:text-signal hover:underline`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
