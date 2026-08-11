"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { useRef, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { clamp, useControllable } from "../internal/use-controllable";
import type { SpatialCollectionItem } from "./types";

export type HelixGalleryProps = { items: SpatialCollectionItem[]; radius?: number; pitch?: number; spacing?: number; index?: number; defaultIndex?: number; onIndexChange?: (index: number) => void; label?: string; className?: string; disabled?: boolean };

/** Procedural helical placement with a linear/touch fallback and no required 3D runtime. */
export function HelixGallery({ items, radius = 150, pitch = 1.4, spacing = 0.8, index, defaultIndex = 0, onIndexChange, label = "Helix gallery", className, disabled = false }: HelixGalleryProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const [selected, setSelected] = useControllable(index, clamp(defaultIndex, 0, Math.max(items.length - 1, 0)), onIndexChange);
  const startX = useRef<number | null>(null);
  const enabled = motionEnabled && !disabled && !compact;
  const select = (next: number) => setSelected(clamp(next, 0, Math.max(items.length - 1, 0)));
  return <section aria-label={label} className={cn("w-full", className)} onPointerDown={(event: PointerEvent<HTMLElement>) => { if (event.pointerType === "touch") startX.current = event.clientX; }} onPointerUp={(event: PointerEvent<HTMLElement>) => { if (startX.current === null) return; const delta = event.clientX - startX.current; if (Math.abs(delta) > 40) select(selected + (delta < 0 ? 1 : -1)); startX.current = null; }} onPointerCancel={() => { startX.current = null; }}><div className={cn("relative mx-auto min-h-[23rem]", enabled ? "[perspective:1000px]" : "")}>{items.map((item, itemIndex) => { const offset = itemIndex - selected; const angle = offset * (22 * spacing); const active = itemIndex === selected; return <motion.article key={item.id} role="listitem" tabIndex={active ? 0 : -1} aria-current={active ? "true" : undefined} className={cn("mx-auto w-[min(72vw,18rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ink-900", enabled ? "absolute inset-x-0 top-8" : "mb-3")} style={{ transformStyle: "preserve-3d" }} animate={enabled ? { rotateY: angle, z: radius - Math.abs(offset) * radius * 0.12, y: offset * pitch * 34, scale: active ? 1.04 : Math.max(0.78, 1 - Math.abs(offset) * 0.055), opacity: Math.abs(offset) > 4 ? 0 : active ? 1 : .72 } : { rotateY: 0, z: 0, y: 0, scale: 1, opacity: 1 }} transition={enabled ? { type: "spring", ...springs.responsive } : { duration: 0 }} onClick={() => select(itemIndex)} onFocus={() => select(itemIndex)}>{item.content}<div className="flex items-baseline justify-between gap-3 p-4"><h3 className="font-display text-sm font-semibold">{item.label}</h3>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div></motion.article>; })}</div><div className="flex items-center justify-between gap-3"><p aria-live="polite" className="font-mono text-xs text-ink-500">{items[selected]?.label ?? "No selection"}</p><div className="flex gap-2"><button type="button" onClick={() => select(selected - 1)} aria-label="Previous helix item" className="rounded-pill border border-line px-3 py-1.5 text-sm">Previous</button><button type="button" onClick={() => select(selected + 1)} aria-label="Next helix item" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">Next</button></div></div></section>;
}
