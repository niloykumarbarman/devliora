export default function BookConsultationHero() {
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
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h1 className="hero-h1-rise mt-6 text-balance font-display text-4xl font-semibold text-paper sm:text-5xl md:text-6xl">
          Book a free consultation.{" "}
          <span className="text-signal">Start with clarity.</span>
        </h1>
        <p
          className="hero-fade-rise mx-auto mt-6 max-w-xl text-lg text-wire"
          style={{ animationDelay: "0.2s" }}
        >
          Tell us about your project and preferred timing. One of our
          engineers will reach out to schedule a focused session on scope,
          timeline, and approach.
        </p>
      </div>
    </section>
  );
}
