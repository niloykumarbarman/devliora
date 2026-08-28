"use client";

import {
  createElement,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useReveal } from "@/lib/useReveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** seconds, applied as animation-delay — matches the old transition={{ delay }} */
  delay?: number;
  as?: ElementType;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "style" | "children">;

/**
 * Fade-and-rise-on-scroll wrapper. Was a framer-motion `motion.div` with
 * `initial/whileInView={{ opacity, y }}`; it is now a plain element that
 * carries `data-reveal` and gets `.is-revealed` from a shared
 * IntersectionObserver (see lib/useReveal.ts). The keyframe is in
 * globals.css. Same visual — 0.6s, fade + 16px rise, once — with no
 * animation-library JS, and the content is never hidden if scripting is
 * unavailable.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  style,
  ...rest
}: RevealProps) {
  const ref = useReveal<HTMLElement>();

  return createElement(
    as,
    {
      ref,
      className,
      "data-reveal": "",
      style:
        delay > 0
          ? ({ ...style, "--reveal-delay": `${delay}s` } as CSSProperties)
          : style,
      ...rest,
    },
    children
  );
}
