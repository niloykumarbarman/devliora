"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TechBrandIcon from "@/components/TechBrandIcon";
import { getTechIcon } from "@/lib/techIcons";
import { fetchTechnologies, TechnologyDto } from "@/lib/technologies";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/technologyCategories";

export default function TechnologiesDetailList() {
  const reducedMotion = useReducedMotion();
  const [technologies, setTechnologies] = useState<TechnologyDto[]>([]);

  useEffect(() => {
    fetchTechnologies().then(setTechnologies);
  }, []);

  useEffect(() => {
    if (technologies.length === 0) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [technologies]);

  const groups = CATEGORY_ORDER.map((categoryId) => {
    const items = technologies
      .filter((t) => t.category === categoryId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return { categoryId, meta: CATEGORY_META[categoryId], items };
  }).filter((group) => group.items.length > 0);

  return (
    <section className="relative overflow-hidden bg-paper px-6 py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">

        <motion.h2
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-ink sm:text-4xl"
        >
          Every layer, <span className="text-signal">deliberately chosen</span>
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-graphite/10 bg-graphite/10 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => {
            const Icon = group.meta.icon;
            return (
              <motion.div
                key={group.categoryId}
                id={group.meta.slug}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex scroll-mt-24 flex-col bg-paper p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-signal/10 text-signal">
                  <Icon size={20} strokeWidth={1.75} />
                </div>

                <h3 className="mt-6 font-display text-lg font-medium text-ink">
                  {group.meta.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-graphite">
                  {group.meta.description}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2 border-t border-graphite/10 pt-6">
                  {group.items.map((tool, idx) => {
                    const hasIcon = !!getTechIcon(tool.name);
                    const stickerBg = idx % 2 === 0 ? "bg-signal text-paper" : "bg-ember text-paper";
                    const stickerTilt =
                      idx % 3 === 0 ? "-rotate-2" : idx % 3 === 1 ? "rotate-2" : "-rotate-1";
                    return (
                      <li
                        key={tool.id}
                        className={`flex items-center gap-1.5 whitespace-nowrap rounded-tl-lg rounded-br-lg rounded-tr-sm rounded-bl-sm px-3 py-1.5 font-mono text-[0.7rem] font-bold uppercase tracking-wide shadow-[2px_2px_0_0_rgba(14,20,32,0.85)] transition-transform duration-200 hover:rotate-0 ${stickerBg} ${stickerTilt}`}
                      >
                        {hasIcon ? (
                          <TechBrandIcon name={tool.name} className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-paper/70" />
                        )}
                        {tool.displayName}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
