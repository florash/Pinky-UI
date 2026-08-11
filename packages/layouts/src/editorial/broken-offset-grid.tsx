"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { useState, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";

export type BrokenOffsetGridItem = { id: string; label: string; content: ReactNode; meta?: ReactNode; offset?: number; span?: 1 | 2 };
export type BrokenOffsetGridProps = { items: BrokenOffsetGridItem[]; columns?: 2 | 3 | 4; gap?: number; label?: string; className?: string; disabled?: boolean };

/** A deterministic offset rhythm; explicit offsets make the composition reviewable and stable. */
export function BrokenOffsetGrid({ items, columns = 3, gap = 16, label = "Offset grid", className, disabled = false }: BrokenOffsetGridProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const [active, setActive] = useState<string | null>(null);
  const enabled = motionEnabled && !disabled && !compact;
  const columnCount = compact ? Math.min(columns, 2) : columns;

  return <ul aria-label={label} className={cn("grid list-none p-0", className)} style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap }}>{items.map((item) => { const focused = active === item.id; return <motion.li key={item.id} className="relative min-h-32 overflow-hidden rounded-2xl" style={{ gridColumn: `span ${Math.min(item.span ?? 1, columnCount)}` }} animate={enabled ? { y: focused ? 0 : item.offset ?? 0, scale: focused ? 1.025 : active ? 0.985 : 1 } : { y: 0, scale: 1 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }} onPointerEnter={(event: PointerEvent<HTMLLIElement>) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setActive(item.id); }} onPointerLeave={() => setActive(null)} onFocusCapture={() => setActive(item.id)} onBlurCapture={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setActive(null); }}>{item.content}{item.meta ? <span className="pointer-events-none absolute right-3 bottom-3 truncate rounded-pill bg-white/85 px-3 py-1.5 text-xs whitespace-nowrap text-ink-700 shadow-soft"><strong>{item.label}</strong><span className="ml-2 hidden text-ink-500 sm:inline">{item.meta}</span></span> : null}</motion.li>; })}</ul>;
}
