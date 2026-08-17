"use client";

import { AnimatePresence, motion } from "motion/react";
import { GridReveal, useMotionEnabled } from "@pinky-ui/primitives";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type ReactNode,
} from "react";

import { cn } from "../internal/cn";

type Placement = "top" | "bottom" | "left" | "right";
type SurfacePosition = { left: number; top: number; placement: Placement };

const SURFACE = "rounded-2xl border border-line bg-white/95 p-4 shadow-xl backdrop-blur-sm";
const CONTROL = "min-h-9 rounded-xl border border-line bg-white px-3 py-2 text-left text-sm text-ink-900 transition-colors hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 active:scale-[.99]";

const DEFAULT_INSPECTOR_ITEMS = [
  { id: "hero", label: "Hero surface", meta: "Editorial / 01", value: "Fluid content", description: "A responsive source surface with one nearby context." },
  { id: "rail", label: "Focus rail", meta: "Layout / 02", value: "Quiet density", description: "A narrow reading lane that keeps supporting actions close." },
  { id: "media", label: "Media study", meta: "Media / 03", value: "Shared frame", description: "A selected object can be inspected without leaving its collection." },
] as const;

type AnchorLike = { id: string; label: string; meta?: string; value?: string; description?: string };

function useFloatingPosition(
  anchorRef: RefObject<HTMLElement | null>,
  boundaryRef: RefObject<HTMLElement | null>,
  open: boolean,
  preferred: Placement = "bottom",
  estimated = { width: 248, height: 176 },
) {
  const [position, setPosition] = useState<SurfacePosition | null>(null);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const anchor = anchorRef.current;
      const boundary = boundaryRef.current;
      if (!anchor || !boundary) return;
      const anchorRect = anchor.getBoundingClientRect();
      const boundaryRect = boundary.getBoundingClientRect();
      const boundaryWidth = Math.max(boundary.clientWidth, boundaryRect.width);
      const boundaryHeight = Math.max(boundary.clientHeight, boundaryRect.height);
      const local = {
        left: anchorRect.left - boundaryRect.left,
        top: anchorRect.top - boundaryRect.top,
        right: anchorRect.right - boundaryRect.left,
        bottom: anchorRect.bottom - boundaryRect.top,
      };
      const gap = 10;
      const space = {
        top: local.top,
        bottom: boundaryHeight - local.bottom,
        left: local.left,
        right: boundaryWidth - local.right,
      };
      let placement = preferred;
      if (placement === "bottom" && space.bottom < estimated.height + gap && space.top > space.bottom) placement = "top";
      if (placement === "top" && space.top < estimated.height + gap && space.bottom > space.top) placement = "bottom";
      if (placement === "right" && space.right < estimated.width + gap && space.left > space.right) placement = "left";
      if (placement === "left" && space.left < estimated.width + gap && space.right > space.left) placement = "right";
      const rawLeft = placement === "right" ? local.right + gap : placement === "left" ? local.left - estimated.width - gap : local.left + (anchorRect.width - estimated.width) / 2;
      const rawTop = placement === "bottom" ? local.bottom + gap : placement === "top" ? local.top - estimated.height - gap : local.top + (anchorRect.height - estimated.height) / 2;
      setPosition({
        left: Math.min(Math.max(8, rawLeft), Math.max(8, boundaryWidth - estimated.width - 8)),
        top: Math.min(Math.max(8, rawTop), Math.max(8, boundaryHeight - estimated.height - 8)),
        placement,
      });
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [anchorRef, boundaryRef, estimated.height, estimated.width, open, preferred]);

  return position;
}

function useSurfaceLifecycle(
  open: boolean,
  onClose: () => void,
  rootRef: RefObject<HTMLElement | null>,
  surfaceRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
) {
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      if (previous.current?.isConnected) previous.current.focus();
      previous.current = null;
      return;
    }
    const active = document.activeElement;
    if (active instanceof HTMLElement && !surfaceRef.current?.contains(active)) previous.current = active;
    const focusFrame = window.requestAnimationFrame(() => {
      const first = surfaceRef.current?.querySelector<HTMLElement>("button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])");
      (first ?? surfaceRef.current)?.focus();
    });
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (rootRef.current && event.target instanceof Node && !rootRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose, open, rootRef, surfaceRef, triggerRef]);

  useEffect(() => {
    if (!open && triggerRef.current && document.activeElement === document.body) triggerRef.current.focus();
  }, [open, triggerRef]);
}

function surfaceStyle(position: SurfacePosition | null): CSSProperties | undefined {
  return position ? { left: position.left, top: position.top } : undefined;
}

export type AnchoredInspectorItem = AnchorLike;
export function AnchoredInspector({ items = DEFAULT_INSPECTOR_ITEMS, className }: { items?: readonly AnchoredInspectorItem[]; className?: string }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((item) => item.id === activeId);
  const inspectorId = useId();
  return <div className={cn("grid gap-3 sm:grid-cols-[minmax(0,1fr)_15rem]", className)}>
    <div role="list" aria-label="Inspectable surfaces" className="grid gap-2">
      {items.map((item) => <button key={item.id} type="button" aria-pressed={item.id === activeId} aria-expanded={item.id === activeId} aria-controls={inspectorId} onClick={() => setActiveId(item.id)} className={cn("flex items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", item.id === activeId ? "border-ink-900 bg-blush-50" : "border-line bg-white hover:bg-cloud-50")}><span className="min-w-0"><span className="block truncate font-medium">{item.label}</span>{item.meta ? <span className="mt-0.5 block truncate text-xs text-ink-500">{item.meta}</span> : null}</span><span aria-hidden className="text-ink-400">↗</span></button>)}
    </div>
    {active ? <aside id={inspectorId} aria-label={`${active.label} inspector`} className="rounded-xl border border-ink-900/10 bg-ink-900 p-4 text-milk"><p className="font-mono text-[0.62rem] tracking-[0.16em] text-white/55 uppercase">Inspector</p><h3 className="mt-3 text-base font-semibold">{active.label}</h3><p className="mt-1 text-xs text-white/65">{active.description ?? "Context stays next to the selected source."}</p><div className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-sm"><span className="text-white/55">State</span><strong className="ml-2">{active.value ?? "Ready"}</strong></div></aside> : null}
  </div>;
}

export function AdaptivePopover({ label = "Open context", title = "Nearby context", children, className }: { label?: string; title?: string; children?: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null); const surface = useRef<HTMLDivElement>(null); const [open, setOpen] = useState(false); const id = useId(); const motionEnabled = useMotionEnabled();
  const close = useCallback(() => setOpen(false), []);
  const position = useFloatingPosition(trigger, root, open, "bottom", { width: 248, height: 178 });
  useSurfaceLifecycle(open, close, root, surface, trigger);
  return <div ref={root} className={cn("relative min-h-44 overflow-visible rounded-2xl border border-line bg-cloud-50 p-5", className)}><button ref={trigger} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)} className={CONTROL}>{label}<span aria-hidden className="ml-2 text-ink-400">⌄</span></button><AnimatePresence>{open ? <motion.div ref={surface} id={id} role="dialog" aria-label={title} tabIndex={-1} initial={motionEnabled ? { opacity: 0, scale: .97, y: -4 } : false} animate={{ opacity: 1, scale: 1, y: 0 }} exit={motionEnabled ? { opacity: 0, scale: .97 } : undefined} style={surfaceStyle(position)} className={cn(SURFACE, "absolute z-20 w-[min(15.5rem,calc(100%-1rem))]")}><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Adaptive surface</p><h3 className="mt-2 text-sm font-semibold">{title}</h3></div><button type="button" aria-label="Close context" onClick={close} className="rounded-lg px-2 py-1 text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">×</button></div><div className="mt-3 text-sm leading-relaxed text-ink-700">{children ?? "The surface flips or shifts to stay inside its local boundary."}</div><p className="mt-3 text-xs text-ink-500">{position?.placement ?? "measuring"} placement</p></motion.div> : null}</AnimatePresence></div>;
}

export function ContextMenuSurface({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null); const target = useRef<HTMLButtonElement>(null); const surface = useRef<HTMLDivElement>(null); const [open, setOpen] = useState(false); const [point, setPoint] = useState({ left: 12, top: 58 }); const id = useId(); const motionEnabled = useMotionEnabled();
  const close = useCallback(() => setOpen(false), []);
  useSurfaceLifecycle(open, close, root, surface, target);
  const openBelow = () => { const node = root.current; const anchor = target.current; if (!node || !anchor) return; const boundary = node.getBoundingClientRect(); const rect = anchor.getBoundingClientRect(); setPoint({ left: Math.max(8, rect.left - boundary.left), top: Math.min(node.clientHeight - 160, rect.bottom - boundary.top + 8) }); setOpen(true); };
  const openAtPointer = (event: ReactPointerEvent<HTMLButtonElement>) => { event.preventDefault(); const boundary = root.current?.getBoundingClientRect(); if (!boundary) return; setPoint({ left: Math.min(Math.max(8, event.clientX - boundary.left), Math.max(8, (root.current?.clientWidth ?? 280) - 220)), top: Math.min(Math.max(8, event.clientY - boundary.top), Math.max(8, (root.current?.clientHeight ?? 240) - 156)) }); setOpen(true); };
  return <div ref={root} className={cn("relative min-h-52 overflow-visible rounded-2xl border border-dashed border-ink-900/20 bg-white p-5", className)}><button ref={target} type="button" aria-expanded={open} aria-controls={id} onClick={openBelow} onContextMenu={openAtPointer} className="flex min-h-28 w-full items-center justify-center rounded-xl border border-line bg-cloud-50 text-sm font-medium text-ink-800 transition-colors hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Right-click or open actions</button><AnimatePresence>{open ? <motion.div ref={surface} id={id} role="region" aria-label="Context actions" tabIndex={-1} initial={motionEnabled ? { opacity: 0, scale: .96 } : false} animate={{ opacity: 1, scale: 1 }} exit={motionEnabled ? { opacity: 0, scale: .96 } : undefined} style={{ left: point.left, top: point.top }} className={cn(SURFACE, "absolute z-20 w-52 p-2")}><p className="px-2 py-1 text-xs text-ink-500">Document actions</p><button type="button" className={cn("block w-full", CONTROL)} onClick={close}>Rename surface</button><button type="button" className={cn("mt-1 block w-full", CONTROL)} onClick={close}>Duplicate view</button></motion.div> : null}</AnimatePresence></div>;
}

export type SelectionToolbarItem = { id: string; label: string; meta?: string };
export function SelectionToolbar({ items = [{ id: "one", label: "North star", meta: "Draft" }, { id: "two", label: "Release notes", meta: "Ready" }, { id: "three", label: "Research log", meta: "Shared" }], className }: { items?: SelectionToolbarItem[]; className?: string }) {
  const [selected, setSelected] = useState<string[]>([]); const [message, setMessage] = useState("Select an item to reveal its local actions.");
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  const clear = () => { setSelected([]); setMessage("Selection cleared."); };
  return <div className={cn("space-y-3", className)}><div className="grid gap-2 sm:grid-cols-3">{items.map((item) => { const active = selected.includes(item.id); return <button key={item.id} type="button" aria-pressed={active} onClick={() => toggle(item.id)} className={cn("rounded-xl border p-3 text-left transition-[border-color,background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", active ? "border-ink-900 bg-blush-50" : "border-line bg-white hover:bg-cloud-50")}><span className="block text-sm font-medium">{item.label}</span><span className="mt-1 block text-xs text-ink-500">{active ? "Selected" : item.meta ?? "Available"}</span></button>; })}</div><AnimatePresence initial={false}>{selected.length ? <motion.div role="toolbar" aria-label="Selection toolbar" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="flex flex-wrap items-center gap-2 rounded-xl border border-ink-900/10 bg-ink-900 px-3 py-2 text-milk"><span className="mr-auto text-xs"><strong>{selected.length}</strong> selected</span><button type="button" onClick={() => setMessage("Moved to a new collection.")} className="rounded-lg bg-white/12 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Move</button><button type="button" onClick={() => setMessage("Archive action is ready.")} className="rounded-lg bg-white px-3 py-2 text-xs text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Archive</button><button type="button" onClick={clear} className="rounded-lg px-2 py-2 text-xs text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Clear</button></motion.div> : null}</AnimatePresence><p role="status" aria-live="polite" className="text-xs text-ink-500">{message}</p></div>;
}

export function PeekOverlay({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null); const anchor = useRef<HTMLButtonElement>(null); const surface = useRef<HTMLDivElement>(null); const [active, setActive] = useState("brief"); const [open, setOpen] = useState(false); const id = useId(); const motionEnabled = useMotionEnabled();
  const close = useCallback(() => setOpen(false), []); const position = useFloatingPosition(anchor, root, open, "right", { width: 234, height: 150 }); useSurfaceLifecycle(open, close, root, surface, anchor);
  const details: Record<string, { label: string; meta: string }> = { brief: { label: "Project brief", meta: "A short read with three linked decisions." }, notes: { label: "Release notes", meta: "The latest changes stay visible behind the peek." } };
  return <div ref={root} className={cn("relative min-h-48 rounded-2xl border border-line bg-cloud-50 p-4", className)}><div className="grid gap-2 sm:w-1/2">{Object.entries(details).map(([key, item]) => <button key={key} ref={key === active ? anchor : undefined} type="button" aria-expanded={open && key === active} aria-controls={id} onClick={() => { setActive(key); setOpen(true); }} className={cn("rounded-xl border bg-white px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", active === key && open ? "border-ink-900" : "border-line hover:bg-blush-50")}><span className="block text-sm font-medium">{item.label}</span><span className="mt-1 block text-xs text-ink-500">Peek without leaving the source</span></button>)}</div><AnimatePresence>{open ? <motion.div ref={surface} id={id} role="dialog" aria-label={`${details[active]?.label ?? "Item"} preview`} tabIndex={-1} initial={motionEnabled ? { opacity: 0, x: 6 } : false} animate={{ opacity: 1, x: 0 }} exit={motionEnabled ? { opacity: 0, x: 6 } : undefined} style={surfaceStyle(position)} className={cn(SURFACE, "absolute z-20 w-[min(14.5rem,calc(100%-2rem))]")}><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Peek</p><h3 className="mt-2 text-sm font-semibold">{details[active]?.label}</h3></div><button type="button" aria-label="Close peek" onClick={close} className="rounded-lg px-2 py-1 text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">×</button></div><p className="mt-3 text-sm leading-relaxed text-ink-700">{details[active]?.meta}</p><button type="button" onClick={close} className="mt-3 text-xs font-medium underline underline-offset-4">Keep reading</button></motion.div> : null}</AnimatePresence></div>;
}

export function NestedSurfaceStack({ className }: { className?: string }) {
  const [stack, setStack] = useState<string[]>([]); const trigger = useRef<HTMLButtonElement>(null); const surface = useRef<HTMLDivElement>(null); const root = useRef<HTMLDivElement>(null); const motionEnabled = useMotionEnabled();
  const close = useCallback(() => setStack([]), []); useSurfaceLifecycle(stack.length > 0, close, root, surface, trigger);
  const current = stack.at(-1); const labels: Record<string, string> = { account: "Account surface", access: "Access details", billing: "Billing details" };
  return <div ref={root} className={cn("relative min-h-48 rounded-2xl border border-line bg-white p-5", className)}><button ref={trigger} type="button" aria-expanded={stack.length > 0} onClick={() => setStack(["account"])} className={CONTROL}>Open layered settings</button><AnimatePresence mode="wait">{current ? <motion.div ref={surface} role="dialog" aria-label={labels[current]} tabIndex={-1} initial={motionEnabled ? { opacity: 0, x: 12 } : false} animate={{ opacity: 1, x: 0 }} exit={motionEnabled ? { opacity: 0, x: 12 } : undefined} className={cn(SURFACE, "absolute top-16 right-4 z-20 w-[min(17rem,calc(100%-2rem))]")}><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Layer {stack.length}</p><h3 className="mt-2 text-sm font-semibold">{labels[current]}</h3></div><button type="button" aria-label="Close layered surface" onClick={close} className="rounded-lg px-2 py-1 text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">×</button></div><p className="mt-3 text-sm leading-relaxed text-ink-700">Each layer has its own context; Back returns to the same parent surface.</p><div className="mt-4 flex flex-wrap gap-2">{stack.length > 1 ? <button type="button" onClick={() => setStack((value) => value.slice(0, -1))} className={CONTROL}>Back</button> : null}{stack.length === 1 ? <button type="button" onClick={() => setStack(["account", "access"])} className={cn(CONTROL, "bg-blush-50")}>Open access</button> : null}{stack.length === 2 ? <button type="button" onClick={() => setStack(["account", "access", "billing"])} className={cn(CONTROL, "bg-cloud-50")}>Open billing</button> : null}</div></motion.div> : null}</AnimatePresence></div>;
}

export function SpotlightOverlay({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null); const root = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null); const surface = useRef<HTMLDivElement>(null); const motionEnabled = useMotionEnabled();
  const close = useCallback(() => setActive(null), []); useSurfaceLifecycle(active !== null, close, root, surface, trigger);
  const targets = ["Primary action", "Supporting detail", "Quiet escape"];
  return <div ref={root} className={cn("relative min-h-56 overflow-hidden rounded-2xl border border-line bg-cloud-50 p-5", className)}><div className="grid gap-2 sm:grid-cols-3">{targets.map((label, index) => <button key={label} ref={index === 0 ? trigger : undefined} type="button" onClick={() => setActive(index)} aria-expanded={active === index} className={cn("rounded-xl border bg-white p-4 text-left text-sm transition-[transform,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", active === index ? "border-ink-900" : "border-line hover:-translate-y-0.5")}><span className="block font-medium">{label}</span><span className="mt-1 block text-xs text-ink-500">Focus this target</span></button>)}</div><AnimatePresence>{active !== null ? <motion.div role="presentation" initial={motionEnabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} exit={motionEnabled ? { opacity: 0 } : undefined} className="absolute inset-0 z-10 bg-ink-900/25 p-4 sm:p-5"><motion.div ref={surface} role="dialog" aria-modal="false" aria-label="Spotlight context" tabIndex={-1} initial={motionEnabled ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0 }} exit={motionEnabled ? { opacity: 0, y: 12 } : undefined} className={cn(SURFACE, "mx-auto mt-20 max-w-sm")}><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Spotlight</p><h3 className="mt-2 text-sm font-semibold">{targets[active]} stays in context</h3></div><button type="button" aria-label="Close spotlight" onClick={close} className="rounded-lg px-2 py-1 text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">×</button></div><p className="mt-3 text-sm leading-relaxed text-ink-700">A soft scrim reduces noise while the chosen source remains the reason for the layer.</p></motion.div></motion.div> : null}</AnimatePresence></div>;
}

export function CursorActionSurface({ className }: { className?: string }) {
  const [active, setActive] = useState("surface"); const [point, setPoint] = useState({ left: 64, top: 42 }); const [pinned, setPinned] = useState(false); const motionEnabled = useMotionEnabled();
  const update = (event: ReactPointerEvent<HTMLElement>, id: string) => { const rect = event.currentTarget.getBoundingClientRect(); setPoint({ left: Math.min(82, Math.max(18, ((event.clientX - rect.left) / rect.width) * 100)), top: Math.min(72, Math.max(28, ((event.clientY - rect.top) / rect.height) * 100)) }); setActive(id); };
  return <div className={cn("relative min-h-56 overflow-hidden rounded-2xl border border-line bg-ink-900 p-4 text-milk", className)} onPointerMove={(event) => { if (!pinned) update(event, active); }} onPointerLeave={() => { if (!pinned) setActive(""); }}><div className="grid h-full gap-2 sm:grid-cols-3">{["surface", "image", "note"].map((id) => <button key={id} type="button" onPointerEnter={(event) => update(event, id)} onFocus={() => setActive(id)} onClick={() => setPinned((value) => !value)} aria-pressed={pinned && active === id} className="min-h-28 rounded-xl border border-white/15 bg-white/8 p-3 text-left text-sm transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"><span className="block font-medium">{id === "surface" ? "Surface" : id === "image" ? "Image" : "Note"}</span><span className="mt-1 block text-xs text-white/55">{pinned && active === id ? "Pinned actions" : "Move across"}</span></button>)}</div><AnimatePresence>{active ? <motion.div initial={motionEnabled ? { opacity: 0, scale: .92 } : false} animate={{ opacity: 1, scale: 1 }} exit={motionEnabled ? { opacity: 0, scale: .92 } : undefined} style={{ left: `${point.left}%`, top: `${point.top}%` }} className="absolute z-10 w-40 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-2 text-ink-900 shadow-2xl"><p className="px-2 py-1 text-xs text-ink-500">{active} actions</p><button type="button" className="block min-h-9 w-full rounded-lg px-2 py-2 text-left text-xs hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Inspect layer</button><button type="button" onClick={() => setPinned(false)} className="mt-1 block min-h-9 w-full rounded-lg px-2 py-2 text-left text-xs hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Release surface</button></motion.div> : null}</AnimatePresence><p className="absolute right-4 bottom-3 text-[0.65rem] text-white/50">{pinned ? "Tap the source to release" : "Pointer follows · tap pins"}</p></div>;
}

export function EdgeDockedPanel({ className }: { className?: string }) {
  const [open, setOpen] = useState(false); const root = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null); const surface = useRef<HTMLDivElement>(null); const motionEnabled = useMotionEnabled(); const close = useCallback(() => setOpen(false), []); useSurfaceLifecycle(open, close, root, surface, trigger);
  return <div ref={root} className={cn("grid min-h-52 gap-3 rounded-2xl border border-line bg-cloud-50 p-4 lg:grid-cols-[minmax(0,1fr)_auto]", className)}><div className="min-w-0 rounded-xl bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Workspace</p><h3 className="mt-2 text-sm font-semibold">The content makes room</h3></div><button ref={trigger} type="button" aria-expanded={open} aria-controls="edge-docked-panel" onClick={() => setOpen((value) => !value)} className={CONTROL}>{open ? "Close panel" : "Open panel"}</button></div><p className="mt-6 max-w-md text-sm leading-relaxed text-ink-700">On wide screens the panel docks beside this surface. On touch it becomes an inline continuation, so it never hides the page behind a drawer.</p></div><AnimatePresence>{open ? <motion.aside ref={surface} id="edge-docked-panel" role="region" aria-label="Docked context panel" initial={motionEnabled ? { opacity: 0, x: 10 } : false} animate={{ opacity: 1, x: 0 }} exit={motionEnabled ? { opacity: 0, x: 10 } : undefined} className="min-w-52 rounded-xl border border-ink-900/10 bg-ink-900 p-4 text-milk lg:w-56"><p className="font-mono text-[0.62rem] tracking-[0.14em] text-white/55 uppercase">Docked context</p><p className="mt-3 text-sm leading-relaxed text-white/80">A side-by-side continuation, not a viewport-level interruption.</p><button type="button" onClick={close} className="mt-5 min-h-9 rounded-lg bg-white px-3 py-2 text-xs text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Done</button></motion.aside> : null}</AnimatePresence></div>;
}

export function ExpandingActionSurface({ className }: { className?: string }) {
  const [open, setOpen] = useState(false); const root = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null); const surface = useRef<HTMLDivElement>(null); const close = useCallback(() => setOpen(false), []); useSurfaceLifecycle(open, close, root, surface, trigger);
  return <div ref={root} className={cn("min-h-28 rounded-2xl border border-line bg-white p-4", className)}><div className="flex flex-wrap items-center gap-3"><div className="mr-auto"><p className="text-sm font-medium">Project brief</p><p className="mt-1 text-xs text-ink-500">Actions expand from the object they affect.</p></div><button ref={trigger} type="button" aria-expanded={open} aria-controls="expanding-actions" onClick={() => setOpen((value) => !value)} className={cn(CONTROL, "bg-blush-50")}>{open ? "Close actions" : "More actions"}<span aria-hidden className="ml-2">⋯</span></button></div><GridReveal open={open} className="mt-3" contentRef={surface} contentProps={{ id: "expanding-actions", role: "toolbar", "aria-label": "Project actions", className: "flex flex-wrap gap-2 border-t border-line pt-3" }}><button type="button" className={CONTROL} onClick={close}>Duplicate</button><button type="button" className={CONTROL} onClick={close}>Move</button><button type="button" className={cn(CONTROL, "bg-ink-900 text-milk")} onClick={close}>Archive</button></GridReveal></div>;
}

export function FollowAnchorSurface({ className }: { className?: string }) {
  const [point, setPoint] = useState({ left: 38, top: 42 }); const [message, setMessage] = useState("Anchor ready");
  const nudge = (axis: "left" | "top", delta: number) => setPoint((current) => { const next = { ...current, [axis]: Math.min(78, Math.max(20, current[axis] + delta)) }; setMessage(`Anchor at ${Math.round(next.left)}% horizontal, ${Math.round(next.top)}% vertical`); return next; });
  const style = { left: `${point.left}%`, top: `${point.top}%` };
  return <div className={cn("relative min-h-60 overflow-hidden rounded-2xl border border-line bg-cloud-50 p-4", className)}><div className="absolute inset-4 rounded-xl border border-dashed border-ink-900/15" aria-hidden /><button type="button" aria-label="Followable anchor" onClick={() => nudge("left", 8)} style={style} className="absolute z-10 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush-200 text-xs font-semibold text-ink-900 shadow-soft transition-[left,top] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Anchor</button><div style={{ left: `${Math.min(72, Math.max(8, point.left + 10))}%`, top: `${Math.min(72, Math.max(8, point.top + 12))}%` }} className="absolute z-10 w-44 rounded-xl border border-ink-900/10 bg-white p-3 shadow-xl"><p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Follow anchor</p><p className="mt-2 text-xs leading-relaxed text-ink-700">The context stays with its moving source.</p><div className="mt-3 flex flex-wrap gap-1.5"><button type="button" onClick={() => nudge("left", -8)} className="min-h-9 min-w-9 rounded-lg border border-line px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">←</button><button type="button" onClick={() => nudge("top", -8)} className="min-h-9 min-w-9 rounded-lg border border-line px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">↑</button><button type="button" onClick={() => nudge("top", 8)} className="min-h-9 min-w-9 rounded-lg border border-line px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">↓</button><button type="button" onClick={() => nudge("left", 8)} className="min-h-9 min-w-9 rounded-lg border border-line px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">→</button></div></div><p role="status" aria-live="polite" className="absolute right-4 bottom-3 max-w-[65%] text-right text-[0.65rem] text-ink-500">{message}</p></div>;
}

export function SharedContextSurface({ className }: { className?: string }) {
  const sources = [{ id: "one", label: "Overview", detail: "One shared context surface is reused." }, { id: "two", label: "Signals", detail: "The same surface rebinds without a second layer." }, { id: "three", label: "History", detail: "Selection changes its content, not its ownership." }]; const [active, setActive] = useState(sources[0]!); const id = useId();
  return <div className={cn("grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]", className)}><div className="grid gap-2">{sources.map((source) => <button key={source.id} type="button" aria-selected={source.id === active.id} aria-controls={id} onClick={() => setActive(source)} className={cn("rounded-xl border px-3 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", source.id === active.id ? "border-ink-900 bg-blush-50" : "border-line bg-white hover:bg-cloud-50")}><span className="block font-medium">{source.label}</span><span className="mt-1 block text-xs text-ink-500">Rebind shared context</span></button>)}</div><aside id={id} role="region" aria-live="polite" aria-label="Shared context surface" className="rounded-xl border border-ink-900/10 bg-ink-900 p-4 text-milk"><p className="font-mono text-[0.62rem] tracking-[0.14em] text-white/55 uppercase">Shared surface</p><h3 className="mt-3 text-sm font-semibold">{active.label}</h3><p className="mt-2 text-xs leading-relaxed text-white/70">{active.detail}</p><span className="mt-4 block rounded-lg bg-white/10 px-3 py-2 text-xs">Surface identity preserved</span></aside></div>;
}

export function MorphingContextSurface({ className }: { className?: string }) {
  const [open, setOpen] = useState(false); const [value, setValue] = useState("A contextual note"); const trigger = useRef<HTMLButtonElement>(null); const input = useRef<HTMLInputElement>(null); const motionEnabled = useMotionEnabled();
  useEffect(() => { const frame = window.requestAnimationFrame(() => { if (open) input.current?.focus(); else trigger.current?.focus(); }); return () => window.cancelAnimationFrame(frame); }, [open]);
  return <div className={cn("min-h-32 rounded-2xl border border-line bg-white p-4", className)}><AnimatePresence initial={false}>{open ? <motion.div key="editor" layoutId="morphing-context" initial={motionEnabled ? { opacity: 0, scale: .97 } : false} animate={{ opacity: 1, scale: 1 }} exit={motionEnabled ? { opacity: 0, scale: .97 } : undefined} className="rounded-xl border border-ink-900/20 bg-blush-50 p-3"><label htmlFor="morphing-context-input" className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-500 uppercase">Context note</label><div className="mt-2 flex gap-2"><input ref={input} id="morphing-context-input" value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); if (event.key === "Enter") setOpen(false); }} className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink-900" /><button type="button" onClick={() => setOpen(false)} className="min-h-9 rounded-lg bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Done</button></div></motion.div> : <motion.button ref={trigger} key="resting" layoutId="morphing-context" type="button" onClick={() => setOpen(true)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-cloud-50 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"><span><span className="block text-xs text-ink-500">Context note</span><span className="mt-1 block truncate text-sm font-medium">{value}</span></span><span aria-hidden className="text-ink-400">↗</span></motion.button>}</AnimatePresence></div>;
}
