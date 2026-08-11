"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";

import { cn } from "../internal/cn";

export type RadialMeterProps = { value: number; min?: number; max?: number; label: string; formatValue?: (value: number) => string; segments?: number; size?: number; className?: string };

export function RadialMeter({ value, min = 0, max = 100, label, formatValue = (number) => `${Math.round(number)}%`, segments = 1, size = 160, className }: RadialMeterProps) {
  const motionEnabled = useMotionEnabled(); const percent = Math.min(Math.max((value - min) / Math.max(max - min, 1), 0), 1); const radius = 54; const circumference = 2 * Math.PI * radius;
  return <div role="meter" aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}><svg aria-hidden viewBox="0 0 128 128" className="absolute inset-0 -rotate-90"><circle cx="64" cy="64" r={radius} fill="none" stroke="var(--color-cloud-100,#eaf6fd)" strokeWidth="10" strokeDasharray={segments > 1 ? `${circumference / segments - 4} 4` : undefined} /><motion.circle cx="64" cy="64" r={radius} fill="none" stroke="var(--color-blush-300,#f4c7d7)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} initial={false} animate={{ strokeDashoffset: circumference * (1 - percent) }} transition={motionEnabled ? { type: "spring", stiffness: 110, damping: 22 } : { duration: 0 }} /></svg><div className="text-center"><strong className="block font-display text-2xl">{formatValue(value)}</strong><span className="mt-1 block text-xs text-[color:var(--color-ink-500,#7b8492)]">{label}</span></div></div>;
}
