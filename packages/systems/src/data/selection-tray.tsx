"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useId, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type SelectionTrayItem = { id: string; label: string; meta?: ReactNode; disabled?: boolean };
export type SelectionTrayAction = { id: string; label: string; onAction?: (items: SelectionTrayItem[]) => void; destructive?: boolean };
export type SelectionTrayProps = {
  items: SelectionTrayItem[];
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  actions?: SelectionTrayAction[];
  label?: string;
  className?: string;
};

/** A multi-select list whose actions appear only when they have something to act on. */
export function SelectionTray({ items, selectedIds, defaultSelectedIds = [], onSelectedIdsChange, actions = [], label = "Selectable items", className }: SelectionTrayProps) {
  const id = useId();
  const [internalSelected, setInternalSelected] = useState(defaultSelectedIds);
  const [announcement, setAnnouncement] = useState("");
  const selected = selectedIds ?? internalSelected;
  const chosen = items.filter((item) => selected.includes(item.id));
  const motionEnabled = useMotionEnabled();
  const update = (next: string[]) => {
    if (selectedIds === undefined) setInternalSelected(next);
    onSelectedIdsChange?.(next);
    setAnnouncement(`${next.length} item${next.length === 1 ? "" : "s"} selected.`);
  };
  const toggle = (item: SelectionTrayItem) => update(selected.includes(item.id) ? selected.filter((idValue) => idValue !== item.id) : [...selected, item.id]);

  return (
    <div className={cn("w-full", className)}>
      <div role="list" aria-label={label} className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => { const checked = selected.includes(item.id); return <label key={item.id} className={cn("flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-ink-900/15", checked ? "border-ink-900 bg-blush-50" : "border-line bg-white hover:bg-cloud-50", item.disabled && "cursor-not-allowed opacity-50")}><input id={`${id}-${item.id}`} type="checkbox" checked={checked} disabled={item.disabled} onChange={() => toggle(item)} className="size-4 accent-[var(--color-ink-900)]" /><span className="min-w-0"><span className="block truncate text-sm font-medium text-ink-900">{item.label}</span>{item.meta ? <span className="mt-0.5 block truncate text-xs text-ink-500">{item.meta}</span> : null}</span></label>; })}
      </div>
      <AnimatePresence initial={false}>{chosen.length ? <motion.div layout={motionEnabled} initial={motionEnabled ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} exit={motionEnabled ? { opacity: 0, y: 8 } : undefined} role="region" aria-label="Selection actions" style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }} className="sticky z-10 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-900/10 bg-ink-900 px-4 py-3 text-milk shadow-xl"><p className="text-sm"><strong>{chosen.length}</strong> selected</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => update([])} className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">Clear</button>{actions.map((action) => <button key={action.id} type="button" onClick={() => action.onAction?.(chosen)} className={cn("rounded-full px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50", action.destructive ? "bg-blush-200 text-ink-900" : "bg-white text-ink-900")}>{action.label}</button>)}</div></motion.div> : null}</AnimatePresence>
      <p aria-live="polite" className="sr-only">{announcement}</p>
    </div>
  );
}
