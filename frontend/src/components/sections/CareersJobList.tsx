"use client";

import { useEffect, useState } from "react";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { fetchJobListings, type JobListing } from "@/lib/jobListings";
import Reveal from "@/components/Reveal";

export default function CareersJobList() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    fetchJobListings()
      .then((data) => {
        if (!cancelled) {
          setJobs(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative bg-paper py-24 sm:py-32">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <h2 className="mt-4 text-balance font-display text-3xl font-semibold text-ink sm:text-4xl">
          Current openings
        </h2>

        <div className="mt-12">
          {status === "loading" && (
            <p className="font-mono text-sm text-graphite">
              Loading open positions...
            </p>
          )}

          {status === "error" && (
            <p className="font-mono text-sm text-graphite">
              We could not load open positions right now. Please try again
              later.
            </p>
          )}

          {status === "success" && jobs.length === 0 && (
            <div className="border border-ink/10 bg-ink/[0.02] px-8 py-14 text-center">
              <p className="font-display text-xl text-ink">
                No open positions right now
              </p>
              <p className="mx-auto mt-3 max-w-md text-graphite">
                We are not actively hiring at the moment, but we are always
                interested in hearing from strong engineers. Feel free to
                reach out and introduce yourself.
              </p>
            </div>
          )}

          {status === "success" && jobs.length > 0 && (
            <ul className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10">
              {jobs.map((job, i) => (
                <Reveal
                  key={job.id}
                  as="li"
                  delay={i * 0.08}
                  className="bg-paper px-6 py-6 sm:px-8"
                >
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {job.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wide text-graphite">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.department}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {job.employmentType}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
