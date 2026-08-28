import Reveal from "@/components/Reveal";

const sections = [
  {
    title: "Who Operates This Site",
    body: [
      "This website, devliora.com, is operated by Devliora, a software engineering company that trades as Devliora Systems, with delivery teams in Australia and Bangladesh. References to \"Devliora\", \"we\", or \"us\" in these terms mean that company. Questions about these terms can be emailed to info@devliora.com.",
    ],
  },
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using this website, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.",
    ],
  },
  {
    title: "Use of the Website",
    body: [
      "This website and its content are provided for informational purposes about Devliora's services. You agree not to misuse the site, attempt unauthorized access to any systems, or interfere with its normal operation.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "All content on this website, including text, graphics, logos, and design, is the property of Devliora unless otherwise stated, and may not be reproduced or distributed without prior written permission.",
    ],
  },
  {
    title: "Service Engagements",
    body: [
      "Any project work, deliverables, timelines, and fees are governed by a separate written agreement between Devliora and the client, entered into after a scoping and consultation process. These website terms do not by themselves constitute a service contract.",
    ],
  },
  {
    title: "Job Applications",
    body: [
      "Information submitted through the Careers page is used solely to evaluate your candidacy for open positions and is handled in line with our Privacy Policy.",
    ],
  },
  {
    title: "No Warranty",
    body: [
      "This website is provided on an \"as is\" basis without warranties of any kind, express or implied, regarding its accuracy, availability, or fitness for a particular purpose.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "To the extent permitted by law, Devliora is not liable for any indirect, incidental, or consequential damages arising from your use of this website.",
    ],
  },
  {
    title: "External Links",
    body: [
      "This site may link to third-party websites. Devliora is not responsible for the content or practices of those external sites.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "We may revise these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "Governing Law",
    body: [
      "These terms are governed by applicable local law, without regard to conflict-of-law principles.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "Questions about these terms can be sent through our contact page, and we will respond as soon as possible.",
    ],
  },
];

export default function TermsContent() {
  return (
    <section className="relative bg-paper py-24">
      <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(to_right,rgba(14,20,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,20,32,0.04)_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="space-y-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
          {sections.map((section, i) => (
            <Reveal
              key={section.title}
              delay={i * 0.08}
              className="bg-paper p-6 md:p-8"
            >
              <h2 className="font-display text-xl font-semibold text-ink">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-graphite">
                {section.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
