"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import type { SpatialCollectionItem } from "./types";

export type StackSpatialProps = { items: SpatialCollectionItem[]; expanded?: boolean; defaultExpanded?: boolean; onExpandedChange?: (expanded: boolean) => void; label?: string; className?: string; disabled?: boolean };

/** Stack → X/Y/Z planes, preserving keyed children instead of remounting a second view. */
export function StackSpatial({ items, expanded, defaultExpanded = false, onExpandedChange, label = "Stack to spatial", className, disabled = false }: StackSpatialProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const [internal, setInternal] = useState(defaultExpanded);
  const open = expanded ?? internal;
  const enabled = motionEnabled && !disabled && !compact;
  const setOpen = (next: boolean) => { if (expanded === undefined) setInternal(next); onExpandedChange?.(next); };
  return <div className={cn("w-full", className)}><div className="mb-4 flex items-center justify-between gap-3"><span className="font-mono text-xs text-ink-500">{items.length} items · {open ? "spatial" : "stack"}</span><button type="button" aria-pressed={open} onClick={() => setOpen(!open)} className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">{open ? "Stack up" : "Spread into space"}</button></div><LayoutGroup id={`stack-spatial-${label}`}><ul aria-label={label} className={cn("relative list-none p-0", open && !compact ? "min-h-[26rem] [perspective:1000px]" : "grid gap-3")} style={open && !compact ? undefined : { gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))" }}>{items.map((item, itemIndex) => { const row = Math.floor(itemIndex / 3); const column = itemIndex % 3; return <motion.li key={item.id} layout className={cn("overflow-hidden rounded-2xl border border-line bg-white shadow-soft", open && !compact ? "absolute inset-x-[10%] top-8" : "relative")} animate={enabled && open ? { x: (column - 1) * 110, y: row * 48 - 12, z: -itemIndex * 72, rotateY: (column - 1) * 5, scale: itemIndex === 0 ? 1.04 : 1 - Math.min(itemIndex * .025, .12), opacity: 1 } : { x: 0, y: open && !compact ? itemIndex * 3 : 0, z: 0, rotateY: 0, scale: open && !compact ? 1 - Math.min(itemIndex * .025, .12) : 1, opacity: 1 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }}><div className="relative">{item.content}<div className="flex items-baseline justify-between gap-3 p-4"><h3 className="font-display text-sm font-semibold">{item.label}</h3>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div></div></motion.li>; })}</ul></LayoutGroup></div>;
}
