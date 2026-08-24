"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fetchIndustries, type IndustryDto } from "@/lib/industries";

export default function IndustriesDetailList() {
  const shouldReduceMotion = useReducedMotion();
  const [industries, setIndustries] = useState<IndustryDto[]>([]);

  useEffect(() => {
    fetchIndustries().then(setIndustries);
  }, []);

  return (
    <section className="relative bg-paper py-24">
      <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(14,20,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,20,32,0.04)_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold text-ink md:text-4xl">
          Industries where we've built real context
        </h2>

        {industries.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.id}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-paper"
              >
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group relative z-0 flex h-full flex-col justify-between p-8 transition-[background-color,transform] duration-200 hover:z-10 hover:scale-[1.03] hover:bg-ink/[0.03]"
                >
                  <span className="font-mono text-sm tabular-nums text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {industry.name}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-graphite/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
