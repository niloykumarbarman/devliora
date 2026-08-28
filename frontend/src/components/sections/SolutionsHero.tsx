export default function SolutionsHero() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-36">
      <div className="bg-grain absolute inset-0" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(61,90,254,0.25), transparent 60%), radial-gradient(circle at 80% 0%, rgba(255,107,53,0.15), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(243,242,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(243,242,237,0.04)_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-4xl px-6">

        <h1 className="hero-h1-rise mt-4 text-balance font-display text-4xl font-semibold text-paper md:text-5xl">
          Software Solutions Built Around <span className="text-signal">Your Outcomes</span>
        </h1>

        <p
          className="hero-fade-rise mt-6 max-w-2xl text-lg text-wire"
          style={{ animationDelay: "0.16s" }}
        >
          Where our services describe what we do, our solutions describe the
          problems we solve — from legacy modernization to AI integration.
        </p>
      </div>
    </section>
  );
}
