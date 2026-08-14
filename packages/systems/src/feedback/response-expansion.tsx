"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type ResponseResult = boolean | void | Promise<boolean | void>;
type LifecycleState = "idle" | "pending" | "success" | "error";

function useMountedRef() {
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);
  return mounted;
}

function useActionVersion() {
  const version = useRef(0);
  return version;
}

function StateLabel({ children, tone = "quiet", className }: { children: ReactNode; tone?: "quiet" | "success" | "error" | "pending"; className?: string }) {
  const toneClass = tone === "success" ? "bg-cloud-100 text-ink-900" : tone === "error" ? "bg-blush-100 text-ink-900" : tone === "pending" ? "bg-blush-50 text-ink-700" : "bg-white text-ink-500";
  return <span className={cn("rounded-full border border-line px-2.5 py-1 text-[0.6875rem] font-medium", toneClass, className)}>{children}</span>;
}

function FocusRing({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[22px] border border-line bg-white p-4 shadow-soft focus-within:border-ink-900/30", className)}>{children}</div>;
}

/** Immediately reflects an action, then confirms or rolls it back. */
export function OptimisticAction({ label = "Follow", activeLabel = "Following", pendingLabel = "Confirming", onAction, className }: { label?: string; activeLabel?: string; pendingLabel?: string; onAction?: () => ResponseResult; className?: string }) {
  const [state, setState] = useState<LifecycleState>("idle");
  const mounted = useMountedRef();
  const version = useActionVersion();
  const run = async () => {
    if (state === "pending") return;
    const current = ++version.current;
    setState("pending");
    try {
      const result = await onAction?.();
      if (!mounted.current || current !== version.current) return;
      if (result === false) throw new Error("Action was rejected");
      setState("success");
    } catch {
      if (mounted.current && current === version.current) setState("error");
    }
  };
  const active = state === "pending" || state === "success";
  return <div className={cn("flex flex-wrap items-center gap-3", className)}><button type="button" aria-pressed={active} aria-busy={state === "pending"} disabled={state === "pending"} onClick={() => { if (state === "error") setState("idle"); void run(); }} className={cn("min-h-10 rounded-full px-4 py-2 text-sm font-medium transition-[transform,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 active:scale-[.98] disabled:cursor-wait", active ? "bg-cloud-100 text-ink-900" : "bg-ink-900 text-milk", state === "error" && "bg-blush-200 text-ink-900")}>{state === "pending" ? pendingLabel : active ? activeLabel : state === "error" ? "Try again" : label}</button><span role="status" aria-live="polite" className="text-xs text-ink-500">{state === "pending" ? "Your change is ahead of confirmation." : state === "success" ? "Confirmed." : state === "error" ? "Could not confirm. The action is available again." : "Ready."}</span></div>;
}

export type UndoableActionItem = { id: string; label: string; meta?: string };

/** Removes an item now, but keeps its exact position recoverable for a short window. */
export function UndoableAction({ items = [{ id: "brief", label: "Project brief", meta: "Updated today" }, { id: "notes", label: "Release notes", meta: "Draft" }], duration = 5000, onUndo, onCommit, className }: { items?: UndoableActionItem[]; duration?: number; onUndo?: (item: UndoableActionItem) => void; onCommit?: (item: UndoableActionItem) => void; className?: string }) {
  const [visible, setVisible] = useState(items);
  const [pending, setPending] = useState<{ item: UndoableActionItem; index: number } | null>(null);
  const motionEnabled = useMotionEnabled();
  useEffect(() => { if (!pending || duration <= 0) return; const timer = window.setTimeout(() => { onCommit?.(pending.item); setPending(null); }, duration); return () => window.clearTimeout(timer); }, [duration, onCommit, pending]);
  const remove = (item: UndoableActionItem) => { if (pending) return; const index = visible.findIndex((candidate) => candidate.id === item.id); setVisible((current) => current.filter((candidate) => candidate.id !== item.id)); setPending({ item, index }); };
  const undo = () => { if (!pending) return; setVisible((current) => { const next = [...current]; next.splice(Math.min(pending.index, next.length), 0, pending.item); return next; }); onUndo?.(pending.item); setPending(null); };
  return <div className={cn("w-full space-y-3", className)}><ul aria-label="Recoverable items" className="space-y-2"><AnimatePresence initial={false}>{visible.map((item) => <motion.li key={item.id} layout={motionEnabled} initial={motionEnabled ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} exit={motionEnabled ? { opacity: 0, height: 0, marginBottom: 0 } : { opacity: 0 }} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3"><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-ink-900">{item.label}</span>{item.meta ? <span className="mt-0.5 block text-xs text-ink-500">{item.meta}</span> : null}</span><button type="button" disabled={Boolean(pending)} onClick={() => remove(item)} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 disabled:opacity-40">Remove</button></motion.li>)}</AnimatePresence></ul>{pending ? <div role="status" aria-live="polite" className="flex flex-wrap items-center gap-3 rounded-2xl bg-ink-900 px-4 py-3 text-sm text-milk"><span className="min-w-0 flex-1">{pending.item.label} removed · recoverable</span><button type="button" onClick={undo} aria-label={`Undo ${pending.item.label}`} className="min-h-9 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Undo</button>{duration > 0 ? <span className="font-mono text-[0.65rem] text-white/70">{Math.ceil(duration / 1000)}s</span> : null}</div> : <p className="text-xs text-ink-500">Removing an item closes the gap before the Undo surface arrives.</p>}</div>;
}

/** Keeps saving feedback beside the field that owns the change. */
export function InlineSaveState({ label = "Project title", defaultValue = "North star refresh", onSave, className }: { label?: string; defaultValue?: string; onSave?: (value: string) => ResponseResult; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [state, setState] = useState<"idle" | "edited" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState(defaultValue);
  const mounted = useMountedRef();
  const save = async () => {
    if (state === "saving" || value === lastSaved) return;
    setState("saving");
    try {
      const result = await onSave?.(value);
      if (!mounted.current) return;
      if (result === false) throw new Error("Save rejected");
      setLastSaved(value); setState("saved");
    } catch { if (mounted.current) setState("error"); }
  };
  const statusTone = state === "error" ? "error" : state === "saved" ? "success" : state === "saving" ? "pending" : "quiet";
  return <FocusRing className={className}><label className="block text-sm font-medium text-ink-900" htmlFor={`inline-save-${label.replace(/\W+/g, "-")}`}>{label}</label><div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap"><input id={`inline-save-${label.replace(/\W+/g, "-")}`} value={value} aria-busy={state === "saving"} onChange={(event) => { setValue(event.currentTarget.value); setState("edited"); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void save(); } }} className="min-h-10 min-w-0 flex-1 rounded-xl border border-line bg-milk px-3 py-2 text-sm outline-none focus:border-ink-900" /><button type="button" disabled={state === "saving" || value === lastSaved} onClick={() => { void save(); }} className="min-h-10 rounded-xl bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:cursor-not-allowed disabled:opacity-40">Save</button></div><div className="mt-3 flex min-h-6 items-center gap-2"><StateLabel tone={statusTone}>{state === "idle" ? "Saved" : state === "edited" ? "Edited locally" : state === "saving" ? "Saving…" : state === "saved" ? "Saved" : "Save failed"}</StateLabel><span role={state === "error" ? "alert" : "status"} aria-live="polite" className="text-xs text-ink-500">{state === "error" ? "The value stayed here. Try saving again." : state === "saved" ? "Saved in this context." : state === "edited" ? "Unsaved change" : state === "saving" ? "Writing the change…" : "No pending changes."}</span></div></FocusRing>;
}

/** A control-owned async lifecycle with intent, success and recovery—not only a spinner. */
export function AsyncActionControl({ label = "Publish", pendingLabel = "Publishing…", successLabel = "Published", onAction, className }: { label?: string; pendingLabel?: string; successLabel?: string; onAction?: () => ResponseResult; className?: string }) {
  const [state, setState] = useState<LifecycleState>("idle");
  const mounted = useMountedRef();
  const run = async () => { if (state === "pending") return; setState("pending"); try { const result = await onAction?.(); if (!mounted.current) return; if (result === false) throw new Error("Action rejected"); setState("success"); } catch { if (mounted.current) setState("error"); } };
  return <div className={cn("flex flex-wrap items-center gap-3", className)}><button type="button" disabled={state === "pending"} aria-busy={state === "pending"} onClick={() => { if (state === "success") setState("idle"); else void run(); }} className={cn("min-h-11 min-w-32 rounded-xl px-4 py-2.5 text-sm font-semibold transition-[transform,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 active:scale-[.98] disabled:cursor-wait", state === "success" ? "bg-cloud-100 text-ink-900" : state === "error" ? "bg-blush-200 text-ink-900" : "bg-ink-900 text-milk")}>{state === "pending" ? pendingLabel : state === "success" ? successLabel : state === "error" ? "Retry publish" : label}</button><span role={state === "error" ? "alert" : "status"} aria-live="polite" className="text-xs text-ink-500">{state === "pending" ? "The action owns its pending state." : state === "success" ? "The result is ready. Activate to run again." : state === "error" ? "Nothing was lost. Retry when ready." : "Ready to publish."}</span></div>;
}

export type ProgressiveStatusPhase = "idle" | "running" | "complete";

/** Reveals operational detail only as a long action earns it. */
export function ProgressiveStatus({ steps = ["Processing", "Processing images", "Optimizing output"], interval = 900, autoStart = false, className }: { steps?: string[]; interval?: number; autoStart?: boolean; className?: string }) {
  const [phase, setPhase] = useState<ProgressiveStatusPhase>(autoStart ? "running" : "idle");
  const [index, setIndex] = useState(0);
  const motionEnabled = useMotionEnabled();
  useEffect(() => { if (phase !== "running" || steps.length === 0) return; const timer = window.setTimeout(() => { if (index >= steps.length - 1) setPhase("complete"); else setIndex((current) => current + 1); }, interval); return () => window.clearTimeout(timer); }, [index, interval, phase, steps.length]);
  const start = () => { setIndex(0); setPhase("running"); };
  return <div className={cn("w-full rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}><div className="flex flex-wrap items-center gap-3"><span aria-hidden className={cn("grid size-9 place-items-center rounded-full bg-blush-100 text-sm", phase === "complete" && "bg-cloud-100")}>{phase === "complete" ? "✓" : "◌"}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink-900">{phase === "idle" ? "Ready to process" : phase === "complete" ? "Processing complete" : steps[index] ?? "Processing"}</p><p role="status" aria-live="polite" className="mt-1 text-xs text-ink-500">{phase === "idle" ? "Details appear only when the work takes time." : phase === "complete" ? "The final state is quiet and readable." : `${index + 1} of ${steps.length} operational updates`}</p></div><button type="button" onClick={start} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">{phase === "idle" ? "Start" : "Run again"}</button></div><div className="mt-4 space-y-2" aria-label="Progressive status details">{steps.slice(0, phase === "idle" ? 1 : index + 1).map((step, stepIndex) => <motion.div key={step} initial={motionEnabled ? { opacity: 0, x: 8 } : false} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-xs text-ink-700"><span aria-hidden className="size-1.5 rounded-full bg-blush-300" />{step}{stepIndex < index || phase === "complete" ? <span className="text-ink-500">· seen</span> : null}</motion.div>)}</div></div>;
}

export type ExecutionStage = { id: string; label: string; detail?: string };

/** System execution progress: a named process with an expanded current stage, not a user wizard. */
export function MultiStageProgress({ stages = [{ id: "upload", label: "Upload", detail: "Accepting the source file" }, { id: "process", label: "Process", detail: "Preparing the working result" }, { id: "review", label: "Review", detail: "Checking the output" }, { id: "complete", label: "Complete", detail: "Ready for the next product action" }], defaultIndex = 1, className }: { stages?: ExecutionStage[]; defaultIndex?: number; className?: string }) {
  const [current, setCurrent] = useState(Math.min(Math.max(defaultIndex, 0), Math.max(stages.length - 1, 0)));
  const [failed, setFailed] = useState(false);
  const motionEnabled = useMotionEnabled();
  if (!stages.length) return null;
  const finish = current >= stages.length - 1;
  const advance = () => { if (failed) { setFailed(false); return; } if (finish) { setCurrent(0); return; } setCurrent((value) => Math.min(value + 1, stages.length - 1)); };
  return <div className={cn("w-full rounded-[24px] border border-line bg-white p-4 shadow-soft sm:p-5", className)}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">System execution</p><h3 className="mt-1 text-base font-semibold text-ink-900">{failed ? "Stage needs attention" : stages[current]?.label}</h3></div><StateLabel tone={failed ? "error" : finish ? "success" : "pending"}>{failed ? "Failed" : finish ? "Complete" : `${current + 1} / ${stages.length}`}</StateLabel></div><ol className="mt-5 grid gap-2 sm:grid-cols-4">{stages.map((stage, index) => { const complete = index < current || finish && index === current; const active = index === current && !finish; return <li key={stage.id} className="min-w-0"><motion.div layout={motionEnabled} className={cn("rounded-xl border px-3 py-3", complete ? "border-cloud-300 bg-cloud-50" : active ? "border-ink-900 bg-blush-50" : "border-line bg-white")}>{<div className="flex items-center gap-2"><span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[0.65rem] ring-1 ring-line">{complete ? "✓" : index + 1}</span><span className="min-w-0 truncate text-xs font-medium text-ink-900">{stage.label}</span></div>}<span className="mt-2 block text-[0.65rem] leading-relaxed text-ink-500">{stage.detail}</span></motion.div></li>; })}</ol><div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cloud-50 px-4 py-3"><p role="status" aria-live="polite" className="text-xs text-ink-700">{failed ? "The process stays at its failed stage so recovery has context." : finish ? "All named stages completed." : stages[current]?.detail}</p><div className="flex gap-2">{!finish && !failed ? <button type="button" onClick={() => setFailed(true)} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Simulate failure</button> : null}<button type="button" onClick={advance} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{failed ? "Retry stage" : finish ? "Run again" : "Advance stage"}</button></div></div></div>;
}

export type BackgroundTaskState = "queued" | "running" | "complete" | "error";

/** Keeps long-running work visible as a compact, persistent row while the user continues elsewhere. */
export function BackgroundTaskRow({ label = "Generating preview", defaultState = "running", defaultProgress = 42, onRetry, className }: { label?: string; defaultState?: BackgroundTaskState; defaultProgress?: number; onRetry?: () => ResponseResult; className?: string }) {
  const [state, setState] = useState<BackgroundTaskState>(defaultState);
  const [progress, setProgress] = useState(defaultProgress);
  const mounted = useMountedRef();
  const run = () => { if (state === "complete") { setProgress(0); setState("running"); } else if (state === "queued") setState("running"); else if (state === "running") { const next = Math.min(progress + 29, 100); setProgress(next); if (next >= 100) setState("complete"); } };
  const retry = async () => { setState("running"); setProgress(20); try { const result = await onRetry?.(); if (!mounted.current) return; if (result === false) throw new Error("Retry rejected"); } catch { if (mounted.current) setState("error"); } };
  const tone = state === "error" ? "error" : state === "complete" ? "success" : "pending";
  return <div className={cn("w-full rounded-2xl border border-line bg-white px-4 py-3 shadow-soft", className)}><div className="flex flex-wrap items-center gap-3"><span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full", state === "complete" ? "bg-cloud-100" : state === "error" ? "bg-blush-100" : "bg-blush-50")}>{state === "complete" ? "✓" : state === "error" ? "!" : "◌"}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-ink-900">{label}</p><p role={state === "error" ? "alert" : "status"} aria-live="polite" className="mt-0.5 text-xs text-ink-500">{state === "queued" ? "Queued · you can keep working" : state === "running" ? `Running · ${progress}%` : state === "complete" ? "Complete · ready to inspect" : "Failed · retry without losing the task"}</p></div><StateLabel tone={tone}>{state}</StateLabel>{state === "error" ? <button type="button" onClick={() => { void retry(); }} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Retry</button> : <button type="button" onClick={run} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">{state === "complete" ? "Run again" : state === "queued" ? "Start" : "Advance"}</button>}</div>{state === "running" ? <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`${label} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span className="block h-full rounded-full bg-ink-900 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div> : null}</div>;
}

/** Makes acceptance into a visible queue state before work becomes active. */
export function QueuedAction({ label = "Export report", queuePosition = 2, className }: { label?: string; queuePosition?: number; className?: string }) {
  const [state, setState] = useState<"idle" | "queued" | "running" | "complete">("queued");
  const [progress, setProgress] = useState(0);
  const advance = () => { if (state === "queued") { setState("running"); setProgress(18); } else if (state === "running") { const next = Math.min(progress + 41, 100); setProgress(next); if (next >= 100) setState("complete"); } else if (state === "complete") { setState("queued"); setProgress(0); } else setState("queued"); };
  return <div className={cn("w-full rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}><div className="flex flex-wrap items-center gap-3"><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink-900">{label}</p><p role="status" aria-live="polite" className="mt-1 text-xs text-ink-500">{state === "queued" ? `Queued · #${queuePosition} · waiting for capacity` : state === "running" ? `Starting · ${progress}% complete` : state === "complete" ? "Ready to download" : "Ready to queue"}</p></div><StateLabel tone={state === "complete" ? "success" : state === "running" ? "pending" : "quiet"}>{state}</StateLabel><button type="button" onClick={advance} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{state === "queued" ? "Start when ready" : state === "running" ? "Advance" : state === "complete" ? "Queue again" : "Queue action"}</button></div>{state === "running" ? <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`${label} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span className="block h-full rounded-full bg-blush-300 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div> : null}</div>;
}

/** Turns a failed content region into its own recovery surface. */
export function RetrySurface({ title = "Preview unavailable", description = "The source did not arrive, but the surrounding product context is still here.", children = <p className="text-sm text-ink-700">The original content is available again.</p>, onRetry, className }: { title?: string; description?: string; children?: ReactNode; onRetry?: () => ResponseResult; className?: string }) {
  const [state, setState] = useState<"error" | "retrying" | "success">("error");
  const mounted = useMountedRef();
  const retry = async () => { setState("retrying"); try { const result = await onRetry?.(); if (!mounted.current) return; if (result === false) throw new Error("Retry rejected"); setState("success"); } catch { if (mounted.current) setState("error"); } };
  return <div className={cn("w-full rounded-[22px] border border-line bg-white p-5 shadow-soft", className)}>{state === "success" ? <div className="flex flex-wrap items-center gap-3"><span aria-hidden className="grid size-9 place-items-center rounded-full bg-cloud-100">✓</span><div className="min-w-0 flex-1">{children}</div><StateLabel tone="success">Recovered</StateLabel></div> : <div className="flex flex-wrap items-start gap-4"><span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-blush-100">!</span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold text-ink-900">{title}</h3><p role="alert" className="mt-1 text-sm leading-relaxed text-ink-700">{state === "retrying" ? "Trying the same source again…" : description}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={state === "retrying"} onClick={() => { void retry(); }} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:opacity-50">{state === "retrying" ? "Retrying…" : "Retry"}</button><button type="button" onClick={() => setState("success")} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Use cached view</button></div></div></div>}</div>;
}

/** Transforms the working surface into its result while preserving its footprint. */
export function CompletionMorph({ label = "Upload brief", resultLabel = "Brief ready", onComplete, className }: { label?: string; resultLabel?: string; onComplete?: () => ResponseResult; className?: string }) {
  const [state, setState] = useState<"idle" | "working" | "complete" | "error">("idle");
  const mounted = useMountedRef();
  const motionEnabled = useMotionEnabled();
  const start = async () => { if (state === "working") return; setState("working"); try { const result = await onComplete?.(); if (!mounted.current) return; if (result === false) throw new Error("Completion rejected"); setState("complete"); } catch { if (mounted.current) setState("error"); } };
  return <motion.div layout={motionEnabled} className={cn("w-full rounded-[24px] border border-line bg-white p-5 shadow-soft", className)}><AnimatePresence mode="wait" initial={false}>{state === "complete" ? <motion.div key="complete" initial={motionEnabled ? { opacity: 0, scale: .96 } : false} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap items-center gap-4"><span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-cloud-100 text-lg">✓</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink-900">{resultLabel}</p><p role="status" aria-live="polite" className="mt-1 text-xs text-ink-500">The working surface became the result.</p></div><button type="button" onClick={() => setState("idle")} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Reset</button></motion.div> : <motion.div key="working-surface" initial={false} animate={{ opacity: 1 }}><div className="flex flex-wrap items-center gap-4"><span aria-hidden className={cn("grid size-11 shrink-0 place-items-center rounded-full", state === "error" ? "bg-blush-100" : state === "working" ? "bg-blush-50" : "bg-cloud-50")}>{state === "error" ? "!" : state === "working" ? "◌" : "↑"}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink-900">{state === "working" ? "Working on it…" : state === "error" ? "Could not finish" : label}</p><p role={state === "error" ? "alert" : "status"} aria-live="polite" className="mt-1 text-xs text-ink-500">{state === "working" ? "The same surface owns the progress." : state === "error" ? "Retry keeps the action in place." : "Start the action to see the surface transform."}</p></div><button type="button" disabled={state === "working"} onClick={() => { void start(); }} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:cursor-wait disabled:opacity-50">{state === "working" ? "Working…" : state === "error" ? "Retry" : label}</button></div></motion.div>}</AnimatePresence></motion.div>;
}

export type BatchResultItem = { id: string; label: string; state: "success" | "failed"; detail?: string };

/** Summarises mixed batch outcomes without framing a partial failure as total failure. */
export function PartialSuccessSummary({ items = [{ id: "one", label: "Cover image", state: "success" }, { id: "two", label: "Gallery images", state: "success" }, { id: "three", label: "Archive copy", state: "failed", detail: "Unsupported format" }], onRetry, className }: { items?: BatchResultItem[]; onRetry?: (items: BatchResultItem[]) => ResponseResult; className?: string }) {
  const [results, setResults] = useState(items);
  const [retrying, setRetrying] = useState(false);
  const failed = results.filter((item) => item.state === "failed");
  const retry = async () => { if (!failed.length) return; setRetrying(true); try { const result = await onRetry?.(failed); if (result === false) throw new Error("Retry rejected"); setResults((current) => current.map((item) => item.state === "failed" ? { ...item, state: "success", detail: "Retried successfully" } : item)); } catch { /* The failed rows remain explicit when retry does not complete. */ } finally { setRetrying(false); } };
  return <div className={cn("w-full rounded-[24px] border border-line bg-white p-5 shadow-soft", className)}><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">Batch result</p><h3 className="mt-1 text-base font-semibold text-ink-900">{results.filter((item) => item.state === "success").length} succeeded · {failed.length} need attention</h3></div>{failed.length ? <button type="button" disabled={retrying} onClick={() => { void retry(); }} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:opacity-50">{retrying ? "Retrying…" : `Retry ${failed.length} failed`}</button> : <StateLabel tone="success">All complete</StateLabel>}</div><ul className="mt-4 space-y-2" aria-label="Batch outcomes">{results.map((item) => <li key={item.id} className="flex items-center gap-3 rounded-xl bg-cloud-50 px-3 py-2.5"><span aria-hidden className={cn("grid size-6 place-items-center rounded-full text-xs", item.state === "success" ? "bg-cloud-100" : "bg-blush-100")}>{item.state === "success" ? "✓" : "!"}</span><span className="min-w-0 flex-1 text-sm text-ink-900">{item.label}<span className="ml-2 text-xs text-ink-500">{item.detail ?? (item.state === "success" ? "Complete" : "Failed")}</span></span><span className="font-mono text-[0.6rem] tracking-[0.1em] text-ink-500 uppercase">{item.state}</span></li>)}</ul><p role="status" aria-live="polite" className="mt-3 text-xs text-ink-500">{failed.length ? "Successful items are kept; only failed items enter recovery." : "Every item completed."}</p></div>;
}

/** Holds a local/external comparison in place until the user resolves the conflict. */
export function ConflictResolution({ label = "Project title", localValue = "North star refresh", remoteValue = "North star refresh · updated elsewhere", onResolve, className }: { label?: string; localValue?: string; remoteValue?: string; onResolve?: (choice: "mine" | "latest") => void; className?: string }) {
  const [choice, setChoice] = useState<"mine" | "latest" | null>(null);
  const headingId = useId();
  const resolve = (next: "mine" | "latest") => { setChoice(next); onResolve?.(next); };
  return <div className={cn("w-full rounded-[24px] border border-line bg-white p-5 shadow-soft", className)} aria-labelledby={headingId}><div className="flex items-start gap-3"><span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-blush-100">!</span><div className="min-w-0"><h3 id={headingId} className="text-base font-semibold text-ink-900">{choice ? "Conflict resolved" : "This item changed elsewhere"}</h3><p role="status" aria-live="polite" className="mt-1 text-sm leading-relaxed text-ink-700">{choice ? `Kept ${choice === "mine" ? "your local version" : "the latest version"}.` : "Choose which value should continue in this surface."}</p></div></div>{choice ? <div className="mt-4 rounded-xl bg-cloud-50 px-3 py-3 text-sm text-ink-700"><span className="font-medium">{label}:</span> {choice === "mine" ? localValue : remoteValue}</div> : <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-line bg-cloud-50 p-3"><p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-500 uppercase">Your version</p><p className="mt-2 text-sm text-ink-900">{localValue}</p><button type="button" onClick={() => resolve("mine")} className="mt-3 min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Keep mine</button></div><div className="rounded-xl border border-line bg-blush-50 p-3"><p className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-500 uppercase">Latest version</p><p className="mt-2 text-sm text-ink-900">{remoteValue}</p><button type="button" onClick={() => resolve("latest")} className="mt-3 min-h-9 rounded-full border border-line bg-white px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Use latest</button></div></div>}</div>;
}

export type ConnectionMode = "online" | "reconnecting" | "offline" | "restored";

/** Makes connection loss a recoverable product state rather than a generic browser banner. */
export function ConnectionState({ defaultMode = "offline", onReconnect, className }: { defaultMode?: ConnectionMode; onReconnect?: () => ResponseResult; className?: string }) {
  const [mode, setMode] = useState<ConnectionMode>(defaultMode);
  const mounted = useMountedRef();
  const reconnect = async () => { setMode("reconnecting"); try { const result = await onReconnect?.(); if (!mounted.current) return; if (result === false) throw new Error("Reconnect rejected"); setMode("restored"); } catch { if (mounted.current) setMode("offline"); } };
  const message = mode === "online" ? "Online · changes sync normally." : mode === "reconnecting" ? "Reconnecting · local work stays here." : mode === "restored" ? "Connection restored · local work can sync." : "Offline · local work stays available.";
  return <div className={cn("flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft", className)}><span aria-hidden className={cn("size-2.5 rounded-full", mode === "online" || mode === "restored" ? "bg-cloud-300" : mode === "reconnecting" ? "bg-blush-300" : "bg-ink-300")} /><p role="status" aria-live="polite" className="min-w-0 flex-1 text-sm text-ink-700">{message}</p><StateLabel tone={mode === "offline" ? "error" : mode === "reconnecting" ? "pending" : "success"}>{mode}</StateLabel>{mode === "offline" || mode === "restored" ? <button type="button" onClick={() => { void reconnect(); }} className="min-h-9 rounded-full border border-line px-3 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">{mode === "offline" ? "Reconnect" : "Check again"}</button> : null}</div>;
}

/** Pauses a long operation without losing its progress or its next action. */
export function ResumableProgress({ label = "Importing archive", defaultProgress = 56, className }: { label?: string; defaultProgress?: number; className?: string }) {
  const [state, setState] = useState<"running" | "paused" | "complete">("paused");
  const [progress, setProgress] = useState(defaultProgress);
  const advance = () => { if (state === "paused") setState("running"); else if (state === "running") { const next = Math.min(progress + 22, 100); setProgress(next); if (next >= 100) setState("complete"); } else { setProgress(0); setState("running"); } };
  return <div className={cn("w-full rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}><div className="flex flex-wrap items-center gap-3"><span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-blush-50">{state === "complete" ? "✓" : state === "paused" ? "Ⅱ" : "▶"}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink-900">{label}</p><p role="status" aria-live="polite" className="mt-1 text-xs text-ink-500">{state === "paused" ? `Paused at ${progress}% · resume keeps the work` : state === "running" ? `Resuming · ${progress}% complete` : "Import complete · no restart required"}</p></div><StateLabel tone={state === "complete" ? "success" : state === "paused" ? "pending" : "pending"}>{state}</StateLabel><button type="button" onClick={advance} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{state === "paused" ? "Resume" : state === "running" ? "Advance" : "Start again"}</button></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`${label} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span className="block h-full rounded-full bg-blush-300 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div></div>;
}

/** Escalates feedback only when work crosses perceived-performance thresholds. */
export function DelayedFeedbackEscalation({ fastDelay = 350, detailedDelay = 1100, className }: { fastDelay?: number; detailedDelay?: number; className?: string }) {
  const [phase, setPhase] = useState<"idle" | "quiet" | "pending" | "detailed" | "complete">("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);
  const start = () => { timers.current.forEach((timer) => window.clearTimeout(timer)); setPhase("quiet"); timers.current = [window.setTimeout(() => setPhase("pending"), fastDelay), window.setTimeout(() => setPhase("detailed"), detailedDelay), window.setTimeout(() => setPhase("complete"), detailedDelay + 900)]; };
  return <div className={cn("w-full rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}><div className="flex flex-wrap items-center gap-3"><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink-900">Save changes</p><p role="status" aria-live="polite" className="mt-1 text-xs text-ink-500">{phase === "idle" ? "Fast work stays quiet." : phase === "quiet" ? "No loading flash yet…" : phase === "pending" ? "Still working · a subtle state is now useful." : phase === "detailed" ? "Taking longer · showing the operation." : "Saved without a loader replay."}</p></div><StateLabel tone={phase === "complete" ? "success" : phase === "detailed" ? "pending" : "quiet"}>{phase === "idle" ? "idle" : phase}</StateLabel><button type="button" onClick={start} className="min-h-9 rounded-full bg-ink-900 px-3 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{phase === "idle" || phase === "complete" ? "Run save" : "Run again"}</button></div><div className="mt-4 grid grid-cols-3 gap-1.5" aria-label="Feedback thresholds"><span className={cn("h-1.5 rounded-full bg-line", phase !== "idle" && "bg-cloud-200")} /><span className={cn("h-1.5 rounded-full bg-line", ["pending", "detailed", "complete"].includes(phase) && "bg-blush-200")} /><span className={cn("h-1.5 rounded-full bg-line", ["detailed", "complete"].includes(phase) && "bg-ink-300")} /></div></div>;
}
