"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type SubmitStatus = "idle" | "submitting" | "success";

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const fadeUp = (i: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, delay: i * 0.08 },
        };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    // NOTE: UI-only for now. Not yet wired to the backend ContactMessages API.
    // A future session will replace this with a real POST request.
    setTimeout(() => {
      setStatus("success");
      setForm(INITIAL_STATE);
    }, 900);
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-paper py-24 text-ink md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 1px, transparent 1px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div {...fadeUp(0)} className="max-w-2xl">
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight text-graphite md:text-5xl">
            Tell us what you are building.{" "}
            <span className="text-signal">We will tell you how.</span>
          </h2>
          <p className="mt-6 text-lg text-graphite/70">
            Share a few details about your project and one of our engineers
            will respond within 48 hours with a clear, honest read on scope,
            timeline, and approach.
          </p>
        </motion.div>

        <motion.form
          {...fadeUp(1)}
          onSubmit={handleSubmit}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/60"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
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
              value={form.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              className="rounded-lg border border-wire bg-paper px-4 py-3 text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              htmlFor="company"
              className="font-mono text-xs uppercase tracking-[0.15em] text-graphite/60"
            >
              Company{" "}
              <span className="normal-case tracking-normal text-graphite/40">
                (optional)
              </span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              placeholder="Acme Inc."
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
              rows={5}
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
              <p className="mt-4 text-sm text-graphite/60">
                This form is not yet connected to our backend — a real
                submission pipeline is coming in a future update.
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
