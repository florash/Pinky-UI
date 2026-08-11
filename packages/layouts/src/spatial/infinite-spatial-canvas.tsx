"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { motion, useMotionValue } from "motion/react";
import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type WheelEvent } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { clamp, useControllable } from "../internal/use-controllable";

export type SpatialCanvasItem = { id: string; label: string; x: number; y: number; content: ReactNode; meta?: ReactNode };
export type SpatialCanvasBounds = { left: number; right: number; top: number; bottom: number };
export type InfiniteSpatialCanvasProps = {
  items: SpatialCanvasItem[];
  bounds?: SpatialCanvasBounds;
  height?: number | string;
  zoom?: number;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (zoom: number) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export function clampCanvasPan(value: number, min: number, max: number) { return clamp(value, Math.min(min, max), Math.max(min, max)); }
export function clampCanvasZoom(value: number, min = 0.7, max = 1.35) { return clamp(value, min, max); }

/** A bounded, curated content plane. Pan uses MotionValues; flat mode is a normal list. */
export function InfiniteSpatialCanvas({ items, bounds = { left: -360, right: 360, top: -220, bottom: 220 }, height = 520, zoom, defaultZoom = 1, minZoom = .7, maxZoom = 1.35, onZoomChange, label = "Spatial canvas", className, disabled = false }: InfiniteSpatialCanvasProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const [currentZoom, setCurrentZoom] = useControllable(zoom, clampCanvasZoom(defaultZoom, minZoom, maxZoom), onZoomChange);
  const [active, setActive] = useState<string | null>(null);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const enabled = motionEnabled && !disabled && !compact;
  const updateZoom = (next: number) => setCurrentZoom(clampCanvasZoom(next, minZoom, maxZoom));
  const begin = (event: PointerEvent<HTMLDivElement>) => { if (event.button !== 0 || !enabled) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, panX: panX.get(), panY: panY.get() }; };
  const move = (event: PointerEvent<HTMLDivElement>) => { const start = drag.current; if (!start || !enabled) return; panX.set(clampCanvasPan(start.panX + event.clientX - start.x, bounds.left, bounds.right)); panY.set(clampCanvasPan(start.panY + event.clientY - start.y, bounds.top, bounds.bottom)); };
  const end = (event: PointerEvent<HTMLDivElement>) => { if (drag.current) event.currentTarget.releasePointerCapture?.(event.pointerId); drag.current = null; };
  const wheel = (event: WheelEvent<HTMLDivElement>) => { if (!enabled || (!event.ctrlKey && !event.metaKey)) return; event.preventDefault(); updateZoom(currentZoom - event.deltaY * .001); };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => { const step = 48; if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); const dx = event.key === "ArrowLeft" ? step : event.key === "ArrowRight" ? -step : 0; const dy = event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0; panX.set(clampCanvasPan(panX.get() + dx, bounds.left, bounds.right)); panY.set(clampCanvasPan(panY.get() + dy, bounds.top, bounds.bottom)); } if (event.key === "+" || event.key === "=") { event.preventDefault(); updateZoom(currentZoom + .1); } if (event.key === "-" || event.key === "_") { event.preventDefault(); updateZoom(currentZoom - .1); } if (event.key === "0" || event.key === "Home") { event.preventDefault(); panX.set(0); panY.set(0); updateZoom(1); } };

  return <section aria-label={label} className={cn("w-full", className)}><div tabIndex={0} onKeyDown={keyDown} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onWheel={wheel} className={cn("relative overflow-hidden rounded-[28px] border border-line bg-cloud-50 outline-none focus-visible:ring-2 focus-visible:ring-ink-900", enabled ? "touch-none" : "p-4")} style={{ height }}><div role="list" className={enabled ? "absolute inset-0 [perspective:1000px]" : "grid gap-3 sm:grid-cols-2"}>{enabled ? <motion.div className="absolute inset-0" style={{ x: panX, y: panY, scale: currentZoom, transformOrigin: "center center" }}>{items.map((item) => <CanvasItem key={item.id} item={item} active={active === item.id} onActive={setActive} enabled />)}</motion.div> : items.map((item) => <CanvasItem key={item.id} item={item} active={active === item.id} onActive={setActive} enabled={false} />)}</div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p aria-live="polite" className="font-mono text-xs text-ink-500">Zoom {Math.round(currentZoom * 100)}% · {items.length} items</p><div className="flex gap-2"><button type="button" onClick={() => updateZoom(currentZoom - .1)} aria-label="Zoom out spatial canvas" className="rounded-pill border border-line px-3 py-1.5 text-sm">−</button><button type="button" onClick={() => { panX.set(0); panY.set(0); updateZoom(1); }} className="rounded-pill border border-line px-3 py-1.5 text-sm">Reset view</button><button type="button" onClick={() => updateZoom(currentZoom + .1)} aria-label="Zoom in spatial canvas" className="rounded-pill bg-ink-900 px-3 py-1.5 text-sm text-milk">+</button></div></div></section>;
}

function CanvasItem({ item, active, onActive, enabled }: { item: SpatialCanvasItem; active: boolean; onActive: (id: string | null) => void; enabled: boolean }) {
  return <motion.article role="listitem" tabIndex={0} className={cn("group overflow-hidden rounded-2xl border border-line bg-white shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ink-900", enabled ? "absolute w-56" : "relative")} style={enabled ? { left: item.x, top: item.y, contentVisibility: "auto", contain: "layout paint style" } : undefined} animate={enabled ? { z: active ? 26 : 0, y: active ? -5 : 0, scale: active ? 1.03 : 1 } : undefined} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") onActive(item.id); }} onPointerLeave={() => onActive(null)} onFocus={() => onActive(item.id)} onBlur={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) onActive(null); }} onClick={() => onActive(item.id)}>{item.content}<div className="flex items-baseline justify-between gap-3 p-4"><h3 className="font-display text-sm font-semibold">{item.label}</h3>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div></motion.article>;
}
