export default function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-ink py-32 sm:py-40">
      <div className="bg-grain absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-ember/10 blur-[100px] animate-ambient-drift" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="hero-h1-rise mt-6 text-balance font-display text-4xl font-semibold text-paper sm:text-5xl md:text-6xl">
          Build <span className="text-signal">production-grade</span> software
          with people who care about the details
        </h1>
        <p
          className="hero-fade-rise mx-auto mt-6 max-w-2xl text-lg text-wire"
          style={{ animationDelay: "0.2s" }}
        >
          We are a small, founder-led team that treats security, performance,
          and clear communication as requirements, not nice-to-haves. If that
          sounds like how you work, we would like to hear from you.
        </p>
      </div>
    </section>
  );
}
