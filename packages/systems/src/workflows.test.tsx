import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { ActionUndoBar, AsyncButton, BottomSheet, CommandPalette, EdgeSwipePanel, ExpandableListRow, LongPressAction, MultiStepProgress, ProgressiveStepWorkflow, PullToRefresh, ReorderableList, ShimmerSurface, StatusPipeline, Stepper, SwipeActionRow, ToastProvider, useToast } from "@pinky-ui/systems";
import { moveItem } from "./lists";

function ToastTrigger() { const { toast } = useToast(); return <button type="button" onClick={() => toast({ title: "File saved", action: { label: "Open file", onClick: vi.fn() } })}>Notify</button>; }

describe("Workflow systems", () => {
  it("keeps the shimmer surface readable and static under reduced motion", () => {
    setReducedMotion(true);
    const { container } = render(<ShimmerSurface>Waiting for the preview</ShimmerSurface>);

    expect(screen.getByText("Waiting for the preview")).toBeInTheDocument();
    expect(container.querySelector("i")).not.toBeInTheDocument();
  });

  it("announces a toast, supports its action, and dismisses it", async () => {
    const user = userEvent.setup(); const action = vi.fn();
    function Trigger() { const { toast } = useToast(); return <button type="button" onClick={() => toast({ title: "File saved", action: { label: "Open file", onClick: action } })}>Notify</button>; }
    render(<ToastProvider><Trigger /></ToastProvider>);
    await user.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByRole("status", { name: /file saved/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open file" })); expect(action).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Dismiss" })); await waitFor(() => expect(screen.queryByRole("status", { name: /file saved/i })).not.toBeInTheDocument());
  });

  it("pauses toast expiry while focused", () => {
    vi.useFakeTimers();
    render(<ToastProvider><ToastTrigger /></ToastProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Notify" })); const toast = screen.getByRole("status", { name: /file saved/i });
    fireEvent.mouseEnter(toast); act(() => { vi.advanceTimersByTime(6000); }); expect(toast).toBeInTheDocument();
    fireEvent.mouseLeave(toast); act(() => { vi.advanceTimersByTime(6000); }); vi.useRealTimers(); expect(toast).toHaveStyle({ opacity: "0" });
  });

  it("filters and activates command palette items with keyboard and closes on Escape", async () => {
    const select = vi.fn(); const setOpen = vi.fn();
    render(<CommandPalette open onOpenChange={setOpen} items={[{ id: "new", label: "New document", group: "Create", onSelect: select }, { id: "invite", label: "Invite collaborator", group: "Team", onSelect: vi.fn() }]} />);
    const input = screen.getByRole("combobox"); fireEvent.change(input, { target: { value: "new" } }); expect(screen.getByRole("option", { name: /new document/i })).toBeInTheDocument(); fireEvent.keyDown(input, { key: "Enter" }); expect(select).toHaveBeenCalledTimes(1); expect(setOpen).toHaveBeenCalledWith(false);
    cleanup(); render(<CommandPalette open onOpenChange={setOpen} items={[]} />); fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" }); expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("waits for the exit before restoring focus and unmounting", async () => {
    const user = userEvent.setup();
    function Harness() { const [open, setOpen] = useState(false); return <><button type="button" onClick={() => setOpen(true)}>Open commands</button><CommandPalette open={open} onOpenChange={setOpen} items={[{ id: "new", label: "New document", onSelect: vi.fn() }]} /></>; }

    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open commands" });
    await user.click(trigger);
    const input = screen.getByRole("combobox");
    expect(input).toHaveFocus();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(trigger).not.toHaveFocus();
    const exitingOverlay = screen.queryByRole("presentation");
    if (exitingOverlay) expect(exitingOverlay).toHaveClass("pointer-events-none");
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Command palette" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("closes from outside click and survives a rapid reopen", async () => {
    const user = userEvent.setup();
    function Harness() { const [open, setOpen] = useState(false); return <><button type="button" onClick={() => setOpen(true)}>Open commands</button><CommandPalette open={open} onOpenChange={setOpen} items={[{ id: "new", label: "New document", onSelect: vi.fn() }]} /></>; }

    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open commands" });
    await user.click(trigger);
    fireEvent.mouseDown(screen.getByRole("presentation"));
    expect(trigger).not.toHaveFocus();
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Command palette" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    const input = screen.getByRole("combobox");
    expect(input).toHaveFocus();
    await user.keyboard("{Escape}");
    await user.click(trigger);
    expect(screen.getByRole("combobox")).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("moves AsyncButton through loading and success", async () => {
    const action = vi.fn(async () => undefined);
    function AsyncHarness() { const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle"); return <AsyncButton state={state} onAction={async () => { setState("loading"); await action(); setState("success"); }}>Save</AsyncButton>; }
    render(<AsyncHarness />); const button = screen.getByRole("button", { name: "Save" }); fireEvent.click(button); expect(action).toHaveBeenCalledTimes(1); await waitFor(() => expect(button).toHaveTextContent("Done"));
  });

  it("provides controlled keyboard reorder and a stable move utility", async () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    const reordered = vi.fn(); const items = [{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }];
    render(<ReorderableList items={items} onReorder={reordered} />); const handle = screen.getByRole("button", { name: "Move Alpha" }); fireEvent.keyDown(handle, { key: "ArrowDown" }); expect(reordered).toHaveBeenCalledWith([items[1], items[0]]);
  });

  it("keeps swipe actions out of the tab order until the row is opened", async () => {
    const user = userEvent.setup(); const archive = vi.fn();
    render(<SwipeActionRow actions={[{ label: "Archive", onAction: archive }]}><span>Team notes</span></SwipeActionRow>);
    const toggle = screen.getByRole("button", { name: "Show row actions" }); const action = screen.getByRole("button", { name: "Archive" });
    expect(action).toHaveAttribute("tabindex", "-1"); expect(action).toHaveClass("pointer-events-none");
    await user.click(toggle);
    expect(action).toHaveAttribute("tabindex", "0"); expect(action).not.toHaveClass("pointer-events-none");
    await user.click(action); expect(archive).toHaveBeenCalledTimes(1);
  });

  it("connects an expandable row trigger to its revealed region", async () => {
    const user = userEvent.setup();
    render(<ExpandableListRow summary="Invoice #1042"><p>Due Friday</p></ExpandableListRow>);
    const trigger = screen.getByRole("button", { name: /invoice/i });
    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region")).toHaveAttribute("id", contentId);
    expect(screen.getByRole("region")).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("names progress attention states without relying on colour", () => {
    render(<MultiStepProgress steps={[{ id: "cart", label: "Cart", state: "completed" }, { id: "payment", label: "Payment", state: "error" }]} />);
    expect(screen.getByRole("listitem", { name: "Payment, needs attention" })).toBeInTheDocument();
  });

  it("exposes step semantics and bottom sheet Escape focus restoration", async () => {
    render(<><button type="button">Open filters</button><Stepper steps={[{ id: "one", label: "Plan" }, { id: "two", label: "Build" }]} active={1} /><BottomSheet title="Filters"><p>Filter content</p></BottomSheet></>);
    expect(screen.getByRole("list", { name: "Steps" })).toBeInTheDocument(); expect(screen.getByRole("listitem", { current: "step" })).toHaveTextContent("Build"); fireEvent.click(screen.getByRole("button", { name: "Open filters" }));
    // The standalone sheet is closed; opening is covered by the controlled path below.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    function SheetHarness() { const [open, setOpen] = useState(false); return <><button type="button" onClick={() => setOpen(true)}>Show sheet</button><BottomSheet open={open} onOpenChange={setOpen} title="Filters"><p>Filter content</p></BottomSheet></>; }
    render(<SheetHarness />); const trigger = screen.getByRole("button", { name: "Show sheet" }); trigger.focus(); fireEvent.click(trigger); expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument(); fireEvent.keyDown(document, { key: "Escape" }); await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps keyboard focus inside the bottom sheet while it is open", async () => {
    const user = userEvent.setup();
    function SheetHarness() { const [open, setOpen] = useState(false); return <><button type="button" onClick={() => setOpen(true)}>Show sheet</button><BottomSheet open={open} onOpenChange={setOpen} title="Filters"><button type="button">Apply filters</button></BottomSheet></>; }

    render(<SheetHarness />);
    const trigger = screen.getByRole("button", { name: "Show sheet" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    await user.tab();
    expect(screen.getByRole("button", { name: "Close sheet" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Apply filters" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Close sheet" })).toHaveFocus();
    expect(dialog).toBeInTheDocument();
  });

  it("requires the long-press threshold and cancels early release", () => {
    vi.useFakeTimers(); const action = vi.fn(); render(<LongPressAction duration={500} onLongPress={action}>Select item</LongPressAction>); const button = screen.getByRole("button", { name: "Select item" }); fireEvent.pointerDown(button); act(() => vi.advanceTimersByTime(300)); fireEvent.pointerUp(button); expect(action).not.toHaveBeenCalled(); fireEvent.pointerDown(button); act(() => vi.advanceTimersByTime(500)); expect(action).toHaveBeenCalledTimes(1); fireEvent.pointerUp(button); vi.useRealTimers();
  });

  it("keeps feedback state usable when reduced motion is enabled", () => { setReducedMotion(true); render(<ActionUndoBar message="Item deleted" onUndo={vi.fn()} />); expect(screen.getByRole("status")).toHaveTextContent("Item deleted"); });

  it("keeps Pull to Refresh honest and keyboard reachable", async () => {
    const user = userEvent.setup();
    const refresh = vi.fn();
    render(<PullToRefresh onRefresh={refresh}><p>Studio feed</p></PullToRefresh>);

    expect(screen.getByRole("status", { name: "Refresh content" })).toHaveTextContent(/reveal refresh/i);
    await user.click(screen.getByRole("button", { name: "Refresh" }));
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("settles Pull to Refresh after an async refresh failure", async () => {
    const user = userEvent.setup();
    const refresh = vi.fn(async () => { throw new Error("offline"); });
    render(<PullToRefresh onRefresh={refresh}><p>Studio feed</p></PullToRefresh>);

    await user.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByRole("status", { name: "Refresh content" })).toHaveTextContent(/reveal refresh/i));
  });

  it("requires the Pull to Refresh threshold before invoking the callback", async () => {
    const refresh = vi.fn();
    const { container } = render(<PullToRefresh threshold={64} onRefresh={refresh}><p>Studio feed</p></PullToRefresh>);
    const surface = container.querySelector("[data-pull-state]");
    if (!surface) throw new Error("Pull to Refresh surface was not rendered");

    act(() => {
      fireEvent.pointerDown(surface, { clientY: 0, pointerId: 1, pointerType: "touch" });
      fireEvent.pointerMove(surface, { clientY: 63, pointerId: 1, pointerType: "touch" });
      fireEvent.pointerUp(surface, { clientY: 63, pointerId: 1, pointerType: "touch" });
    });
    expect(refresh).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.pointerDown(surface, { clientY: 0, pointerId: 2, pointerType: "touch" });
      fireEvent.pointerMove(surface, { clientY: 64, pointerId: 2, pointerType: "touch" });
      fireEvent.pointerUp(surface, { clientY: 64, pointerId: 2, pointerType: "touch" });
      await Promise.resolve();
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("tracks Edge Swipe progress and restores focus after Escape", async () => {
    const user = userEvent.setup();
    function EdgeHarness() {
      const [open, setOpen] = useState(false);
      return <><button type="button">Outside</button><EdgeSwipePanel open={open} onOpenChange={setOpen} label="Filters"><button type="button">Apply filters</button></EdgeSwipePanel></>;
    }

    render(<EdgeHarness />);
    const trigger = screen.getByRole("button", { name: "Open Filters" });
    trigger.focus();
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    expect(dialog).toHaveAttribute("aria-label", "Filters");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument();
  });

  it("opens Edge Swipe Panel from a tracked touch gesture", () => {
    const onOpenChange = vi.fn();
    const { container } = render(<EdgeSwipePanel onOpenChange={onOpenChange} label="Filters"><p>Filter content</p></EdgeSwipePanel>);
    const rail = container.querySelector("[aria-hidden='true']");
    if (!rail) throw new Error("Edge rail was not rendered");

    fireEvent.pointerDown(rail, { clientX: 2, clientY: 120, pointerId: 1, pointerType: "touch" });
    fireEvent.pointerMove(rail, { clientX: 190, clientY: 120, pointerId: 1, pointerType: "touch" });
    fireEvent.pointerUp(rail, { clientX: 190, clientY: 120, pointerId: 1, pointerType: "touch" });

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("keeps refresh and edge alternatives usable with reduced motion", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<><PullToRefresh onRefresh={vi.fn()}><p>Feed</p></PullToRefresh><EdgeSwipePanel label="Filters"><p>Filter content</p></EdgeSwipePanel></>);

    await user.click(screen.getByRole("button", { name: "Refresh" }));
    const edgeTrigger = screen.getByRole("button", { name: "Open Filters" });
    await user.click(edgeTrigger);
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(edgeTrigger).toHaveFocus());
  });

  it("keeps ProgressiveStepWorkflow context while advancing", async () => {
    const user = userEvent.setup();
    render(<ProgressiveStepWorkflow steps={[{ id: "draft", label: "Draft", content: <p>Draft content</p> }, { id: "review", label: "Review", content: <p>Review content</p> }]} />);
    await user.click(screen.getByRole("button", { name: "Continue to Review" }));
    expect(screen.getByRole("heading", { name: "Review" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Draft" })).toBeInTheDocument();
  });

  it("advances StatusPipeline and exposes retry for a failed stage", async () => {
    const user = userEvent.setup(); const retry = vi.fn();
    function Harness() { const [failed, setFailed] = useState(false); return <><StatusPipeline stages={[{ id: "queued", label: "Queued" }, { id: "active", label: "Active" }]} failedId={failed ? "active" : undefined} onRetry={(id) => { retry(id); setFailed(false); }} /><button type="button" onClick={() => setFailed(true)}>Fail active</button></>; }
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Advance stage" }));
    await user.click(screen.getByRole("button", { name: "Fail active" }));
    expect(screen.getByRole("button", { name: "Active, failed" })).toHaveAttribute("aria-current", "step");
    await user.click(screen.getByRole("button", { name: "Retry stage" }));
    expect(retry).toHaveBeenCalledWith("active");
  });

  it("keeps StatusPipeline state changes semantic when motion is reduced", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<StatusPipeline stages={[{ id: "queued", label: "Queued" }, { id: "active", label: "Active" }]} />);
    await user.click(screen.getByRole("button", { name: "Advance stage" }));
    expect(screen.getByRole("button", { name: "Active, current" })).toHaveAttribute("aria-current", "step");
  });
});
