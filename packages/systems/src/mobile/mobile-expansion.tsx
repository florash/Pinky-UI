"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type PointerEvent as ReactPointerEvent, type ReactNode, type Ref } from "react";

import { cn } from "../internal/cn";

const SAFE_BOTTOM = "max(0.5rem, env(safe-area-inset-bottom))";
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25";
const TOUCH_BUTTON = `min-h-11 rounded-[14px] px-3 py-2 text-sm ${FOCUS_RING}`;
const DEFAULT_ITEMS = [
  { id: "home", label: "Home", meta: "01" },
  { id: "search", label: "Search", meta: "02" },
  { id: "saved", label: "Saved", meta: "03" },
  { id: "profile", label: "Profile", meta: "04" },
] as const;

export type MobileExpansionItem = { id: string; label: string; meta?: string; description?: string };
export type MobileExpansionAction = { id: string; label: string; tone?: "quiet" | "strong"; onAction?: () => void };

function useOpenState(open: boolean | undefined, defaultOpen: boolean, onOpenChange?: (open: boolean) => void) {
  const [internal, setInternal] = useState(defaultOpen);
  const shown = open ?? internal;
  const setShown = (next: boolean) => {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  return [shown, setShown] as const;
}

function useRestoreFocus(shown: boolean) {
  const previous = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (shown) previous.current = document.activeElement as HTMLElement;
    return () => {
      if (previous.current && !shown) previous.current.focus();
    };
  }, [shown]);
  return previous;
}

function SurfaceButton({ children, className, ref: buttonRef, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }) {
  return <button ref={buttonRef} type="button" className={cn(TOUCH_BUTTON, className)} {...props}>{children}</button>;
}

/** Active context grows above a stable icon rail instead of changing only colour. */
export function MorphingBottomNavigation({ items = [...DEFAULT_ITEMS], value, defaultValue, onValueChange, label = "Morphing bottom navigation", className }: { items?: MobileExpansionItem[]; value?: string; defaultValue?: string; onValueChange?: (id: string) => void; label?: string; className?: string }) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? "");
  const current = value ?? internal;
  const select = (id: string) => { if (value === undefined) setInternal(id); onValueChange?.(id); };
  return <nav aria-label={label} className={cn("w-full", className)} style={{ paddingBottom: SAFE_BOTTOM }}><div className="mx-auto flex max-w-md items-end justify-center gap-1 rounded-[22px] border border-line bg-white/95 p-1.5 shadow-soft">{items.slice(0, 4).map((item) => { const active = item.id === current; return <button key={item.id} type="button" aria-current={active ? "page" : undefined} aria-pressed={active} onClick={() => select(item.id)} className={cn("flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[16px] px-2 text-xs transition-[min-width,background-color,transform] duration-300 motion-reduce:transition-none", active ? "min-w-[6.5rem] -translate-y-1 bg-blush-50 px-3 font-medium text-ink-900 shadow-sm" : "text-ink-500 hover:bg-cloud-50", FOCUS_RING)}><span aria-hidden className="font-mono text-[0.58rem] tracking-[0.08em]">{item.meta ?? "·"}</span><span className={active ? "" : "sr-only"}>{item.label}</span></button>; })}</div></nav>;
}

/** A resting dock keeps the selected destination and one contextual action in the same object. */
export function FloatingDockNavigation({ items = [...DEFAULT_ITEMS], value, defaultValue, onValueChange, actionLabel = "New", onAction, label = "Floating dock navigation", className }: { items?: MobileExpansionItem[]; value?: string; defaultValue?: string; onValueChange?: (id: string) => void; actionLabel?: string; onAction?: () => void; label?: string; className?: string }) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? "");
  const current = value ?? internal;
  const motionEnabled = useMotionEnabled();
  const select = (id: string) => { if (value === undefined) setInternal(id); onValueChange?.(id); };
  return <nav aria-label={label} className={cn("w-full", className)} style={{ paddingBottom: SAFE_BOTTOM }}><div className="mx-auto flex max-w-md items-end justify-center gap-1 rounded-[24px] border border-line bg-cloud-50/95 p-1.5 shadow-soft">{items.slice(0, 4).map((item) => { const active = item.id === current; return <motion.button key={item.id} type="button" aria-current={active ? "page" : undefined} aria-label={item.label} onClick={() => select(item.id)} initial={false} animate={motionEnabled && active ? { y: -8 } : { y: 0 }} className={cn("relative flex min-h-11 min-w-11 items-center justify-center rounded-[17px] px-2 text-xs text-ink-500 transition-[background-color,width] duration-300 motion-reduce:transition-none", active && "min-w-[5.5rem] bg-white text-ink-900 shadow-sm", FOCUS_RING)}><span aria-hidden className="font-mono text-[0.58rem]">{item.meta ?? "·"}</span>{active ? <span className="ml-1.5 font-medium">{item.label}</span> : null}</motion.button>; })}<button type="button" aria-label={actionLabel} onClick={onAction} className={cn("ml-1 min-h-11 min-w-11 rounded-[17px] bg-ink-900 px-3 text-xs text-milk", FOCUS_RING)}>+</button></div></nav>;
}

/** A bottom trigger fans actions upward so the primary reach zone stays close to the thumb. */
export function ThumbReachMenu({ items = [{ id: "save", label: "Save" }, { id: "share", label: "Share" }, { id: "move", label: "Move" }], label = "More actions", className }: { items?: MobileExpansionAction[]; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } }; document.addEventListener("keydown", onKey); menu.current?.querySelector<HTMLButtonElement>("button")?.focus(); return () => document.removeEventListener("keydown", onKey); }, [open]);
  return <div className={cn("relative flex min-h-64 items-end justify-center", className)}><AnimatePresence>{open ? <motion.div ref={menu} role="menu" aria-label={`${label} choices`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="absolute bottom-16 left-1/2 flex -translate-x-1/2 flex-col-reverse items-center gap-2">{items.slice(0, 4).map((item, index) => <motion.button key={item.id} type="button" role="menuitem" onClick={() => { item.onAction?.(); setOpen(false); trigger.current?.focus(); }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={cn("min-h-11 min-w-28 rounded-pill border border-line bg-white px-4 py-2 text-sm text-ink-900 shadow-soft", FOCUS_RING)}>{item.label}</motion.button>)}</motion.div> : null}</AnimatePresence><button ref={trigger} type="button" aria-expanded={open} aria-haspopup="menu" aria-label={open ? `Close ${label}` : label} onClick={() => setOpen((value) => !value)} className={cn("grid min-h-12 min-w-12 place-items-center rounded-full bg-ink-900 text-lg text-milk shadow-soft", FOCUS_RING)}>{open ? "×" : "+"}</button></div>;
}

/** A search surface rises from the lower edge and keeps results and keyboard intent together. */
export function BottomSearchSheet({ open, defaultOpen = false, onOpenChange, query, defaultQuery = "", onQueryChange, results = ["Research interaction", "Surface notes", "Motion review"], title = "Search", className }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; query?: string; defaultQuery?: string; onQueryChange?: (value: string) => void; results?: ReactNode[]; title?: string; className?: string }) {
  const [shown, setShown] = useOpenState(open, defaultOpen, onOpenChange);
  const [internal, setInternal] = useState(defaultQuery);
  const value = query ?? internal;
  const setValue = (next: string) => { if (query === undefined) setInternal(next); onQueryChange?.(next); };
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const motionEnabled = useMotionEnabled();
  useEffect(() => { if (shown) window.requestAnimationFrame(() => input.current?.focus()); }, [shown]);
  const close = () => { setShown(false); window.requestAnimationFrame(() => trigger.current?.focus()); };
  const filtered = results.filter((result) => typeof result === "string" ? result.toLowerCase().includes(value.toLowerCase()) : true);
  return <div className={cn("relative", className)}><SurfaceButton ref={trigger} onClick={() => setShown(true)} className="bg-cloud-50 text-xs">Search from the bottom</SurfaceButton><AnimatePresence>{shown ? <motion.div className="fixed inset-0 z-[80] flex items-end bg-ink-900/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><motion.section role="dialog" aria-modal="true" aria-labelledby={titleId} initial={motionEnabled ? { y: "100%" } : false} animate={{ y: 0 }} exit={motionEnabled ? { y: "100%" } : undefined} className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl" style={{ paddingBottom: SAFE_BOTTOM }}><div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-cloud-200" /><div className="flex items-center justify-between gap-3"><h2 id={titleId} className="font-display text-xl font-semibold">{title}</h2><button type="button" onClick={close} aria-label="Close search" className={cn("min-h-10 min-w-10 rounded-full border border-line text-lg", FOCUS_RING)}>×</button></div><label htmlFor={`${titleId}-input`} className="sr-only">Search results</label><input ref={input} id={`${titleId}-input`} value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") close(); }} placeholder="Search notes" className="mt-5 min-h-12 w-full rounded-[16px] border border-line bg-cloud-50 px-4 text-base outline-none focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10" /><div className="mt-4 space-y-2" aria-live="polite">{filtered.length ? filtered.map((result, index) => <button key={typeof result === "string" ? result : index} type="button" onClick={close} className={cn("block min-h-11 w-full rounded-[14px] bg-cloud-50 px-3 py-2 text-left text-sm", FOCUS_RING)}>{result}</button>) : <p className="rounded-[14px] bg-cloud-50 p-3 text-sm text-ink-500">No matching notes.</p>}</div></motion.section></motion.div> : null}</AnimatePresence></div>;
}

/** Search and filters share one expanding surface so filter intent does not jump to a second route. */
export function SearchFilterMorph({ filters = ["All", "Editorial", "Product"], query, onQueryChange, className }: { filters?: string[]; query?: string; onQueryChange?: (value: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState("");
  const value = query ?? internal;
  const [filter, setFilter] = useState(filters[0] ?? "All");
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const setValue = (next: string) => { if (query === undefined) setInternal(next); onQueryChange?.(next); };
  useEffect(() => { if (open) window.requestAnimationFrame(() => input.current?.focus()); }, [open]);
  const close = () => { setOpen(false); window.requestAnimationFrame(() => trigger.current?.focus()); };
  return <div className={cn("rounded-[20px] border border-line bg-white p-3", className)}><div className="flex items-center gap-2"><button ref={trigger} type="button" aria-expanded={open} onClick={() => setOpen(true)} className={cn("min-h-11 min-w-11 rounded-[14px] bg-cloud-50 px-3 text-xs", FOCUS_RING)}>{open ? "Search" : "⌕ Search"}</button>{filter !== filters[0] ? <span className="rounded-pill bg-blush-50 px-3 py-2 text-xs text-ink-700">{filter}</span> : null}{open ? <button type="button" onClick={close} className={cn("ml-auto min-h-10 rounded-[14px] px-3 text-xs text-ink-500", FOCUS_RING)}>Cancel</button> : null}</div>{open ? <div className="mt-3 space-y-3"><input ref={input} value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") close(); }} placeholder="Search this view" className="min-h-11 w-full rounded-[14px] border border-line bg-cloud-50 px-3 text-sm outline-none focus:border-ink-900/30" /><div role="group" aria-label="Filters" className="flex gap-2 overflow-x-auto pb-1">{filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={cn("min-h-10 shrink-0 rounded-pill border px-3 text-xs", filter === item ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700", FOCUS_RING)}>{item}</button>)}</div></div> : <p className="mt-3 px-1 text-xs text-ink-500">Tap once to search, then refine the same surface.</p>}</div>;
}

/** An inline query pushes nearby content instead of reserving a permanent desktop search row. */
export function InlineSearchReveal({ title = "Saved notes", query, onQueryChange, className }: { title?: string; query?: string; onQueryChange?: (value: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState("");
  const value = query ?? internal;
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const setValue = (next: string) => { if (query === undefined) setInternal(next); onQueryChange?.(next); };
  useEffect(() => { if (open) window.requestAnimationFrame(() => input.current?.focus()); }, [open]);
  const close = () => { setOpen(false); window.requestAnimationFrame(() => trigger.current?.focus()); };
  return <div className={cn("flex min-h-16 items-center gap-3 border-b border-line", className)}>{open ? <div className="flex min-w-0 flex-1 items-center gap-2"><label htmlFor="inline-search" className="sr-only">Search {title}</label><input id="inline-search" ref={input} value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") close(); }} placeholder={`Search ${title.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base outline-none" /><button type="button" onClick={close} className={cn("min-h-10 shrink-0 rounded-[14px] border border-line px-3 text-xs", FOCUS_RING)}>Cancel</button></div> : <><h3 className="min-w-0 flex-1 truncate font-display text-lg font-semibold">{title}</h3><button ref={trigger} type="button" aria-expanded={false} onClick={() => setOpen(true)} className={cn("min-h-11 min-w-11 rounded-[14px] bg-cloud-50 px-3 text-sm", FOCUS_RING)} aria-label={`Search ${title}`}>⌕</button></>}</div>;
}

/** Three stable heights make a sheet's drag handoff predictable rather than arbitrary. */
export function DetentSheet({ open, defaultOpen = false, onOpenChange, title = "Choose a view", className }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; title?: string; className?: string }) {
  const [shown, setShown] = useOpenState(open, defaultOpen, onOpenChange);
  const [detent, setDetent] = useState<0 | 1 | 2>(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLElement>(null);
  const start = useRef<number | null>(null);
  const previous = useRestoreFocus(shown);
  const motionEnabled = useMotionEnabled();
  const heights = [32, 56, 84] as const;
  useEffect(() => { if (shown) window.requestAnimationFrame(() => sheet.current?.focus()); else if (previous.current) window.requestAnimationFrame(() => { previous.current?.focus(); previous.current = null; }); }, [shown, previous]);
  const close = () => { setShown(false); window.requestAnimationFrame(() => trigger.current?.focus()); };
  return <div className={cn("relative", className)}><SurfaceButton ref={trigger} onClick={() => setShown(true)} className="bg-cloud-50">Open detents</SurfaceButton><AnimatePresence>{shown ? <motion.div className="fixed inset-0 z-[80] flex items-end bg-ink-900/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><motion.section ref={sheet} role="dialog" aria-modal="true" tabIndex={-1} aria-label={title} initial={motionEnabled ? { y: "100%" } : false} animate={{ y: 0, height: `${heights[detent]}vh` }} exit={motionEnabled ? { y: "100%" } : undefined} onKeyDown={(event) => { if (event.key === "Escape") close(); }} className="w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl" style={{ paddingBottom: SAFE_BOTTOM }}><div onPointerDown={(event) => { start.current = event.clientY; event.currentTarget.setPointerCapture?.(event.pointerId); }} onPointerUp={(event) => { if (start.current === null) return; const distance = start.current - event.clientY; if (distance > 70) setDetent((value) => Math.min(2, value + 1) as 0 | 1 | 2); if (distance < -70) { if (detent === 0) close(); else setDetent((value) => Math.max(0, value - 1) as 0 | 1 | 2); } start.current = null; }} className="mx-auto mb-4 h-8 w-16 touch-none rounded-pill bg-cloud-200" aria-label="Drag to change sheet height" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={2} aria-valuenow={detent} onKeyDown={(event) => { if (event.key === "ArrowUp") setDetent((value) => Math.min(2, value + 1) as 0 | 1 | 2); if (event.key === "ArrowDown") setDetent((value) => Math.max(0, value - 1) as 0 | 1 | 2); }} /><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Detent / {detent === 0 ? "peek" : detent === 1 ? "half" : "full"}</p><h2 className="mt-2 text-lg font-semibold">{title}</h2></div><button type="button" onClick={close} aria-label="Close detent sheet" className={cn("min-h-10 min-w-10 rounded-full border border-line", FOCUS_RING)}>×</button></div><div className="mt-5 flex gap-2">{["Peek", "Half", "Full"].map((label, index) => <button key={label} type="button" aria-pressed={detent === index} onClick={() => setDetent(index as 0 | 1 | 2)} className={cn("min-h-10 flex-1 rounded-[14px] border text-xs", detent === index ? "border-ink-900 bg-cloud-50 text-ink-900" : "border-line text-ink-500", FOCUS_RING)}>{label}</button>)}</div><div className="mt-5 rounded-[18px] bg-cloud-50 p-4 text-sm leading-relaxed text-ink-700">The content keeps its place while the sheet moves between three stable reading heights.</div></motion.section></motion.div> : null}</AnimatePresence></div>;
}

/** The sheet height is owned by its content, with a max boundary instead of a fixed viewport fill. */
export function ContentAwareSheet({ open, defaultOpen = false, onOpenChange, title = "Details", children, expandedContent, className }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; title?: string; children: ReactNode; expandedContent?: ReactNode; className?: string }) {
  const [shown, setShown] = useOpenState(open, defaultOpen, onOpenChange);
  const [expanded, setExpanded] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  const close = () => { setShown(false); window.requestAnimationFrame(() => trigger.current?.focus()); };
  return <div className={cn("relative", className)}><SurfaceButton ref={trigger} onClick={() => setShown(true)} className="bg-cloud-50">Open adaptive sheet</SurfaceButton><AnimatePresence>{shown ? <motion.div className="fixed inset-0 z-[80] flex items-end bg-ink-900/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><motion.section ref={input} role="dialog" aria-modal="true" aria-label={title} layout={motionEnabled} initial={motionEnabled ? { y: "100%" } : false} animate={{ y: 0 }} exit={motionEnabled ? { y: "100%" } : undefined} onKeyDown={(event) => { if (event.key === "Escape") close(); }} className="w-full max-h-[80vh] overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl" style={{ paddingBottom: SAFE_BOTTOM }}><div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-cloud-200" /><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">{title}</h2><button type="button" onClick={close} aria-label={`Close ${title}`} className={cn("min-h-10 min-w-10 rounded-full border border-line", FOCUS_RING)}>×</button></div><div className="mt-5">{children}</div>{expandedContent ? <><button type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className={cn("mt-4 min-h-11 w-full rounded-[14px] border border-line text-sm", FOCUS_RING)}>{expanded ? "Show less" : "Show more detail"}</button><AnimatePresence initial={false}>{expanded ? <motion.div initial={motionEnabled ? { opacity: 0, height: 0 } : false} animate={{ opacity: 1, height: "auto" }} exit={motionEnabled ? { opacity: 0, height: 0 } : undefined} className="mt-3 overflow-hidden rounded-[18px] bg-blush-50 p-4 text-sm leading-relaxed text-ink-700">{expandedContent}</motion.div> : null}</AnimatePresence></> : null}</motion.section></motion.div> : null}</AnimatePresence></div>;
}

/** A card sheet follows the finger with scale and scrim response, then snaps back or dismisses. */
export function SwipeDismissCardSheet({ open, defaultOpen = false, onOpenChange, title = "A movable card", children, className }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; title?: string; children?: ReactNode; className?: string }) {
  const [shown, setShown] = useOpenState(open, defaultOpen, onOpenChange);
  const [offset, setOffset] = useState(0);
  const start = useRef<number | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  const close = () => { setOffset(0); setShown(false); window.requestAnimationFrame(() => trigger.current?.focus()); };
  const update = (value: number) => { setOffset(Math.max(0, value)); if (card.current) { card.current.style.transform = `translateY(${Math.max(0, value)}px) scale(${1 - Math.min(value / 1300, 0.08)})`; } };
  return <div className={cn("relative", className)}><SurfaceButton ref={trigger} onClick={() => setShown(true)} className="bg-cloud-50">Open card sheet</SurfaceButton><AnimatePresence>{shown ? <motion.div className="fixed inset-0 z-[80] flex items-end bg-ink-900/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.section ref={card} role="dialog" aria-modal="true" aria-label={title} initial={motionEnabled ? { y: "100%" } : false} animate={{ y: 0 }} exit={motionEnabled ? { y: "100%" } : undefined} transition={{ duration: motionEnabled ? 0.32 : 0 }} onKeyDown={(event) => { if (event.key === "Escape") close(); }} className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl" style={{ paddingBottom: SAFE_BOTTOM, transform: `translateY(${offset}px) scale(${1 - Math.min(offset / 1300, 0.08)})`, transition: start.current === null && motionEnabled ? "transform 280ms cubic-bezier(.22,.72,.2,1)" : "none" }}><div onPointerDown={(event) => { start.current = event.clientY; event.currentTarget.setPointerCapture?.(event.pointerId); }} onPointerMove={(event) => { if (start.current === null) return; const next = event.clientY - start.current; if (next > 0) { update(next); if (event.cancelable) event.preventDefault(); } }} onPointerUp={(event) => { if (start.current === null) return; const distance = event.clientY - start.current; start.current = null; if (distance > 96) close(); else update(0); }} onPointerCancel={() => { start.current = null; update(0); }} className="mx-auto mb-4 h-8 w-16 touch-none rounded-pill bg-cloud-200" aria-label="Drag down to dismiss" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.round(offset))} /><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Card sheet / release</p><h2 className="mt-2 text-lg font-semibold">{title}</h2></div><button type="button" onClick={close} aria-label={`Close ${title}`} className={cn("min-h-10 min-w-10 rounded-full border border-line", FOCUS_RING)}>×</button></div><div className="mt-5 rounded-[20px] bg-cloud-50 p-4 text-sm leading-relaxed text-ink-700">{children ?? "The card scales with the drag, then returns to its source or leaves with a clear release."}</div></motion.section></motion.div> : null}</AnimatePresence></div>;
}

/** Long press is a selection gesture, while tap and visible check buttons remain complete alternatives. */
export function LongPressSelection({ items = [{ id: "one", label: "North star", meta: "Draft" }, { id: "two", label: "Release notes", meta: "Ready" }, { id: "three", label: "Research log", meta: "Shared" }], onAction, className }: { items?: MobileExpansionItem[]; onAction?: (ids: string[]) => void; className?: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const clear = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = null; };
  useEffect(() => () => clear(), []);
  const begin = (id: string) => { fired.current = false; clear(); timer.current = window.setTimeout(() => { fired.current = true; toggle(id); }, 520); };
  const end = (id: string) => { clear(); if (!fired.current) toggle(id); };
  return <div className={cn("space-y-3", className)}><div className="grid gap-2">{items.map((item) => <button key={item.id} type="button" aria-label={`${item.label}, ${item.meta ?? "Available"}`} aria-pressed={selected.includes(item.id)} onPointerDown={() => begin(item.id)} onPointerUp={() => end(item.id)} onPointerCancel={clear} onContextMenu={(event) => { event.preventDefault(); clear(); toggle(item.id); }} className={cn("flex min-h-14 items-center justify-between rounded-[16px] border px-4 py-3 text-left", selected.includes(item.id) ? "border-ink-900/30 bg-blush-50" : "border-line bg-white", FOCUS_RING)}><span><span className="block text-sm font-medium">{item.label}</span><span className="mt-1 block text-xs text-ink-500">{item.meta ?? "Available"}</span></span><span aria-hidden className={cn("grid size-6 place-items-center rounded-full border text-xs", selected.includes(item.id) ? "border-ink-900 bg-ink-900 text-milk" : "border-line text-transparent")}>✓</span></button>)}</div>{selected.length ? <div role="toolbar" aria-label="Long press selection actions" className="sticky bottom-0 flex items-center gap-2 rounded-[18px] bg-ink-900 px-3 py-2 text-milk" style={{ paddingBottom: SAFE_BOTTOM }}><span className="mr-auto text-xs"><strong>{selected.length}</strong> selected</span><button type="button" onClick={() => onAction?.(selected)} className={cn("min-h-10 rounded-[12px] bg-white px-3 text-xs text-ink-900", FOCUS_RING)}>Move</button><button type="button" onClick={() => setSelected([])} className={cn("min-h-10 rounded-[12px] px-2 text-xs text-milk/75", FOCUS_RING)}>Cancel</button></div> : <p className="text-xs text-ink-500">Tap or hold a row to select it.</p>}</div>;
}

/** A row has reveal, snap and commit thresholds; the visible action button is the non-gesture path. */
export function SwipeActions({ label = "Archive project", actionLabel = "Archive", onAction, className }: { label?: string; actionLabel?: string; onAction?: () => void; className?: string }) {
  const [offset, setOffset] = useState(0);
  const [committed, setCommitted] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const locked = useRef(false);
  const begin = (event: ReactPointerEvent<HTMLDivElement>) => { if (committed) return; start.current = { x: event.clientX, y: event.clientY }; locked.current = false; event.currentTarget.setPointerCapture?.(event.pointerId); };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => { if (!start.current || committed) return; const dx = event.clientX - start.current.x; const dy = event.clientY - start.current.y; if (!locked.current && Math.abs(dx) > 8) locked.current = Math.abs(dx) > Math.abs(dy); if (!locked.current) return; if (dx < 0) { setOffset(Math.max(-170, dx)); if (event.cancelable) event.preventDefault(); } };
  const end = (event: ReactPointerEvent<HTMLDivElement>) => { if (!start.current) return; const distance = event.clientX - start.current.x; if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); start.current = null; locked.current = false; if (distance < -145) { setCommitted(true); setOffset(-170); onAction?.(); } else if (distance < -52) setOffset(-72); else setOffset(0); };
  return <div className={cn("space-y-2", className)}><div className="relative overflow-hidden rounded-[16px] border border-line bg-cloud-100"><div aria-hidden className="absolute inset-y-0 right-0 flex w-40 items-center justify-end bg-blush-100 px-3 text-xs text-ink-900">{committed ? "Archived" : actionLabel}</div><div role="group" aria-label={label} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} className="relative flex min-h-16 items-center justify-between gap-3 bg-white px-4 py-3 touch-pan-y" style={{ transform: `translateX(${offset}px)`, transition: start.current ? "none" : "transform 260ms cubic-bezier(.22,.72,.2,1)" }}><div><p className="text-sm font-medium">{committed ? `${label} archived` : label}</p><p className="mt-1 text-xs text-ink-500">{committed ? "The action committed." : "Swipe left, or use the action."}</p></div><button type="button" onClick={() => { setCommitted(true); setOffset(-170); onAction?.(); }} className={cn("min-h-10 shrink-0 rounded-[12px] border border-line bg-white px-3 text-xs text-ink-700", FOCUS_RING)}>{actionLabel}</button></div></div><p className="text-xs text-ink-500" role="status" aria-live="polite">{committed ? "Action committed." : offset < -52 ? "Release to reveal" : "Swipe partially to reveal, further to commit."}</p></div>;
}

/** Focus expands the field's local surface and brings its helper content into the thumb-sized frame. */
export function FocusLiftField({ label = "Workspace name", defaultValue = "Pinky studio", description = "Shown to collaborators.", className }: { label?: string; defaultValue?: string; description?: string; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const id = useId();
  return <label htmlFor={id} className={cn("block rounded-[18px] border bg-white p-3 transition-[transform,padding,background-color,border-color] duration-300 motion-reduce:transition-none", focused ? "-translate-y-1 border-ink-900/30 bg-cloud-50 p-4 shadow-soft" : "border-line", className)}><span className="block text-xs font-medium text-ink-900">{label}</span><input id={id} value={value} onChange={(event) => setValue(event.currentTarget.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="mt-2 min-h-11 w-full min-w-0 rounded-[14px] border border-line bg-white px-3 text-sm outline-none focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10" />{focused ? <span className="mt-2 block text-xs leading-relaxed text-ink-500">{description}</span> : null}</label>;
}

/** Validation uses a readable status surface and geometry change, not a red/green border alone. */
export function MobileValidationMorph({ label = "Email", defaultValue = "", className }: { label?: string; defaultValue?: string; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  const valid = value.includes("@");
  const status = value.length === 0 ? "idle" : valid ? "valid" : "invalid";
  const id = useId();
  const messageId = `${id}-message`;
  return <div className={cn("rounded-[18px] border p-3 transition-[border-color,background-color,padding] duration-300 motion-reduce:transition-none", status === "valid" ? "border-ink-900/25 bg-cloud-50" : status === "invalid" ? "border-ink-900/20 bg-blush-50" : "border-line bg-white", className)}><label htmlFor={id} className="block text-xs font-medium text-ink-900">{label}</label><div className="mt-2 flex items-center gap-2"><input id={id} value={value} onChange={(event) => setValue(event.currentTarget.value)} aria-invalid={status === "invalid"} aria-describedby={messageId} className="min-h-11 min-w-0 flex-1 rounded-[14px] border border-line bg-white px-3 text-sm outline-none focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10" placeholder="name@studio.com" /><span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full border text-xs", status === "idle" ? "border-line text-transparent" : "border-ink-900 bg-white text-ink-900")}>{status === "valid" ? "✓" : status === "invalid" ? "!" : "·"}</span></div><p id={messageId} role="status" aria-live="polite" className="mt-2 text-xs text-ink-700">{status === "idle" ? "Use an address we can reach." : valid ? "Looks ready to continue." : "Add an @ and a domain before continuing."}</p></div>;
}

export type ProgressiveMobileFormStep = { id: string; label: string; prompt: string; placeholder?: string };
/** One active field stays open while completed groups compress into editable summaries. */
export function ProgressiveMobileForm({ steps = [{ id: "name", label: "Name", prompt: "What should we call you?", placeholder: "Your name" }, { id: "focus", label: "Focus", prompt: "What deserves room today?", placeholder: "A clear next task" }, { id: "place", label: "Place", prompt: "Where should the work live?", placeholder: "A shared studio" }], className }: { steps?: ProgressiveMobileFormStep[]; className?: string }) {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [complete, setComplete] = useState(false);
  const active = steps[current];
  const setValue = (value: string) => { if (!active) return; setValues((currentValues) => ({ ...currentValues, [active.id]: value })); };
  const next = () => { if (!active || !values[active.id]?.trim()) return; if (current === steps.length - 1) setComplete(true); else setCurrent((value) => value + 1); };
  return <div className={cn("space-y-3", className)}><div className="flex gap-1.5" aria-label="Form progress">{steps.map((step, index) => <span key={step.id} className={cn("h-1.5 flex-1 rounded-pill", complete || index < current ? "bg-ink-900" : index === current ? "bg-blush-200" : "bg-cloud-200")} />)}</div>{complete ? <div role="status" className="rounded-[18px] bg-cloud-50 p-4"><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Ready</p><p className="mt-2 text-sm font-medium">Your mobile form is complete.</p><button type="button" onClick={() => { setComplete(false); setCurrent(0); }} className={cn("mt-4 text-xs underline underline-offset-4", FOCUS_RING)}>Edit answers</button></div> : <><div className="space-y-2">{steps.slice(0, current).map((step) => <button key={step.id} type="button" aria-label={`${step.label} ${values[step.id]} Edit`} onClick={() => setCurrent(steps.indexOf(step))} className={cn("flex min-h-12 w-full items-center justify-between rounded-[16px] bg-cloud-50 px-3 text-left", FOCUS_RING)}><span><span className="block text-[0.58rem] font-mono tracking-[0.12em] text-ink-500 uppercase">{step.label}</span><span className="mt-1 block text-sm text-ink-900">{values[step.id]}</span></span><span className="text-xs text-ink-500">Edit</span></button>)}</div><section aria-labelledby={`${active?.id}-title`} className="rounded-[20px] border border-line bg-white p-4 shadow-soft"><p className="font-mono text-[0.58rem] tracking-[0.12em] text-ink-500 uppercase">Current / {active?.label}</p><h3 id={`${active?.id}-title`} className="mt-3 font-display text-xl font-semibold">{active?.prompt}</h3><input value={active ? values[active.id] ?? "" : ""} onChange={(event) => setValue(event.currentTarget.value)} placeholder={active?.placeholder} className="mt-5 min-h-12 w-full rounded-[14px] border border-line bg-cloud-50 px-3 text-sm outline-none focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10" /><div className="mt-5 flex items-center justify-between gap-3"><button type="button" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))} className={cn("min-h-11 rounded-[14px] border border-line px-3 text-sm disabled:opacity-40", FOCUS_RING)}>Back</button><button type="button" onClick={next} className={cn("min-h-11 rounded-[14px] bg-ink-900 px-4 text-sm text-milk", FOCUS_RING)}>{current === steps.length - 1 ? "Finish" : "Next"}</button></div></section><p className="text-xs text-ink-500">Next: {steps[current + 1]?.label ?? "Ready"}</p></>}</div>;
}

export type CardStackItem = { id: string; label: string; description: string };
/** A small editorial stack uses drag distance to move the current card while the next gains depth. */
export function CardStackBrowse({ items = [{ id: "one", label: "Signal", description: "Start with the relationship that matters." }, { id: "two", label: "Material", description: "Let the surface answer a useful question." }, { id: "three", label: "Release", description: "Leave the next choice within reach." }], className }: { items?: CardStackItem[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const start = useRef<number | null>(null);
  const active = items[index % items.length];
  const next = items[(index + 1) % items.length];
  const advance = (direction: 1 | -1) => { setIndex((value) => (value + direction + items.length) % items.length); setOffset(0); };
  return <div className={cn("space-y-3", className)}><div className="relative mx-auto min-h-56 max-w-sm" aria-live="polite"><div className="absolute inset-x-6 top-5 min-h-48 rounded-[24px] border border-line bg-cloud-100 p-5" style={{ transform: "rotate(3deg) translateY(8px)" }}><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Next / {next?.label}</p></div><div role="group" aria-label={`Card ${active?.label}`} onPointerDown={(event) => { start.current = event.clientX; event.currentTarget.setPointerCapture?.(event.pointerId); }} onPointerMove={(event) => { if (start.current === null) return; const distance = event.clientX - start.current; setOffset(Math.max(-110, Math.min(110, distance))); }} onPointerUp={(event) => { if (start.current === null) return; const distance = event.clientX - start.current; start.current = null; if (Math.abs(distance) > 72) advance(distance < 0 ? 1 : -1); else setOffset(0); }} onPointerCancel={() => { start.current = null; setOffset(0); }} className={cn("absolute inset-x-2 top-0 min-h-48 touch-pan-y rounded-[24px] border border-line bg-white p-5 shadow-soft", FOCUS_RING)} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight") advance(1); if (event.key === "ArrowLeft") advance(-1); }} style={{ transform: `translateX(${offset}px) rotate(${offset / 22}deg)`, transition: start.current === null ? "transform 280ms cubic-bezier(.22,.72,.2,1)" : "none" }}><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Current / {active?.label}</p><p className="mt-6 font-display text-2xl font-semibold">{active?.description}</p><p className="mt-5 text-xs text-ink-500">Drag to browse · Arrow keys work too</p></div></div><div className="flex justify-center gap-2"><button type="button" onClick={() => advance(-1)} className={cn("min-h-10 rounded-pill border border-line px-3 text-xs", FOCUS_RING)}>Previous</button><button type="button" onClick={() => advance(1)} className={cn("min-h-10 rounded-pill bg-ink-900 px-3 text-xs text-milk", FOCUS_RING)}>Next card</button></div></div>;
}

export type ExpandableMobileCardItem = { id: string; label: string; summary: string; detail: string };
/** The selected card expands in the same flow and makes later content reflow below it. */
export function ExpandInPlaceCard({ items = [{ id: "one", label: "A quiet surface", summary: "One useful sentence.", detail: "The detail belongs directly below the source, so the reader never loses the item they opened." }, { id: "two", label: "A shared surface", summary: "Context remains nearby.", detail: "This card owns its own extra reading room without becoming a modal or route detour." }], className }: { items?: ExpandableMobileCardItem[]; className?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return <div className={cn("space-y-2", className)}>{items.map((item) => <article key={item.id} className={cn("overflow-hidden rounded-[18px] border transition-[background-color,border-color] motion-reduce:transition-none", open === item.id ? "border-ink-900/25 bg-blush-50" : "border-line bg-white")}><button type="button" aria-expanded={open === item.id} onClick={() => setOpen((value) => value === item.id ? null : item.id)} className={cn("flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 text-left", FOCUS_RING)}><span><span className="block text-sm font-medium">{item.label}</span><span className="mt-1 block text-xs text-ink-500">{item.summary}</span></span><span aria-hidden className="text-lg">{open === item.id ? "−" : "+"}</span></button><AnimatePresence initial={false}>{open === item.id ? <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="border-t border-line/70 px-4 py-4 text-sm leading-relaxed text-ink-700">{item.detail}</p></motion.div> : null}</AnimatePresence></article>)}</div>;
}

/** A native snap rail keeps neighboring items visible and makes the focused item the dominant one. */
export function FocusRailMobile({ items = [{ id: "one", label: "One", meta: "Lead" }, { id: "two", label: "Two", meta: "Current" }, { id: "three", label: "Three", meta: "Next" }], className }: { items?: MobileExpansionItem[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const motionEnabled = useMotionEnabled();
  const rail = useRef<HTMLDivElement>(null);
  const choose = (item: MobileExpansionItem) => { setActive(item.id); rail.current?.querySelector<HTMLElement>(`[data-rail-id="${item.id}"]`)?.scrollIntoView({ behavior: motionEnabled ? "smooth" : "auto", inline: "center", block: "nearest" }); };
  return <div ref={rail} className={cn("flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:none]", className)} role="list" aria-label="Focus rail">{items.map((item) => <button key={item.id} type="button" data-rail-id={item.id} role="listitem" aria-current={active === item.id ? "true" : undefined} onClick={() => choose(item)} className={cn("min-h-36 min-w-[72%] snap-center rounded-[22px] border p-4 text-left transition-[transform,opacity,background-color] duration-300 motion-reduce:transition-none sm:min-w-[17rem]", active === item.id ? "scale-100 border-ink-900/25 bg-blush-50 opacity-100" : "scale-[.94] border-line bg-white opacity-70", FOCUS_RING)}><span className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">{item.meta ?? "Collection"}</span><span className="mt-5 block font-display text-xl font-semibold">{item.label}</span><span className="mt-2 block text-xs text-ink-500">Center to focus · swipe to browse</span></button>)}</div>;
}

export type MobileMediaItem = { id: string; label: string; detail?: string; tone?: "blush" | "cloud" | "milk" };
function mediaTone(tone: MobileMediaItem["tone"] = "cloud") { return tone === "blush" ? "bg-blush-100" : tone === "milk" ? "bg-white" : "bg-cloud-100"; }

/** A media source grows into a local full-screen reading surface and restores its trigger. */
export function FullscreenMediaMorph({ items = [{ id: "one", label: "Soft study", detail: "A considered frame", tone: "blush" }, { id: "two", label: "Working room", detail: "A second frame", tone: "cloud" }], className }: { items?: MobileMediaItem[]; className?: string }) {
  const [active, setActive] = useState<MobileMediaItem | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  useEffect(() => { if (active) window.requestAnimationFrame(() => dialog.current?.focus()); else window.requestAnimationFrame(() => trigger.current?.focus()); }, [active]);
  return <div className={cn("grid gap-2 sm:grid-cols-2", className)}><div className="contents">{items.map((item, index) => <button key={item.id} ref={index === 0 ? trigger : undefined} type="button" onClick={() => setActive(item)} className={cn("min-h-28 rounded-[18px] border border-line p-4 text-left transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none", mediaTone(item.tone), FOCUS_RING)}><span className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Media / 0{index + 1}</span><span className="mt-4 block font-display text-lg font-semibold">{item.label}</span><span className="mt-1 block text-xs text-ink-500">Tap to expand</span></button>)}</div><AnimatePresence>{active ? <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink-900/70 p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.section ref={dialog} role="dialog" aria-modal="true" aria-label={active.label} tabIndex={-1} initial={motionEnabled ? { scale: 0.94, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} exit={motionEnabled ? { scale: 0.96, opacity: 0 } : undefined} className={cn("w-full max-w-lg rounded-[24px] p-5", mediaTone(active.tone))}><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Fullscreen media</p><h2 className="mt-2 font-display text-2xl font-semibold">{active.label}</h2></div><button type="button" onClick={() => setActive(null)} aria-label="Close media" className={cn("min-h-10 min-w-10 rounded-full border border-line bg-white/75", FOCUS_RING)}>×</button></div><div className="mt-6 grid min-h-56 place-items-center rounded-[20px] border border-line bg-white/55"><span className="font-display text-3xl font-semibold">{active.detail ?? "Selected frame"}</span></div><p className="mt-4 text-sm text-ink-700">The surface grows from the source and returns to the same place.</p></motion.section></motion.div> : null}</AnimatePresence></div>;
}

/** Upward swipe reveals metadata in the same media stage; a Details button is always present. */
export function SwipeMediaInspector({ title = "Working room", className }: { title?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const start = useRef<number | null>(null);
  const close = () => { setOpen(false); setDetails(false); };
  return <div className={cn("relative min-h-56 overflow-hidden rounded-[22px] border border-line bg-cloud-100", className)}>{open ? <div onPointerDown={(event) => { start.current = event.clientY; event.currentTarget.setPointerCapture?.(event.pointerId); }} onPointerUp={(event) => { if (start.current === null) return; const distance = start.current - event.clientY; start.current = null; if (distance > 58) setDetails(true); if (distance < -58) setDetails(false); }} className="absolute inset-0 touch-pan-x p-4"><div className="flex items-center justify-between"><span className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Media / inspect</span><button type="button" onClick={close} aria-label="Close media inspector" className={cn("min-h-10 min-w-10 rounded-full border border-line bg-white/75", FOCUS_RING)}>×</button></div><div className="mt-8 grid min-h-28 place-items-center rounded-[18px] bg-white/70"><span className="font-display text-2xl font-semibold">{title}</span></div><button type="button" aria-expanded={details} onClick={() => setDetails((value) => !value)} className={cn("mt-3 min-h-11 rounded-[14px] border border-line bg-white/75 px-3 text-xs", FOCUS_RING)}>{details ? "Hide details" : "Details"}</button>{details ? <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] border-t border-line bg-white p-4"><p className="text-sm font-medium">Metadata stays attached.</p><p className="mt-1 text-xs text-ink-500">Swipe down or use the button to return to the frame.</p></div> : null}</div> : <button type="button" onClick={() => setOpen(true)} className={cn("absolute inset-0 grid place-items-center text-left", FOCUS_RING)}><span><span className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Media / source</span><span className="mt-3 block font-display text-xl font-semibold">Tap, then swipe up.</span><span className="mt-2 block text-xs text-ink-500">{title}</span></span></button>}</div>;
}

/** Controls stay minimal at rest and reveal a small contextual set after a tap. */
export function FloatingMediaControls({ label = "Lesson 01", className }: { label?: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  const reveal = () => { setVisible(true); if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setVisible(false), 2200); };
  return <div className={cn("relative min-h-48 overflow-hidden rounded-[22px] border border-line bg-ink-900 text-milk", className)} onClick={reveal}><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,var(--color-cloud-300),transparent_42%)] opacity-60" /><div className="relative flex min-h-48 flex-col justify-between p-4"><div className="flex items-start justify-between"><span className="font-mono text-[0.58rem] tracking-[0.14em] text-white/65 uppercase">Media / {label}</span><span aria-live="polite" className="text-xs text-white/65">{playing ? "Playing" : "Paused"}</span></div><div className={cn("flex items-center justify-between gap-3 transition-opacity duration-300 motion-reduce:transition-none", visible ? "opacity-100" : "opacity-0")}><button type="button" aria-label={playing ? "Pause media" : "Play media"} onClick={(event) => { event.stopPropagation(); setPlaying((value) => !value); reveal(); }} className={cn("grid min-h-11 min-w-11 place-items-center rounded-full bg-white text-ink-900", FOCUS_RING)}>{playing ? "Ⅱ" : "▶"}</button><span className="text-xs text-white/70">Tap the surface for controls</span></div></div></div>;
}

export type MobileToast = { id: string; title: string; description?: string };
/** A bottom stack compresses multiple short messages without importing desktop corner-toast geometry. */
export function BottomToastStack({ className }: { className?: string }) {
  const [toasts, setToasts] = useState<MobileToast[]>([]);
  useEffect(() => { const timers = toasts.map((toast) => window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== toast.id)), 4200)); return () => timers.forEach((timer) => window.clearTimeout(timer)); }, [toasts]);
  const add = () => setToasts((current) => [...current, { id: `${Date.now()}-${current.length}`, title: current.length ? "Second update" : "Saved locally", description: "The stack stays within thumb reach." }].slice(-3));
  return <div className={cn("relative min-h-48", className)}><SurfaceButton onClick={add} className="bg-ink-900 text-milk">Add bottom toast</SurfaceButton><div className="pointer-events-none fixed inset-x-3 bottom-3 z-[70] mx-auto flex max-w-md flex-col-reverse gap-2" style={{ paddingBottom: SAFE_BOTTOM }} aria-live="polite">{toasts.map((toast, index) => <div key={toast.id} className="pointer-events-auto rounded-[18px] border border-line bg-white/95 p-3 shadow-soft" style={{ transform: `scale(${1 - Math.min(index, 2) * .035})` }}><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-sm font-medium text-ink-900">{toast.title}</p><p className="mt-1 text-xs text-ink-500">{toast.description}</p></div><button type="button" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} aria-label={`Dismiss ${toast.title}`} className={cn("min-h-9 min-w-9 rounded-full border border-line text-xs", FOCUS_RING)}>×</button></div></div>)}</div></div>;
}

/** Undo keeps the exact item in its place while the lower surface remains reachable. */
export function MobileUndoBar({ className }: { className?: string }) {
  const [items, setItems] = useState(["Research note", "Release brief", "Motion audit"]);
  const [removed, setRemoved] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  const remove = (item: string) => { setItems((current) => current.filter((value) => value !== item)); setRemoved(item); if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setRemoved(null), 5000); };
  const undo = () => { if (!removed) return; setItems((current) => [removed, ...current]); setRemoved(null); if (timer.current) window.clearTimeout(timer.current); };
  return <div className={cn("space-y-2", className)}><div className="space-y-2">{items.map((item) => <div key={item} className="flex min-h-12 items-center gap-3 rounded-[16px] border border-line bg-white px-3"><span className="min-w-0 flex-1 text-sm">{item}</span><button type="button" onClick={() => remove(item)} className={cn("min-h-10 rounded-[12px] px-3 text-xs text-ink-500", FOCUS_RING)}>Archive</button></div>)}</div>{removed ? <div role="status" aria-live="polite" className="sticky bottom-0 flex items-center gap-3 rounded-[18px] bg-ink-900 px-3 py-2 text-milk" style={{ paddingBottom: SAFE_BOTTOM }}><span className="min-w-0 flex-1 truncate text-xs">{removed} archived</span><button type="button" onClick={undo} className={cn("min-h-10 rounded-[12px] bg-white px-3 text-xs text-ink-900", FOCUS_RING)}>Undo</button></div> : null}</div>;
}

/** A quick action sheet combines searchable actions with recent/contextual priority. */
export function QuickActionSheet({ actions = [{ id: "new", label: "New note", meta: "Recent" }, { id: "share", label: "Share collection", meta: "Context" }, { id: "filter", label: "Filter this view", meta: "Recent" }], className }: { actions?: Array<MobileExpansionAction & { meta?: string }>; className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) window.requestAnimationFrame(() => input.current?.focus()); }, [open]);
  const close = () => { setOpen(false); setQuery(""); window.requestAnimationFrame(() => trigger.current?.focus()); };
  const filtered = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));
  return <div className={cn("relative", className)}><SurfaceButton ref={trigger} onClick={() => setOpen(true)} className="bg-ink-900 text-milk">Quick actions</SurfaceButton><AnimatePresence>{open ? <motion.div className="fixed inset-0 z-[80] flex items-end bg-ink-900/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><motion.section role="dialog" aria-modal="true" aria-label="Quick actions" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl" style={{ paddingBottom: SAFE_BOTTOM }} onKeyDown={(event) => { if (event.key === "Escape") close(); }}><div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-cloud-200" /><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[0.58rem] tracking-[0.14em] text-ink-500 uppercase">Quick actions</p><h2 className="mt-2 text-lg font-semibold">What is next?</h2></div><button type="button" onClick={close} aria-label="Close quick actions" className={cn("min-h-10 min-w-10 rounded-full border border-line", FOCUS_RING)}>×</button></div><input ref={input} value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search actions" className="mt-5 min-h-11 w-full rounded-[14px] border border-line bg-cloud-50 px-3 text-sm outline-none focus:border-ink-900/30" /><div className="mt-4 space-y-2">{filtered.map((action) => <button key={action.id} type="button" onClick={() => { action.onAction?.(); close(); }} className={cn("flex min-h-14 w-full items-center justify-between gap-3 rounded-[16px] bg-cloud-50 px-3 text-left", FOCUS_RING)}><span className="text-sm font-medium">{action.label}</span><span className="text-xs text-ink-500">{action.meta ?? "Action"}</span></button>)}</div></motion.section></motion.div> : null}</AnimatePresence></div>;
}

/** A long press reveals secondary actions, with a visible cancel path and Escape fallback. */
export function HoldToRevealActions({ label = "Publish", actions = [{ id: "schedule", label: "Schedule" }, { id: "duplicate", label: "Duplicate" }], onAction, className }: { label?: string; actions?: MobileExpansionAction[]; onAction?: () => void; className?: string }) {
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const clear = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = null; };
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (revealed && event.key === "Escape") setRevealed(false); }; document.addEventListener("keydown", onKey); return () => { clear(); document.removeEventListener("keydown", onKey); }; }, [revealed]);
  const begin = () => { fired.current = false; clear(); timer.current = window.setTimeout(() => { fired.current = true; setRevealed(true); }, 520); };
  const end = () => { clear(); if (!fired.current && !revealed) onAction?.(); };
  return <div className={cn("relative min-h-36", className)}><div className="flex items-center justify-center gap-2">{revealed ? actions.map((action) => <button key={action.id} type="button" onClick={() => { action.onAction?.(); setRevealed(false); }} className={cn("min-h-11 rounded-pill border border-line bg-white px-3 text-xs shadow-soft", FOCUS_RING)}>{action.label}</button>) : null}<button type="button" aria-expanded={revealed} onPointerDown={begin} onPointerUp={end} onPointerCancel={clear} onContextMenu={(event) => { event.preventDefault(); clear(); setRevealed(true); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setRevealed((value) => !value); } }} className={cn("min-h-12 rounded-pill bg-ink-900 px-5 text-sm text-milk", FOCUS_RING)}>{revealed ? "Cancel" : label}</button></div><p className="mt-4 text-center text-xs text-ink-500">Hold to reveal · tap the visible action to cancel</p></div>;
}
