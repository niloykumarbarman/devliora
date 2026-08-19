import { Users, Server, Workflow } from "lucide-react";

// "Empowering your dedicated development team for success" — matches
// kaz.com.bd's per-technology page's org-chart block. Originally built
// only for the Staff Augmentation service page
// (services/[slug]/page.tsx); extracted here so other pages (like this
// .NET Development technology page) can reuse the same generic
// capability copy and org-chart instead of duplicating ~90 lines of
// JSX. No fabricated claims — same reasoning as the original.
//
// The org-chart is a 3-tier breakdown (Dedicated Development Center ->
// People/Infrastructure/Processes -> 2 sub-areas each -> 2 leaf items
// each) drawn as a real connector tree: each row of siblings is a flex
// row where every child paints its own half of the horizontal bracket
// line (0-50% or 50-100% of its own width) plus a vertical drop to its
// content — the classic pure-CSS org-chart technique, so the line only
// spans from the first child's center to the last child's center
// instead of the full container width.
const DEDICATED_DEV_CENTER = [
  {
    title: "People",
    icon: Users,
    subs: [
      { title: "Teams", leaves: ["Team Productivity", "Knowledge Accumulation"] },
      { title: "Individuals", leaves: ["Technological Skills", "Domain Experience"] },
    ],
  },
  {
    title: "Infrastructure",
    icon: Server,
    subs: [
      { title: "Hardware", leaves: ["Devices", "Networks"] },
      { title: "Software", leaves: ["Test Automation", "IDEs"] },
    ],
  },
  {
    title: "Processes",
    icon: Workflow,
    subs: [
      { title: "Integration", leaves: ["In-House/Offshore", "Process Optimization"] },
      { title: "Alignment", leaves: ["Seamless Communication", "Methodologies Adjustment"] },
    ],
  },
];

export default function DedicatedDevTeam() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
            Empowering your dedicated development team for success
          </h2>
          <p className="text-paper/70">
            We build skilled teams with the right expertise, infrastructure, and processes to
            support productivity and clear communication, aligned with project goals.
            Collaboration is structured, transparent, and responsive. This ensures teams integrate
            smoothly and deliver consistently over time.
          </p>
        </div>

        <div className="mt-20">
          <div className="text-center">
            <p className="inline-block font-semibold text-paper">Dedicated Development Center</p>
          </div>
          <div className="mx-auto h-6 w-px bg-paper/25" />

          {/* Below sm, 3 categories x 2 subs each squeezes into unreadably
              narrow columns, so the connector-line tree is desktop/tablet
              only and mobile gets a simple stacked list instead (no
              lines, just spacing). */}
          <div className="hidden sm:flex">
            {DEDICATED_DEV_CENTER.map((cat, i, cats) => (
              <div key={cat.title} className="relative flex-1 px-3">
                <span
                  className="absolute top-0 h-px bg-paper/25"
                  style={{ left: i === 0 ? "50%" : "0", right: i === cats.length - 1 ? "50%" : "0" }}
                />
                <span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-paper/25" />

                <div className="flex flex-col items-center pt-6 text-center">
                  <cat.icon className="h-7 w-7 text-ember" strokeWidth={1.5} />
                  <p className="mt-2 font-semibold text-paper">{cat.title}</p>
                  <div className="mt-4 h-4 w-px bg-paper/25" />

                  <div className="flex w-full">
                    {cat.subs.map((sub, j, subs) => (
                      <div key={sub.title} className="relative flex-1 px-2">
                        <span
                          className="absolute top-0 h-px bg-paper/25"
                          style={{ left: j === 0 ? "50%" : "0", right: j === subs.length - 1 ? "50%" : "0" }}
                        />
                        <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-paper/25" />

                        <div className="flex flex-col items-center gap-2 pt-4 text-center">
                          <p className="text-sm font-medium text-paper">{sub.title}</p>
                          {sub.leaves.map((leaf) => (
                            <p key={leaf} className="text-xs leading-snug text-paper/60">
                              {leaf}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-10 sm:hidden">
            {DEDICATED_DEV_CENTER.map((cat) => (
              <div key={cat.title} className="flex flex-col items-center text-center">
                <cat.icon className="h-7 w-7 text-ember" strokeWidth={1.5} />
                <p className="mt-2 font-semibold text-paper">{cat.title}</p>

                <div className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-2 border-t border-paper/15 pt-4">
                  {cat.subs.map((sub) => (
                    <div key={sub.title} className="flex flex-col items-center gap-1.5">
                      <p className="text-sm font-medium text-paper">{sub.title}</p>
                      {sub.leaves.map((leaf) => (
                        <p key={leaf} className="text-xs leading-snug text-paper/60">
                          {leaf}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
