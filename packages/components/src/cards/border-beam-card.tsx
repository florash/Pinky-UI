"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type BorderBeamCardProps = {
  children: ReactNode;
  /** Border thickness in px. */
  thickness?: number;
  /** One full loop, in seconds. */
  duration?: number;
  /** The beam's colour. */
  color?: string;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  as?: ElementType;
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<BorderBeamCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

/**
 * A point of light that continuously travels the border ring — the one
 * card in the family whose signature motion runs whether or not a pointer
 * is anywhere near it, so it's the one that most needs the
 * `useMotionEnabled()` gate to actually mean something: under reduced
 * motion the beam stops at a fixed point on the ring rather than looping
 * forever, the settled-end-state rule every other card in this document
 * follows for hover motion, applied here to ambient motion instead. Same
 * border-ring mask technique as Glow Border and Gradient Border Card —
 * only the light source differs (pointer-tracked, static, continuously
 * orbiting).
 */
export function BorderBeamCard({
  children,
  thickness = 1.5,
  duration = 6,
  color = "var(--color-blush-300)",
  radius = "xl",
  padded = true,
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: BorderBeamCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;
  const motionEnabled = useMotionEnabled();

  const maskStyle: CSSProperties = {
    padding: thickness,
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    maskComposite: "exclude",
  };

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative isolate block w-full overflow-hidden bg-white/90 text-left shadow-soft",
        RADIUS[radius],
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)] hover:shadow-lift", CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <motion.span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-10", RADIUS[radius])}
        style={{
          ...maskStyle,
          background: `conic-gradient(from 0deg, transparent 0%, ${color} 8%, transparent 20%)`,
        }}
        animate={motionEnabled ? { rotate: 360 } : { rotate: 0 }}
        transition={motionEnabled ? { duration, repeat: Infinity, ease: "linear" } : { duration: 0 }}
      />
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>{children}</div>
    </Tag>
  );
}
