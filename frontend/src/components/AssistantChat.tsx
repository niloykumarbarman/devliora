"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X, Send, Loader2, PhoneCall, Minus, CalendarDays, Headset } from "lucide-react";
import {
  sendAssistantMessage,
  type AssistantChatMessage,
} from "@/lib/assistantChat";
import { submitContactMessage } from "@/lib/contactMessages";

const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, var(--color-wire) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};

const TOOLTIP_DISMISSED_KEY = "devliora-assistant-tooltip-dismissed";
const TOOLTIP_SHOW_DELAY_MS = 1500;
// On small screens the tooltip's fixed bottom-right position can sit
// on top of hero/body text for as long as it's up — auto-hide it
// (not a permanent dismiss, just visual) so it doesn't linger over
// content the visitor is trying to read.
const TOOLTIP_AUTO_HIDE_MS = 8000;

interface CallbackFormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const EMPTY_CALLBACK_FORM: CallbackFormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const REQUEST_CALLBACK_PHRASE = "Request a Callback";

// The assistant (Gemini) naturally replies in light markdown — **bold**
// section labels, "* "/"- " bullet lists, blank-line-separated paragraphs.
// Rendering `msg.content` as a plain string showed those markers literally
// (e.g. "**Web Application Development:**"), which read as broken/unpolished
// rather than professional. This is a small, dependency-free renderer for
// just that subset (no images/links/headings/code — the assistant doesn't
// use those) rather than pulling in a full markdown library for one widget.
function renderInlineMarkdown(text: string, keyPrefix: string): React.ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={`${keyPrefix}-t-${i}`}>{part}</span>
      )
    );
}

function renderAssistantMessage(content: string): React.ReactNode {
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let blockKey = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`ul-${blockKey++}`} className="list-disc space-y-1 pl-4">
        {listItems.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item, `li-${blockKey}-${i}`)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line === "") {
      flushList();
      continue;
    }
    const bulletMatch = line.match(/^[*-]\s+(.*)/);
    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
      continue;
    }
    flushList();
    blocks.push(
      <p key={`p-${blockKey++}`}>{renderInlineMarkdown(line, `p-${blockKey}`)}</p>
    );
  }
  flushList();

  return <div className="space-y-1.5">{blocks}</div>;
}

const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "Tell me about your projects",
  "What's your tech stack?",
  "How can I contact you?",
];

// Every page's <title> already carries its real, specific name (built by
// buildMetadata in lib/seo.ts — "Web Development | Devliora", etc.), so
// reading document.title client-side gives an accurate "here's what you're
// looking at" label for free instead of maintaining a second route->label
// map that would drift from the real page titles. The homepage's title has
// no " | Devliora" suffix (root layout sets it directly) and isn't a
// specific-enough page to reference, so it's excluded by the "/" check.
function getPageContextLabel(pathname: string | null): string | null {
  if (!pathname || pathname === "/" || typeof document === "undefined") return null;
  const title = document.title.replace(/\s*\|\s*Devliora\s*$/i, "").trim();
  return title || null;
}

function formatConversationTimestamp(date: Date): string {
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const isToday = new Date().toDateString() === date.toDateString();
  return isToday ? `Today, ${time}` : `${date.toLocaleDateString()}, ${time}`;
}

export default function AssistantChat() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackForm, setCallbackForm] = useState<CallbackFormState>(EMPTY_CALLBACK_FORM);
  const [callbackStatus, setCallbackStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const [openedAt, setOpenedAt] = useState<Date | null>(null);
  const [pageContextLabel, setPageContextLabel] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending, showCallbackForm]);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Freeze "opened at" the moment the panel first opens (matches the
  // timestamp divider a real chat widget shows above the welcome message),
  // and read the page's title then too. Set from the click handlers that
  // open the panel (below) rather than an effect watching `isOpen` — this
  // only ever needs to run in direct response to that click, and setting
  // state from an effect for that causes an extra render pass for no
  // benefit. The `prev ?? ...` guards mean it only fills in once — later
  // opens (after closing/reopening) keep the original timestamp/context.
  function openChatPanel() {
    setIsOpen(true);
    setOpenedAt((prev) => prev ?? new Date());
    setPageContextLabel((prev) => prev ?? getPageContextLabel(pathname));
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(TOOLTIP_DISMISSED_KEY)) return;

    const showTimeout = setTimeout(() => {
      setShowTooltip(true);
    }, TOOLTIP_SHOW_DELAY_MS);

    return () => clearTimeout(showTimeout);
  }, []);

  useEffect(() => {
    if (!showTooltip) return;
    const hideTimeout = setTimeout(() => setShowTooltip(false), TOOLTIP_AUTO_HIDE_MS);
    return () => clearTimeout(hideTimeout);
  }, [showTooltip]);

  function dismissTooltip() {
    setShowTooltip(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOOLTIP_DISMISSED_KEY, "1");
    }
  }

  function handleTooltipClick() {
    dismissTooltip();
    openChatPanel();
  }

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 30 };

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const historyBeforeSend = messages;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const reply = await sendAssistantMessage(historyBeforeSend, trimmed);
      setMessages((prev) => [...prev, { role: "model", content: reply }]);
    } catch {
      setError(
        "Something went wrong while reaching the assistant. Please try again in a moment."
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    await sendMessage(input);
  }

  function handleSuggestedQuestion(question: string) {
    void sendMessage(question);
  }

  function handleCallbackChange(
    field: keyof CallbackFormState
  ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> {
    return (e) => {
      setCallbackForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleCallbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (callbackStatus === "sending") return;

    setCallbackStatus("sending");
    try {
      await submitContactMessage({
        fullName: callbackForm.fullName,
        email: callbackForm.email,
        phone: callbackForm.phone,
        subject: callbackForm.subject,
        message: callbackForm.message,
        source: "assistant-chat",
      });
      setCallbackStatus("sent");
      setCallbackForm(EMPTY_CALLBACK_FORM);
    } catch {
      setCallbackStatus("error");
    }
  }

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={panelTransition}
            className="relative max-w-[12rem] rounded-2xl rounded-br-sm border border-wire bg-paper px-4 py-3 text-sm text-ink shadow-2xl sm:max-w-[15rem]"
            role="status"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissTooltip();
              }}
              aria-label="Dismiss tooltip"
              className="absolute right-1.5 top-1.5 rounded-full p-1 text-graphite transition hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleTooltipClick}
              className="block w-full pr-4 text-left leading-snug"
            >
              Chat with my AI Assistant! Ask about our services, projects, or
              anything else.
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.96 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.96 }
            }
            transition={panelTransition}
            className={`flex w-[22rem] flex-col overflow-hidden rounded-2xl border border-wire bg-paper shadow-2xl sm:w-96 ${isMinimized ? "h-auto" : "h-[32rem]"}`}
            role="dialog"
            aria-label="Devliora assistant chat"
          >
            <div
              className={isMinimized ? "flex items-center justify-between px-5 py-4" : "flex items-center justify-between border-b border-wire px-5 py-4"}
              style={DOT_GRID_STYLE}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-signal to-ember font-display text-sm font-semibold text-paper"
                >
                  D
                </span>
                <div>
                  <h2 className="font-display text-base leading-tight text-ink">Devliora Assistant</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-graphite">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    AI Assistant &middot; Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized((prev) => !prev)}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                  className="rounded-lg p-2 text-graphite transition hover:bg-ink/5 hover:text-ink"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="rounded-lg p-2 text-graphite transition hover:bg-ink/5 hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && !showCallbackForm && (
                <div className="space-y-3">
                  {openedAt && (
                    <p className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-graphite/40">
                      {formatConversationTimestamp(openedAt)}
                    </p>
                  )}

                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-lg rounded-bl-sm border border-wire bg-paper px-4 py-2.5 text-sm text-ink">
                      Welcome to Devliora! I&apos;m here to help with questions
                      about our services, past work, or getting started on a
                      project.
                    </div>
                  </div>

                  {pageContextLabel && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-lg rounded-bl-sm border border-wire bg-paper px-4 py-2.5 text-sm text-ink">
                        Saw you&apos;re checking out {pageContextLabel}. I&apos;m
                        available if you have questions!
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/book-consultation"
                      className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3 py-1.5 text-xs font-medium text-paper shadow-[0_0_16px_-6px_var(--color-signal)] transition-all hover:-translate-y-0.5"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      Book a meeting
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowCallbackForm(true)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-wire px-3 py-1.5 text-xs font-medium text-ink transition hover:border-signal hover:text-signal"
                    >
                      <Headset className="h-3.5 w-3.5" />
                      Customer Support
                    </button>
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs text-graphite/60">Or ask something quick:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => handleSuggestedQuestion(question)}
                          className="rounded-full border border-wire px-3 py-1.5 text-xs text-graphite transition hover:border-signal hover:text-signal"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "max-w-[85%] rounded-lg rounded-br-sm bg-ink px-4 py-2.5 text-sm text-paper"
                        : "max-w-[85%] rounded-lg rounded-bl-sm border border-wire bg-paper px-4 py-2.5 text-sm text-ink"
                    }
                  >
                    {msg.role === "model" ? renderAssistantMessage(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg rounded-bl-sm border border-wire bg-paper px-4 py-2.5 text-sm text-graphite">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}

              {error && <p className="text-center text-xs text-ember">{error}</p>}

              {showCallbackForm && (
                <form
                  onSubmit={handleCallbackSubmit}
                  className="space-y-2.5 rounded-lg border border-wire p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-graphite">
                    Request a Callback
                  </p>
                  {callbackStatus === "sent" ? (
                    <p className="text-sm text-ink">
                      Thanks, we will be in touch shortly.
                    </p>
                  ) : (
                    <>
                      <input
                        required
                        placeholder="Name"
                        value={callbackForm.fullName}
                        onChange={handleCallbackChange("fullName")}
                        className="w-full rounded-lg border border-wire bg-paper px-3 py-2 text-sm text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email"
                        value={callbackForm.email}
                        onChange={handleCallbackChange("email")}
                        className="w-full rounded-lg border border-wire bg-paper px-3 py-2 text-sm text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                      />
                      <input
                        required
                        placeholder="Phone"
                        value={callbackForm.phone}
                        onChange={handleCallbackChange("phone")}
                        className="w-full rounded-lg border border-wire bg-paper px-3 py-2 text-sm text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                      />
                      <input
                        required
                        placeholder="Subject"
                        value={callbackForm.subject}
                        onChange={handleCallbackChange("subject")}
                        className="w-full rounded-lg border border-wire bg-paper px-3 py-2 text-sm text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                      />
                      <textarea
                        placeholder="What should we know?"
                        value={callbackForm.message}
                        onChange={handleCallbackChange("message")}
                        rows={2}
                        className="w-full resize-none rounded-lg border border-wire bg-paper px-3 py-2 text-sm text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                      />
                      {callbackStatus === "error" && (
                        <p className="text-xs text-ember">
                          Could not send your request. Please try again.
                        </p>
                      )}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={callbackStatus === "sending"}
                          className="flex-1 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          {callbackStatus === "sending" ? "Sending..." : "Submit"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCallbackForm(false)}
                          className="rounded-lg border border-wire px-4 py-2 text-sm text-graphite transition hover:text-ink"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
            )}

            {!isMinimized && (
            <div className="border-t border-wire p-3">
              {!showCallbackForm && (
                <button
                  type="button"
                  onClick={() => setShowCallbackForm(true)}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-wire px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-graphite transition hover:border-signal hover:text-signal"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  {REQUEST_CALLBACK_PHRASE}
                </button>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about our services..."
                  className="flex-1 rounded-lg border border-wire bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-graphite/40 outline-none transition focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                />
                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  aria-label="Send message"
                  className="rounded-lg bg-signal p-2.5 text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] leading-snug text-graphite/50">
                This chat may be saved to help our team follow up. See our{" "}
                <Link href="/privacy" className="underline hover:text-graphite">
                  privacy policy
                </Link>
                .
              </p>
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-3">
        <motion.a
          href="https://t.me/Devliora_bot"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={prefersReducedMotion ? undefined : { y: -2 }}
          aria-label="Chat with us on Telegram"
          title="Chat with us on Telegram"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26A5E4] text-paper shadow-[0_0_24px_-6px_#26A5E4] transition-all"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M9.036 15.803 8.72 20.09c.46 0 .658-.198.898-.436l2.155-2.06 4.467 3.27c.818.452 1.401.214 1.62-.757l2.937-13.81h.001c.256-1.19-.43-1.656-1.226-1.363L2.6 9.9c-1.157.452-1.14 1.1-.197 1.393l4.408 1.376L17.05 6.29c.485-.318.928-.142.564.176"/>
          </svg>
        </motion.a>

        <motion.button
          type="button"
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              openChatPanel();
            }
            if (showTooltip) dismissTooltip();
          }}
          whileHover={prefersReducedMotion ? undefined : { y: -2 }}
          aria-label={isOpen ? "Close assistant chat" : "Open assistant chat"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-signal text-paper shadow-[0_0_24px_-6px_var(--color-signal)] transition-all"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
