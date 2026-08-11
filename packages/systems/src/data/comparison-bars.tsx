"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";

import { cn } from "../internal/cn";

export type ComparisonBarItem = { id: string; label: string; value: number; color?: string };
export type ComparisonBarsProps = { items: ComparisonBarItem[]; max?: number; label: string; formatValue?: (value: number) => string; className?: string };

export function ComparisonBars({ items, max, label, formatValue = String, className }: ComparisonBarsProps) {
  const motionEnabled = useMotionEnabled(); const ceiling = max ?? Math.max(...items.map((item) => item.value), 1);
  return <div role="list" aria-label={label} className={cn("space-y-4", className)}>{items.map((item) => <div key={item.id} role="listitem" tabIndex={0} aria-label={`${item.label}: ${formatValue(item.value)}`} className="group grid grid-cols-[minmax(5rem,auto)_1fr_auto] items-center gap-3 rounded-xl focus-visible:outline-2"><span className="text-sm">{item.label}</span><div aria-hidden className="h-3 overflow-hidden rounded-full bg-[color:var(--color-cloud-100,#eaf6fd)]"><motion.div className="h-full rounded-full" style={{ background: item.color ?? "var(--color-blush-300,#f4c7d7)" }} initial={false} animate={{ width: `${Math.min(Math.max(item.value / Math.max(ceiling, 1), 0), 1) * 100}%` }} transition={motionEnabled ? { type: "spring", stiffness: 130, damping: 24 } : { duration: 0 }} /></div><strong className="text-sm tabular-nums">{formatValue(item.value)}</strong></div>)}</div>;
}
