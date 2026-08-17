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
} from "@pinky-ui/systems";
import { useState, type ReactNode } from "react";

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export const RESPONSE_EXPANSION_PREVIEWS: Record<string, ReactNode> = {
  "optimistic-action": <OptimisticPreview />,
  "undoable-action": <UndoableAction />,
  "inline-save-state": <InlineSaveState onSave={() => wait(380)} />,
  "async-action-control": <AsyncActionControl onAction={() => wait(460)} />,
  "progressive-status": <ProgressiveStatus autoStart interval={750} />,
  "multi-stage-progress": <MultiStageProgress />,
  "background-task-row": <BackgroundTaskRow />,
  "queued-action": <QueuedAction />,
  "retry-surface": <RetryPreview />,
  "completion-morph": <CompletionMorph onComplete={() => wait(520)} />,
  "partial-success-summary": <PartialSuccessSummary />,
  "conflict-resolution": <ConflictResolution />,
  "connection-state": <ConnectionState />,
  "resumable-progress": <ResumableProgress />,
  "delayed-feedback-escalation": <DelayedFeedbackEscalation fastDelay={300} detailedDelay={900} />,
};

function OptimisticPreview() {
  const [failNext, setFailNext] = useState(false);
  return <div className="w-full space-y-3"><OptimisticAction onAction={async () => { await wait(520); if (failNext) { setFailNext(false); return false; } return true; }} /><button type="button" onClick={() => setFailNext(true)} className="text-xs text-ink-500 underline decoration-line-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Make the next confirmation fail</button></div>;
}

function RetryPreview() {
  const [failNext, setFailNext] = useState(false);
  return <div className="w-full space-y-3"><RetrySurface onRetry={async () => { await wait(420); if (failNext) { setFailNext(false); return false; } return true; }} /><button type="button" onClick={() => setFailNext(true)} className="text-xs text-ink-500 underline decoration-line-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">Make the next retry fail</button></div>;
}
