"use client";

import { ArrowRight } from "lucide-react";
import { IAC_STEPS, IAC_CODE_LINES } from "@/lib/cloudDevops";
import Reveal from "@/components/Reveal";

export default function InfrastructureAsCode() {
  return (
    <section
      id="infrastructure-as-code"
      className="relative scroll-mt-24 overflow-hidden bg-paper text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.ink/4)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink/4)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Infrastructure as Code
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Infrastructure you can <span className="text-signal">review in a pull request</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite/75">
            Terraform turns environments into code — planned, peer-reviewed and
            applied by automation, so staging and production never quietly drift
            apart.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Workflow */}
          <ol className="space-y-3">
            {IAC_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal
                  key={step.label}
                  as="li"
                  delay={i * 0.08}
                  className="reveal-from-left flex gap-4 rounded-sm border border-ink/10 bg-white/60 p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink/10 bg-signal/[0.08] font-mono text-xs font-semibold text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-display text-base font-semibold">
                      <Icon className="h-4 w-4 text-signal" strokeWidth={1.75} />
                      {step.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-graphite/75">{step.detail}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>

          {/* Code visual */}
          <Reveal
            as="figure"
            className="overflow-hidden rounded-lg border border-ink/15 shadow-[0_24px_48px_-24px_rgba(14,20,32,0.4)]"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#1e1e1e] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 font-mono text-xs text-white/40">main.tf</span>
            </div>
            <pre className="overflow-x-auto bg-[#1e1e1e] px-4 py-4 font-mono text-[11px] leading-relaxed sm:px-6 sm:text-[13px]">
              {IAC_CODE_LINES.map((line, i) => (
                <div key={i} style={{ paddingLeft: `${line.indent}rem` }}>
                  {line.tokens.length === 0 ? (
                    <span>&nbsp;</span>
                  ) : (
                    line.tokens.map((token, j) => (
                      <span key={j} className={token.color}>
                        {token.text}
                      </span>
                    ))
                  )}
                </div>
              ))}
            </pre>
            <figcaption className="border-t border-white/10 bg-[#1e1e1e] px-4 py-2.5 font-mono text-[11px] text-white/40 sm:px-6">
              Illustrative configuration — the secret is read from a variable, never
              hard-coded.
            </figcaption>
          </Reveal>
        </div>

        <Reveal
          as="p"
          delay={0.2}
          className="mt-10 flex flex-wrap items-center gap-2 font-mono text-xs text-graphite/60"
        >
          {IAC_STEPS.map((step, i) => (
            <span key={step.label} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="h-3 w-3 text-graphite/30" />}
              {step.label}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
