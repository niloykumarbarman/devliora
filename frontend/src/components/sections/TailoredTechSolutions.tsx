// "Tailored tech solutions for every industry" — matches
// kaz.com.bd's per-technology page's 4-column tech/domain grid.
// Originally built only for the Staff Augmentation and AI Development
// pages (services/[slug]/page.tsx, shared there via TAILORED_TECH_COLUMNS);
// extracted here so other pages can reuse the same generic capability
// copy and real (non-fabricated) technology/domain names instead of
// duplicating the JSX.
const TAILORED_TECH_COLUMNS = [
  { title: "Programming languages", items: ["Java", ".NET", "C++", "Python", "C#", "PHP"] },
  { title: "Platforms", items: ["Office 365", "SPA Commerce", "SharePoint", "Salesforce", "Atlassian"] },
  {
    title: "Technologies",
    items: [
      "Cloud",
      "Machine Learning",
      "Internet of Things",
      "Augmented & Virtual Reality",
      "Cybersecurity",
      "Blockchain",
    ],
  },
  { title: "Domains", items: ["Healthcare", "Telecom", "Finance", "Automotive", "Retail"] },
];

export default function TailoredTechSolutions() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
              Tailored tech solutions for every industry
            </h2>
            <p className="mt-5 inline-block max-w-md border-b border-ember/40 pb-3 italic text-paper/60">
              Proven expertise, industry knowledge, tailored results.
            </p>
          </div>
          <p className="text-paper/70 md:pt-2">
            Across industries, we build custom solutions tailored to the needs of healthcare,
            telecom, finance, automotive, and retail. The focus is on smooth integration and
            operational efficiency. From concept through execution, technology is applied to
            support meaningful outcomes.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {TAILORED_TECH_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-ember">{col.title}</p>
              <div className="mt-2 border-t border-paper/15" />
              <div className="mt-4 flex flex-col gap-3">
                {col.items.map((item) => (
                  <p key={item} className="text-paper/80">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
