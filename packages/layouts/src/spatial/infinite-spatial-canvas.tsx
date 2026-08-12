"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode, type WheelEvent } from "react";

import { cn } from "../internal/cn";
import { clamp, useControllable } from "../internal/use-controllable";

export type SpatialCanvasPlane = "foreground" | "working" | "distant";
export type SpatialCanvasItem = {
  id: string;
  label: string;
  x: number;
  y: number;
  content: ReactNode;
  meta?: ReactNode;
  /** Optional authored depth plane; unspecified items use the working plane. */
  plane?: SpatialCanvasPlane;
  /** Optional cluster label used by the orientation map and canvas annotations. */
  cluster?: string;
};
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

export function clampCanvasPan(value: number, min: number, max: number) {
  return clamp(value, Math.min(min, max), Math.max(min, max));
}

export function clampCanvasZoom(value: number, min = 0.7, max = 1.35) {
  return clamp(value, min, max);
}

type DragState = {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  velocityX: number;
  velocityY: number;
  moved: boolean;
};

/**
 * A bounded spatial index rather than a whiteboard.
 *
 * The content plane stays in MotionValues so pointer movement does not make
 * the page tree render. A short inertial continuation is added only when
 * motion is allowed; reduced motion keeps the same direct pan and selection
 * model without inertia or parallax.
 */
export function InfiniteSpatialCanvas({
  items,
  bounds = { left: -360, right: 360, top: -220, bottom: 220 },
  height = 520,
  zoom,
  defaultZoom = 1,
  minZoom = 0.7,
  maxZoom = 1.35,
  onZoomChange,
  label = "Spatial canvas",
  className,
  disabled = false,
}: InfiniteSpatialCanvasProps) {
  const motionEnabled = useMotionEnabled();
  const [currentZoom, setCurrentZoom] = useControllable(zoom, clampCanvasZoom(defaultZoom, minZoom, maxZoom), onZoomChange);
  const [active, setActive] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const parallaxX = useTransform(panX, (value) => value * -0.08);
  const parallaxY = useTransform(panY, (value) => value * -0.08);
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const inertia = useRef<Array<{ stop: () => void }>>([]);
  const suppressClickUntil = useRef(0);

  const clusterMarkers = useMemo(() => {
    const clusters = new Map<string, { x: number; y: number; count: number }>();
    for (const item of items) {
      if (!item.cluster) continue;
      const current = clusters.get(item.cluster) ?? { x: 0, y: 0, count: 0 };
      current.x += item.x;
      current.y += item.y;
      current.count += 1;
      clusters.set(item.cluster, current);
    }
    return [...clusters.entries()].map(([label, value]) => ({
      label,
      x: value.x / value.count,
      y: value.y / value.count,
    }));
  }, [items]);

  const updateZoom = (next: number) => setCurrentZoom(clampCanvasZoom(next, minZoom, maxZoom));

  const stopInertia = () => {
    for (const animation of inertia.current) animation.stop();
    inertia.current = [];
  };

  const resistantPan = (value: number, min: number, max: number) => {
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);
    if (value < lower) return lower + (value - lower) * 0.18;
    if (value > upper) return upper + (value - upper) * 0.18;
    return value;
  };

  const setPan = (x: number, y: number, resistant = false) => {
    panX.set(resistant ? resistantPan(x, bounds.left, bounds.right) : clampCanvasPan(x, bounds.left, bounds.right));
    panY.set(resistant ? resistantPan(y, bounds.top, bounds.bottom) : clampCanvasPan(y, bounds.top, bounds.bottom));
  };

  const startInertia = (velocityX: number, velocityY: number) => {
    if (!motionEnabled || (Math.abs(velocityX) < 24 && Math.abs(velocityY) < 24)) return;
    stopInertia();
    const options = {
      type: "inertia" as const,
      power: 0.16,
      timeConstant: 260,
      bounceStiffness: 280,
      bounceDamping: 34,
    };
    inertia.current = [
      animate(panX, panX.get(), { ...options, velocity: velocityX, min: bounds.left, max: bounds.right }),
      animate(panY, panY.get(), { ...options, velocity: velocityY, min: bounds.top, max: bounds.bottom }),
    ];
  };

  const begin = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.target instanceof Element && event.target.closest("button,a,input,textarea,select,[data-spatial-interactive]")) return;
    stopInertia();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      velocityX: 0,
      velocityY: 0,
      moved: false,
    };
    setDragging(true);
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || disabled) return;
    const now = performance.now();
    const elapsed = Math.max(now - start.lastTime, 1);
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const stepX = event.clientX - start.lastX;
    const stepY = event.clientY - start.lastY;
    start.moved = start.moved || Math.abs(dx) + Math.abs(dy) > 4;
    start.velocityX = (stepX / elapsed) * 1000;
    start.velocityY = (stepY / elapsed) * 1000;
    start.lastX = event.clientX;
    start.lastY = event.clientY;
    start.lastTime = now;
    setPan(panX.get() + stepX, panY.get() + stepY, true);
    if (event.cancelable) event.preventDefault();
  };

  const end = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
    setDragging(false);
    if (start.moved) {
      suppressClickUntil.current = performance.now() + 180;
      setPan(clampCanvasPan(panX.get(), bounds.left, bounds.right), clampCanvasPan(panY.get(), bounds.top, bounds.bottom));
      startInertia(start.velocityX, start.velocityY);
    }
  };

  const reset = () => {
    stopInertia();
    panX.set(0);
    panY.set(0);
    updateZoom(1);
  };

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = 48;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      stopInertia();
      const dx = event.key === "ArrowLeft" ? step : event.key === "ArrowRight" ? -step : 0;
      const dy = event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0;
      setPan(panX.get() + dx, panY.get() + dy);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      updateZoom(currentZoom + 0.1);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      updateZoom(currentZoom - 0.1);
    } else if (event.key === "0" || event.key === "Home") {
      event.preventDefault();
      reset();
    }
  };

  const wheel = (event: WheelEvent<HTMLDivElement>) => {
    if (disabled || (!event.ctrlKey && !event.metaKey)) return;
    event.preventDefault();
    updateZoom(currentZoom - event.deltaY * 0.001);
  };

  const mapPosition = (value: number, min: number, max: number) => {
    const range = Math.max(max - min, 1);
    return `${clamp(((value - min) / range) * 100, 8, 92)}%`;
  };

  return (
    <section aria-label={label} className={cn("w-full", className)}>
      <div
        ref={canvas}
        tabIndex={disabled ? -1 : 0}
        aria-describedby={`${label.replace(/\s+/g, "-").toLowerCase()}-instructions`}
        onKeyDown={keyDown}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onWheel={wheel}
        onClickCapture={(event) => {
          if (suppressClickUntil.current > performance.now()) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        data-dragging={dragging ? "true" : "false"}
        className={cn(
          "relative isolate overflow-hidden rounded-[28px] border border-line bg-[color:var(--color-cloud-50,#f4fbff)] outline-none focus-visible:ring-2 focus-visible:ring-ink-900",
          !disabled && "[touch-action:none]",
          disabled && "opacity-60",
        )}
        style={{ height, contain: "layout paint" }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-20 opacity-70"
          style={{
            x: motionEnabled ? parallaxX : 0,
            y: motionEnabled ? parallaxY : 0,
            backgroundImage:
              "linear-gradient(rgba(98,132,154,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(98,132,154,.09) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute top-8 left-8 size-32 rounded-[42%] bg-blush-100/75 blur-[1px]" />
        <div aria-hidden className="pointer-events-none absolute right-20 bottom-12 size-24 rounded-full bg-cloud-200/70" />

        <motion.div
          role="list"
          className="pointer-events-none absolute inset-0"
          style={{ x: panX, y: panY, scale: currentZoom, transformOrigin: "center center" }}
        >
          {clusterMarkers.map((cluster) => (
            <div
              key={cluster.label}
              aria-hidden
              className="absolute -translate-y-full rounded-pill border border-line bg-white/75 px-2.5 py-1 font-mono text-[0.55rem] tracking-[0.14em] text-ink-500 uppercase shadow-sm"
              style={{ left: cluster.x, top: cluster.y }}
            >
              {cluster.label}
            </div>
          ))}
          {items.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              active={active === item.id}
              onActive={setActive}
              disabled={disabled}
              motionEnabled={motionEnabled}
            />
          ))}
        </motion.div>

        <div aria-hidden className="pointer-events-none absolute top-4 right-4 z-20 rounded-2xl border border-line bg-white/75 p-2.5 shadow-soft backdrop-blur-[2px]">
          <div className="relative size-16 rounded-xl border border-line bg-cloud-50/80">
            <span className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-ink-900" />
            {items.map((item) => (
              <span
                key={item.id}
                className="absolute size-1.5 -translate-1/2 rounded-full bg-blush-300"
                style={{ left: mapPosition(item.x, bounds.left, bounds.right), top: mapPosition(item.y, bounds.top, bounds.bottom) }}
              />
            ))}
          </div>
          <span className="mt-1 block text-center font-mono text-[0.5rem] tracking-[0.12em] text-ink-500 uppercase">index</span>
        </div>

        <div className="pointer-events-none absolute inset-x-5 bottom-4 z-20 flex items-end justify-between gap-4 font-mono text-[0.55rem] tracking-[0.12em] text-ink-500 uppercase">
          <span>Drag to browse</span>
          <span>Bounded field</span>
        </div>
      </div>

      <p id={`${label.replace(/\s+/g, "-").toLowerCase()}-instructions`} className="sr-only">
        Drag or use the arrow keys to browse the spatial field. Focus an item to inspect it. Home or 0 recenters the field.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-xs text-ink-500">
          Zoom {Math.round(currentZoom * 100)}% · {items.length} items
        </p>
        <p className="sr-only" aria-live="polite">
          {active ? `${items.find((item) => item.id === active)?.label ?? "Item"} selected` : "No spatial item selected"}
        </p>
        <div className="flex gap-2">
          <button type="button" disabled={disabled} onClick={() => updateZoom(currentZoom - 0.1)} aria-label="Zoom out spatial canvas" className="min-h-10 min-w-10 rounded-pill border border-line bg-white px-3 py-2 text-sm transition-colors hover:bg-cloud-50 disabled:opacity-40">−</button>
          <button type="button" disabled={disabled} onClick={reset} className="min-h-10 rounded-pill border border-line bg-white px-3 py-2 text-sm transition-colors hover:bg-cloud-50 disabled:opacity-40">Reset view</button>
          <button type="button" disabled={disabled} onClick={() => updateZoom(currentZoom + 0.1)} aria-label="Zoom in spatial canvas" className="min-h-10 min-w-10 rounded-pill bg-ink-900 px-3 py-2 text-sm text-milk disabled:opacity-40">+</button>
        </div>
      </div>
    </section>
  );
}

function CanvasItem({ item, active, onActive, disabled, motionEnabled }: { item: SpatialCanvasItem; active: boolean; onActive: (id: string | null) => void; disabled: boolean; motionEnabled: boolean }) {
  const plane = item.plane ?? "working";
  const planeStyle: Record<SpatialCanvasPlane, CSSProperties> = {
    foreground: { width: "min(17rem, calc(100vw - 3rem))", opacity: 1, filter: "saturate(1.02)" },
    working: { width: "min(15rem, calc(100vw - 3rem))", opacity: 0.94, filter: "saturate(.96)" },
    distant: { width: "min(13rem, calc(100vw - 3rem))", opacity: 0.78, filter: "saturate(.84)" },
  };

  return (
    <motion.article
      role="listitem"
      tabIndex={disabled ? -1 : 0}
      aria-label={`${item.label}${item.meta ? ` · ${String(item.meta)}` : ""}`}
      data-plane={plane}
      aria-current={active ? "true" : undefined}
      className="pointer-events-auto absolute overflow-hidden rounded-[22px] border border-line bg-white shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
      style={{ left: item.x, top: item.y, zIndex: active ? 40 : plane === "foreground" ? 30 : plane === "working" ? 20 : 10, ...planeStyle[plane] }}
      animate={motionEnabled ? { y: active ? -8 : 0, scale: active ? 1.035 : plane === "distant" ? 0.96 : 1 } : { y: active ? -5 : 0, scale: active ? 1.01 : 1 }}
      transition={motionEnabled ? { type: "spring", stiffness: 250, damping: 28, mass: 0.9 } : { duration: 0 }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch" && event.pointerType !== "pen") onActive(item.id);
      }}
      onPointerLeave={() => onActive(null)}
      onFocus={() => onActive(item.id)}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) onActive(null);
      }}
      onClick={() => onActive(item.id)}
    >
      {item.content}
      <div className="flex items-baseline justify-between gap-3 border-t border-line/70 bg-white/80 px-4 py-3">
        <h3 className="font-display text-sm font-semibold">{item.label}</h3>
        {item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}
      </div>
    </motion.article>
  );
}
