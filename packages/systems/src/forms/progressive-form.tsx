"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useId, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type ProgressiveFormStep = {
  id: string;
  label: string;
  description?: string;
  summary?: ReactNode;
  content: ReactNode;
  canContinue?: boolean | (() => boolean);
};
export type ProgressiveFormProps = {
  steps: ProgressiveFormStep[];
  activeId?: string;
  defaultActiveId?: string;
  completedIds?: string[];
  defaultCompletedIds?: string[];
  onActiveIdChange?: (id: string) => void;
  onCompletedIdsChange?: (ids: string[]) => void;
  label?: string;
  className?: string;
};

/** A form that preserves completed context while opening only the next useful section. */
export function ProgressiveForm({
  steps,
  activeId,
  defaultActiveId,
  completedIds,
  defaultCompletedIds = [],
  onActiveIdChange,
  onCompletedIdsChange,
  label = "Progressive form",
  className,
}: ProgressiveFormProps) {
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

  const setActive = (next: string) => {
    if (activeId === undefined) setInternalActive(next);
    onActiveIdChange?.(next);
  };
  const setComplete = (next: string[]) => {
    if (completedIds === undefined) setInternalCompleted(next);
    onCompletedIdsChange?.(next);
  };
  const continueStep = () => {
    const allowed = typeof current.canContinue === "function" ? current.canContinue() : current.canContinue ?? true;
    if (!allowed) {
      setAnnouncement(`Complete ${current.label} before continuing.`);
      return;
    }
    const nextCompleted = completed.includes(current.id) ? completed : [...completed, current.id];
    setComplete(nextCompleted);
    const next = steps[currentIndex + 1];
    if (next) {
      setActive(next.id);
      setAnnouncement(`${current.label} complete. Now editing ${next.label}.`);
    } else {
      setAnnouncement("All form sections are complete.");
    }
  };

  return (
    <div aria-label={label} className={cn("w-full max-w-2xl", className)}>
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCurrent = step.id === current.id;
          const isComplete = completed.includes(step.id) && !isCurrent;
          if (isCurrent) return null;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isComplete && setActive(step.id)}
              disabled={!isComplete}
              aria-label={isComplete ? `Edit ${step.label}` : `${step.label}, upcoming`}
              className={cn("flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20", isComplete ? "border-line bg-white hover:border-ink-900" : "cursor-default border-transparent bg-cloud-50/70")}
            >
              <span className="flex min-w-0 items-center gap-3"><span aria-hidden className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs", isComplete ? "bg-ink-900 text-milk" : "bg-white text-ink-400 ring-1 ring-line")}>{isComplete ? "✓" : index + 1}</span><span className="min-w-0"><span className="block truncate text-sm font-medium text-ink-900">{step.label}</span>{isComplete ? <span className="mt-0.5 block truncate text-xs text-ink-500">{step.summary ?? "Complete · Edit if needed"}</span> : step.description ? <span className="mt-0.5 block truncate text-xs text-ink-500">Next · {step.description}</span> : null}</span></span>
              <span className="shrink-0 text-xs text-ink-500">{isComplete ? "Edit" : "Next"}</span>
            </button>
          );
        })}
      </div>

      <motion.section layout={motionEnabled} aria-labelledby={`${id}-current`} className="mt-3 rounded-[24px] border border-ink-900/10 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div><p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">Section {currentIndex + 1} of {steps.length}</p><h3 id={`${id}-current`} className="mt-2 text-xl font-semibold text-ink-900">{current.label}</h3>{current.description ? <p className="mt-1 text-sm text-ink-700">{current.description}</p> : null}</div>
          <span className="rounded-full bg-blush-50 px-2.5 py-1 text-xs text-ink-700">In focus</span>
        </div>
        <div className="mt-5">{current.content}</div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" disabled={currentIndex === 0} onClick={() => setActive(steps[currentIndex - 1]?.id ?? current.id)} className="rounded-full border border-line px-3.5 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 disabled:cursor-not-allowed disabled:opacity-40">Back</button>
          <button type="button" onClick={continueStep} className="rounded-full bg-ink-900 px-4 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">{nextStep ? `Continue to ${nextStep.label}` : "Complete form"}</button>
        </div>
      </motion.section>
      {nextStep ? <div className="mt-3 rounded-2xl border border-dashed border-line px-4 py-3"><p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">Up next</p><p className="mt-1 text-sm text-ink-700">{nextStep.label}<span className="ml-2 text-xs text-ink-500">{nextStep.description}</span></p></div> : null}
      <p aria-live="polite" className="sr-only">{announcement}</p>
    </div>
  );
}
