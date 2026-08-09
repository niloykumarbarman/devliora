"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import { API_BASE_URL } from "@/lib/apiConfig";
import { resolveImageUrl } from "@/lib/hero";
import { hasDetailPage } from "@/lib/services";

type ServiceItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  iconUrl: string;
  displayOrder: number;
};

export default function ServicesDetailList() {
  const shouldReduceMotion = useReducedMotion();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/services`);
        if (!res.ok) {
          throw new Error(`Failed to load services: ${res.status}`);
        }
        const data = (await res.json()) as ServiceItem[];
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (services.length === 0) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [services]);

  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, delay: (i % 6) * 0.06 },
        };

  return (
    <section className="relative overflow-hidden bg-paper py-24 text-ink md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {loading ? (
          <p className="text-center text-sm text-graphite/50">Loading services...</p>
        ) : error ? (
          <p className="text-center text-sm text-ember">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-sm text-graphite/50">No services available yet.</p>
        ) : (
          <div className="grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 md:grid-cols-2">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                id={service.slug}
                {...fadeUp(i)}
                className="scroll-mt-24 bg-paper p-8 md:p-10"
              >
                {service.iconUrl ? (
                  <img
                    src={resolveImageUrl(service.iconUrl)}
                    alt=""
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <Layers className="h-6 w-6 text-signal" strokeWidth={1.75} />
                )}
                <h2 className="mt-5 text-xl font-semibold text-graphite">
                  {service.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-graphite/70">
                  {service.shortDescription}
                </p>
                {service.includes.length > 0 && (
                  <ul className="mt-5 space-y-2 border-t border-ink/10 pt-5">
                    {service.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-graphite/70"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {hasDetailPage(service.slug) && (
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-signal transition-colors hover:text-ink ${
                      service.includes.length === 0 ? "border-t border-ink/10 pt-5" : ""
                    }`}
                  >
                    View full breakdown
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
