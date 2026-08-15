"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled, usePressSpring } from "@pinky/primitives";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../internal/cn";

export function ShimmerSurface({ className, direction = "right", active = true, children }: { className?: string; direction?: "right" | "left" | "down" | "up"; active?: boolean; children?: ReactNode }) {
  const enabled = useMotionEnabled();
  const horizontal = direction === "right" || direction === "left";
  const axis = horizontal ? "x" : "y";
  const reverse = direction === "left" || direction === "up";

  return (
    <span
      className={cn("relative isolate block overflow-hidden bg-cloud-50/80 ring-1 ring-line/70", className)}
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -1px 0 rgba(170,210,230,0.22)",
      }}
    >
      {children}
      {active && enabled ? (
        <motion.i
          aria-hidden
          className={cn(
            "pointer-events-none absolute rounded-pill bg-white/35 blur-xl",
            horizontal ? "inset-y-[-35%] w-2/5" : "inset-x-[-35%] h-2/5",
          )}
          style={{ [axis]: reverse ? "100%" : "-100%" }}
          animate={{ [axis]: reverse ? "-100%" : "100%" }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
    </span>
  );
}
export function SkeletonMorph({ loading, skeleton, children, label = "Loading content", className }: { loading: boolean; skeleton: ReactNode; children: ReactNode; label?: string; className?: string }) { const enabled = useMotionEnabled(); return <motion.div layout={enabled} aria-busy={loading} aria-label={loading ? label : undefined} className={className}><AnimatePresence mode="popLayout" initial={false}>{loading ? <motion.div key="skeleton" aria-hidden initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{skeleton}</motion.div> : <motion.div key="content" initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }}>{children}</motion.div>}</AnimatePresence></motion.div>; }
export type ProgressStep = { id: string; label: string; state?: "completed" | "current" | "upcoming" | "error" };
export function MultiStepProgress({ steps, label = "Progress", orientation = "horizontal" }: { steps: ProgressStep[]; label?: string; orientation?: "horizontal" | "vertical" }) { return <ol aria-label={label} className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "items-start")}>{steps.map((step, index) => { const stateLabel = step.state === "completed" ? "complete" : step.state === "current" ? "current" : step.state === "error" ? "needs attention" : "upcoming"; return <li key={step.id} aria-current={step.state === "current" ? "step" : undefined} aria-label={`${step.label}, ${stateLabel}`} className="flex min-w-0 flex-1 items-center gap-2"><span aria-hidden className={cn("grid size-7 shrink-0 place-items-center rounded-full border", step.state === "completed" && "bg-ink-900 text-milk", step.state === "current" && "border-blush-300 bg-blush-50", step.state === "error" && "border-ink-900/35 bg-milk text-ink-900")}>{step.state === "completed" ? "✓" : step.state === "error" ? "!" : index + 1}</span><span className="truncate text-sm">{step.label}</span></li>; })}</ol>; }
export function CircularProgressMorph({ value, state = "progress", label = "Progress", size = 64 }: { value?: number; state?: "spinner" | "progress" | "success"; label?: string; size?: number }) { const percent = Math.max(0, Math.min(100, value ?? 0)); const radius = 25; const length = 2 * Math.PI * radius; return <div role={state === "spinner" ? "status" : "progressbar"} aria-label={label} aria-valuemin={state === "spinner" ? undefined : 0} aria-valuemax={state === "spinner" ? undefined : 100} aria-valuenow={state === "spinner" ? undefined : state === "success" ? 100 : percent} className="relative inline-grid place-items-center" style={{ width: size, height: size }}><svg viewBox="0 0 60 60" className={cn("absolute inset-0 -rotate-90", state === "spinner" && "animate-spin motion-reduce:animate-none")}><circle cx="30" cy="30" r={radius} fill="none" stroke="currentColor" opacity=".12" strokeWidth="5"/><motion.circle cx="30" cy="30" r={radius} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" strokeDasharray={length} animate={{ strokeDashoffset: length * (1 - (state === "spinner" ? .24 : state === "success" ? 1 : percent / 100)) }} /></svg><span className="text-xs font-semibold">{state === "success" ? "✓" : state === "spinner" ? "…" : `${percent}%`}</span></div>; }
export type AsyncState = "idle" | "loading" | "success" | "error";
export function AsyncButton({ state: controlled, onAction, children, loadingLabel = "Working…", successLabel = "Done", errorLabel = "Try again", className, disabled, ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"> & { state?: AsyncState; onAction?: () => Promise<unknown>; loadingLabel?: string; successLabel?: string; errorLabel?: string }) { const [internal, setInternal] = useState<AsyncState>("idle"); const state = controlled ?? internal; const alive = useRef(true); const press = usePressSpring({ disabled: disabled || state === "loading" }); useEffect(() => () => { alive.current = false; }, []); const run = async () => { if (!onAction || state === "loading") return; setInternal("loading"); try { await onAction(); if (alive.current) setInternal("success"); } catch { if (alive.current) setInternal("error"); } }; const label = state === "loading" ? loadingLabel : state === "success" ? successLabel : state === "error" ? errorLabel : children; return <motion.button {...props} type={props.type ?? "button"} disabled={disabled || state === "loading"} aria-label={typeof children === "string" ? children : undefined} aria-busy={state === "loading"} data-state={state} onPointerDown={press.handlers.onPointerDown} onPointerUp={press.handlers.onPointerUp} onPointerLeave={press.handlers.onPointerLeave} onPointerCancel={press.handlers.onPointerCancel} onBlur={press.handlers.onBlur} onKeyDown={press.handlers.onKeyDown} onKeyUp={press.handlers.onKeyUp} onClick={run} style={press.scale ? { ...props.style, scale: press.scale } : props.style} className={cn("relative rounded-full bg-ink-900 px-5 py-2.5 text-milk disabled:opacity-70", className)}><span aria-hidden="true" className="invisible">{children}</span><span className="absolute inset-0 grid place-items-center px-5">{label}</span></motion.button>; }
