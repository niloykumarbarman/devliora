"use client";

import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

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

export default function ServicesView({ services }: { services: ServiceItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverCapable, setHoverCapable] = useState(true);

  useEffect(() => {
    setHoverCapable(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handleCardClick = (i: number) => {
    if (hoverCapable) return;
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[-8%] h-[420px] w-[420px] rounded-full bg-signal/10 blur-[130px] animate-ambient-drift"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Engineering built for{" "}
            <span className="text-signal">systems that outlast us</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            We take on the parts of enterprise software that are hardest to
            get right the first time, and hardest to unwind if they go
            wrong.
          </p>
        </Reveal>

        {services.length === 0 ? (
          <p className="mt-16 text-center text-sm text-graphite/65">
            No services available yet.
          </p>
        ) : (
          <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const isSignal = i % 2 === 0;
              const isActive = activeIndex === i;
              const hoverHandlers = hoverCapable
                ? {
                    onMouseEnter: () => setActiveIndex(i),
                    onMouseLeave: () =>
                      setActiveIndex((prev) => (prev === i ? null : prev)),
                  }
                : {
                    onClick: () => handleCardClick(i),
                  };
              return (
                <Reveal
                  key={service.id}
                  delay={i * 0.08}
                  {...hoverHandlers}
                  className={`hover-pop group relative z-0 cursor-pointer p-8 transition-colors duration-300 ${
                    isActive ? "bg-ink text-paper" : "bg-paper"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-sm transition-colors duration-300 ${
                        isSignal
                          ? isActive
                            ? "bg-signal/30 text-signal"
                            : "bg-signal/15 text-signal"
                          : isActive
                            ? "bg-ember/30 text-ember"
                            : "bg-ember/15 text-ember"
                      }`}
                    >
                      {service.iconUrl ? (
                        <Image
                          src={service.iconUrl}
                          alt=""
                          width={28}
                          height={28}
                          className="h-7 w-7 object-contain"
                        />
                      ) : (
                        <Layers className="h-7 w-7" strokeWidth={1.6} />
                      )}
                    </span>
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                        isActive ? "text-paper/55" : "text-graphite/60"
                      }`}
                    >
                      /{service.slug}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                    {service.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed transition-colors duration-300 ${
                      isActive ? "text-paper/70" : "text-graphite/75"
                    }`}
                  >
                    {service.shortDescription}
                  </p>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
