"use client";

import { motion } from "motion/react";
import { usePressSpring } from "@pinky-ui/primitives";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type BeforeAfterProps = {
  before: ReactNode;
  after: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  disabled?: boolean;
};

export function BeforeAfter({ before, after, value, defaultValue = 50, onValueChange, orientation = "horizontal", beforeLabel = "Before", afterLabel = "After", className, disabled = false }: BeforeAfterProps) {
  const [position, setPosition] = useControllable(value, defaultValue, onValueChange);
  const bounded = Math.min(Math.max(position, 0), 100);
  const press = usePressSpring({ scale: 0.9, disabled });
  const vertical = orientation === "vertical";
  return (
    <div className={cn("relative isolate overflow-hidden rounded-[22px] focus-within:outline-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink-900 focus-within:ring-2 focus-within:ring-ink-900/25", className)}>
      <div aria-label={beforeLabel}>{before}</div>
      <div aria-label={afterLabel} className="absolute inset-0 overflow-hidden" style={{ clipPath: vertical ? `inset(0 0 ${100 - bounded}% 0)` : `inset(0 ${100 - bounded}% 0 0)` }}>{after}</div>
      <div aria-hidden className={cn("pointer-events-none absolute bg-white shadow-lg", vertical ? "right-0 left-0 h-0.5" : "top-0 bottom-0 w-0.5")} style={vertical ? { top: `${bounded}%` } : { left: `${bounded}%` }}>
        <motion.span style={{ scale: press.scale }} className={cn("absolute grid size-11 place-items-center rounded-full border border-white/60 bg-[color:var(--color-ink-900,#252933)] text-white shadow-lg", vertical ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" : "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2")}>{vertical ? "↕" : "↔"}</motion.span>
      </div>
      <input
        type="range" min={0} max={100} step={1} value={bounded} disabled={disabled}
        aria-label={`${beforeLabel} and ${afterLabel} comparison`}
        aria-valuetext={`${Math.round(bounded)} percent ${afterLabel}`}
        onChange={(event) => setPosition(event.currentTarget.valueAsNumber)}
        {...press.handlers}
        className={cn("absolute inset-0 z-10 size-full cursor-ew-resize opacity-0 outline-none", vertical && "cursor-ns-resize")}
        style={vertical ? { writingMode: "vertical-lr", direction: "rtl" } : undefined}
      />
    </div>
  );
}
