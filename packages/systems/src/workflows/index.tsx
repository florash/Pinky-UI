"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useId, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type ProgressiveWorkflowStep = {
  id: string;
  label: string;
  description?: string;
  summary?: ReactNode;
  content: ReactNode;
  nextPreview?: ReactNode;
  blocked?: boolean;
};
export type ProgressiveStepWorkflowProps = {
  steps: ProgressiveWorkflowStep[];
  activeId?: string;
  defaultActiveId?: string;
  completedIds?: string[];
  defaultCompletedIds?: string[];
  onActiveIdChange?: (id: string) => void;
  onCompletedIdsChange?: (ids: string[]) => void;
  label?: string;
  className?: string;
};

/** A workflow rail that keeps completed decisions visible while the current task stays large. */
export function ProgressiveStepWorkflow({ steps, activeId, defaultActiveId, completedIds, defaultCompletedIds = [], onActiveIdChange, onCompletedIdsChange, label = "Progressive step workflow", className }: ProgressiveStepWorkflowProps) {
  const id = useId();
  const firstId = steps[0]?.id ?? "";
  const [internalActive, setInternalActive] = useState(defaultActiveId ?? firstId);
  const [internalCompleted, setInternalCompleted] = useState(defaultCompletedIds);
  const [announcement, setAnnouncement] = useState("");
  const currentId = activeId ?? internalActive;
  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === currentId));
  const current = steps[currentIndex];
  const nextStep = steps[currentIndex + 1];
  const completed = completedIds ?? internalCompleted;
  const motionEnabled = useMotionEnabled();
  if (!current) return null;

  const setActive = (next: string) => { if (activeId === undefined) setInternalActive(next); onActiveIdChange?.(next); };
  const setComplete = (next: string[]) => { if (completedIds === undefined) setInternalCompleted(next); onCompletedIdsChange?.(next); };
  const back = () => { const previous = steps[currentIndex - 1]; if (previous) setActive(previous.id); };
  const continueStep = () => {
    if (current.blocked) { setAnnouncement(`${current.label} is waiting for an external decision.`); return; }
    const nextCompleted = completed.includes(current.id) ? completed : [...completed, current.id];
    setComplete(nextCompleted);
    const next = steps[currentIndex + 1];
    if (next) { setActive(next.id); setAnnouncement(`${current.label} complete. ${next.label} is now in focus.`); } else setAnnouncement("Workflow complete.");
  };

  return (
    <div aria-label={label} className={cn("w-full max-w-3xl", className)}>
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const isCurrent = step.id === current.id;
          const isComplete = completed.includes(step.id) && !isCurrent;
          const isBlocked = step.blocked && !isComplete;
          return <li key={step.id}><button type="button" disabled={!isComplete} onClick={() => setActive(step.id)} aria-current={isCurrent ? "step" : undefined} aria-label={isComplete ? `Edit ${step.label}` : `${step.label}${isBlocked ? ", waiting" : isCurrent ? ", current" : ", upcoming"}`} className={cn("flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20", isCurrent ? "border-ink-900 bg-white shadow-sm" : isComplete ? "border-line bg-white hover:border-ink-900" : "cursor-default border-transparent bg-cloud-50/70")}><span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs", isComplete ? "bg-ink-900 text-milk" : isCurrent ? "bg-blush-200 text-ink-900" : isBlocked ? "bg-amber-100 text-ink-700" : "bg-white text-ink-400 ring-1 ring-line")}>{isComplete ? "✓" : isBlocked ? "!" : index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-ink-900">{step.label}</span><span className="mt-0.5 block truncate text-xs text-ink-500">{isComplete ? step.summary ?? "Complete · Edit if needed" : isCurrent ? step.description ?? "In focus now" : isBlocked ? "Waiting for a decision" : "Upcoming"}</span></span><span className="shrink-0 text-xs text-ink-500">{isCurrent ? "Current" : isComplete ? "Edit" : isBlocked ? "Waiting" : "Next"}</span></button></li>;
        })}
      </ol>

      <motion.section layout={motionEnabled} aria-labelledby={`${id}-current`} className="mt-3 rounded-[24px] border border-ink-900/10 bg-white p-5 shadow-soft sm:p-6">
        <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">Active decision · {currentIndex + 1} / {steps.length}</p>
        <h3 id={`${id}-current`} className="mt-2 text-xl font-semibold text-ink-900">{current.label}</h3>
        {current.description ? <p className="mt-1 text-sm leading-relaxed text-ink-700">{current.description}</p> : null}
        <div className="mt-5">{current.content}</div>
        {current.blocked ? <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-ink-700">This step stays visible while the product waits; nothing is silently skipped.</p> : null}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4"><button type="button" disabled={currentIndex === 0} onClick={back} className="rounded-full border border-line px-3.5 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 disabled:opacity-40">Back</button><button type="button" disabled={current.blocked} onClick={continueStep} className="rounded-full bg-ink-900 px-4 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 disabled:cursor-not-allowed disabled:opacity-40">{nextStep ? `Continue to ${nextStep.label}` : "Finish workflow"}</button></div>
      </motion.section>
      {nextStep ? <div className="mt-3 rounded-2xl border border-dashed border-line px-4 py-3"><p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">Next context</p><p className="mt-1 text-sm text-ink-700">{nextStep.label}<span className="ml-2 text-xs text-ink-500">{current.nextPreview ?? nextStep.description}</span></p></div> : null}
      <p aria-live="polite" className="sr-only">{announcement}</p>
    </div>
  );
}

export type PipelineState = "pending" | "current" | "complete" | "failed" | "blocked";
export type PipelineStage = { id: string; label: string; description?: string; state?: PipelineState };
export type StatusPipelineProps = {
  stages: PipelineStage[];
  currentId?: string;
  defaultCurrentId?: string;
  failedId?: string;
  onCurrentIdChange?: (id: string) => void;
  onRetry?: (id: string) => void;
  label?: string;
  className?: string;
};

/** A status path where queued, active, complete and failed states stay spatially continuous. */
export function StatusPipeline({ stages, currentId, defaultCurrentId, failedId, onCurrentIdChange, onRetry, label = "Status pipeline", className }: StatusPipelineProps) {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrentId ?? stages[0]?.id ?? "");
  const [announcement, setAnnouncement] = useState("");
  const activeId = currentId ?? internalCurrent;
  const activeIndex = Math.max(0, stages.findIndex((stage) => stage.id === activeId));
  const motionEnabled = useMotionEnabled();
  if (!stages.length) return null;

  const setActive = (next: string) => { if (currentId === undefined) setInternalCurrent(next); onCurrentIdChange?.(next); };
  const activeStage = stages[activeIndex];
  const failure = failedId ? stages.find((stage) => stage.id === failedId) : undefined;
  const advance = () => {
    if (failure) { setAnnouncement(`${failure.label} needs attention before the pipeline can continue.`); return; }
    const next = stages[activeIndex + 1];
    if (next) { setActive(next.id); setAnnouncement(`${next.label} is now active.`); } else setAnnouncement("Pipeline complete.");
  };

  return (
    <motion.div layout={motionEnabled} aria-label={label} className={cn("w-full max-w-4xl rounded-[24px] border border-line bg-white p-4 shadow-soft sm:p-6", className)}>
      <div className="grid gap-3 md:grid-cols-4">
        {stages.map((stage, index) => {
          const state: PipelineState = stage.state ?? (failedId === stage.id ? "failed" : index < activeIndex ? "complete" : index === activeIndex ? "current" : "pending");
          return <div key={stage.id} className="relative"><button type="button" onClick={() => index <= activeIndex && setActive(stage.id)} disabled={index > activeIndex} aria-current={stage.id === activeId ? "step" : undefined} aria-label={`${stage.label}, ${state}`} className={cn("relative z-10 flex w-full items-center gap-3 rounded-2xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 md:block", state === "current" && "border-ink-900 bg-blush-50", state === "complete" && "border-emerald-200 bg-emerald-50/40", state === "failed" && "border-rose-200 bg-rose-50/50", state === "blocked" && "border-amber-200 bg-amber-50/50", state === "pending" && "border-line bg-cloud-50/60")}><span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs md:mb-3", state === "complete" ? "bg-emerald-200" : state === "failed" ? "bg-rose-200" : state === "blocked" ? "bg-amber-200" : state === "current" ? "bg-ink-900 text-milk" : "bg-white text-ink-400 ring-1 ring-line")}>{state === "complete" ? "✓" : state === "failed" ? "!" : index + 1}</span><span className="min-w-0"><span className="block truncate text-sm font-medium text-ink-900">{stage.label}</span><span className="mt-1 block truncate text-xs text-ink-500">{stage.description}</span><span className="mt-1 block text-[0.625rem] font-medium tracking-[0.08em] text-ink-500 uppercase">{state}</span></span></button>{index < stages.length - 1 ? <span aria-hidden className="absolute top-1/2 right-[-0.75rem] hidden h-px w-3 bg-line md:block" /> : null}</div>;
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cloud-50 px-4 py-3"><p className="text-sm text-ink-700"><strong>{failure ? failure.label : activeStage?.label}</strong>{failure ? " needs attention" : activeStage ? " is active" : ""}</p><div className="flex gap-2">{failure ? <button type="button" onClick={() => { onRetry?.(failure.id); setAnnouncement(`Retry requested for ${failure.label}.`); }} className="rounded-full bg-ink-900 px-3.5 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Retry stage</button> : <button type="button" onClick={advance} className="rounded-full bg-ink-900 px-3.5 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{activeIndex === stages.length - 1 ? "Mark complete" : "Advance stage"}</button>}</div></div>
      <p aria-live="polite" className="sr-only">{announcement}</p>
    </motion.div>
  );
}
