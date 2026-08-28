export default function AboutHero() {
  return (
    <section className="bg-grain relative overflow-hidden bg-ink py-28 text-paper md:py-36">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px] animate-ambient-drift"
        style={{ backgroundColor: "var(--color-signal)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">

        <h1 className="hero-h1-rise mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl">
          Founder-led. <span className="text-signal">Production-grade.</span>{" "}
          No shortcuts.
        </h1>

        <p
          className="hero-fade-rise mx-auto mt-6 max-w-2xl text-lg text-paper/70"
          style={{ animationDelay: "0.16s" }}
        >
          Devliora is built and led by Niloy Kumar Barman — a software
          engineer who believes enterprise clients deserve the same security,
          transparency, and engineering rigor that large teams promise but
          rarely deliver in full.
        </p>
      </div>
    </section>
  );
}
