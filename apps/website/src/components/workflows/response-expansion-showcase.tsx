"use client";

import {
  AsyncActionControl,
  BackgroundTaskRow,
  CompletionMorph,
  ConnectionState,
  ConflictResolution,
  DelayedFeedbackEscalation,
  InlineSaveState,
  MultiStageProgress,
  OptimisticAction,
  PartialSuccessSummary,
  ProgressiveStatus,
  QueuedAction,
  ResumableProgress,
  RetrySurface,
  UndoableAction,
} from "@pinky/systems";
import type { ReactNode } from "react";

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export function ResponseExpansionShowcase() {
  return <section id="response" className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-28"><p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">08 · Action response</p><h2 className="mt-4 max-w-3xl text-section text-balance-tight">Let the system answer the action it owns.</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700">These surfaces cover pending, recovery, background work and completion without turning every state into a toast or a spinner.</p><div className="mt-10"><p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">Action ownership</p><div className="mt-4 grid gap-5 lg:grid-cols-2"><Demo id="optimistic-action" title="Optimistic Action" copy="The visible state leads; confirmation can still roll it back."><OptimisticAction onAction={() => wait(520)} /></Demo><Demo id="undoable-action" title="Undoable Action" copy="The item reflows immediately while its exact recovery remains close by."><UndoableAction items={[{ id: "brief", label: "Project brief", meta: "Ready to archive" }, { id: "notes", label: "Release notes", meta: "Draft" }]} /></Demo><Demo id="inline-save-state" title="Inline Save State" copy="Edited, saving, saved and failed remain attached to the field."><InlineSaveState onSave={() => wait(420)} /></Demo><Demo id="async-action-control" title="Async Action Control" copy="The control owns intent, pending, success and retry as one stable surface."><AsyncActionControl onAction={() => wait(520)} /></Demo><Demo id="retry-surface" title="Retry Surface" copy="A failed region keeps its context and offers a local recovery path."><RetrySurface onRetry={() => wait(420)} /></Demo><Demo id="completion-morph" title="Completion Morph" copy="The working surface becomes the result instead of disappearing into a detached message."><CompletionMorph onComplete={() => wait(560)} /></Demo></div></div><div className="mt-12"><p className="font-mono text-[0.625rem] tracking-[0.15em] text-ink-500 uppercase">Progress, recovery & continuity</p><div className="mt-4 grid gap-5 lg:grid-cols-2"><Demo id="progressive-status" title="Progressive Status" copy="Operational detail appears only after the work earns it."><ProgressiveStatus autoStart interval={850} /></Demo><Demo id="multi-stage-progress" title="Multi-Stage Progress" copy="System execution stages remain named, current and recoverable; this is not a user wizard."><MultiStageProgress /></Demo><Demo id="background-task-row" title="Background Task Row" copy="Long work stays visible without blocking the surface where it began."><BackgroundTaskRow /></Demo><Demo id="queued-action" title="Queued Action" copy="Acceptance, waiting and active work are different states with different next actions."><QueuedAction /></Demo><Demo id="partial-success-summary" title="Partial Success Summary" copy="Successful items stay successful while only failed items enter retry."><PartialSuccessSummary /></Demo><Demo id="conflict-resolution" title="Conflict Resolution" copy="Local and external values stay visible until a deliberate choice resolves them."><ConflictResolution /></Demo><Demo id="connection-state" title="Connection State" copy="Offline and restored states remain actionable without forcing a refresh."><ConnectionState /></Demo><Demo id="resumable-progress" title="Resumable Progress" copy="An interrupted long operation resumes from its known position."><ResumableProgress /></Demo><Demo id="delayed-feedback-escalation" title="Delayed Feedback Escalation" copy="Fast work stays quiet; longer work earns a more detailed status." ><DelayedFeedbackEscalation fastDelay={300} detailedDelay={900} /></Demo></div></div></section>;
}

function Demo({ id, title, copy, children }: { id: string; title: string; copy: string; children: ReactNode }) {
  return <article id={id} className="min-w-0 scroll-mt-24 rounded-[28px] border border-line bg-white/75 p-5 shadow-soft sm:p-6"><h3 className="text-xl text-ink-900">{title}</h3><p className="mt-2 mb-6 text-sm leading-relaxed text-ink-700">{copy}</p>{children}</article>;
}
