"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// AssistantChat is a large client component (chat state machine, callback
// form, markdown renderer, lucide icons). It sits in the root layout, so
// before this loader it was in every page's initial JS and hydration
// path despite being a bottom-right widget almost no first-paint depends
// on.
//
// Now it is:
//   - code-split (`next/dynamic`) into its own chunk, and
//   - not even requested until the browser is idle or the visitor first
//     interacts (pointer / keydown / touch) — whichever comes first.
//
// `ssr: false` is fine: the widget renders nothing meaningful on the
// server anyway, and skipping it removes the markup + its hydration cost
// from the critical path entirely.
const AssistantChat = dynamic(() => import("./AssistantChat"), { ssr: false });

export default function AssistantChatLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    let idleId: number | undefined;
    const load = () => setShow(true);

    const win = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(load, { timeout: 4000 });
    } else {
      idleId = window.setTimeout(load, 2500) as unknown as number;
    }

    const opts = { once: true, passive: true } as const;
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    events.forEach((e) => window.addEventListener(e, load, opts));

    return () => {
      if (idleId !== undefined) {
        if (typeof win.cancelIdleCallback === "function") win.cancelIdleCallback(idleId);
        else window.clearTimeout(idleId);
      }
      events.forEach((e) => window.removeEventListener(e, load));
    };
  }, [show]);

  return show ? <AssistantChat /> : null;
}
