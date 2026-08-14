"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../internal/cn";

export type ToastTone = "info" | "success" | "error";
export type ToastInput = { id?: string; title: string; description?: string; tone?: ToastTone; duration?: number; action?: { label: string; onClick: () => void } };
type ToastItem = ToastInput & { id: string };
type ToastApi = { toast: (input: ToastInput) => string; update: (id: string, input: Partial<ToastInput>) => void; dismiss: (id: string) => void };
const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children, max = 4 }: { children: ReactNode; max?: number }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: string) => setItems((value) => value.filter((item) => item.id !== id)), []);
  const api = useMemo<ToastApi>(() => ({
    toast(input) { const id = input.id ?? crypto.randomUUID(); setItems((value) => [...value.filter((item) => item.id !== id), { ...input, id }].slice(-max)); return id; },
    update(id, input) { setItems((value) => value.map((item) => item.id === id ? { ...item, ...input, id } : item)); },
    dismiss,
  }), [dismiss, max]);
  return <ToastContext.Provider value={api}>{children}<ToastViewport items={items} dismiss={dismiss} /></ToastContext.Provider>;
}
export function useToast() { const value = useContext(ToastContext); if (!value) throw new Error("useToast must be used within ToastProvider"); return value; }

function ToastViewport({ items, dismiss }: { items: ToastItem[]; dismiss: (id: string) => void }) {
  const motionEnabled = useMotionEnabled();
  return <div aria-label="Notifications" className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"><AnimatePresence initial={false}>{items.map((item) => <ToastCard key={item.id} item={item} dismiss={dismiss} motionEnabled={motionEnabled} />)}</AnimatePresence></div>;
}
function ToastCard({ item, dismiss, motionEnabled }: { item: ToastItem; dismiss: (id: string) => void; motionEnabled: boolean }) {
  const [paused, setPaused] = useState(false); const remaining = useRef(item.duration ?? 5000); const started = useRef(Date.now());
  useEffect(() => { if (paused || item.duration === 0) return; started.current = Date.now(); const timer = window.setTimeout(() => dismiss(item.id), remaining.current); return () => { clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (Date.now() - started.current)); }; }, [dismiss, item.duration, item.id, paused]);
  return <motion.div role={item.tone === "error" ? "alert" : "status"} aria-label={item.title} aria-atomic="true" drag={motionEnabled ? "x" : false} dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 80) dismiss(item.id); }} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} initial={motionEnabled ? { opacity: 0, y: 12, scale: .98 } : false} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 32 }} className="pointer-events-auto rounded-2xl border border-line bg-white p-4 shadow-xl"><div className="flex gap-3"><span aria-hidden>{item.tone === "success" ? "✓" : item.tone === "error" ? "!" : "i"}</span><div className="min-w-0 flex-1"><p className="font-medium">{item.title}</p>{item.description ? <p className="mt-1 text-sm text-ink-700">{item.description}</p> : null}<div className="mt-3 flex gap-3">{item.action ? <button type="button" onClick={item.action.onClick} className="text-sm font-semibold">{item.action.label}</button> : null}<button type="button" onClick={() => dismiss(item.id)} className="text-sm text-ink-500">Dismiss</button></div></div></div></motion.div>;
}

export function StatusPill({ label, state = "idle", progress, icon, className }: { label: string; state?: "idle" | "working" | "success" | "error"; progress?: number; icon?: ReactNode; className?: string }) {
  const value = progress == null ? undefined : Math.max(0, Math.min(100, progress));
  return <span role="status" className={cn("relative inline-flex min-w-24 items-center gap-2 overflow-hidden rounded-full border border-line bg-white px-3 py-1.5 text-sm", className)}>{value != null ? <motion.i aria-hidden className="absolute inset-y-0 left-0 bg-blush-100" animate={{ width: `${value}%` }} /> : null}<span className="relative" aria-hidden>{icon ?? (state === "success" ? "✓" : state === "error" ? "!" : state === "working" ? "◌" : "•")}</span><span className="relative">{label}</span>{value != null ? <span className="sr-only">{value}%</span> : null}</span>;
}
export function InlineFeedback({ children, tone = "info", onDismiss }: { children: ReactNode; tone?: ToastTone | "warning"; onDismiss?: () => void }) { return <div role={tone === "error" ? "alert" : "status"} className="flex items-center gap-2 rounded-xl bg-cloud-50 px-3 py-2 text-sm"><span aria-hidden>{tone === "success" ? "✓" : tone === "error" ? "!" : tone === "warning" ? "△" : "i"}</span><span className="flex-1">{children}</span>{onDismiss ? <button type="button" onClick={onDismiss} aria-label="Dismiss feedback">×</button> : null}</div>; }
export function ActionUndoBar({ message, onUndo, duration = 0, onExpire, className }: { message: string; onUndo: () => void; duration?: number; onExpire?: () => void; className?: string }) {
  const [remaining, setRemaining] = useState(duration); useEffect(() => { if (!duration) return; const started = Date.now(); const timer = window.setInterval(() => { const next = Math.max(0, duration - (Date.now() - started)); setRemaining(next); if (!next) { clearInterval(timer); onExpire?.(); } }, 250); return () => clearInterval(timer); }, [duration, onExpire]);
  return <div role="status" className={cn("flex items-center gap-4 rounded-2xl bg-ink-900 px-4 py-3 text-milk shadow-xl", className)}><span className="flex-1">{message}</span>{duration ? <span aria-hidden className="font-mono text-xs">{Math.ceil(remaining / 1000)}s</span> : null}<button type="button" onClick={onUndo} className="rounded-full bg-white/15 px-3 py-1.5 font-semibold">Undo</button></div>;
}

export * from "./response-expansion";
