"use client";

import { useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import {
  submitConsultationRequest,
  type ServiceInterest,
  type ProjectBudgetRange,
  type PreferredTimeSlot,
} from "@/lib/bookConsultation";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  serviceInterest: ServiceInterest;
  projectBudgetRange: ProjectBudgetRange;
  preferredDate: string;
  preferredTimeSlot: PreferredTimeSlot;
  additionalDetails: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  serviceInterest: "WebDevelopment",
  projectBudgetRange: "NotSure",
  preferredDate: "",
  preferredTimeSlot: "Morning",
  additionalDetails: "",
};

const SERVICE_INTEREST_OPTIONS: { value: ServiceInterest; label: string }[] = [
  { value: "WebDevelopment", label: "Web Development" },
  { value: "MobileApp", label: "Mobile App" },
  { value: "CloudDevOps", label: "Cloud & DevOps" },
  { value: "UiUxDesign", label: "UI/UX Design" },
  { value: "Other", label: "Other" },
];

const BUDGET_RANGE_OPTIONS: { value: ProjectBudgetRange; label: string }[] = [
  { value: "Under10k", label: "Under $10k" },
  { value: "Range10kTo50k", label: "$10k – $50k" },
  { value: "Range50kTo100k", label: "$50k – $100k" },
  { value: "Over100k", label: "Over $100k" },
  { value: "NotSure", label: "Not sure yet" },
];

const TIME_SLOT_OPTIONS: { value: PreferredTimeSlot; label: string }[] = [
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "Evening", label: "Evening" },
];

const inputClasses =
  "rounded-lg border border-wire bg-paper px-4 py-3 text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30";

const labelClasses =
  "font-mono text-xs uppercase tracking-[0.15em] text-graphite/60";

export default function BookConsultationForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await submitConsultationRequest({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        companyName: form.companyName,
        serviceInterest: form.serviceInterest,
        projectBudgetRange: form.projectBudgetRange,
        preferredDate: form.preferredDate
          ? new Date(form.preferredDate).toISOString()
          : null,
        preferredTimeSlot: form.preferredTimeSlot,
        additionalDetails: form.additionalDetails,
      });
      setStatus("success");
      setForm(INITIAL_STATE);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative overflow-hidden bg-paper py-24 text-ink md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6">
        {status === "success" ? (
          <Reveal className="flex flex-col items-center gap-4 rounded-2xl border border-wire bg-paper px-8 py-16 text-center" role="status">
            <CheckCircle2 className="h-12 w-12 text-signal" />
            <h2 className="font-display text-2xl font-semibold text-ink">
              Request received — thank you.
            </h2>
            <p className="max-w-md text-graphite/70">
              One of our engineers will reach out within 48 hours to confirm
              your consultation and preferred time.
            </p>
          </Reveal>
        ) : (
          <Reveal>
          <form
            onSubmit={handleSubmit}
            aria-label="Book a consultation"
            aria-busy={status === "submitting"}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className={labelClasses}>
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                maxLength={200}
                value={form.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                value={form.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className={labelClasses}>
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={50}
                value={form.phone}
                onChange={handleChange}
                placeholder="+880 17666823"
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="companyName" className={labelClasses}>
                Company name{" "}
                <span className="normal-case tracking-normal text-graphite/60">
                  (optional)
                </span>
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                maxLength={200}
                value={form.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="serviceInterest" className={labelClasses}>
                Service interest
              </label>
              <select
                id="serviceInterest"
                name="serviceInterest"
                required
                value={form.serviceInterest}
                onChange={handleChange}
                className={inputClasses}
              >
                {SERVICE_INTEREST_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="projectBudgetRange" className={labelClasses}>
                Project budget
              </label>
              <select
                id="projectBudgetRange"
                name="projectBudgetRange"
                required
                value={form.projectBudgetRange}
                onChange={handleChange}
                className={inputClasses}
              >
                {BUDGET_RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="preferredDate" className={labelClasses}>
                Preferred date{" "}
                <span className="normal-case tracking-normal text-graphite/60">
                  (optional)
                </span>
              </label>
              <input
                id="preferredDate"
                name="preferredDate"
                type="date"
                value={form.preferredDate}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="preferredTimeSlot" className={labelClasses}>
                Preferred time
              </label>
              <select
                id="preferredTimeSlot"
                name="preferredTimeSlot"
                required
                value={form.preferredTimeSlot}
                onChange={handleChange}
                className={inputClasses}
              >
                {TIME_SLOT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="additionalDetails" className={labelClasses}>
                Additional details{" "}
                <span className="normal-case tracking-normal text-graphite/60">
                  (optional)
                </span>
              </label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                maxLength={5000}
                rows={6}
                value={form.additionalDetails}
                onChange={handleChange}
                placeholder="What are you trying to build, and what does success look like?"
                className="resize-none rounded-lg border border-wire bg-paper px-4 py-3 text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="group inline-flex items-center gap-2 rounded-lg bg-signal px-7 py-3.5 font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_-4px_var(--color-signal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    Request consultation
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {status === "error" && (
                <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-ember">
                  <AlertCircle className="h-4 w-4" />
                  Something went wrong submitting your request. Please try
                  again or email us directly.
                </p>
              )}
            </div>
          </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
