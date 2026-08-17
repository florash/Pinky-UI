"use client";

import { springs, useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useState, type KeyboardEvent } from "react";

import { cn } from "../internal/cn";
import { clamp } from "../internal/use-controllable";
import type { SpatialCollectionItem } from "./types";

export type SpatialCardTunnelProps = { items: SpatialCollectionItem[]; spacing?: number; index?: number; defaultIndex?: number; onIndexChange?: (index: number) => void; label?: string; className?: string; disabled?: boolean };

/** A finite Z-axis collection with explicit controls; reduced motion becomes a normal list. */
export function SpatialCardTunnel({ items, spacing = 110, index, defaultIndex = 0, onIndexChange, label = "Spatial card tunnel", className, disabled = false }: SpatialCardTunnelProps) {
  const motionEnabled = useMotionEnabled();
  const { hasHover } = usePointerCapability();
  const [internal, setInternal] = useState(index ?? defaultIndex);
  const selected = index ?? internal;
  const enabled = motionEnabled && !disabled && hasHover;
  const setSelected = (next: number) => { const resolved = clamp(next, 0, Math.max(items.length - 1, 0)); if (index === undefined) setInternal(resolved); onIndexChange?.(resolved); };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => { if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); setSelected(selected + 1); } if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); setSelected(selected - 1); } if (event.key === "Home") { event.preventDefault(); setSelected(0); } if (event.key === "End") { event.preventDefault(); setSelected(items.length - 1); } };
  return <section aria-label={label} className={cn("w-full", className)}><div role="list" tabIndex={0} onKeyDown={keyDown} className={cn("relative outline-none focus-visible:ring-2 focus-visible:ring-ink-900", enabled ? "min-h-[25rem] [perspective:1000px]" : "flex flex-col gap-3")}>{items.map((item, itemIndex) => { const offset = itemIndex - selected; const active = itemIndex === selected; return <motion.article key={item.id} role="listitem" tabIndex={active ? 0 : -1} aria-current={active ? "true" : undefined} className={cn("overflow-hidden rounded-2xl border border-line bg-white shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ink-900", enabled ? "absolute inset-x-[10%] top-8" : "relative")} animate={enabled ? { z: -Math.abs(offset) * spacing, y: offset * 22, scale: active ? 1.04 : Math.max(.78, 1 - Math.abs(offset) * .05), opacity: Math.abs(offset) > 4 ? 0 : active ? 1 : .68 } : { z: 0, y: 0, scale: 1, opacity: 1 }} transition={enabled ? { type: "spring", ...springs.responsive } : { duration: 0 }} onClick={() => setSelected(itemIndex)} onFocus={() => setSelected(itemIndex)}>{item.content}<div className="flex items-baseline justify-between gap-3 p-4"><h3 className="font-display text-sm font-semibold">{item.label}</h3>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div></motion.article>; })}</div><div className="mt-4 flex items-center justify-between gap-3"><p aria-live="polite" className="font-mono text-xs text-ink-500">{items[selected]?.label ?? "No selection"}</p><div className="flex gap-2"><button type="button" onClick={() => setSelected(selected - 1)} aria-label="Previous tunnel card" className="rounded-pill border border-line px-3 py-1.5 text-sm">Previous</button><button type="button" onClick={() => setSelected(selected + 1)} aria-label="Next tunnel card" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">Next</button></div></div></section>;
}
