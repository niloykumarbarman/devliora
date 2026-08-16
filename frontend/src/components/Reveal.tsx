"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fade-and-slide-up-on-scroll wrapper, matching the scroll-reveal
 * pattern already used throughout the rest of the site (About, Blog,
 * Careers, Case Studies, Contact, Industries, Portfolio, the Services
 * listing page, etc. — see ServicesView.tsx for the same values). The
 * service *detail* pages (this route and ServiceTabs.tsx) predate that
 * pattern and never got it, so this exists to bring them in line
 * without repeating the motion.div boilerplate at every section.
 *
 * Lets a Server Component (page.tsx fetches data server-side, so it
 * can't use framer-motion's hooks directly) wrap a section in
 * animation by rendering this Client Component around it as children
 * — the standard App Router pattern for mixing server and client code.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
