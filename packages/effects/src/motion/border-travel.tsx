"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";

type BorderStyle = CSSProperties & Record<`--${string}`, string | number>;

export type BorderTravelProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

/** One short border segment travels along the nearest side instead of lighting the whole frame. */
export function BorderTravel({ children, className, disabled = false }: BorderTravelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  const update = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.pointerType === "touch" || event.pointerType === "pen") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
    const distances = { top: y, right: 1 - x, bottom: 1 - y, left: x };
    const side = (Object.keys(distances) as Array<keyof typeof distances>).sort((a, b) => distances[a] - distances[b])[0];
    const styles = element.style;
    styles.setProperty("--travel-top", side === "top" ? "1" : "0");
    styles.setProperty("--travel-right", side === "right" ? "1" : "0");
    styles.setProperty("--travel-bottom", side === "bottom" ? "1" : "0");
    styles.setProperty("--travel-left", side === "left" ? "1" : "0");
    styles.setProperty("--travel-x", `${x * 100}%`);
    styles.setProperty("--travel-y", `${y * 100}%`);
  };

  const clear = () => {
    const element = ref.current;
    if (!element) return;
    for (const side of ["top", "right", "bottom", "left"]) element.style.setProperty(`--travel-${side}`, "0");
  };

  const focus = () => {
    if (disabled) return;
    ref.current?.style.setProperty("--travel-top", "1");
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} style={{ "--travel-x": "50%", "--travel-y": "50%" } as BorderStyle} onPointerMove={update} onPointerLeave={clear} onFocusCapture={focus} onBlurCapture={clear}>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ opacity: "var(--travel-top)", background: "linear-gradient(90deg, transparent 0 28%, var(--color-ink-900) var(--travel-x), transparent 72%)", transition: motionEnabled ? "opacity 180ms ease, background-position 260ms ease" : "none" }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px" style={{ opacity: "var(--travel-right)", background: "linear-gradient(180deg, transparent 0 28%, var(--color-ink-900) var(--travel-y), transparent 72%)", transition: motionEnabled ? "opacity 180ms ease, background-position 260ms ease" : "none" }} />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ opacity: "var(--travel-bottom)", background: "linear-gradient(90deg, transparent 0 28%, var(--color-ink-900) var(--travel-x), transparent 72%)", transition: motionEnabled ? "opacity 180ms ease, background-position 260ms ease" : "none" }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px" style={{ opacity: "var(--travel-left)", background: "linear-gradient(180deg, transparent 0 28%, var(--color-ink-900) var(--travel-y), transparent 72%)", transition: motionEnabled ? "opacity 180ms ease, background-position 260ms ease" : "none" }} />
    </div>
  );
}
