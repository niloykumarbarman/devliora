import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import type { OfficeLocationDto } from "@/lib/officeLocations";
import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/seo";

export default function ContactLocations({ offices }: { offices: OfficeLocationDto[] }) {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {/* Schedule-a-call banner */}
      <Link
        href="/book-consultation"
        className="group flex flex-col items-start justify-between gap-4 bg-signal px-6 py-8 transition-colors hover:bg-signal/90 sm:flex-row sm:items-center sm:px-12 sm:py-10"
      >
        <span className="font-display text-2xl font-semibold text-paper md:text-3xl">
          Schedule a call with us
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-paper">
          Book your call
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Canonical contact channel — always shown, pulled from the one
            place the phone/email are defined (siteConfig), so it can't
            drift from the structured data and is never blank if the
            admin-managed office list is empty. */}
        <Reveal className="grid gap-6 sm:grid-cols-3">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="flex items-start gap-3 rounded-lg border border-paper/10 bg-paper/[0.03] p-5 transition-colors hover:border-signal/40"
          >
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-signal" strokeWidth={1.75} />
            <span>
              <span className="block font-mono text-xs uppercase tracking-[0.14em] text-paper/50">
                Email
              </span>
              <span className="mt-1 block text-paper">{siteConfig.contactEmail}</span>
            </span>
          </a>
          <a
            href={`tel:${siteConfig.contactPhone}`}
            className="flex items-start gap-3 rounded-lg border border-paper/10 bg-paper/[0.03] p-5 transition-colors hover:border-signal/40"
          >
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-signal" strokeWidth={1.75} />
            <span>
              <span className="block font-mono text-xs uppercase tracking-[0.14em] text-paper/50">
                Phone
              </span>
              <span className="mt-1 block text-paper">{siteConfig.contactPhoneDisplay}</span>
            </span>
          </a>
          <div className="flex items-start gap-3 rounded-lg border border-paper/10 bg-paper/[0.03] p-5">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-signal" strokeWidth={1.75} />
            <span>
              <span className="block font-mono text-xs uppercase tracking-[0.14em] text-paper/50">
                Response time
              </span>
              <span className="mt-1 block text-paper/80">
                A substantive reply within two business days.
              </span>
            </span>
          </div>
        </Reveal>

        {offices.length > 0 && (
        <>
        <Reveal
          as="h2"
          className="mt-20 font-display text-3xl font-semibold text-paper sm:text-4xl"
        >
          Our offices
        </Reveal>
        <Reveal delay={0.08} className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-16">
          {offices.map((office) => (
            <div key={office.id}>
              <h3 className="font-mono text-sm uppercase tracking-[0.15em] text-ember">
                {office.country}
              </h3>
              <div className="mt-4 space-y-3 text-paper/80">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-paper/50" />
                  {office.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-paper/50" />
                  {office.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-paper/50" />
                  {office.email}
                </p>
              </div>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-ember to-transparent" />
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.08} className="mt-16 grid gap-6 sm:grid-cols-2">
          {offices.map((office) => (
            <div
              key={office.id}
              className="overflow-hidden rounded-lg border border-paper/10"
            >
              <iframe
                title={`${office.country} office map`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&output=embed`}
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ))}
        </Reveal>
        </>
        )}
      </div>
    </section>
  );
}
