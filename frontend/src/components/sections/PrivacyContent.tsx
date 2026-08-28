import Reveal from "@/components/Reveal";

const sections = [
  {
    title: "Who We Are",
    body: [
      "This website, devliora.com, is operated by Devliora (\"Devliora\", \"we\", \"us\"), a software engineering company that trades as Devliora Systems, with delivery teams in Australia and Bangladesh. Devliora is responsible for the personal information collected through this site and through our services.",
      "For any question about this policy or the information we hold about you, email info@devliora.com or use the contact page.",
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "We collect information you provide directly, such as your name, email, phone number, and project details when you fill out a contact form, apply for a role, or engage us for services.",
      "We also collect limited technical data automatically: IP address, browser type, device information, and pages visited, used for security and basic analytics.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use the information you share to respond to inquiries, evaluate job applications, deliver contracted services, and improve this website.",
      "We do not sell your personal information to third parties, and we do not use it for unrelated marketing without your consent.",
    ],
  },
  {
    title: "Cookies & Tracking",
    body: [
      "This site may use essential cookies for basic functionality and, where enabled, privacy-respecting analytics to understand aggregate usage patterns. You can control cookies through your browser settings.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "We may rely on trusted infrastructure providers (hosting, email delivery, analytics) to operate this site. These providers only receive the data necessary to perform their function and are bound by their own privacy commitments.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We apply the safeguards described on our security page — encrypted transport, hashed credentials, short-lived authentication tokens, rate limiting, audit logging, and least-privilege access — to protect information from unauthorized access, alteration, or disclosure. Vulnerability reports can be sent to info@devliora.com.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You may request access to, correction of, or deletion of the personal information we hold about you. To exercise these rights, contact us using the details below.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We retain personal information only as long as necessary to fulfil the purpose it was collected for, or as required by applicable law, after which it is securely deleted or anonymized.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "Our services are intended for businesses and professionals. We do not knowingly collect personal information from individuals under the age of 16.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this policy from time to time. Material changes will be reflected by updating the date at the top of this page.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "Questions about this policy, or a request to access, correct, or delete your data, can be emailed to info@devliora.com or sent through the contact page. We aim to respond within a reasonable period, and always within any timeframe set by applicable law.",
    ],
  },
];

export default function PrivacyContent() {
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
