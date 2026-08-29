// Frontend-authored "Who it's for" / "Problems it solves" copy for each
// service that has a dedicated /services/[slug] page.
//
// Why it lives here and not in the CMS: the admin-managed ServiceDto
// carries the marketing prose (shortDescription / fullDescription /
// highlights / process), but there was no field framing the audience or
// the concrete pains a service addresses — the two things a visitor
// arriving from search wants answered before anything else ("is this for
// me?" / "do they solve my problem?"). This map fills that gap without a
// backend schema change. Keep every line specific and honest: describe
// real situations and real pains, never invented metrics or client
// counts. A slug with no entry simply renders no section.

export interface ServiceWhoAndProblems {
  /** One sentence that frames the section; optional. */
  intro?: string;
  /** Reader-recognisable situations / team types. 2–4 items. */
  forWho: string[];
  /** Concrete problems this service exists to remove. 3–5 items. */
  problems: string[];
}

export const SERVICE_WHO_AND_PROBLEMS: Record<string, ServiceWhoAndProblems> = {
  "software-engineering": {
    intro:
      "Custom software engineering is the right call when the thing you need to run the business doesn't exist off the shelf — or the version you have is holding you back.",
    forWho: [
      "Product and operations teams that have outgrown spreadsheets, internal scripts, or a SaaS tool that no longer matches how they actually work",
      "Companies replacing a system that still runs the business but is slow, risky, and expensive to change",
      "Founders who need a first version built to a standard they can scale from and raise on",
    ],
    problems: [
      "An off-the-shelf tool forces your process to bend around it instead of the other way round",
      "A legacy codebase where every change is slow, risky, and understood by only one or two people",
      "Integrations held together by manual exports, brittle scripts, or a spreadsheet nobody wants to own",
      "Authentication, rate limiting, and audit trails that were added late and were never fully trusted",
      "No clear record of what was built, why, or how another team would take it over",
    ],
  },

  "ai-development": {
    intro:
      "AI development is worth it when a task is repetitive and language-shaped but has too many edge cases for a rule engine — and when you need the result to be measurable, not just impressive in a demo.",
    forWho: [
      "Teams with a high-volume task — classification, extraction, drafting, routing, summarising — that currently eats staff hours",
      "Companies sitting on documents, tickets, or transcripts they can't search or summarise at scale",
      "Product teams adding an AI feature that has to be reliable, observable, and safe to ship to customers",
    ],
    problems: [
      "A workflow that is almost rules-based, but the exceptions keep growing faster than the rules",
      "Manual review queues that expand faster than the team can clear them",
      "An LLM prototype that demos well but fails quietly on real inputs, with no way to measure how often",
      "Open questions about cost per request, where the data goes, and what happens when the model is wrong",
    ],
  },

  "digital-design": {
    intro:
      "Design work pays off when unclear screens — not missing features — are what's costing you users, support time, and engineering rework.",
    forWho: [
      "Teams shipping a product whose interface has grown by accretion and now confuses new users",
      "Companies with a working backend and no design system, so every screen looks and behaves differently",
      "Founders who need screens and a clickable prototype to test with users or show investors before committing to a build",
    ],
    problems: [
      "Drop-off and support tickets that trace back to confusing flows rather than gaps in functionality",
      "Designers and engineers working from different sources of truth, so the build never quite matches the mockups",
      "Accessibility and responsive behaviour treated as a later pass that never actually happens",
      "No shared components, so the same button gets rebuilt five slightly different ways",
    ],
  },

  "digital-marketing": {
    intro:
      "A good fit when you have something real to promote and need the channels, tracking, and cadence run properly — not a generic campaign template.",
    forWho: [
      "Companies with a product or service that sells, but no consistent pipeline of visibility and leads feeding it",
      "Teams running ad-hoc social, email, and content with no plan tying them together or measuring what works",
      "Businesses whose analytics can't currently answer where a lead or a sale actually came from",
    ],
    problems: [
      "Marketing spend going out with no clear read on which channel returns it",
      "Content and posts published on an irregular schedule, so momentum never builds",
      "SEO and site copy written for search engines rather than for the person reading it",
      "Reporting that shows activity (posts, sends, clicks) but not outcomes (leads, revenue)",
    ],
  },

  "it-consulting": {
    intro:
      "Consulting is the right first step when the decision matters, the options are unclear, and you want an outside read before committing budget or a direction.",
    forWho: [
      "Leaders weighing build vs. buy, a re-platform, or a cloud move and wanting a second opinion grounded in engineering reality",
      "Teams that know something in the architecture, process, or delivery is slowing them down but can't name it precisely",
      "Companies inheriting a system through acquisition or a departed vendor and needing to understand what they actually have",
    ],
    problems: [
      "A roadmap decision that could go several ways, each expensive to reverse",
      "Delivery that keeps slipping, with no agreement on why",
      "An architecture that made sense three years ago and now fights every new requirement",
      "No documented view of the current systems, their risks, or what depends on what",
    ],
  },

  "it-maintenance-support": {
    intro:
      "For software that is live and mattering, and needs someone accountable for keeping it running, patched, and improving — not just on call when it breaks.",
    forWho: [
      "Companies whose original build team has moved on, leaving a system in production with no clear owner",
      "Teams that need dependable L1–L3 support and a predictable response time, not best-effort favours",
      "Businesses that want steady, small improvements to an existing product rather than a big rewrite",
    ],
    problems: [
      "Incidents handled by whoever happens to be free, with no runbook and no follow-up",
      "Security patches and dependency updates that quietly fall years behind",
      "A backlog of small fixes and improvements that never reaches the top of anyone's list",
      "No monitoring, so you hear about outages from customers first",
    ],
  },

  "staff-augmentation": {
    intro:
      "The right model when you have the direction and the product ownership in-house, and need experienced engineers to add capacity without a long hiring cycle.",
    forWho: [
      "Product teams with a clear roadmap and more work than the current team can deliver on time",
      "Companies that need a specific skill — a platform, a framework, a discipline — for a defined stretch of work",
      "Teams scaling up for a launch or a funded push who don't want to over-hire for a temporary peak",
    ],
    problems: [
      "A hiring pipeline that takes months while the roadmap keeps slipping",
      "Contractors who need heavy hand-holding and leave nothing behind when they go",
      "Uneven coverage — one person holding a critical area with no backup",
      "Ramp-up time that eats most of a short engagement before anything ships",
    ],
  },

  "software-quality-assurance": {
    intro:
      "QA earns its place when releases have become tense — when you're not sure what a change might break, and finding out in production is the norm.",
    forWho: [
      "Teams shipping frequently enough that manual regression checks no longer keep up",
      "Companies preparing a release that has to be right the first time — a migration, a compliance deadline, a launch",
      "Product teams with a growing bug backlog and no agreed definition of what \"done\" and \"tested\" mean",
    ],
    problems: [
      "Regressions that reappear release after release because nothing guards against them",
      "A test suite that is slow, flaky, and ignored, so a red build means nothing",
      "Bugs found by customers that a structured test pass would have caught",
      "No shared record of what has been tested, on what, and to what standard",
    ],
  },

  "performance-reliability-engineering": {
    intro:
      "This is for systems where load is the risk — where a traffic spike, a large customer, or a growth milestone could be the thing that takes the service down.",
    forWho: [
      "Teams heading into a known peak — a campaign, a sale, a seasonal surge — that has hurt before or hasn't been tested",
      "Companies onboarding a customer several times larger than their current largest",
      "Product teams that have never load-tested and want to know where the system actually breaks before a customer finds out",
    ],
    problems: [
      "Response times that are fine in normal use and fall apart under concurrency",
      "No idea what the real ceiling is — how many users, requests, or records before things degrade",
      "Outages during the exact moments that matter most: launches, sales, deadlines",
      "Performance work done by guesswork because there's no repeatable way to reproduce load",
    ],
  },
};

// SEO metadata overlay for /services/[slug]. Purely additive: the page's
// generateMetadata falls back to the CMS `service.title` /
// `service.shortDescription` for any slug not listed here, so this never
// hides or replaces admin-managed content — it only supplies a longer,
// keyword-led <title> (~50–60 chars, brand-suffixed by buildMetadata)
// and a 150–160-char meta description with a call to action, which the
// short CMS fields don't provide. Keep every claim to real capability
// statements — no invented metrics or client counts.
export interface ServiceSeo {
  /** Bare title; buildMetadata appends " | Devliora". Target 50–60 chars total. */
  title: string;
  /** 150–160 chars, ends with a light CTA. */
  description: string;
}

export const SERVICE_SEO: Record<string, ServiceSeo> = {
  "software-engineering": {
    title: "Software Engineering & Architecture Services",
    description:
      "Devliora's software engineering team designs, builds and hardens custom systems — APIs, platforms and integrations — to a standard your team can own and scale.",
  },
  "ai-development": {
    title: "AI Development Services — ML & Automation",
    description:
      "Practical AI features — extraction, classification, prediction and automation — engineered to be measurable and safe in production, not just a demo. Talk to us.",
  },
  "performance-reliability-engineering": {
    title: "Performance & Reliability Engineering Services",
    description:
      "Load testing, performance profiling and reliability engineering so software stays fast from first user to peak traffic. Find the ceiling before customers do.",
  },
  "digital-design": {
    title: "Product Design & UI/UX Services for Software",
    description:
      "UI/UX and product design that fixes the unclear screens costing you users and support time — research, design systems and clean handoff to engineering.",
  },
  "digital-marketing": {
    title: "Digital Marketing Services for Tech Companies",
    description:
      "SEO, content, paid and email run with proper tracking and cadence, so you can see which channel returns the spend — not a generic campaign template. Let's talk.",
  },
  "it-consulting": {
    title: "IT Consulting & Software Architecture Services",
    description:
      "An outside engineering read before you commit budget — build vs buy, re-platform, cloud moves, delivery problems — grounded in what ships. Book a consult.",
  },
  "it-maintenance-support": {
    title: "Software Maintenance & Application Support",
    description:
      "Dependable L1–L3 support, security patching, dependency upkeep and steady improvements for software that is live and matters, with an accountable owner.",
  },
  "staff-augmentation": {
    title: "Staff Augmentation & Dedicated Dev Teams",
    description:
      "Experienced engineers embedded with your team to add capacity without a long hiring cycle — your roadmap, your standards, ramped up fast. Tell us what you need.",
  },
  "software-quality-assurance": {
    title: "Software QA & Automated Testing Services",
    description:
      "Automated test suites, CI quality gates and a written definition of done, so releases stop being tense and regressions stop reappearing. Book a QA assessment.",
  },
};
