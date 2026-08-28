"use client";

import { useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage } from "@/lib/contactMessages";
import Reveal from "@/components/Reveal";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await submitContactMessage(form);
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
        <Reveal>
        <form
          onSubmit={handleSubmit}
          aria-label="Contact form"
          aria-busy={status === "submitting"}
          className="grid gap-6 md:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="fullName"
              className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/60"
            >
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
              className="rounded-lg border border-wire bg-paper px-4 py-3 text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/60"
            >
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
              className="rounded-lg border border-wire bg-paper px-4 py-3 text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/60"
            >
              Phone{" "}
              <span className="normal-case tracking-normal text-graphite/60">
                (optional)
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+880 17666823"
              className="rounded-lg border border-wire bg-paper px-4 py-3 text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="subject"
              className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/60"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              maxLength={300}
              value={form.subject}
              onChange={handleChange}
              placeholder="New project inquiry"
              className="rounded-lg border border-wire bg-paper px-4 py-3 text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="message"
              className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/60"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={5000}
              rows={6}
              value={form.message}
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
                  Sending
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Sent — thank you
                </>
              ) : (
                <>
                  Send message
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {status === "success" && (
              <p role="status" className="mt-4 text-sm text-graphite/70">
                Thanks for reaching out. We typically respond within 48
                hours.
              </p>
            )}

            {status === "error" && (
              <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-ember">
                <AlertCircle className="h-4 w-4" />
                Something went wrong sending your message. Please try again
                or email us directly.
              </p>
            )}
          </div>
        </form>
        </Reveal>
      </div>
    </section>
  );
}
