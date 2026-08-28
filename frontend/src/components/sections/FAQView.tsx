"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { type FaqDto } from "@/lib/faq";
import Reveal from "@/components/Reveal";

type FAQViewProps = {
  faqs: FaqDto[];
  /** Defaults to the homepage's own heading; pass a different one (e.g.
   * a service detail page) to reuse this same accordion elsewhere. */
  heading?: ReactNode;
};

export default function FAQView({ faqs, heading }: FAQViewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="bg-grain relative scroll-mt-24 overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] left-[-8%] h-[420px] w-[420px] rounded-full bg-signal/15 blur-[140px] animate-ambient-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.paper/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.paper/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 md:py-32">
        <Reveal>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {heading ?? (
              <>
                Questions we get{" "}
                <span className="text-signal">before the first call</span>.
              </>
            )}
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-col divide-y divide-paper/10 border-t border-paper/10">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.id}>
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    id={`faq-trigger-${faq.id}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    <span className="font-display text-lg font-medium tracking-tight sm:text-xl">
                      {faq.question}
                    </span>
                    <Plus
                      className={
                        isOpen
                          ? "h-5 w-5 shrink-0 rotate-45 text-ember transition-transform duration-300"
                          : "h-5 w-5 shrink-0 text-paper/50 transition-transform duration-300"
                      }
                      strokeWidth={1.75}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  className="accordion-panel"
                  data-open={isOpen}
                >
                  <div>
                    <p className="pb-6 pr-10 text-sm leading-relaxed text-paper/70">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
