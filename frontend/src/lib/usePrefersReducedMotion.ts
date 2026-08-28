"use client";

import { useEffect, useState } from "react";

// Drop-in replacement for framer-motion's useReducedMotion for the few
// components that still need the value in JS (to skip an auto-rotate
// timer or a JS-driven transform). Pure CSS effects handle reduced
// motion in globals.css and don't need this.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}
