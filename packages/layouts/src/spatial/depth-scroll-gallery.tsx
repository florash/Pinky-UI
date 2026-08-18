"use client";

import { springs, useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { clamp } from "../internal/use-controllable";
import type { SpatialCollectionItem } from "./types";

export type DepthScrollGalleryProps = { items: SpatialCollectionItem[]; top?: number; index?: number; onIndexChange?: (index: number) => void; label?: string; className?: string; disabled?: boolean };

/** Native scroll remains in charge; IntersectionObserver only gives the current plane a quiet emphasis. */
export function DepthScrollGallery({ items, top = 24, index, onIndexChange, label = "Depth scroll gallery", className, disabled = false }: DepthScrollGalleryProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const { hasHover } = usePointerCapability();
  const [internal, setInternal] = useState(index ?? 0);
  const selected = index ?? internal;
  const refs = useRef<Array<HTMLElement | null>>([]);
  const enabled = motionEnabled && !disabled && hasHover;

  useEffect(() => {
    if (compact || disabled || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const next = Number((visible.target as HTMLElement).dataset.index);
      if (!Number.isFinite(next)) return;
      if (index === undefined) setInternal(next);
      onIndexChange?.(next);
    }, { threshold: [0.45, 0.7], rootMargin: "-25% 0px -25% 0px" });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [compact, disabled, index, items.length, onIndexChange]);

  const select = (next: number) => { const resolved = clamp(next, 0, Math.max(items.length - 1, 0)); if (index === undefined) setInternal(resolved); onIndexChange?.(resolved); refs.current[resolved]?.scrollIntoView?.({ behavior: enabled ? "smooth" : "auto", block: "center" }); };
  const keyDown = (event: KeyboardEvent<HTMLElement>) => { if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); select(selected + 1); } if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); select(selected - 1); } };

  return <section aria-label={label} className={cn("w-full", className)}><div className={cn("flex flex-col gap-8", enabled && "[perspective:1100px]")} onKeyDown={keyDown}>{items.map((item, itemIndex) => { const active = selected === itemIndex; return <motion.article key={item.id} ref={(node) => { refs.current[itemIndex] = node; }} data-index={itemIndex} tabIndex={active ? 0 : -1} aria-current={active ? "true" : undefined} className={cn("relative min-h-64 scroll-mt-20 overflow-hidden rounded-[26px] border border-line bg-white shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ink-900", enabled && "sticky")} style={enabled ? { top: top + itemIndex * 12, zIndex: itemIndex + 1 } : undefined} animate={enabled ? { scale: active ? 1 : .965, y: active ? -4 : 0, z: active ? 18 : -itemIndex * 5, opacity: active ? 1 : .72 } : { scale: 1, y: 0, z: 0, opacity: 1 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }} onFocus={() => select(itemIndex)} onClick={() => select(itemIndex)}>{item.content}<div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink-900/55 to-transparent p-5 pt-14 text-milk"><h3 className="font-display text-lg font-semibold">{item.label}</h3>{item.meta ? <span className="text-xs text-milk/75">{item.meta}</span> : null}</div></motion.article>; })}</div><div className="mt-5 flex items-center justify-between gap-3"><p aria-live="polite" className="font-mono text-xs text-ink-500">{items.length ? `${selected + 1} / ${items.length}` : "0 items"}</p><div className="flex gap-2"><button type="button" onClick={() => select(selected - 1)} aria-label="Previous depth item" className="rounded-pill border border-line px-3 py-1.5 text-sm">Previous</button><button type="button" onClick={() => select(selected + 1)} aria-label="Next depth item" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">Next</button></div></div></section>;
}
