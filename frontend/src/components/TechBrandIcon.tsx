"use client";

import { getTechIcon } from "@/lib/techIcons";

interface TechBrandIconProps {
  name: string;
  className?: string;
  /** Override the icon's own brand color, e.g. "#fff" on a colored badge background. */
  color?: string;
}

export default function TechBrandIcon({ name, className, color }: TechBrandIconProps) {
  const icon = getTechIcon(name);
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color ?? `#${icon.hex}`} role="img" aria-label={icon.title}>
      <path d={icon.path} />
    </svg>
  );
}
