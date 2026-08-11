"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useState, type ElementType, type ReactNode } from "react";

export type KineticUnderlineProps = {
  children: ReactNode;
  as?: ElementType;
  href?: string;
  className?: string;
  color?: string;
  thickness?: number;
  offset?: number;
  disabled?: boolean;
};

/** A small elastic underline for links, navigation labels and headings. */
export function KineticUnderline({
  children,
  as: Tag = "span",
  href,
  className,
  color = "currentColor",
  thickness = 1.5,
  offset = 2,
  disabled = false,
}: KineticUnderlineProps) {
  const [active, setActive] = useState(false);
  const motionEnabled = useMotionEnabled();
  const animate = motionEnabled && !disabled;

  return (
    <Tag
      href={href}
      className={className}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={{ position: "relative", display: "inline-block", textDecoration: "none" }}
    >
      {children}
      <motion.span
        aria-hidden
        initial={false}
        animate={!animate ? { scaleX: active ? 1 : 0.22, opacity: active ? 1 : 0.55 } : { scaleX: active ? 1 : 0.22, opacity: active ? 1 : 0.55 }}
        transition={animate ? { type: "spring", stiffness: 460, damping: 36, mass: 0.7 } : { duration: 0 }}
        style={{ position: "absolute", left: 0, right: 0, bottom: -offset, height: thickness, transformOrigin: "left center", borderRadius: 999, background: color }}
      />
    </Tag>
  );
}
