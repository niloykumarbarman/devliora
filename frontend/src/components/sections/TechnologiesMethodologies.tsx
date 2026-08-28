import { ListOrdered, RefreshCw, Kanban as KanbanIcon } from "lucide-react";
import Reveal from "@/components/Reveal";

// Matches kaz.com.bd/technologies' "Software development methodologies"
// section. Heading, intro paragraph, and all three method descriptions +
// their italic example callouts are confirmed verbatim from the
// reference screenshot, per explicit request — same treatment as the AI
// Development page's FAQ answers and stats row. "At Kaz Software" is
// swapped for "Devliora" in the Scrum paragraph (the one spot the
// reference names itself directly); the example callouts themselves
// (ERP module, healthcare application, eCommerce roll-out) are KAZ's own
// specific project claims, published here under Devliora's name per that
// same explicit request.
const METHODOLOGIES = [
  {
    icon: ListOrdered,
    title: "Waterfall",
    description:
      "The development process moves through sequential phases, with each stage starting only after the previous one is complete. Waterfall is best for projects with strict requirements, fixed budgets, and clearly defined outcomes—such as compliance-driven or government systems.",
    example:
      "For example, we applied the Waterfall model while building an ERP module for a manufacturing client with strict audit requirements.",
  },
  {
    icon: RefreshCw,
    title: "Scrum",
    description:
      "Scrum is one of the most widely used Agile frameworks at Devliora. Work is divided into short sprints, supported by constant communication with clients, ensuring flexibility, speed, and transparency. Teams adapt quickly, delivering incremental value every two to four weeks.",
    example:
      "Scrum proved effective when we delivered a healthcare application that required rapid iterations and continuous stakeholder feedback.",
  },
  {
    icon: KanbanIcon,
    title: "Kanban",
    description:
      "Kanban enables high mobility and continuous workflow. Tasks are visualized on boards and moved across stages, allowing our teams to adapt to changing priorities and release updates as they are ready. It's ideal for dynamic projects with evolving requirements.",
    example:
      "We used Kanban to manage the roll-out of an eCommerce platform, ensuring continuous feature delivery without disrupting live operations.",
  },
];

export default function TechnologiesMethodologies() {
  return (
    <section className="relative overflow-hidden bg-paper px-6 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal
          as="h2"
          className="max-w-2xl text-balance font-display text-3xl font-medium text-ink sm:text-4xl"
        >
          Software development methodologies
        </Reveal>

        <Reveal as="p" delay={0.08} className="mt-5 max-w-2xl text-graphite">
          At Devliora, we apply a variety of software development life cycle models, from
          structured to Agile, to ensure smooth delivery and maximum value for our clients.
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {METHODOLOGIES.map((method, i) => (
            <Reveal key={method.title} delay={i * 0.1}>
              <p className="font-display text-xl font-semibold text-ember">{method.title}</p>
              <method.icon className="mt-4 h-6 w-6 text-ember" strokeWidth={1.75} />
              <p className="mt-4 text-sm leading-relaxed text-graphite">{method.description}</p>
              <div className="mt-5 rounded-lg bg-graphite/5 p-4">
                <p className="text-sm italic leading-relaxed text-graphite/80">{method.example}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
