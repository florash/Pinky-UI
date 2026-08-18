"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";

type DepthStyle = CSSProperties & Record<`--${string}`, string | number>;

export type DepthShiftProps = {
  children: ReactNode;
  secondary?: ReactNode;
  background?: ReactNode;
  className?: string;
  disabled?: boolean;
  intensity?: number;
};

/** Three shallow planes respond as one surface, keeping the depth relationship legible. */
export function DepthShift({ children, secondary, background, className, disabled = false, intensity = 8 }: DepthShiftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled() && !disabled;

  const update = (event: PointerEvent<HTMLDivElement>) => {
    if (!motionEnabled || event.pointerType === "touch" || event.pointerType === "pen") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    element.style.setProperty("--depth-x", String(Math.max(-1, Math.min(1, x)) * intensity));
    element.style.setProperty("--depth-y", String(Math.max(-1, Math.min(1, y)) * intensity));
    element.style.setProperty("--depth-active", "1");
  };

  const reset = () => {
    ref.current?.style.setProperty("--depth-x", "0");
    ref.current?.style.setProperty("--depth-y", "0");
    ref.current?.style.setProperty("--depth-active", "0");
  };

  const focus = () => {
    if (!motionEnabled) return;
    ref.current?.style.setProperty("--depth-active", "1");
  };

  return (
    <div
      ref={ref}
      className={cn("relative isolate", className)}
      style={{ perspective: 820, "--depth-x": 0, "--depth-y": 0, "--depth-active": 0 } as DepthStyle}
      onPointerMove={update}
      onPointerLeave={reset}
      onFocusCapture={focus}
      onBlurCapture={reset}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ opacity: "calc(0.42 + var(--depth-active) * 0.12)", transform: "translate3d(calc(var(--depth-x) * -0.55px), calc(var(--depth-y) * -0.55px), -18px) scale(.98)", transition: motionEnabled ? "transform 420ms cubic-bezier(.22,1,.36,1)" : "none" }}>{background}</div>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ transform: "translate3d(calc(var(--depth-x) * -0.25px), calc(var(--depth-y) * -0.25px), -7px)", transition: motionEnabled ? "transform 360ms cubic-bezier(.22,1,.36,1)" : "none" }}>{secondary}</div>
      <div className="relative" style={{ transform: "translate3d(calc(var(--depth-x) * 0.2px), calc(var(--depth-y) * 0.2px), 0)", transition: motionEnabled ? "transform 300ms cubic-bezier(.22,1,.36,1)" : "none" }}>{children}</div>
    </div>
  );
}
