"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";

type EdgeStyle = CSSProperties & Record<`--${string}`, string | number>;

export type EdgeHighlightProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

/** A short, local hairline follows the side nearest to a fine pointer. */
export function EdgeHighlight({ children, className, disabled = false }: EdgeHighlightProps) {
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
    styles.setProperty("--edge-top", side === "top" ? "1" : "0");
    styles.setProperty("--edge-right", side === "right" ? "1" : "0");
    styles.setProperty("--edge-bottom", side === "bottom" ? "1" : "0");
    styles.setProperty("--edge-left", side === "left" ? "1" : "0");
    styles.setProperty("--edge-x", `${x * 100}%`);
    styles.setProperty("--edge-y", `${y * 100}%`);
  };

  const clear = () => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--edge-top", "0");
    element.style.setProperty("--edge-right", "0");
    element.style.setProperty("--edge-bottom", "0");
    element.style.setProperty("--edge-left", "0");
  };

  const focus = () => {
    const element = ref.current;
    if (!element || disabled) return;
    element.style.setProperty("--edge-top", "0.72");
    element.style.setProperty("--edge-right", "0.32");
    element.style.setProperty("--edge-bottom", "0.32");
    element.style.setProperty("--edge-left", "0.32");
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ "--edge-x": "50%", "--edge-y": "50%" } as EdgeStyle}
      onPointerMove={update}
      onPointerLeave={clear}
      onFocusCapture={focus}
      onBlurCapture={clear}
    >
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ opacity: "var(--edge-top)", background: "linear-gradient(90deg, transparent, var(--color-blush-300) var(--edge-x), transparent)", transition: motionEnabled ? "opacity 240ms ease" : "none" }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px" style={{ opacity: "var(--edge-right)", background: "linear-gradient(180deg, transparent, var(--color-blush-300) var(--edge-y), transparent)", transition: motionEnabled ? "opacity 240ms ease" : "none" }} />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ opacity: "var(--edge-bottom)", background: "linear-gradient(90deg, transparent, var(--color-blush-300) var(--edge-x), transparent)", transition: motionEnabled ? "opacity 240ms ease" : "none" }} />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px" style={{ opacity: "var(--edge-left)", background: "linear-gradient(180deg, transparent, var(--color-blush-300) var(--edge-y), transparent)", transition: motionEnabled ? "opacity 240ms ease" : "none" }} />
    </div>
  );
}
