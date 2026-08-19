import { Server, BookOpen, CalendarClock, Globe, MessageCircle } from "lucide-react";

// "Seamless Collaboration Across Distributed Teams" — matches
// kaz.com.bd's per-technology page's 5-column capability grid.
// Originally built only for the Staff Augmentation service page
// (services/[slug]/page.tsx); extracted here so other pages can reuse
// it instead of duplicating the JSX. Generic capability copy, no
// fabricated claims. Icons are generic concept marks (not brand logos),
// so lucide-react rather than simple-icons.
const DISTRIBUTED_TEAMS_COLLABORATION = [
  {
    icon: Server,
    title: "Common Infrastructure",
    items: ["Integrated Codebase", "Single CI Server", "Hourly Automated Builds"],
  },
  {
    icon: BookOpen,
    title: "Inter-Team Alignment",
    items: ["Technology Alignment", "Tool Matching", "Knowledge Transfer"],
  },
  {
    icon: CalendarClock,
    title: "Multi-Team Management",
    items: ["Accountable Roles Matching", "Project Progress Tracking", "Completed Phases Analysis"],
  },
  {
    icon: Globe,
    title: "Community",
    items: ["Project Management Tools", "Wikis And Blogs", "Shared Mailing Lists"],
  },
  {
    icon: MessageCircle,
    title: "Communication",
    items: ["Sprint Planning", "Regular Standups", "Retrospectives"],
  },
];

export default function DistributedTeamsCollaboration() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <h2 className="text-balance font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
            Seamless Collaboration Across Distributed Teams
          </h2>
          <p className="text-paper/70">
            We&apos;ve perfected collaboration and project management in distributed teams,
            mastering industry best practices to overcome geographic, language, and cultural
            barriers. Our expertise ensures smooth integration into global, multi-vendor
            environments for efficient teamwork.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {DISTRIBUTED_TEAMS_COLLABORATION.map((col) => (
            <div key={col.title}>
              <div className="flex items-center gap-2 border-b border-paper/15 pb-3">
                <col.icon className="h-6 w-6 shrink-0 text-ember" strokeWidth={1.5} />
                <p className="font-semibold text-paper">{col.title}</p>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {col.items.map((item) => (
                  <li key={item} className="text-sm leading-snug text-ember/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
