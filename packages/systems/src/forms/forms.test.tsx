import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import { ElasticSegmentedControl } from "./elastic-segmented-control";
import { HoldToConfirm } from "./hold-to-confirm";
import { InlineEditMorph } from "./inline-edit-morph";
import { MorphSelect } from "./morph-select";
import { SmartDropzone } from "./smart-dropzone";

describe("Form systems", () => {
  it("moves segmented radio selection and focus with arrows", async () => {
    const user = userEvent.setup();
    render(<ElasticSegmentedControl label="Billing" items={[{ value: "month", label: "Monthly" }, { value: "year", label: "Yearly" }]} />);
    screen.getByRole("radio", { name: "Monthly" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveFocus();
  });

  it("selects a MorphSelect option by keyboard and restores trigger focus", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<MorphSelect label="Format" options={[{ value: "photo", label: "Photo" }, { value: "video", label: "Video" }]} onValueChange={change} />);
    const trigger = screen.getByRole("button", { name: "Format" });
    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(change).toHaveBeenCalledWith("video");
    await waitFor(() => expect(trigger).toHaveFocus());
    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("confirms only after a completed hold and cancels an early release", () => {
    vi.useFakeTimers();
    const confirm = vi.fn();
    render(<HoldToConfirm duration={1000} onConfirm={confirm}>Delete project</HoldToConfirm>);
    const button = screen.getByRole("button", { name: /delete project/i });
    act(() => { fireEvent.pointerDown(button); vi.advanceTimersByTime(500); fireEvent.pointerUp(button); vi.advanceTimersByTime(600); });
    expect(confirm).not.toHaveBeenCalled();
    act(() => { fireEvent.pointerDown(button); vi.advanceTimersByTime(1000); });
    expect(confirm).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("saves and cancels inline edits with Enter and Escape", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<InlineEditMorph label="Display name" defaultValue="Flora He" onValueChange={change} />);
    await user.click(screen.getByRole("button", { name: "Edit Display name" }));
    const input = screen.getByRole("textbox", { name: "Display name" });
    await user.clear(input); await user.type(input, "Flora Pinky{Enter}");
    expect(change).toHaveBeenCalledWith("Flora Pinky");
    await user.click(screen.getByRole("button", { name: "Edit Display name" }));
    await user.type(screen.getByRole("textbox"), " changed{Escape}");
    expect(screen.getByRole("button", { name: "Edit Display name" })).toHaveTextContent("Flora Pinky");
  });

  it("accepts valid local files without claiming an upload", () => {
    const files = vi.fn();
    render(<SmartDropzone label="Choose images" accept="image/*" onFiles={files} />);
    const input = document.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    fireEvent.change(input!, { target: { files: [new File(["x"], "photo.png", { type: "image/png" })] } });
    expect(files).toHaveBeenCalledWith([expect.objectContaining({ name: "photo.png" })]);
    expect(screen.getByText("1 file accepted.")).toBeInTheDocument();
  });

  it("uses an explicit two-press confirmation under reduced motion", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    const confirm = vi.fn();
    render(<HoldToConfirm onConfirm={confirm}>Delete project</HoldToConfirm>);
    const button = screen.getByRole("button", { name: /delete project/i });
    await user.click(button);
    expect(button).toHaveTextContent("Press again to confirm");
    expect(confirm).not.toHaveBeenCalled();
    await user.click(button);
    expect(confirm).toHaveBeenCalledTimes(1);
  });
});
