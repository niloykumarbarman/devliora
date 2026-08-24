"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { loginAdmin, setAdminToken, setAdminRefreshToken } from "@/lib/adminAuth";

type SubmitStatus = "idle" | "submitting" | "error";

export default function AdminLoginPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fadeUp = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const data = await loginAdmin({ email, password });
      if (data.token) {
        setAdminToken(data.token);
        if (data.refreshToken) {
          setAdminRefreshToken(data.refreshToken);
        }
        router.push("/admin/consultations");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink py-24 text-paper">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:56px_56px] opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-paper) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-paper) 6%, transparent) 1px, transparent 1px)",
        }}
      />

      <motion.div {...fadeUp} className="relative w-full max-w-md px-6">
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
          /admin/login
        </span>
        <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight text-paper md:text-4xl">
          Devliora <span className="text-signal">Admin</span>
        </h1>
        <p className="mt-3 text-graphite-200 text-wire/70">
          Sign in to manage consultations, content, and messages.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs uppercase tracking-wider text-wire/60"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-wire/20 bg-paper/5 px-4 py-3 text-paper outline-none transition focus:border-signal"
              placeholder="admin@devliora.dev"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs uppercase tracking-wider text-wire/60"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-wire/20 bg-paper/5 px-4 py-3 text-paper outline-none transition focus:border-signal"
              placeholder="••••••••"
            />
          </div>

          {status === "error" && (
            <div className="flex items-start gap-2 rounded-md border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-signal px-6 py-3 font-medium text-ink transition hover:brightness-110 disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign in
              </>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
