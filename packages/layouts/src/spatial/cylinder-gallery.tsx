"use client";

import { springs, useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useRef, type PointerEvent, type WheelEvent } from "react";

import { cn } from "../internal/cn";
import { clamp, useControllable } from "../internal/use-controllable";
import type { SpatialCollectionItem } from "./types";

export type CylinderGalleryProps = { items: SpatialCollectionItem[]; radius?: number; index?: number; defaultIndex?: number; onIndexChange?: (index: number) => void; snap?: boolean; label?: string; className?: string; disabled?: boolean };

/** A finite ring of media with restrained wheel, touch and keyboard navigation. */
export function CylinderGallery({ items, radius = 170, index, defaultIndex = 0, onIndexChange, snap = true, label = "Cylinder gallery", className, disabled = false }: CylinderGalleryProps) {
  const motionEnabled = useMotionEnabled();
  const { hasHover } = usePointerCapability();
  const [selected, setSelected] = useControllable(index, clamp(defaultIndex, 0, Math.max(items.length - 1, 0)), onIndexChange);
  const startX = useRef<number | null>(null);
  const enabled = motionEnabled && !disabled && hasHover;
  const select = (next: number) => setSelected(clamp(next, 0, Math.max(items.length - 1, 0)));
  const wheel = (event: WheelEvent<HTMLElement>) => { if (Math.abs(event.deltaY) < 12 && Math.abs(event.deltaX) < 12) return; select(selected + ((event.deltaY + event.deltaX) > 0 ? 1 : -1)); };
  return <section aria-label={label} className={cn("w-full", className)} onWheel={wheel} onPointerDown={(event: PointerEvent<HTMLElement>) => { if (event.pointerType === "touch") startX.current = event.clientX; }} onPointerUp={(event: PointerEvent<HTMLElement>) => { if (startX.current === null) return; const delta = event.clientX - startX.current; if (Math.abs(delta) > 40) select(selected + (delta < 0 ? 1 : -1)); startX.current = null; }} onPointerCancel={() => { startX.current = null; }}><div className={cn("relative mx-auto min-h-[23rem]", enabled ? "[perspective:1000px]" : "")}>{items.map((item, itemIndex) => { const offset = itemIndex - selected; const step = items.length > 1 ? 360 / items.length : 0; const angle = offset * step; const active = itemIndex === selected; return <motion.article key={item.id} role="listitem" tabIndex={active ? 0 : -1} aria-current={active ? "true" : undefined} className={cn("mx-auto w-[min(70vw,17rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ink-900", enabled ? "absolute inset-x-0 top-8" : "mb-3")} style={{ transformStyle: "preserve-3d" }} animate={enabled ? { rotateY: angle, z: radius, scale: active ? 1.04 : .9, opacity: Math.abs(offset) > 3 ? 0 : active ? 1 : .72 } : { rotateY: 0, z: 0, scale: 1, opacity: 1 }} transition={enabled ? { type: snap ? "spring" : "tween", ...(snap ? springs.responsive : { duration: .25 }) } : { duration: 0 }} onClick={() => select(itemIndex)} onFocus={() => select(itemIndex)}>{item.content}<div className="flex items-baseline justify-between gap-3 p-4"><h3 className="font-display text-sm font-semibold">{item.label}</h3>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div></motion.article>; })}</div><div className="flex items-center justify-between gap-3"><p aria-live="polite" className="font-mono text-xs text-ink-500">{items[selected]?.label ?? "No selection"}</p><div className="flex gap-2"><button type="button" onClick={() => select(selected - 1)} aria-label="Previous cylinder item" className="rounded-pill border border-line px-3 py-1.5 text-sm">Previous</button><button type="button" onClick={() => select(selected + 1)} aria-label="Next cylinder item" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">Next</button></div></div></section>;
}
