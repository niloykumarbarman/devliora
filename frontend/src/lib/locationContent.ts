/**
 * Content for the /locations/[slug] market pages. Devliora has one real
 * office (Melbourne, AU) plus a Bangladesh team; the US, UK and Canada
 * pages are explicit that there is no local entity and are useful
 * because of what they actually say — working-hours overlap, contracting
 * and tax treatment, the privacy regime that applies, data residency
 * options, and a communication cadence built around that market's day.
 *
 * These pages must never be the same page with the country name
 * swapped. Every field below differs by market on a real axis (overlap
 * window, tax form, privacy law, cloud regions, presence). If a new
 * market can't be given genuinely distinct, useful content, it should
 * not get a page.
 */

export interface LocationEngagementModel {
  title: string;
  body: string;
}

export interface LocationProcessStep {
  step: string;
  body: string;
}

export interface LocationContent {
  slug: string;
  /** Full country name for prose, e.g. "the United States". */
  country: string;
  /** Short label for headings/nav, e.g. "USA". */
  label: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Lead paragraph — states honestly what presence Devliora has. */
  intro: string;
  /** One-line explicit presence / contracting-entity statement. */
  presence: string;
  timezone: {
    summary: string;
    overlap: string;
    detail: string;
  };
  engagementModels: LocationEngagementModel[];
  contracting: string[];
  dataProtection: string[];
  communication: string[];
  industries: string;
  process: LocationProcessStep[];
  caseStudySlugs: string[];
  faqs: { question: string; answer: string }[];
}

export const LOCATION_CONTENT: Record<string, LocationContent> = {
  usa: {
    slug: "usa",
    country: "the United States",
    label: "USA",
    metaTitle: "Custom Software Development Company in USA",
    metaDescription:
      "Devliora builds custom software for US companies — async-first delivery with daytime overlap, US-friendly contracting, and SOC 2 / CCPA / HIPAA-aware engineering.",
    h1: "Custom Software Development for US Companies",
    intro:
      "Devliora is a software engineering company working with US clients from delivery teams in Australia and Bangladesh. We don't have a US office — what we bring instead is senior engineers, a documented async-first process, and a working day that overlaps yours enough to keep decisions moving.",
    presence:
      "No US entity or office. We contract as an overseas vendor, invoice in USD, and provide a W-8BEN-E. Most clients engage us under their own MSA or ours, governed by the law of their state.",
    timezone: {
      summary:
        "Our Australia team's afternoon is your morning; our Bangladesh team overlaps your prior evening.",
      overlap: "3–5 hours with US Eastern, 2–4 with Pacific",
      detail:
        "A typical setup: the Australia team is online during US morning (roughly 8–11am ET) for standups, planning, and unblock calls; the Bangladesh team carries the build through your night, so you review progress at the start of the next day. Pacific clients get the overlap shifted earlier and we place the one fixed daily call where it costs you least.",
    },
    engagementModels: [
      { title: "Dedicated team", body: "A ring-fenced squad — engineers, a tech lead, QA — working only on your product, billed monthly. The usual fit for an ongoing roadmap." },
      { title: "Fixed-scope project", body: "A defined build with a fixed price and milestones. Best for a well-specified v1 or a contained piece of work." },
      { title: "Staff augmentation", body: "Individual senior engineers embedded in your existing team and process, reporting to your leads." },
    ],
    contracting: [
      "Contract under your state's law; we accept client-paper MSAs and SOWs",
      "USD invoicing, net-15 to net-30, paid by wire or ACH",
      "W-8BEN-E on file; services performed abroad, so no US withholding",
      "IP assigned on payment in every SOW; NDAs before any code or data access",
      "US business-hours support windows available as a paid add-on",
    ],
    dataProtection: [
      "CCPA / CPRA-aware handling for California consumer data — data inventory, deletion, and opt-out support built into what we ship",
      "HIPAA engagements run under a BAA with the cloud provider; PHI kept in US regions",
      "SOC 2 control support — we build the logging, access control, and change management your auditor expects",
      "Data can be pinned to US cloud regions (us-east, us-west) when residency matters",
    ],
    communication: [
      "One scheduled daily sync in your morning overlap; everything else async",
      "Written updates in your tracker daily; a recorded demo every week",
      "Shared Slack or Teams channel; decisions logged, not left in calls",
      "Named escalation contacts with a response-time commitment",
    ],
    industries:
      "We've built for fintech and payments, healthcare, logistics, and B2B SaaS — the sectors where US clients most often need an outside engineering team that already understands compliance and scale.",
    process: [
      { step: "Scoping call", body: "60–90 minutes in your afternoon; a written scope, risks, and a delivery shape follow within two business days." },
      { step: "Kickoff & setup", body: "Repo access, environments, and the first backlog in week one; the daily sync time is fixed with you here." },
      { step: "Weekly delivery", body: "Work ships behind flags continuously; a recorded demo and a written summary land every Friday your time." },
      { step: "Monthly review", body: "Scope, velocity, and cost reviewed against the roadmap; change what isn't working." },
    ],
    caseStudySlugs: ["multi-bank-settlement-api-modernization", "scaling-saas-platform-enterprise-workloads"],
    faqs: [
      { question: "Do you have an office in the US?", answer: "No, and we're upfront about that. We work with US clients remotely from our teams in Australia and Bangladesh, with a process built for that setup — daytime overlap for decisions, async delivery overnight." },
      { question: "How much of your day overlaps with US hours?", answer: "Three to five hours with US Eastern and two to four with Pacific, concentrated in your morning. Enough for a daily sync and ad-hoc calls; the rest of the work happens while you're offline." },
      { question: "Can you sign our MSA and work under US law?", answer: "Yes. We regularly work under client MSAs governed by the client's state law, with IP assigned on payment and NDAs in place before any access." },
      { question: "Can you meet SOC 2 or HIPAA requirements?", answer: "Yes. We build the technical controls a SOC 2 audit checks for, and run HIPAA engagements under a BAA with PHI kept in US cloud regions." },
      { question: "How do you handle payments?", answer: "USD invoices, net-15 to net-30, paid by wire or ACH. We provide a W-8BEN-E; services are performed outside the US so there's no US withholding." },
    ],
  },

  uk: {
    slug: "uk",
    country: "the United Kingdom",
    label: "UK",
    metaTitle: "Software Development Company in UK",
    metaDescription:
      "Devliora builds software for UK companies — strong working-hours overlap, contracts under English law, UK GDPR-aware engineering, and senior remote teams.",
    h1: "Software Development for UK Companies",
    intro:
      "Devliora works with UK clients from engineering teams in Bangladesh and Australia. The Bangladesh team shares a large part of your working day, so a UK engagement feels closer to a same-timezone one than most offshore arrangements.",
    presence:
      "No UK office or Ltd. We invoice from Australia in GBP or USD; for UK VAT-registered clients our services fall under the reverse charge, so no VAT is added on our side.",
    timezone: {
      summary:
        "Bangladesh (UTC+6) overlaps your morning through mid-afternoon; the Australia team covers your earlier hours.",
      overlap: "4–6 hours with UK time",
      detail:
        "The Bangladesh team is online from roughly 10am to 4pm UK time — the core of your day — so standups, reviews, pairing, and unblock calls all happen live. Work continues after you log off, and you pick up progress the next morning.",
    },
    engagementModels: [
      { title: "Dedicated team", body: "A ring-fenced squad billed monthly, working only on your product — the usual fit for an ongoing roadmap." },
      { title: "Fixed-scope project", body: "A defined build, fixed price, milestone billing — for a contained, well-specified piece of work." },
      { title: "Team extension", body: "Senior engineers embedded in your team and ceremonies, reporting to your leads. This is a B2B services engagement — Devliora is the supplier, not individuals working inside your org." },
    ],
    contracting: [
      "Contract under the law of England and Wales; client-paper MSAs and SOWs accepted",
      "GBP or USD invoicing, typically 30-day terms, paid by bank transfer",
      "VAT reverse charge applies — we don't add UK VAT; your accounts handle it",
      "A supplier relationship, not IR35-relevant contracting — Devliora is the contracting entity, not an individual",
      "IP assigned on payment in every SOW; NDAs before access",
    ],
    dataProtection: [
      "UK GDPR and the Data Protection Act 2018 — lawful basis, DSAR handling, and retention limits built into what we ship",
      "The IDTA or SCCs in place for personal data processed by our overseas teams, with a documented transfer risk assessment",
      "Data can be kept in UK or EU cloud regions (London, Dublin) where residency is required",
      "ICO-aligned breach process — the 72-hour notification path defined before go-live",
    ],
    communication: [
      "Daily standup live in your morning; reviews and planning in your working hours",
      "Shared Slack / Teams channel; written daily updates and a weekly demo",
      "Decisions recorded in the tracker or a decision log, not left in calls",
      "Named escalation contacts with a response-time commitment",
    ],
    industries:
      "UK work has clustered in fintech and payments, B2B SaaS, and e-commerce — sectors where teams want strong process and UK GDPR fluency without hiring locally.",
    process: [
      { step: "Scoping call", body: "In your working hours; a written scope with risks and a delivery shape follows within two business days." },
      { step: "Kickoff", body: "Access, environments, and the first backlog in week one; standup time fixed with you." },
      { step: "Weekly delivery", body: "Continuous delivery behind flags; a demo and written summary each week, in your afternoon." },
      { step: "Monthly review", body: "Scope, velocity, and spend reviewed against the roadmap; adjust what isn't working." },
    ],
    caseStudySlugs: ["multi-bank-settlement-api-modernization", "scalable-digital-platform-for-technology-agency"],
    faqs: [
      { question: "How well do your hours overlap with the UK?", answer: "Four to six hours a day. Our Bangladesh team is online through the core of your working day (about 10am–4pm UK), so standups, reviews, and pairing all happen live." },
      { question: "Do you have a UK company?", answer: "No. We contract from Australia, under English law, invoicing in GBP or USD. For VAT-registered UK clients our services fall under the reverse charge." },
      { question: "Is IR35 a concern?", answer: "No. IR35 applies to individuals working like employees. Devliora engages as a supplier — you contract with the company, which delivers with its own team, tools, and process." },
      { question: "How do you handle UK GDPR and data transfers?", answer: "We work to UK GDPR and the DPA 2018, put the IDTA or SCCs in place for processing by our overseas teams with a transfer risk assessment, and can keep data in UK or EU regions." },
      { question: "Can data stay in the UK or EU?", answer: "Yes. We can pin storage and processing to London or Dublin cloud regions when residency is a requirement." },
    ],
  },

  canada: {
    slug: "canada",
    country: "Canada",
    label: "Canada",
    metaTitle: "Custom Software Development Company in Canada",
    metaDescription:
      "Devliora builds custom software for Canadian companies — morning overlap for decisions, PIPEDA and Quebec Law 25-aware engineering, and senior remote teams.",
    h1: "Custom Software Development for Canadian Companies",
    intro:
      "Devliora works with Canadian clients from teams in Australia and Bangladesh. The working pattern is close to how we serve the US: your morning is our decision window, and delivery continues through your night.",
    presence:
      "No Canadian entity. We invoice in CAD or USD from Australia; as a non-resident supplying services from abroad we don't charge GST/HST — your organization self-assesses where the rules require it.",
    timezone: {
      summary:
        "Australia's afternoon is your morning (Eastern); Bangladesh overlaps your previous evening.",
      overlap: "3–5 hours with Eastern (Toronto, Montréal), 1–3 with Pacific (Vancouver)",
      detail:
        "The Australia team takes the morning-Eastern slot for standups and planning; the Bangladesh team runs the build overnight. Vancouver clients get a thinner live window, so we lean more async and place the one fixed call as early in your day as works.",
    },
    engagementModels: [
      { title: "Dedicated team", body: "A ring-fenced monthly squad for an ongoing product roadmap." },
      { title: "Fixed-scope project", body: "Defined build, fixed price, milestones — for contained, specified work." },
      { title: "Staff augmentation", body: "Senior engineers inside your team and process, reporting to your leads." },
    ],
    contracting: [
      "Contract under the law of your province (commonly Ontario, BC, or Alberta); client-paper MSAs accepted",
      "CAD or USD invoicing, 30-day terms, bank transfer",
      "Non-resident service supplier — no GST/HST charged; client self-assesses where applicable",
      "French-language contract and correspondence available for Québec-based clients",
      "IP assigned on payment; NDAs before access",
    ],
    dataProtection: [
      "PIPEDA-aligned handling — consent, purpose limitation, and access-request support built in",
      "Québec Law 25 — privacy impact assessments, breach reporting to the CAI, and stricter consent rules where a client or their users are in Québec",
      "Data can be kept in Canadian cloud regions (Montréal, Toronto) when residency is required — relevant for public sector and health",
      "Provincial health-privacy regimes (PHIPA in Ontario, equivalents elsewhere) supported for healthcare work",
    ],
    communication: [
      "One fixed daily sync in your morning; async the rest of the day",
      "Daily written updates, a weekly recorded demo, a shared Slack / Teams channel",
      "Bilingual (EN / FR) communication available for Québec engagements",
      "Named escalation contacts and a response-time commitment",
    ],
    industries:
      "Canadian engagements have been strongest in fintech, healthcare, and SaaS — areas where PIPEDA, provincial health privacy, or Law 25 make an experienced partner worth more than a local generalist.",
    process: [
      { step: "Scoping call", body: "In your morning; a written scope, risks, and delivery shape within two business days." },
      { step: "Kickoff", body: "Access and the first backlog in week one; the daily sync time set with you, earlier for Pacific clients." },
      { step: "Weekly delivery", body: "Continuous delivery behind flags; a demo and written summary each week." },
      { step: "Monthly review", body: "Scope, pace, and cost reviewed against the roadmap." },
    ],
    caseStudySlugs: ["patient-records-modernization-healthcare-platform", "multi-bank-settlement-api-modernization"],
    faqs: [
      { question: "Do you have an office in Canada?", answer: "No. We work with Canadian clients from Australia and Bangladesh. What we offer is a morning-overlap decision window, an async delivery process, and fluency with PIPEDA and Law 25." },
      { question: "Can you work in French for a Québec project?", answer: "Yes. We can handle contracts and day-to-day communication in French for Québec-based clients and account for Law 25's stricter requirements." },
      { question: "How does GST/HST work with an overseas supplier?", answer: "We don't charge GST/HST as a non-resident supplying services from abroad. Your organization self-assesses where the rules require it — your finance team will know the treatment." },
      { question: "Can data stay in Canada?", answer: "Yes. We can pin storage and processing to Montréal or Toronto cloud regions, which matters for public sector and healthcare work." },
      { question: "What are your hours versus Canadian time?", answer: "Three to five hours of overlap with Eastern, one to three with Pacific, in your morning. Enough for a daily sync and calls; the build continues overnight." },
    ],
  },

  australia: {
    slug: "australia",
    country: "Australia",
    label: "Australia",
    metaTitle: "Software Development Company in Australia",
    metaDescription:
      "Devliora is a software development company with a Melbourne team — same-timezone delivery for Australian clients, local contracting, and Privacy Act-aware engineering.",
    h1: "Software Development for Australian Companies",
    intro:
      "Devliora has an engineering team in Melbourne (Point Cook, VIC) alongside our Bangladesh team. For Australian clients that means a genuine local presence, same-timezone working hours, and the option to meet in person.",
    presence:
      "Local team in Melbourne, VIC. We contract as an Australian counterparty, invoice in AUD with GST, and can meet on-site in Melbourne. The Bangladesh team extends delivery capacity while the Australia team keeps the working relationship local.",
    timezone: {
      summary:
        "The Melbourne team works your hours; Bangladesh (UTC+6) overlaps your morning to mid-afternoon.",
      overlap: "Full working-day overlap with the Melbourne team, 4–6 hours with Bangladesh",
      detail:
        "There's no offshore lag on the relationship — planning, reviews, and calls happen in AEST/AEDT with people who work your day. The Bangladesh team adds throughput and covers your early hours, but your primary contacts are local.",
    },
    engagementModels: [
      { title: "Dedicated team", body: "A monthly squad led from Melbourne, with Bangladesh engineers adding capacity — for an ongoing roadmap." },
      { title: "Fixed-scope project", body: "Defined build, fixed price, milestones — managed locally." },
      { title: "Staff augmentation", body: "Engineers embedded in your team, coordinated in your timezone." },
    ],
    contracting: [
      "Australian-law contract; Devliora is an Australian counterparty for the engagement",
      "AUD invoicing with GST; standard 14–30 day terms",
      "ABN provided; PAYG and GST handled locally",
      "On-site meetings in Melbourne; interstate by arrangement",
      "IP assigned on payment; NDAs before access",
    ],
    dataProtection: [
      "Privacy Act 1988 and the Australian Privacy Principles — collection limits, access/correction, and use restrictions built into what we ship",
      "Notifiable Data Breaches scheme — assessment and OAIC notification process defined before go-live",
      "Data can be kept in Australian cloud regions (Sydney, Melbourne) — required for much government and health work",
      "For government engagements: alignment with the ISM and IRAP-assessed cloud services where mandated",
    ],
    communication: [
      "Standups, planning, and reviews in AEST/AEDT with your local contacts",
      "In-person workshops in Melbourne when useful; video otherwise",
      "Shared Slack / Teams channel, daily written updates, a weekly demo",
      "Named escalation contacts locally",
    ],
    industries:
      "Australian work spans government and public sector, healthcare, logistics, and SaaS — sectors where data residency, the ISM, or the APPs make a locally-accountable partner important.",
    process: [
      { step: "Scoping meeting", body: "In person in Melbourne or by video; a written scope and delivery shape within two business days." },
      { step: "Kickoff", body: "Access, environments, and the first backlog in week one; ceremonies scheduled in AEST/AEDT." },
      { step: "Weekly delivery", body: "Continuous delivery behind flags; a demo and summary each week." },
      { step: "Monthly review", body: "Scope, pace, and cost reviewed against the roadmap, in person where practical." },
    ],
    caseStudySlugs: ["scaling-saas-platform-enterprise-workloads", "patient-records-modernization-healthcare-platform"],
    faqs: [
      { question: "Do you actually have a team in Australia?", answer: "Yes — an engineering team in Point Cook, Melbourne. For Australian clients your primary contacts are local and work your hours; the Bangladesh team adds delivery capacity behind them." },
      { question: "Can we meet in person?", answer: "Yes, in Melbourne, and interstate by arrangement. Kickoffs and workshops in particular are better face to face." },
      { question: "Do you invoice in AUD with GST?", answer: "Yes. We're an Australian counterparty with an ABN, invoicing in AUD with GST, on standard 14–30 day terms." },
      { question: "Can data stay onshore?", answer: "Yes. We can keep storage and processing in Australian cloud regions (Sydney, Melbourne), which is typically required for government and health projects." },
      { question: "Can you work to the ISM / IRAP for government projects?", answer: "Yes. We align to the Information Security Manual and use IRAP-assessed cloud services where a project mandates it." },
    ],
  },
};

/** Render order for the /locations index and static params. */
export const LOCATION_SLUGS = ["usa", "uk", "canada", "australia"] as const;

/**
 * Readable titles for the case studies these pages link to, so the
 * /locations pages stay fully static (no API fetch just to show a
 * label). Keep in sync with the real /case-studies slugs.
 */
export const CASE_STUDY_TITLES: Record<string, string> = {
  "multi-bank-settlement-api-modernization": "Multi-bank settlement API modernization",
  "scaling-saas-platform-enterprise-workloads": "Scaling a SaaS platform for enterprise workloads",
  "scalable-digital-platform-for-technology-agency": "A scalable digital platform for a technology agency",
  "patient-records-modernization-healthcare-platform": "Patient records modernization for a healthcare platform",
};
