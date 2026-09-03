"use client";

import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

/**
 * Portalled to `document.body`: a `position: fixed` descendant of any
 * ancestor with a non-none `filter`/`backdrop-filter`/`transform` (e.g. this
 * site's header, which gains `backdrop-blur-xl` once scrolled) becomes fixed
 * relative to that ancestor instead of the viewport — the sheet would then
 * render squashed into the header's own box instead of covering the screen.
 * Portalling out of the header's subtree sidesteps that containing-block
 * rule entirely, regardless of what filters any future caller's ancestors use.
 */
export function BottomSheet({ open, defaultOpen = false, onOpenChange, snapPoints = [45, 85], title = "Sheet", children, className }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; snapPoints?: number[]; title?: string; children: ReactNode; className?: string }) { const [shown, setShown] = useControllable(open, defaultOpen, onOpenChange); const [snap, setSnap] = useState(0); const previous = useRef<HTMLElement | null>(null); const sheet = useRef<HTMLElement>(null); const titleId = useId(); const enabled = useMotionEnabled(); const [mounted, setMounted] = useState(false); useEffect(() => { setMounted(true); }, []); useEffect(() => { if (!shown) return; previous.current = document.activeElement as HTMLElement; sheet.current?.focus(); const key = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setShown(false); }; document.addEventListener("keydown", key); return () => { document.removeEventListener("keydown", key); }; }, [setShown, shown]); const onSheetKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => { if (event.key !== "Tab" || !sheet.current) return; const focusable = [...sheet.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])")]; if (!focusable.length) { event.preventDefault(); return; } const first = focusable[0]; const last = focusable[focusable.length - 1]; if (!first || !last) return; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }; const content = <AnimatePresence onExitComplete={() => { if (!shown) { previous.current?.focus(); previous.current = null; } }}>{shown ? <motion.div className="fixed inset-0 z-[80] flex items-end bg-ink-900/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setShown(false); }}><motion.section ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} onKeyDown={onSheetKeyDown} drag={enabled ? "y" : false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={.18} dragMomentum={false} onDragEnd={(_, info) => { if (info.offset.y > 100) setShown(false); else if (info.offset.y < -70) setSnap(Math.min(snap + 1, snapPoints.length - 1)); }} initial={{ y: "100%" }} /* height: a real dvh-relative sheet height — the flex-1 scroll area and drag physics inside genuinely depend on it, not a visual-only size */ animate={{ y: 0, height: `${snapPoints[snap] ?? 45}dvh` }} exit={{ y: "100%" }} className={cn("flex w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl", className)}><div className="shrink-0 px-5 pt-5"><div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-cloud-200" /><div className="flex items-center justify-between"><h2 id={titleId} className="text-lg font-semibold">{title}</h2><button type="button" aria-label="Close sheet" onClick={() => setShown(false)} className="rounded-full p-2">×</button></div></div><div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>{children}</div></motion.section></motion.div> : null}</AnimatePresence>; if (!mounted) return null; return createPortal(content, document.body); }

export type SwipeTab = { id: string; label: string; panel: ReactNode };
export function SwipeableTabs({ tabs, index, defaultIndex = 0, onIndexChange, label = "Tabs", className }: { tabs: SwipeTab[]; index?: number; defaultIndex?: number; onIndexChange?: (index: number) => void; label?: string; className?: string }) { const [current, setCurrent] = useControllable(index, defaultIndex, onIndexChange); const start = useRef<number | null>(null); const set = (next: number) => setCurrent(Math.max(0, Math.min(tabs.length - 1, next))); const active = tabs[current]; return <div className={className}><div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-line">{tabs.map((tab, tabIndex) => <button key={tab.id} type="button" role="tab" aria-selected={tabIndex === current} onClick={() => set(tabIndex)} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); set(tabIndex + (event.key === "ArrowRight" ? 1 : -1)); } }} className={cn("shrink-0 border-b-2 px-4 py-3 text-sm", tabIndex === current ? "border-ink-900 font-semibold" : "border-transparent text-ink-500")}>{tab.label}</button>)}</div><motion.div role="tabpanel" tabIndex={0} onPointerDown={(event) => { start.current = event.clientX; }} onPointerUp={(event) => { if (start.current != null && Math.abs(event.clientX - start.current) > 60) set(current + (event.clientX < start.current ? 1 : -1)); start.current = null; }} className="touch-pan-y py-5">{active?.panel}</motion.div></div>; }

export type PullState = "idle" | "pulling" | "ready" | "refreshing" | "complete";
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 64,
  label = "Refresh content",
  actionLabel = "Refresh",
  showRefreshButton = true,
  className,
}: {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  threshold?: number;
  label?: string;
  actionLabel?: string;
  showRefreshButton?: boolean;
  className?: string;
}) {
  const motionEnabled = useMotionEnabled();
  const [state, setState] = useState<PullState>("idle");
  const start = useRef<number | null>(null);
  const distance = useRef(0);
  const node = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const refreshing = useRef(false);
  const alive = useRef(true);
  const stateRef = useRef<PullState>("idle");
  const safeThreshold = Math.max(1, threshold);
  const offsetY = useMotionValue(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const setOffset = (offset: number, raw = 0) => {
    offsetY.set(Math.max(0, offset));
    if (!node.current) return;
    node.current.style.setProperty("--pull-progress", `${Math.min(Math.max(raw / safeThreshold, 0), 1)}`);
  };

  /** The release settle borrows Jelly's elastic curve — a visible, springy overshoot, not a linear ease-out. */
  const settleOffset = (target: number) => {
    if (!motionEnabled) {
      offsetY.set(target);
      return;
    }
    animate(offsetY, target, { type: "spring", ...springs.elastic });
  };

  const clearCompletion = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    refreshing.current = false;
    if (!alive.current) return;
    setState("idle");
    settleOffset(0);
  };

  const finish = async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    setState("refreshing");
    settleOffset(safeThreshold * 0.7);
    let completed = false;
    try {
      await onRefresh();
      if (!alive.current) return;
      setState("complete");
      completed = true;
    } catch {
      if (alive.current) clearCompletion();
    } finally {
      if (!alive.current) {
        refreshing.current = false;
      } else if (completed) {
        timer.current = window.setTimeout(clearCompletion, 760);
      }
    }
  };

  useEffect(() => () => {
    alive.current = false;
    if (frame.current) cancelAnimationFrame(frame.current);
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const updatePull = (rawDistance: number) => {
    const resisted = rawDistance <= safeThreshold
      ? rawDistance * 0.62
      : safeThreshold * 0.62 + (rawDistance - safeThreshold) * 0.24;
    setOffset(Math.min(resisted, safeThreshold * 0.86), rawDistance);
    const next = rawDistance >= safeThreshold ? "ready" : rawDistance > 8 ? "pulling" : "idle";
    if (stateRef.current !== next) {
      stateRef.current = next;
      setState(next);
    }
  };

  const beginPull = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (refreshing.current || (event.pointerType === "mouse" && event.button !== 0) || (node.current?.scrollTop ?? 0) > 0) return;
    if (event.target instanceof Element && event.target.closest("button,a,input,textarea,select")) return;
    start.current = event.clientY;
    distance.current = 0;
    node.current?.setPointerCapture?.(event.pointerId);
  };

  const movePull = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (start.current === null || refreshing.current) return;
    distance.current = Math.max(0, event.clientY - start.current);
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => updatePull(distance.current));
    if (distance.current > 0 && event.cancelable) event.preventDefault();
  };

  const endPull = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (start.current === null) return;
    if (node.current?.hasPointerCapture?.(event.pointerId)) node.current.releasePointerCapture(event.pointerId);
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = null;
    const pulled = distance.current;
    start.current = null;
    distance.current = 0;
    if (pulled >= safeThreshold) {
      void finish();
    } else {
      setState("idle");
      settleOffset(0);
    }
  };

  const stateCopy = state === "ready"
    ? "Release to refresh"
    : state === "refreshing"
      ? "Refreshing…"
      : state === "complete"
        ? "Updated"
        : state === "pulling"
          ? "Keep pulling"
          : "Pull to reveal refresh";

  return (
    <div
      ref={node}
      data-pull-state={state}
      aria-busy={state === "refreshing"}
      className={cn("relative isolate", className)}
      style={{ touchAction: "auto" } as CSSProperties}
      onPointerDown={beginPull}
      onPointerMove={movePull}
      onPointerUp={endPull}
      onPointerCancel={endPull}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 flex h-20 items-start justify-center pt-3">
        <div className="flex items-center gap-2 rounded-pill border border-line bg-[color:var(--color-milk,#fffdfb)]/90 px-3 py-1.5 text-ink-500 shadow-sm" style={{ opacity: "calc(.28 + var(--pull-progress, 0) * .72)" }}>
          <svg viewBox="0 0 24 24" className={cn("size-5", state === "refreshing" && "animate-spin")} fill="none">
            <circle cx="12" cy="12" r="8" pathLength="1" stroke="currentColor" strokeOpacity=".18" strokeWidth="2" />
            <circle cx="12" cy="12" r="8" pathLength="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1" strokeDashoffset="calc(1 - var(--pull-progress, 0))" transform="rotate(-90 12 12)" />
          </svg>
          <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase">{state === "ready" ? "armed" : state === "refreshing" ? "sync" : "surface"}</span>
        </div>
      </div>

      <motion.div className="relative z-10 min-h-full" style={{ y: offsetY }}>
        <div className="flex items-center justify-between gap-3 border-b border-line/70 bg-white/85 px-4 py-3 backdrop-blur-[2px]">
          <div role="status" aria-label={label} aria-live="polite" className="min-w-0 text-xs text-ink-500">
            <span className="block truncate">{stateCopy}</span>
            <span className="mt-0.5 block font-mono text-[0.55rem] tracking-[0.1em] text-ink-400 uppercase">resistance / threshold / release</span>
          </div>
          {showRefreshButton ? <button type="button" disabled={state === "refreshing"} onClick={() => void finish()} className="min-h-10 shrink-0 rounded-pill border border-line bg-white px-3 py-2 text-xs font-medium transition-colors hover:bg-blush-50 disabled:cursor-wait disabled:opacity-50">{actionLabel}</button> : null}
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
}

type EdgeSwipePanelProps = {
  edge?: "left" | "right";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  label?: string;
  threshold?: number;
  /** Optional content plane for demos/products that want visible displacement behind the panel. */
  content?: ReactNode;
  className?: string;
};

type EdgeDragState = {
  mode: "open" | "close";
  start: number;
  last: number;
  lastTime: number;
  velocity: number;
  moved: boolean;
};

export function EdgeSwipePanel({
  edge = "left",
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  label = "Panel",
  threshold = 80,
  content,
  className,
}: EdgeSwipePanelProps) {
  const motionEnabled = useMotionEnabled();
  const [shown, setShown] = useControllable(open, defaultOpen, onOpenChange);
  const [mounted, setMounted] = useState(defaultOpen || open === true);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const drag = useRef<EdgeDragState | null>(null);
  const settleTimer = useRef<number | null>(null);
  const panelId = useId();
  const safeThreshold = Math.max(1, threshold);
  const getRevealDistance = () => typeof window === "undefined" ? 320 : Math.min(352, Math.max(240, window.innerWidth * 0.88));

  const setProgress = (value: number) => {
    root.current?.style.setProperty("--edge-progress", `${Math.min(Math.max(value, 0), 1)}`);
  };

  useEffect(() => {
    if (shown) {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      setMounted(true);
      setProgress(1);
      previous.current = document.activeElement as HTMLElement;
      const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setShown(false);
        }
      };
      document.addEventListener("keydown", onDocumentKeyDown);
      requestAnimationFrame(() => panel.current?.focus());
      return () => document.removeEventListener("keydown", onDocumentKeyDown);
    }

    if (!dragging) {
      setProgress(0);
      if (mounted) {
        settleTimer.current = window.setTimeout(() => setMounted(false), motionEnabled ? 360 : 0);
      }
      previous.current?.focus();
      previous.current = null;
    }

    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, [dragging, motionEnabled, mounted, setShown, shown]);

  useEffect(() => () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
  }, []);

  const beginOpen = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shown || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { mode: "open", start: event.clientX, last: event.clientX, lastTime: performance.now(), velocity: 0, moved: false };
    setMounted(true);
    setDragging(true);
    setProgress(0);
  };

  const beginClose = (event: ReactPointerEvent<HTMLElement>) => {
    if (!shown || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.target instanceof Element && event.target.closest("button,a,input,textarea,select")) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drag.current = { mode: "close", start: event.clientX, last: event.clientX, lastTime: performance.now(), velocity: 0, moved: false };
    setDragging(true);
  };

  const moveGesture = (event: ReactPointerEvent<HTMLDivElement | HTMLElement>) => {
    const current = drag.current;
    if (!current) return;
    const now = performance.now();
    const elapsed = Math.max(now - current.lastTime, 1);
    const step = event.clientX - current.last;
    const progressDirection = current.mode === "open"
      ? edge === "left" ? 1 : -1
      : edge === "left" ? -1 : 1;
    current.velocity = (step / elapsed) * 1000 * progressDirection;
    current.last = event.clientX;
    current.lastTime = now;
    const distance = current.mode === "open"
      ? edge === "left" ? event.clientX - current.start : current.start - event.clientX
      : edge === "left" ? current.start - event.clientX : event.clientX - current.start;
    current.moved = current.moved || distance > 4;
    const revealDistance = getRevealDistance();
    const progress = current.mode === "open"
      ? distance / revealDistance
      : 1 - distance / revealDistance;
    setProgress(progress);
    if (current.moved && event.cancelable) event.preventDefault();
  };

  const endGesture = (event: ReactPointerEvent<HTMLDivElement | HTMLElement>) => {
    const current = drag.current;
    if (!current) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
    setDragging(false);
    const distance = current.mode === "open"
      ? edge === "left" ? event.clientX - current.start : current.start - event.clientX
      : edge === "left" ? current.start - event.clientX : event.clientX - current.start;
    const revealDistance = getRevealDistance();
    const projected = distance + Math.max(current.velocity, 0) * 0.14;
    const settleDistance = Math.max(safeThreshold, revealDistance * 0.42);
    const nextOpen = current.mode === "open"
      ? projected >= settleDistance || (distance >= safeThreshold && current.velocity > 360)
      : projected < settleDistance && distance < revealDistance * 0.66;
    setProgress(nextOpen ? 1 : 0);
    setShown(nextOpen);
  };

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setShown(false);
      return;
    }
    if (event.key !== "Tab" || !panel.current) return;
    const focusable = [...panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])")];
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleRailMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const proximity = edge === "left" ? event.clientX - rect.left : rect.right - event.clientX;
    event.currentTarget.style.setProperty("--edge-proximity", `${Math.min(Math.max(proximity / 40, 0), 1)}`);
  };

  return (
    <div ref={root} className={cn("relative", className)} style={{ "--edge-progress": shown ? 1 : 0 } as CSSProperties}>
      {content ? <div className="relative" style={{ transform: edge === "left" ? "translateX(calc(var(--edge-progress, 0) * 1.15rem))" : "translateX(calc(var(--edge-progress, 0) * -1.15rem))", transition: dragging || !motionEnabled ? "none" : "transform 360ms cubic-bezier(.22,.72,.2,1)" }}>{content}</div> : null}
      <div
        ref={rail}
        aria-hidden
        className="fixed inset-y-0 z-[60] w-3 cursor-ew-resize"
        style={{ [edge]: 0, touchAction: "none", "--edge-proximity": 0 } as CSSProperties}
        onPointerMove={handleRailMove}
        onPointerLeave={(event) => event.currentTarget.style.setProperty("--edge-proximity", "0")}
        onPointerDown={beginOpen}
        onPointerMoveCapture={moveGesture}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        <span className={cn("absolute inset-y-8 w-px bg-ink-900/20 transition-opacity", edge === "right" ? "right-0" : "left-0")} style={{ opacity: "calc(.28 + var(--edge-proximity, 0) * .62)" }} />
      </div>
      <button ref={trigger} type="button" aria-expanded={shown} aria-controls={mounted ? panelId : undefined} onClick={() => setShown(true)} className="rounded-pill border border-line bg-white px-4 py-2 text-sm transition-colors hover:bg-blush-50">Open {label}</button>

      {mounted ? (
        <div
          className="fixed inset-0 z-[70]"
          style={{
            backgroundColor: "rgba(37,41,51,calc(var(--edge-progress, 0) * .18))",
            pointerEvents: shown ? "auto" : "none",
            transition: dragging || !motionEnabled ? "none" : "background-color 360ms cubic-bezier(.22,.72,.2,1)",
          }}
          onPointerDown={(event) => {
            if (shown && event.target === event.currentTarget) setShown(false);
          }}
        >
          <aside
            ref={panel}
            id={panelId}
            role={shown ? "dialog" : undefined}
            aria-modal={shown ? true : undefined}
            aria-hidden={!shown}
            aria-label={label}
            inert={!shown ? true : undefined}
            tabIndex={shown ? -1 : undefined}
            onKeyDown={onPanelKeyDown}
            onPointerDown={beginClose}
            onPointerMove={moveGesture}
            onPointerUp={endGesture}
            onPointerCancel={endGesture}
            className={cn("absolute top-0 h-full w-[min(22rem,88vw)] overflow-y-auto border-line bg-white p-5 shadow-2xl", edge === "right" ? "right-0 border-l" : "left-0 border-r")}
            style={{
              transform: edge === "left" ? "translateX(calc((1 - var(--edge-progress, 0)) * -100%))" : "translateX(calc((1 - var(--edge-progress, 0)) * 100%))",
              transition: dragging || !motionEnabled ? "none" : "transform 360ms cubic-bezier(.22,.72,.2,1)",
              touchAction: "pan-y",
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="font-mono text-[0.58rem] tracking-[0.15em] text-ink-500 uppercase">Edge / progressive reveal</p>
                <h2 className="mt-2 text-lg font-semibold">{label}</h2>
              </div>
              <button type="button" aria-label={`Close ${label}`} onClick={() => setShown(false)} className="rounded-full border border-line px-2.5 py-1 text-sm leading-none transition-colors hover:bg-blush-50">×</button>
            </div>
            <div className="mt-5">{children}</div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

export function LongPressAction({ children, onLongPress, duration = 500, onClick, label, className }: { children: ReactNode; onLongPress: () => void; duration?: number; onClick?: () => void; label?: string; className?: string }) { const timer = useRef<number | null>(null); const fired = useRef(false); const clear = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = null; }; useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []); const start = () => { fired.current = false; clear(); timer.current = window.setTimeout(() => { fired.current = true; onLongPress(); }, duration); }; return <button type="button" aria-label={label} className={className} onPointerDown={start} onPointerUp={() => { clear(); if (!fired.current) onClick?.(); }} onPointerLeave={clear} onPointerCancel={clear} onContextMenu={(event) => { event.preventDefault(); clear(); onLongPress(); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClick?.(); } }}>{children}</button>; }

export * from "./mobile-expansion";
export * from "./mobile-native";
export * from "./mobile-media";
export * from "./mobile-social";
export * from "./mobile-feed";
