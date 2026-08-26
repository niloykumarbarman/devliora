"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import type { OfficeLocationDto } from "@/lib/officeLocations";
export default function ContactLocations({ offices }: { offices: OfficeLocationDto[] }) {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, delay: i * 0.08 },
        };
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
        <motion.div
          {...fadeUp(0)}
          className="grid gap-12 sm:grid-cols-2 sm:gap-16"
        >
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
        </motion.div>
        <motion.div
          {...fadeUp(1)}
          className="mt-16 grid gap-6 sm:grid-cols-2"
        >
          {offices.map((office) => (
            <div
              key={office.id}
              className="overflow-hidden rounded-lg border border-paper/10"
            >
              <iframe
                title={`${office.country} office map`}
                src={`https://www.google.com/maps?q=${office.mapQuery}&output=embed`}
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
