"use client";

import { Reorder, motion } from "motion/react";
import { GridReveal, useMotionEnabled } from "@pinky-ui/primitives";
import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../internal/cn";

export type ReorderItem = { id: string; label: string; disabled?: boolean };
export function moveItem<T>(items: T[], from: number, to: number) { const next = [...items]; const [item] = next.splice(from, 1); if (item === undefined) return items; next.splice(Math.max(0, Math.min(next.length, to)), 0, item); return next; }
export function ReorderableList<T extends ReorderItem>({ items, onReorder, renderItem, label = "Reorder items", className }: { items: T[]; onReorder: (items: T[]) => void; renderItem?: (item: T) => ReactNode; label?: string; className?: string }) {
  const [announcement, setAnnouncement] = useState(""); const enabled = useMotionEnabled(); const move = (index: number, delta: number) => { const target = Math.max(0, Math.min(items.length - 1, index + delta)); if (target === index) return; const next = moveItem(items, index, target); onReorder(next); setAnnouncement(`${items[index]?.label} moved to position ${target + 1}`); };
  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-1";
  return <><Reorder.Group axis="y" values={items} onReorder={onReorder} aria-label={label} className={cn("space-y-2", className)}>{items.map((item, index) => <Reorder.Item key={item.id} value={item} layout={enabled ? true : undefined} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm"><button type="button" disabled={item.disabled} aria-label={`Move ${item.label}`} onKeyDown={(event) => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); move(index, event.key === "ArrowUp" ? -1 : 1); } }} className={cn("min-h-11 min-w-11 cursor-grab rounded-lg px-2 py-1 touch-none", focusRing)} title="Drag or use Arrow keys">⠿</button><div className="min-w-0 flex-1">{renderItem?.(item) ?? item.label}</div><div className="flex gap-1"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${item.label} up`} className={cn("min-h-11 min-w-11 rounded-lg text-ink-700 disabled:opacity-35", focusRing)}>↑</button><button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Move ${item.label} down`} className={cn("min-h-11 min-w-11 rounded-lg text-ink-700 disabled:opacity-35", focusRing)}>↓</button></div></Reorder.Item>)}</Reorder.Group><p className="sr-only" aria-live="polite">{announcement}</p></>;
}
export function ExpandableListRow({ summary, children, open, defaultOpen = false, onOpenChange, className }: { summary: ReactNode; children: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string }) {
  const [internal, setInternal] = useState(defaultOpen);
  const contentId = useId();
  const shown = open ?? internal;
  const set = (next: boolean) => { if (open === undefined) setInternal(next); onOpenChange?.(next); };
  return <div className={cn("rounded-2xl border border-line bg-white", className)}><button id={`${contentId}-trigger`} type="button" aria-expanded={shown} aria-controls={contentId} onClick={() => set(!shown)} className="flex min-h-12 w-full items-center justify-between gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25"><span>{summary}</span><span aria-hidden>{shown ? "−" : "+"}</span></button><GridReveal open={shown} contentProps={{ id: contentId, role: "region", "aria-labelledby": `${contentId}-trigger` }}><div className="border-t border-line p-4">{children}</div></GridReveal></div>;
}

export function SwipeActionRow({ children, actions, threshold = 72, className }: { children: ReactNode; actions: Array<{ label: string; onAction: () => void; destructive?: boolean }>; threshold?: number; className?: string }) { const [open, setOpen] = useState(false); const start = useRef(0); const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-inset"; return <div className={cn("relative overflow-hidden rounded-2xl bg-cloud-100", className)}><div className="absolute inset-y-0 right-0 flex items-stretch">{actions.map((action) => <button key={action.label} type="button" tabIndex={open ? 0 : -1} onClick={action.onAction} className={cn("min-h-11 min-w-20 px-3 text-sm", focusRing, action.destructive ? "bg-blush-300 text-ink-900" : "bg-cloud-200 text-ink-900", !open && "pointer-events-none")}>{action.label}</button>)}</div><motion.div drag="x" dragDirectionLock dragConstraints={{ left: -actions.length * 80, right: 0 }} dragElastic={.08} dragMomentum={false} animate={{ x: open ? -actions.length * 80 : 0 }} onDragStart={(_, info) => { start.current = info.point.x; }} onDragEnd={(_, info) => setOpen(start.current - info.point.x > threshold)} className="relative flex touch-pan-y items-center gap-3 bg-white p-4"><div className="min-w-0 flex-1">{children}</div><button type="button" aria-expanded={open} aria-label="Show row actions" onClick={() => setOpen(!open)} className={cn("min-h-11 min-w-11 shrink-0 rounded-lg text-ink-700", focusRing)}>•••</button></motion.div></div>; }
export function StickyDataHeader({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("sticky top-0 z-10 border-b border-line bg-white/90 p-3 backdrop-blur supports-[backdrop-filter]:shadow-sm", className)}>{children}</div>; }
/**
 * A presentational emphasis wrapper for a row.
 *
 * It deliberately carries no role and no tab stop: it decorates whatever
 * interactive content the caller puts inside it. Focus emphasis is driven by
 * `focus-within`, so it lights up when a real control inside the row is
 * focused, rather than adding an empty tab stop of its own.
 */
export function RowSpotlight({ children, className }: { children: ReactNode; className?: string }) { return <div className={cn("group rounded-xl px-3 py-2 transition-colors hover:bg-blush-50 focus-within:bg-blush-50", className)}>{children}</div>; }
