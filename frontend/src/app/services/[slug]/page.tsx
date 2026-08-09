import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesCTA from "@/components/sections/ServicesCTA";
import { fetchServiceBySlug } from "@/lib/services";
import { resolveImageUrl } from "@/lib/hero";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) {
    return buildMetadata({
      title: "Service | Devliora",
      description: "Service details.",
      path: `/services/${slug}`,
    });
  }
  return buildMetadata({
    title: `${service.title} | Devliora`,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-grain relative overflow-hidden bg-ink py-24 text-paper md:py-32">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px]"
            style={{ backgroundColor: "var(--color-signal)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
            }}
          />

          <div className="relative mx-auto max-w-4xl px-6">
            <nav className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
              <Link href="/" className="transition-colors hover:text-paper">
                Home
              </Link>
              <span>/</span>
              <Link href="/services" className="transition-colors hover:text-paper">
                Services
              </Link>
              <span>/</span>
              <span className="text-signal">{service.title}</span>
            </nav>

            <div className="mt-6 flex items-center gap-4">
              {service.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImageUrl(service.iconUrl)}
                  alt=""
                  className="h-10 w-10 shrink-0 object-contain"
                />
              ) : (
                <Layers className="h-10 w-10 shrink-0 text-signal" strokeWidth={1.75} />
              )}
              <h1 className="text-balance font-display text-3xl font-semibold leading-tight sm:text-5xl">
                {service.title}
              </h1>
            </div>

            <p className="mt-6 max-w-2xl text-lg text-paper/70">
              {service.shortDescription}
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-paper py-20 text-ink md:py-28">
          <div
            className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)",
            }}
          />

          <div className="relative mx-auto max-w-4xl px-6">
            <p className="max-w-2xl text-lg leading-relaxed text-graphite">
              {service.fullDescription}
            </p>

            {service.includes.length > 0 && (
              <div className="mt-16">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-graphite/50">
                  What this covers
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
                  {service.includes.map((item, i) => (
                    <div key={item} className="bg-paper p-6">
                      <span className="font-mono text-sm tabular-nums text-signal">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 font-display text-base font-medium text-ink">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/services"
              className="group mt-16 inline-flex items-center gap-2 font-mono text-sm text-graphite/70 transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              All services
            </Link>
          </div>
        </section>

        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
