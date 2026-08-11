"use client";

import { motion } from "motion/react";
import { usePressSpring } from "@pinky/primitives";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type TactileRangeProps = {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
  disabled?: boolean;
};

export function TactileRange({ label, value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, showValue = true, formatValue = String, className, disabled = false }: TactileRangeProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const percent = ((current - min) / Math.max(max - min, 1)) * 100;
  const press = usePressSpring({ scale: .92, disabled });
  return <label className={cn("block", className)}><span className="flex items-center justify-between text-sm font-medium"><span>{label}</span>{showValue ? <output>{formatValue(current)}</output> : null}</span><div className="relative mt-4 h-8"><div aria-hidden className="absolute top-1/2 right-0 left-0 h-2 -translate-y-1/2 rounded-full bg-[color:var(--color-cloud-100,#eaf6fd)]"><div className="h-full rounded-full bg-[color:var(--color-ink-900,#252933)]" style={{ width: `${percent}%` }} /><motion.span style={{ left: `${percent}%`, scale: press.scale }} className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[color:var(--color-ink-900,#252933)] shadow-md" /></div><input type="range" min={min} max={max} step={step} value={current} disabled={disabled} onChange={(event) => setCurrent(event.currentTarget.valueAsNumber)} {...press.handlers} className="absolute inset-0 size-full cursor-pointer opacity-0" /></div></label>;
}
