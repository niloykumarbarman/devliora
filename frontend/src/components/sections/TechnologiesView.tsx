"use client";

import { motion } from "framer-motion";
import DraggableMarquee from "@/components/DraggableMarquee";
import TechBrandIcon from "@/components/TechBrandIcon";
import { getTechIcon } from "@/lib/techIcons";
import { type TechnologyDto } from "@/lib/technologies";

type Accent = "signal" | "ember" | "wire";

const CATEGORY_META: Record<number, { label: string; accent: Accent; tilt: string }> = {
  0: { label: "Backend", accent: "signal", tilt: "-rotate-2" },
  1: { label: "Frontend", accent: "ember", tilt: "rotate-2" },
  2: { label: "Cloud", accent: "wire", tilt: "-rotate-1" },
  3: { label: "Data", accent: "signal", tilt: "rotate-1" },
  4: { label: "DevOps", accent: "ember", tilt: "-rotate-2" },
  5: { label: "AI", accent: "wire", tilt: "rotate-2" },
};

const CATEGORY_ORDER = [0, 1, 2, 3, 4, 5];

const ACCENT_CLASSES: Record<Accent, { blob: string; border: string; dot: string }> = {
  signal: { blob: "bg-signal/90 text-ink", border: "border-signal/25 hover:border-signal/60", dot: "bg-signal" },
  ember: { blob: "bg-ember/90 text-ink", border: "border-ember/25 hover:border-ember/60", dot: "bg-ember" },
  wire: { blob: "bg-wire/90 text-ink", border: "border-wire/25 hover:border-wire/60", dot: "bg-wire" },
};

export default function TechnologiesView({ technologies }: { technologies: TechnologyDto[] }) {
  if (technologies.length === 0) {
    return null;
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: technologies.filter((t) => t.category === cat).sort((a, b) => a.displayOrder - b.displayOrder),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="technologies" className="bg-grain relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-12%] left-[-10%] h-[440px] w-[440px] rounded-full bg-signal/15 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The same stack we <span className="text-signal">run our own systems on</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            No stack chosen for a pitch deck. Every tool here is one we operate in production, including this site.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map(({ cat, items }) => {
            const meta = CATEGORY_META[cat];
            const accent = ACCENT_CLASSES[meta.accent];
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`group relative overflow-hidden rounded-sm border bg-graphite/40 pb-5 pt-8 transition-colors ${accent.border}`}
              >
                <div
                  className={`absolute -top-3 left-6 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-md rounded-bl-md px-4 py-2 font-display text-sm font-bold uppercase tracking-wide shadow-lg transition-transform duration-300 ${accent.blob} ${meta.tilt} group-hover:rotate-0`}
                >
                  {meta.label}
                </div>

                <div className="relative mt-6 overflow-hidden">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-graphite/80 to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-graphite/80 to-transparent" />
                  <DraggableMarquee trackClassName="items-stretch gap-3">
                    {[...items, ...items].map((tech, i) => {
                      const hasIcon = !!getTechIcon(tech.name);
                      const stickerOrder: Accent[] = ["signal", "ember", "wire"];
                      const stickerAccent = ACCENT_CLASSES[stickerOrder[i % 3]];
                      const stickerTilt = i % 2 === 0 ? "-rotate-3" : "rotate-3";
                      return (
                        <div
                          key={`${tech.id}-${i}`}
                          className="flex min-w-[130px] items-center justify-center px-1 py-3"
                        >
                          <div
                            className={`flex items-center gap-2 whitespace-nowrap rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md px-4 py-2.5 shadow-[3px_3px_0_0_rgba(14,20,32,0.9)] transition-transform duration-300 hover:rotate-0 hover:scale-105 ${stickerAccent.blob} ${stickerTilt}`}
                          >
                            {hasIcon ? (
                              <TechBrandIcon name={tech.name} className="h-4 w-4 shrink-0" />
                            ) : (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink/50" />
                            )}
                            <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.08em]">
                              {tech.displayName}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </DraggableMarquee>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
