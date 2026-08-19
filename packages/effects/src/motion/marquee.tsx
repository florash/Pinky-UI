"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import type { ReactNode } from "react";

import { cn } from "../internal/cn";

export type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number;
  label?: string;
  className?: string;
};

const MARQUEE_CSS = `@keyframes pinky-marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-100%); } } .pinky-marquee:hover .pinky-marquee-track, .pinky-marquee:focus-within .pinky-marquee-track { animation-play-state: paused; }`;

/**
 * A logo wall / testimonial strip that scrolls itself: two copies of the
 * content sit side by side under one continuous CSS animation, so the loop
 * never visibly resets. Reduced motion drops to a plain scrollable row —
 * the content order is what matters, the auto-scroll is the enhancement.
 * `pauseOnHover` (default on) is also the WCAG pause mechanism for
 * auto-moving content; turning it off puts that requirement on the caller.
 */
export function Marquee({ children, speed = 28, direction = "left", pauseOnHover = true, gap = 32, label, className }: MarqueeProps) {
  const motionEnabled = useMotionEnabled();

  if (!motionEnabled) {
    return (
      <div role={label ? "list" : undefined} aria-label={label} className={cn("flex overflow-x-auto", className)} style={{ gap }}>
        {children}
      </div>
    );
  }

  const trackStyle = {
    gap,
    animationName: "pinky-marquee-scroll",
    animationDuration: `${speed}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDirection: direction === "right" ? ("reverse" as const) : ("normal" as const),
  };

  return (
    <div role={label ? "list" : undefined} aria-label={label} className={cn("relative flex overflow-hidden", pauseOnHover && "pinky-marquee", className)}>
      <style>{MARQUEE_CSS}</style>
      <div className="pinky-marquee-track flex shrink-0" style={trackStyle}>{children}</div>
      <div aria-hidden className="pinky-marquee-track flex shrink-0" style={trackStyle}>{children}</div>
    </div>
  );
}
