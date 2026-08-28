import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buildMetadata } from "@/lib/seo";

// A missing URL should never look indexable. buildMetadata's `noindex`
// emits `robots: noindex, nofollow`; the response itself is served with
// a 404 status by Next for non-streamed requests.
export const metadata: Metadata = buildMetadata({
  title: "Page not found",
  description: "The page you were looking for doesn't exist or has moved.",
  path: "/404",
  noindex: true,
});

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/custom-software-development", label: "Custom software development" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="bg-paper">
        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-24 md:py-32">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            404
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            This page doesn&rsquo;t exist.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            The link may be out of date, or the page may have moved. Here are a
            few places to pick things back up.
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-graphite/20 px-4 py-2 font-mono text-sm text-graphite/80 transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="btn-3d mt-10 inline-flex w-fit items-center gap-2 rounded-lg bg-signal px-6 py-3 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-colors hover:bg-signal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Back to home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
