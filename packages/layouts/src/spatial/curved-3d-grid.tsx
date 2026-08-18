"use client";

import { springs, useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useRef, type KeyboardEvent } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { clamp, mod, useControllable } from "../internal/use-controllable";
import type { SpatialCollectionItem } from "./types";

export type Curved3DGridProps = { items: SpatialCollectionItem[]; columns?: 2 | 3 | 4 | 5; curvature?: number; index?: number; defaultIndex?: number; onIndexChange?: (index: number) => void; label?: string; className?: string; disabled?: boolean };

/** A shallow CSS 3D grid: a curved plane, not a camera ride or WebGL scene. */
export function Curved3DGrid({ items, columns = 4, curvature = 28, index, defaultIndex = 0, onIndexChange, label = "Curved 3D grid", className, disabled = false }: Curved3DGridProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const { hasHover } = usePointerCapability();
  const [selected, setSelected] = useControllable(index, clamp(defaultIndex, 0, Math.max(items.length - 1, 0)), onIndexChange);
  const enabled = motionEnabled && !disabled && hasHover;
  const grid = useRef<HTMLUListElement>(null);
  const count = compact ? Math.min(columns, 2) : columns;
  const select = (next: number) => setSelected(clamp(next, 0, Math.max(items.length - 1, 0)));
  const keyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); select(selected + 1); }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); select(selected - 1); }
    if (event.key === "Home") { event.preventDefault(); select(0); }
    if (event.key === "End") { event.preventDefault(); select(items.length - 1); }
  };
  return <section className={cn("w-full [perspective:1200px]", className)}><ul ref={grid} role="listbox" aria-label={label} onKeyDown={keyDown} className="grid list-none p-0 outline-none focus-visible:ring-2 focus-visible:ring-ink-900" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap: compact ? 10 : 14, transformStyle: "preserve-3d" }}>{items.map((item, itemIndex) => { const column = itemIndex % count; const row = Math.floor(itemIndex / count); const center = (count - 1) / 2; const offset = column - center; const active = selected === itemIndex; const neighbour = selected !== itemIndex && Math.abs(selected - itemIndex) <= 1; return <motion.li key={item.id} role="option" aria-selected={active} tabIndex={active ? 0 : -1} className="min-h-32 cursor-pointer overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ink-900" style={{ transformStyle: "preserve-3d" }} animate={enabled ? { z: -Math.abs(offset) * curvature, rotateY: offset * 3.5, y: active ? -6 : row % 2 ? 2 : 0, scale: active ? 1.025 : neighbour ? .99 : 1 } : { z: 0, rotateY: 0, y: 0, scale: 1 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }} onClick={() => select(itemIndex)} onFocus={() => select(itemIndex)}>{item.content}<span className="sr-only">{item.label}{item.meta ? ` · ${String(item.meta)}` : ""}</span></motion.li>; })}</ul><div className="mt-4 flex items-center justify-between gap-3"><p aria-live="polite" className="font-mono text-xs text-ink-500">{items[selected]?.label ?? "No selection"}</p><div className="flex gap-2"><button type="button" onClick={() => select(mod(selected - 1, items.length))} aria-label="Previous curved grid item" className="rounded-pill border border-line px-3 py-1.5 text-sm">Previous</button><button type="button" onClick={() => select(mod(selected + 1, items.length))} aria-label="Next curved grid item" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">Next</button></div></div></section>;
}
