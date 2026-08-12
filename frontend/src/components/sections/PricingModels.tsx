import { Briefcase, Users } from "lucide-react";

// Same two engagement models already offered in the per-service
// "Engagement models" section (services/[slug]/page.tsx) — reworded here
// to match this card layout, not new business claims.
const PRICING_MODELS = [
  {
    icon: Briefcase,
    title: "Time & Material",
    body: "In this model, you pay for the actual hours worked on your project, along with any agreed expenses. It's well-suited for Agile development, where scope and priorities evolve over time. The flexibility allows you to scale the team size and adjust workloads as your project grows.",
    quote:
      "A pay-as-you-go model where you're billed for actual hours and effort, ideal for Agile projects with changing scope and shifting priorities.",
  },
  {
    icon: Users,
    title: "Dedicated Team",
    body: "This model gives you a hand-picked team of engineers working exclusively on your project. Engagement typically starts from part-time equivalents and can expand as needed. It's the most effective choice for long-term projects, giving you the expertise you need without the overhead of managing in-house staff.",
    quote:
      "A partnership model with a fully committed team working as an extension of your staff, giving you stability, expertise, and cost efficiency for long-term projects.",
  },
];

// Extracted from ServicesHero.tsx once the Staff Augmentation page needed
// the identical "Pricing models" section (same title/body/quote), rather
// than duplicating the JSX a second time — same pattern as
// QualityManagement and PartnerSpotlight.
export default function PricingModels() {
  return (
    <section className="relative overflow-hidden border-t border-paper/10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
          Pricing models
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          {PRICING_MODELS.map((model) => (
            <div key={model.title}>
              <model.icon className="h-9 w-9 text-ember" strokeWidth={1.75} />
              <h3 className="mt-5 font-display text-2xl font-semibold text-ember">{model.title}</h3>
              <p className="mt-4 max-w-md text-paper/70">{model.body}</p>
              <div className="mt-6 max-w-md rounded-lg border border-paper/10 bg-graphite/40 p-6">
                <p className="italic text-paper/70">{model.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
