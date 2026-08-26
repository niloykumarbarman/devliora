"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DEVOPS_STACK, DEVOPS_CATEGORY_ORDER } from "@/lib/cloudDevops";

export default function DevOpsStack() {
  const reduceMotion = useReducedMotion();

  const grouped = DEVOPS_CATEGORY_ORDER.map((category) => ({
    category,
    tools: DEVOPS_STACK.filter((tool) => tool.category === category),
  })).filter((group) => group.tools.length > 0);

  return (
    <section
      id="devops-stack"
      className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] right-[-8%] h-[440px] w-[440px] rounded-full bg-ember/12 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            DevOps Technology Stack
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Fourteen tools, <span className="text-ember">each doing one job well</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
            Not a logo wall. Every tool below is here because it solves a specific
            problem in building, shipping and running software — and here is which one.
          </p>
        </motion.div>

        <div className="mt-16 space-y-12">
          {grouped.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: groupIndex * 0.05 }}
            >
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-paper/50">
                {group.category}
              </h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {group.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.name}
                      className="flex gap-4 rounded-sm border border-paper/10 bg-graphite/30 p-5 transition-colors hover:border-signal/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-paper/10 bg-paper/[0.04]">
                        <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                      </span>
                      <div>
                        <h4 className="font-display text-base font-semibold text-paper">
                          {tool.name}
                        </h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-paper/65">
                          {tool.purpose}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
