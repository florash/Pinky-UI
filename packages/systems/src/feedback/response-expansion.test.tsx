import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
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
} from "./response-expansion";

describe("Feedback and status response systems", () => {
  it("shows an optimistic state and rolls it back after rejection", async () => {
    const action = vi.fn(async () => false);
    render(<OptimisticAction onAction={action} />);
    const button = screen.getByRole("button", { name: "Follow" });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-busy", "true");
    await waitFor(() => expect(screen.getByRole("button", { name: "Try again" })).toHaveAttribute("aria-pressed", "false"));
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent(/could not confirm/i);
  });

  it("restores an undoable item before its recovery window expires", () => {
    vi.useFakeTimers();
    render(<UndoableAction items={[{ id: "one", label: "Project brief" }]} duration={1000} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    fireEvent.click(screen.getByRole("button", { name: "Undo Project brief" }));
    expect(screen.getByText("Project brief")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("commits an undoable removal after the timer and clears it on unmount", () => {
    vi.useFakeTimers();
    const { unmount } = render(<UndoableAction items={[{ id: "one", label: "Release notes" }]} duration={800} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.queryByRole("button", { name: "Undo Release notes" })).not.toBeInTheDocument();
    unmount();
    act(() => { vi.advanceTimersByTime(800); });
    vi.useRealTimers();
  });

  it("keeps save status beside the edited field", async () => {
    const save = vi.fn(async () => undefined);
    const user = userEvent.setup();
    render(<InlineSaveState defaultValue="Draft" onSave={save} />);
    const input = screen.getByRole("textbox", { name: "Project title" });
    await user.clear(input);
    await user.type(input, "Ready");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByText("Saved in this context.")).toBeInTheDocument());
    expect(save).toHaveBeenCalledWith("Ready");
  });

  it("guards an async action from repeated activation while pending", async () => {
    let resolve: (() => void) | undefined;
    const action = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
    render(<AsyncActionControl onAction={action} />);
    const button = screen.getByRole("button", { name: "Publish" });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(action).toHaveBeenCalledTimes(1);
    resolve?.();
    await waitFor(() => expect(screen.getByRole("button", { name: "Published" })).toBeInTheDocument());
  });

  it("recovers a failed local surface without a global notification", async () => {
    const retry = vi.fn(async () => undefined);
    const user = userEvent.setup();
    render(<RetrySurface onRetry={retry} />);
    await user.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() => expect(screen.getByText("Recovered")).toBeInTheDocument());
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("morphs the working surface into its completion result", async () => {
    const user = userEvent.setup();
    render(<CompletionMorph label="Upload" resultLabel="File ready" onComplete={async () => undefined} />);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    await waitFor(() => expect(screen.getByText("File ready")).toBeInTheDocument());
    expect(screen.getByText("The working surface became the result.")).toBeInTheDocument();
  });

  it("retries only failed items in a partial success summary", async () => {
    const user = userEvent.setup();
    const retry = vi.fn(async () => undefined);
    render(<PartialSuccessSummary items={[{ id: "ok", label: "Cover", state: "success" }, { id: "bad", label: "Archive", state: "failed" }]} onRetry={retry} />);
    await user.click(screen.getByRole("button", { name: "Retry 1 failed" }));
    await waitFor(() => expect(screen.getByText("Every item completed.")).toBeInTheDocument());
    expect(retry).toHaveBeenCalledWith([{ id: "bad", label: "Archive", state: "failed" }]);
  });

  it("resolves a conflict with an explicit version choice", async () => {
    const user = userEvent.setup();
    const resolve = vi.fn();
    render(<ConflictResolution localValue="Mine" remoteValue="Latest" onResolve={resolve} />);
    await user.click(screen.getByRole("button", { name: "Keep mine" }));
    expect(resolve).toHaveBeenCalledWith("mine");
    expect(screen.getByText("Kept your local version.")).toBeInTheDocument();
  });

  it("moves connection state through reconnecting to restored", async () => {
    const user = userEvent.setup();
    render(<ConnectionState onReconnect={async () => undefined} />);
    await user.click(screen.getByRole("button", { name: "Reconnect" }));
    await waitFor(() => expect(screen.getByText(/connection restored/i)).toBeInTheDocument());
  });

  it("moves a background task from running to complete", async () => {
    const user = userEvent.setup();
    render(<BackgroundTaskRow defaultProgress={42} />);
    await user.click(screen.getByRole("button", { name: "Advance" }));
    await user.click(screen.getByRole("button", { name: "Advance" }));
    expect(screen.getByRole("status")).toHaveTextContent(/complete/i);
  });

  it("keeps queued work distinct from active work", async () => {
    const user = userEvent.setup();
    render(<QueuedAction />);
    expect(screen.getByRole("status")).toHaveTextContent(/queued/i);
    await user.click(screen.getByRole("button", { name: "Start when ready" }));
    expect(screen.getByRole("status")).toHaveTextContent(/starting/i);
  });

  it("advances and retries a named system stage with reduced motion", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<MultiStageProgress defaultIndex={0} stages={[{ id: "one", label: "Upload", detail: "Receive" }, { id: "two", label: "Process", detail: "Prepare" }]} />);
    await user.click(screen.getByRole("button", { name: "Simulate failure" }));
    expect(screen.getByRole("status")).toHaveTextContent(/failed stage/i);
    await user.click(screen.getByRole("button", { name: "Retry stage" }));
    expect(screen.getByRole("button", { name: "Advance stage" })).toBeInTheDocument();
  });

  it("reveals progressive status details and cleans delayed transitions", () => {
    vi.useFakeTimers();
    const { unmount } = render(<ProgressiveStatus autoStart interval={100} steps={["Processing", "Optimizing", "Complete"]} />);
    act(() => { vi.advanceTimersByTime(100); });
    expect(screen.getByRole("status")).toHaveTextContent(/2 of 3/);
    unmount();
    act(() => { vi.advanceTimersByTime(500); });
    vi.useRealTimers();
  });

  it("resumes from a saved position and retains readable progress", async () => {
    const user = userEvent.setup();
    render(<ResumableProgress defaultProgress={56} />);
    expect(screen.getByRole("status")).toHaveTextContent(/paused at 56%/i);
    await user.click(screen.getByRole("button", { name: "Resume" }));
    expect(screen.getByRole("status")).toHaveTextContent(/resuming/i);
  });

  it("escalates delayed feedback only after its thresholds", () => {
    vi.useFakeTimers();
    render(<DelayedFeedbackEscalation fastDelay={100} detailedDelay={300} />);
    fireEvent.click(screen.getByRole("button", { name: "Run save" }));
    expect(screen.getByRole("status")).toHaveTextContent(/no loading flash/i);
    act(() => { vi.advanceTimersByTime(100); });
    expect(screen.getByRole("status")).toHaveTextContent(/subtle state/i);
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByRole("status")).toHaveTextContent(/taking longer/i);
    vi.useRealTimers();
  });
});
