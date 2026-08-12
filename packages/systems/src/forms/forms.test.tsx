import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import { ElasticSegmentedControl } from "./elastic-segmented-control";
import { ExpandingSearch } from "./expanding-search";
import { HoldToConfirm } from "./hold-to-confirm";
import { InlineEditField } from "./inline-edit-field";
import { InlineEditMorph } from "./inline-edit-morph";
import { MorphSelect } from "./morph-select";
import { ProgressiveForm } from "./progressive-form";
import { SmartDropzone } from "./smart-dropzone";
import { ValidationField } from "./validation-field";

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

  it("keeps the field context attached while saving an inline edit", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<InlineEditField label="Workspace name" defaultValue="Pinky" description="Shared with the team." onValueChange={change} />);
    const trigger = screen.getByRole("button", { name: "Edit Workspace name" });
    await user.click(trigger);
    await user.clear(screen.getByRole("textbox", { name: "Workspace name" }));
    await user.type(screen.getByRole("textbox", { name: "Workspace name" }), "Studio");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(change).toHaveBeenCalledWith("Studio");
    await waitFor(() => expect(screen.getByRole("button", { name: "Edit Workspace name" })).toHaveFocus());
    expect(screen.getByText("Shared with the team.")).toBeInTheDocument();
  });

  it("opens ExpandingSearch and restores trigger focus on Escape", async () => {
    const user = userEvent.setup();
    render(<ExpandingSearch label="Workspace search" results={<p>Results</p>} />);
    const trigger = screen.getByRole("button", { name: "Workspace search" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Workspace search" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByRole("button", { name: "Workspace search" })).toHaveFocus());
  });

  it("publishes readable validation state while a value is corrected", async () => {
    const user = userEvent.setup();
    render(<ValidationField label="Email" defaultValue="bad" validate={(value) => value.includes("@") ? { status: "valid", message: "Looks good." } : { status: "invalid", message: "Add an @." }} />);
    const input = screen.getByRole("textbox", { name: "Email" });
    await user.click(input); await user.tab();
    expect(screen.getByRole("alert")).toHaveTextContent("Add an @.");
    await user.click(input); await user.type(input, "@studio.com");
    expect(screen.getByText("Looks good.")).toBeInTheDocument();
  });

  it("moves ProgressiveForm context to the next section", async () => {
    const user = userEvent.setup();
    render(<ProgressiveForm steps={[{ id: "one", label: "Brief", content: <p>Brief content</p> }, { id: "two", label: "Audience", content: <p>Audience content</p> }]} />);
    await user.click(screen.getByRole("button", { name: "Continue to Audience" }));
    expect(screen.getByRole("heading", { name: "Audience" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Brief" })).toBeInTheDocument();
  });

  it("keeps ExpandingSearch usable when motion is reduced", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<ExpandingSearch label="Search" />);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });
});
