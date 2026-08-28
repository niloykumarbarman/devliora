export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-28 sm:py-32">
      <div className="bg-grain pointer-events-none absolute inset-0" />

      <div className="pointer-events-none absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-signal/20 blur-[120px] animate-ambient-drift" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-ember/10 blur-[120px] animate-ambient-drift" />

      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-paper) 1px, transparent 1px), linear-gradient(to bottom, var(--color-paper) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">

        <h1 className="hero-h1-rise mt-6 text-balance font-display text-4xl font-medium text-paper sm:text-5xl md:text-6xl">
          Engineering <span className="text-signal">notes</span>{" "}
          on software, AI &amp; cloud
        </h1>

        <p
          className="hero-fade-rise mx-auto mt-6 max-w-2xl text-lg text-wire"
          style={{ animationDelay: "0.16s" }}
        >
          Engineering practices, architecture decisions, and lessons from
          building enterprise systems, written by the people who build them.
        </p>
      </div>
    </section>
  );
}
