"use client";

import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type DataLensProps<T> = {
  items: T[];
  children: ReactNode;
  label: string;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  renderLens: (item: T, index: number) => ReactNode;
  className?: string;
};

/** Wraps any custom chart surface; selection logic is independent of its rendering technology. */
export function DataLens<T>({ items, children, label, index, defaultIndex = 0, onIndexChange, renderLens, className }: DataLensProps<T>) {
  const [active, setActive] = useControllable(index, defaultIndex, onIndexChange);
  const [position, setPosition] = useState(50);
  const bounded = Math.min(Math.max(active, 0), Math.max(items.length - 1, 0));
  const seek = (event: PointerEvent<HTMLDivElement>) => { const box = event.currentTarget.getBoundingClientRect(); const percent = Math.min(Math.max((event.clientX - box.left) / Math.max(box.width, 1), 0), 1); setPosition(percent * 100); setActive(Math.round(percent * Math.max(items.length - 1, 0))); };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? Math.max(items.length - 1, 0) : Math.min(Math.max(bounded + (event.key === "ArrowRight" ? 1 : -1), 0), Math.max(items.length - 1, 0)); setActive(next); setPosition((next / Math.max(items.length - 1, 1)) * 100); };
  const item = items[bounded];
  return <div role="slider" aria-label={label} aria-valuemin={1} aria-valuemax={Math.max(items.length, 1)} aria-valuenow={bounded + 1} tabIndex={0} onPointerMove={seek} onPointerDown={seek} onKeyDown={keys} className={cn("relative touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2", className)}>{children}{item ? <div className="pointer-events-none absolute top-3 z-20 -translate-x-1/2 rounded-xl bg-[color:var(--color-ink-900,#252933)] px-3 py-2 text-xs text-white shadow-lg" style={{ left: `${position}%` }}>{renderLens(item, bounded)}</div> : null}<div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-[color:var(--color-ink-900,#252933)]/20" style={{ left: `${position}%` }} /></div>;
}
