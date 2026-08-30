"use client";

import { useEffect, useRef } from "react";

// One IntersectionObserver shared by every <Reveal> on the page.
//
// The element ships VISIBLE from the server (see globals.css). On mount:
//   - if it is already in (or above) the viewport, it is revealed
//     immediately with no entrance animation — so an above-the-fold hero
//     wrapped in <Reveal> is never hidden and never delays LCP;
//   - otherwise it is marked `.reveal-pending` (now hidden, off-screen so
//     no visible flash) and observed; when it scrolls in it gets
//     `.is-revealed .reveal-animate`, running the CSS keyframe once.

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed", "reveal-animate");
            entry.target.classList.remove("reveal-pending");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
  }
  return observer;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.classList.contains("is-revealed")) return;

    const belowFold =
      el.getBoundingClientRect().top >
      (window.innerHeight || document.documentElement.clientHeight) - 80;

    const obs = getObserver();
    if (!obs || !belowFold) {
      // Above the fold, or no observer support: show it now, no animation.
      el.classList.add("is-revealed");
      return;
    }

    el.classList.add("reveal-pending");
    obs.observe(el);

    // Safety net. The observer only fires on a scroll/resize/layout that
    // brings the element into view. Content that mounts below the fold in
    // a client component (e.g. a list rendered after its fetch resolves)
    // and is never scrolled to would otherwise stay at opacity:0 forever
    // — a blank gap where cards should be. After a short grace period,
    // reveal anything still pending so nothing is permanently hidden.
    const failsafe = window.setTimeout(() => {
      if (!el.classList.contains("is-revealed")) {
        el.classList.add("is-revealed", "reveal-animate");
        el.classList.remove("reveal-pending");
        obs.unobserve(el);
      }
    }, 1200);

    return () => {
      window.clearTimeout(failsafe);
      obs.unobserve(el);
    };
  }, []);

  return ref;
}
