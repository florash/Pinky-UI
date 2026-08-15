"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type MobileNavItem = { id: string; label: string; icon?: ReactNode };
export type MobileAction = { id: string; label: string; tone?: "quiet" | "strong"; onAction?: () => void };

const SAFE_BOTTOM = "max(0.5rem, env(safe-area-inset-bottom))";
const CONTROL = "min-h-10 rounded-xl border border-line px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25";
const DEFAULT_NAV_ITEMS: MobileNavItem[] = [
  { id: "home", label: "Home", icon: "01" },
  { id: "search", label: "Search", icon: "02" },
  { id: "saved", label: "Saved", icon: "03" },
  { id: "profile", label: "Profile", icon: "04" },
];

export function FloatingTabBar({ items = DEFAULT_NAV_ITEMS, value, defaultValue, onValueChange, label = "Primary navigation", compact = false, className }: { items?: MobileNavItem[]; value?: string; defaultValue?: string; onValueChange?: (id: string) => void; label?: string; compact?: boolean; className?: string }) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? "");
  const current = value ?? internal;
  const set = (id: string) => { if (value === undefined) setInternal(id); onValueChange?.(id); };
  return (
    <nav aria-label={label} className={cn("w-full", className)} style={{ paddingBottom: SAFE_BOTTOM }}>
      <div className={cn("mx-auto flex w-full max-w-md items-center gap-1.5 rounded-[20px] border border-line bg-white/95 p-1.5 shadow-soft", compact && "rounded-[16px] p-1")}>
        {items.slice(0, 5).map((item) => {
          const active = item.id === current;
          return <button key={item.id} type="button" aria-current={active ? "page" : undefined} aria-pressed={active} onClick={() => set(item.id)} className={cn("flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-[14px] px-2.5 py-2 text-xs transition-[background-color,color,flex-grow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", compact && "min-h-10 rounded-[12px] px-2 py-1.5", active ? "flex-[1.45] bg-cloud-50 font-medium text-ink-900" : "text-ink-500 hover:bg-cloud-50/70 hover:text-ink-900")}>
            <span aria-hidden className={cn("font-mono text-[0.6rem] tracking-[0.08em]", active ? "text-ink-900" : "text-ink-400")}>{item.icon ?? "·"}</span>
            {active && !compact ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
          </button>;
        })}
      </div>
    </nav>
  );
}

export function ContextualBottomBar({ items = DEFAULT_NAV_ITEMS, actions = [{ id: "move", label: "Move" }, { id: "archive", label: "Archive", tone: "strong" }], selectedCount = 0, value, defaultValue, onValueChange, onClearSelection, label = "Contextual bottom bar", className }: { items?: MobileNavItem[]; actions?: MobileAction[]; selectedCount?: number; value?: string; defaultValue?: string; onValueChange?: (id: string) => void; onClearSelection?: () => void; label?: string; className?: string }) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? "");
  const current = value ?? internal;
  const set = (id: string) => { if (value === undefined) setInternal(id); onValueChange?.(id); };
  const selectionMode = selectedCount > 0;
  return <div aria-label={label} data-mode={selectionMode ? "selection" : "navigation"} className={cn("w-full", className)} style={{ paddingBottom: SAFE_BOTTOM }}>
    <AnimatePresence initial={false} mode="popLayout">
      {selectionMode ? <motion.div key="selection" role="toolbar" aria-label="Selection actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mx-auto flex w-full max-w-md items-center gap-2 rounded-[20px] bg-ink-900 px-3 py-2 text-milk shadow-soft">
        <button type="button" onClick={onClearSelection} className="min-h-10 rounded-xl px-2 text-xs text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Cancel</button>
        <span className="mr-auto min-w-0 truncate text-xs"><strong>{selectedCount}</strong> selected</span>
        {actions.slice(0, 2).map((action) => <button key={action.id} type="button" onClick={action.onAction} className={cn("min-h-10 rounded-xl px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60", action.tone === "strong" ? "bg-white text-ink-900" : "bg-white/12 text-milk")}>{action.label}</button>)}
      </motion.div> : <motion.nav key="navigation" aria-label="Primary navigation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mx-auto flex w-full max-w-md items-center gap-1.5 rounded-[20px] border border-line bg-white/95 p-1.5 shadow-soft">
        {items.slice(0, 5).map((item) => <button key={item.id} type="button" aria-current={item.id === current ? "page" : undefined} onClick={() => set(item.id)} className={cn("min-h-11 min-w-0 flex-1 rounded-[14px] px-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", item.id === current ? "bg-cloud-50 font-medium text-ink-900" : "text-ink-500 hover:bg-cloud-50/70")}>{item.label}</button>)}
      </motion.nav>}
    </AnimatePresence>
  </div>;
}

export function ScrollCompactBottomNav({ items = DEFAULT_NAV_ITEMS, value, defaultValue, onValueChange, label = "Scroll compact navigation", className }: { items?: MobileNavItem[]; value?: string; defaultValue?: string; onValueChange?: (id: string) => void; label?: string; className?: string }) {
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);
  const restoreTimer = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const nextY = Math.max(0, window.scrollY);
      const delta = nextY - lastY.current;
      if (Math.abs(delta) >= 8) {
        if (restoreTimer.current) window.clearTimeout(restoreTimer.current);
        if (delta > 0 && nextY > 72) setCompact(true);
        if (delta < 0) setCompact(false);
        lastY.current = nextY;
      }
      restoreTimer.current = window.setTimeout(() => setCompact(false), 560);
    };
    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (restoreTimer.current) window.clearTimeout(restoreTimer.current); };
  }, []);
  return <div data-compact={compact} className={cn("transition-[transform,opacity] duration-300 motion-reduce:transition-none", compact ? "translate-y-1 opacity-90" : "translate-y-0 opacity-100", className)}><FloatingTabBar items={items} value={value} defaultValue={defaultValue} onValueChange={onValueChange} label={label} compact={compact} /></div>;
}

export function StickyBottomCTA({ label = "Continue", description = "Ready for the next step", pending = false, disabled = false, onAction, className }: { label?: string; description?: string; pending?: boolean; disabled?: boolean; onAction?: () => void; className?: string }) {
  return <div role="region" aria-label="Sticky bottom action" className={cn("sticky bottom-0 z-20 -mx-4 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur-sm", className)} style={{ paddingBottom: SAFE_BOTTOM }}><div className="mx-auto flex max-w-md items-center gap-3"><p className="min-w-0 flex-1 text-xs leading-relaxed text-ink-500">{description}</p><button type="button" disabled={disabled || pending} onClick={onAction} className="min-h-11 shrink-0 rounded-[14px] bg-ink-900 px-4 py-2 text-sm text-milk transition-transform active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:cursor-wait disabled:opacity-50">{pending ? "Working…" : label}</button></div></div>;
}

export function FloatingActionIsland({ actions = [{ id: "note", label: "New note" }, { id: "collection", label: "New collection" }], label = "Create", className }: { actions?: MobileAction[]; label?: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);
  const enabled = useMotionEnabled();
  useEffect(() => {
    const onScroll = () => { const y = window.scrollY; if (y - lastY.current > 10) setCompact(true); if (lastY.current - y > 10) setCompact(false); lastY.current = y; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div data-compact={compact} className={cn("flex justify-end", className)}><div className={cn("flex items-center gap-2 rounded-[18px] border border-line bg-white/95 p-1.5 shadow-soft transition-[width,background-color] duration-300 motion-reduce:transition-none", compact && !expanded ? "w-12" : "w-auto")}>
    <button type="button" aria-expanded={expanded} aria-label={expanded ? `Close ${label} actions` : `Open ${label} actions`} onClick={() => setExpanded((value) => !value)} className={cn("flex min-h-10 min-w-10 items-center justify-center rounded-[14px] px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", expanded ? "bg-cloud-50 text-ink-900" : "bg-ink-900 text-milk")}>{expanded ? "×" : "+"}<span className={cn("ml-2 whitespace-nowrap transition-[opacity,width]", compact && !expanded && "sr-only")}>{label}</span></button>
    <AnimatePresence initial={false}>{expanded ? <motion.div key="actions" initial={enabled ? { opacity: 0, width: 0 } : false} animate={{ opacity: 1, width: "auto" }} exit={enabled ? { opacity: 0, width: 0 } : undefined} className="flex min-w-0 items-center gap-1 overflow-hidden"><span aria-hidden className="mx-1 h-5 w-px bg-cloud-200" />{actions.slice(0, 3).map((action) => <button key={action.id} type="button" onClick={action.onAction} className="min-h-10 whitespace-nowrap rounded-[12px] px-2.5 text-xs text-ink-700 transition-colors hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">{action.label}</button>)}</motion.div> : null}</AnimatePresence>
  </div></div>;
}

export function SwipeToConfirm({ label = "Archive project", confirmLabel = "Release to cancel", onConfirm, className }: { label?: string; confirmLabel?: string; onConfirm?: () => void; className?: string }) {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const progressRef = useRef(0);
  const start = useRef<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const announceId = useId();
  const setProgressValue = (value: number) => { progressRef.current = value; setProgress(value); };
  const confirm = () => { setConfirmed(true); setProgressValue(1); onConfirm?.(); };
  const begin = (event: ReactPointerEvent<HTMLDivElement>) => { if (confirmed) return; start.current = event.clientX; event.currentTarget.setPointerCapture?.(event.pointerId); };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => { if (start.current === null || !track.current) return; const width = Math.max(track.current.clientWidth - 56, 1); const distance = Math.max(0, event.clientX - start.current); setProgressValue(Math.min(distance / width, 1)); if (event.cancelable) event.preventDefault(); };
  const end = (event: ReactPointerEvent<HTMLDivElement>) => { if (start.current === null) return; if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); if (progressRef.current >= 0.72) confirm(); else setProgressValue(0); start.current = null; };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); confirm(); } };
  return <div className={cn("space-y-2", className)}><div ref={track} role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-describedby={announceId} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={onKeyDown} className="relative min-h-12 touch-pan-y overflow-hidden rounded-[16px] border border-line bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"><div aria-hidden className="absolute inset-y-1 left-1 rounded-[12px] bg-blush-100 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `calc(${progress * 100}% - 0.5rem)` }} /><div className="relative z-10 flex min-h-12 items-center justify-between gap-3 px-3 text-xs"><span className="font-medium text-ink-900">{confirmed ? "Confirmed" : label}</span><span className="text-ink-500">{confirmed ? "Done" : progress > 0 ? confirmLabel : "Swipe →"}</span></div></div><p id={announceId} role="status" aria-live="polite" className="text-xs text-ink-500">{confirmed ? "Action confirmed." : "Swipe right, or focus and press Enter."}</p>{confirmed ? <button type="button" onClick={() => { setConfirmed(false); setProgressValue(0); }} className="text-xs text-ink-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Reset action</button> : null}</div>;
}

export function SearchMorphHeader({ title = "Explore", query, defaultQuery = "", onQueryChange, placeholder = "Search the collection", className }: { title?: string; query?: string; defaultQuery?: string; onQueryChange?: (value: string) => void; placeholder?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultQuery);
  const value = query ?? internal;
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const inputId = useId();
  const setValue = (next: string) => { if (query === undefined) setInternal(next); onQueryChange?.(next); };
  const close = () => { setOpen(false); window.requestAnimationFrame(() => trigger.current?.focus()); };
  useEffect(() => { if (open) window.requestAnimationFrame(() => input.current?.focus()); }, [open]);
  return <header role="search" className={cn("flex min-h-16 items-center gap-3 border-b border-line py-2", className)}><AnimatePresence initial={false} mode="popLayout">{open ? <motion.div key="search" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="flex min-w-0 flex-1 items-center gap-2"><label htmlFor={inputId} className="sr-only">{placeholder}</label><input ref={input} id={inputId} value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") close(); }} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent px-1 py-2 text-lg text-ink-900 outline-none placeholder:text-ink-400" /><button type="button" onClick={close} className={cn(CONTROL, "shrink-0 px-3 text-xs")}>Cancel</button></motion.div> : <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full items-center justify-between gap-3"><h2 className="min-w-0 truncate font-display text-xl font-semibold tracking-tight">{title}</h2><button ref={trigger} type="button" aria-expanded={false} onClick={() => setOpen(true)} className={cn(CONTROL, "shrink-0 bg-cloud-50 px-3 text-xs")}>Search</button></motion.div>}</AnimatePresence></header>;
}

export function KeyboardAwareComposer({ label = "Add a note", placeholder = "Write something useful…", onSubmit, className }: { label?: string; placeholder?: string; onSubmit?: (value: string) => void; className?: string }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  useEffect(() => { const viewport = window.visualViewport; if (!viewport) return; const update = () => setKeyboardOffset(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)); update(); viewport.addEventListener("resize", update); viewport.addEventListener("scroll", update); return () => { viewport.removeEventListener("resize", update); viewport.removeEventListener("scroll", update); }; }, []);
  const submit = () => { const next = value.trim(); if (!next) return; onSubmit?.(next); setValue(""); textarea.current?.focus(); };
  const style = { "--keyboard-offset": `${keyboardOffset}px`, paddingBottom: `max(${SAFE_BOTTOM}, calc(${SAFE_BOTTOM} + var(--keyboard-offset)))` } as CSSProperties;
  return <form aria-label={label} data-keyboard-offset={keyboardOffset} onSubmit={(event) => { event.preventDefault(); submit(); }} className={cn("sticky bottom-0 z-20 border-t border-line bg-white/95 px-3 pt-3 backdrop-blur-sm", className)} style={style}><label htmlFor={id} className="sr-only">{label}</label><div className={cn("mx-auto flex max-w-md items-end gap-2 rounded-[16px] border border-line bg-cloud-50 p-1.5 transition-[border-color,background-color]", focused && "border-ink-900/25 bg-white")}><textarea ref={textarea} id={id} value={value} rows={focused || value ? 3 : 1} onFocus={() => setFocused(true)} onBlur={() => { if (!value) setFocused(false); }} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); submit(); } }} placeholder={placeholder} className="min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400" /><button type="submit" disabled={!value.trim()} className="min-h-10 rounded-[12px] bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:opacity-40">Send</button></div><p className="mx-auto mt-2 max-w-md px-1 text-[0.65rem] text-ink-500">The surface follows the visual viewport; ⌘/Ctrl + Enter sends.</p></form>;
}

export type MobileSelectionItem = { id: string; label: string; meta?: string };
export function MobileSelectionBar({ items = [{ id: "one", label: "North star", meta: "Draft" }, { id: "two", label: "Release notes", meta: "Ready" }, { id: "three", label: "Research log", meta: "Shared" }], onAction, className }: { items?: MobileSelectionItem[]; onAction?: (ids: string[]) => void; className?: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <div className={cn("space-y-3", className)}><div className="grid gap-2">{items.map((item) => { const active = selected.includes(item.id); return <button key={item.id} type="button" aria-label={item.meta ? `${item.label}, ${item.meta}` : item.label} aria-pressed={active} onClick={() => toggle(item.id)} className={cn("min-h-14 rounded-[16px] border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", active ? "border-ink-900/30 bg-blush-50" : "border-line bg-white hover:bg-cloud-50")}><span className="block text-sm font-medium text-ink-900">{item.label}</span><span className="mt-1 block text-xs text-ink-500">{active ? "Selected" : item.meta ?? "Available"}</span></button>; })}</div><AnimatePresence initial={false}>{selected.length ? <motion.div role="toolbar" aria-label="Mobile selection actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="sticky bottom-0 z-10 flex items-center gap-2 rounded-[18px] bg-ink-900 px-3 py-2 text-milk" style={{ paddingBottom: SAFE_BOTTOM }}><span className="mr-auto text-xs"><strong>{selected.length}</strong> selected</span><button type="button" onClick={() => setSelected([])} className="min-h-10 rounded-xl px-2 text-xs text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Clear</button><button type="button" onClick={() => onAction?.(selected)} className="min-h-10 rounded-xl bg-white px-3 py-2 text-xs text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Move</button></motion.div> : null}</AnimatePresence></div>;
}

export function ProgressiveAuthSurface({ className }: { className?: string }) {
  const [step, setStep] = useState<"identity" | "method" | "code" | "complete">("identity");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const id = useId();
  const copy = step === "identity" ? "Start with your identity." : step === "method" ? "Choose the calmest way in." : step === "code" ? "Enter the six character code." : "You are ready to continue.";
  return <section aria-label="Progressive authentication" className={cn("rounded-[22px] border border-line bg-white p-5 shadow-soft", className)}><div className="flex items-center justify-between gap-3"><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Access / {step}</p><span className="text-xs text-ink-500">{step === "identity" ? "01" : step === "method" ? "02" : step === "code" ? "03" : "04"} / 04</span></div><h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{copy}</h3><p className="mt-2 text-sm leading-relaxed text-ink-700">Only the next useful decision appears; your previous choice stays attached to this surface.</p><div className="mt-6" aria-live="polite">
    {step === "identity" ? <form onSubmit={(event) => { event.preventDefault(); if (email.trim()) setStep("method"); }}><label htmlFor={`${id}-email`} className="block text-xs font-medium text-ink-700">Email address</label><input id={`${id}-email`} type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} placeholder="you@example.com" className="mt-2 min-h-11 w-full rounded-[14px] border border-line bg-cloud-50 px-3 text-sm outline-none focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10" /><button type="submit" className="mt-4 min-h-11 w-full rounded-[14px] bg-ink-900 px-4 text-sm text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Continue</button></form> : null}
    {step === "method" ? <div className="grid gap-2"><button type="button" onClick={() => setStep("complete")} className={cn(CONTROL, "flex w-full items-center justify-between bg-cloud-50 text-left")}>Use a passkey <span aria-hidden>↗</span></button><button type="button" onClick={() => setStep("code")} className={cn(CONTROL, "flex w-full items-center justify-between text-left")}>Send a verification code <span aria-hidden>→</span></button><button type="button" onClick={() => setStep("identity")} className="mt-2 text-left text-xs text-ink-500 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Back to identity</button></div> : null}
    {step === "code" ? <form onSubmit={(event) => { event.preventDefault(); if (code.trim().length >= 4) setStep("complete"); }}><label htmlFor={`${id}-code`} className="block text-xs font-medium text-ink-700">Verification code</label><input id={`${id}-code`} inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.currentTarget.value)} placeholder="••••••" className="mt-2 min-h-11 w-full rounded-[14px] border border-line bg-cloud-50 px-3 text-center font-mono tracking-[0.3em] outline-none focus:border-ink-900/30 focus:ring-2 focus:ring-ink-900/10" /><div className="mt-4 flex items-center justify-between gap-3"><button type="button" onClick={() => setStep("method")} className={cn(CONTROL, "text-xs")}>Back</button><button type="submit" className="min-h-11 flex-1 rounded-[14px] bg-ink-900 px-4 py-2 text-sm text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Verify</button></div></form> : null}
    {step === "complete" ? <div className="rounded-[16px] bg-cloud-50 p-4"><p className="font-medium text-ink-900">Welcome back.</p><p className="mt-1 text-sm text-ink-700">Access continues without replacing the surface.</p><button type="button" onClick={() => setStep("identity")} className="mt-4 text-xs text-ink-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Start again</button></div> : null}
  </div></section>;
}

export function AuthCompletionMorph({ className }: { className?: string }) {
  const [phase, setPhase] = useState<"ready" | "verifying" | "complete">("ready");
  const enabled = useMotionEnabled();
  useEffect(() => { if (phase !== "verifying") return; const timer = window.setTimeout(() => setPhase("complete"), 720); return () => window.clearTimeout(timer); }, [phase]);
  return <section aria-label="Authentication completion" className={cn("min-h-48 rounded-[22px] border border-line bg-white p-5 shadow-soft", className)}><AnimatePresence initial={false} mode="wait">
    {phase === "ready" ? <motion.div key="ready" initial={enabled ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} exit={enabled ? { opacity: 0, y: -6 } : undefined}><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Account / ready</p><h3 className="mt-4 font-display text-xl font-semibold">Keep the welcome in place.</h3><p className="mt-2 text-sm text-ink-700">The same surface will acknowledge completion.</p><button type="button" onClick={() => setPhase("verifying")} className="mt-6 min-h-11 rounded-[14px] bg-ink-900 px-4 py-2 text-sm text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Complete sign in</button></motion.div> : null}
    {phase === "verifying" ? <motion.div key="verifying" initial={enabled ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} exit={enabled ? { opacity: 0, y: -6 } : undefined} role="status" aria-live="polite"><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Account / verifying</p><h3 className="mt-4 font-display text-xl font-semibold">Checking your access.</h3><p className="mt-2 text-sm text-ink-700">One quiet state change, no full-screen replacement.</p></motion.div> : null}
    {phase === "complete" ? <motion.div key="complete" initial={enabled ? { opacity: 0, scale: .98 } : false} animate={{ opacity: 1, scale: 1 }} role="status" aria-live="polite"><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Account / complete</p><h3 className="mt-4 font-display text-xl font-semibold">Welcome in.</h3><p className="mt-2 text-sm text-ink-700">The result owns the same spatial surface as the action.</p><button type="button" onClick={() => setPhase("ready")} className="mt-6 text-xs text-ink-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Run again</button></motion.div> : null}
  </AnimatePresence></section>;
}
