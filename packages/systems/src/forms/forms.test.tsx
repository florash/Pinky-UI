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
import {
  EditablePropertyRail,
  InlineCommandField,
  MorphingInput,
  ProgressiveDisclosureField,
  SegmentedInputComposer,
  SmartSuggestionField,
  TokenField,
  UnitScrubber,
} from "./input-expansion";

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

  it("moves a MorphingInput into editing and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(<MorphingInput label="Release note" defaultValue="Draft" />);
    const trigger = screen.getByRole("button", { name: "Edit Release note" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Release note" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByRole("button", { name: "Edit Release note" })).toHaveFocus());
  });

  it("confirms and removes TokenField values with keyboard input", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<TokenField label="Topics" onTokensChange={change} />);
    const input = screen.getByRole("textbox", { name: "Topics" });
    await user.type(input, "Design{Enter}");
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(change).toHaveBeenCalledWith(["Design"]);
    await user.click(screen.getByRole("button", { name: "Remove Design" }));
    expect(screen.queryByText("Design")).not.toBeInTheDocument();
  });

  it("accepts an explicit SmartSuggestionField choice by keyboard", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(<SmartSuggestionField label="City" options={["Canberra", "Cairns", "Sydney"]} onSelect={select} />);
    const input = screen.getByRole("combobox", { name: "City" });
    await user.type(input, "Canb");
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("Canberra");
    expect(select).toHaveBeenCalledWith("Canberra");
  });

  it("inserts an InlineCommandField token without opening navigation", async () => {
    const user = userEvent.setup();
    render(<InlineCommandField label="Brief" commands={[{ id: "date", label: "date", description: "Due date" }]} />);
    const input = screen.getByRole("combobox", { name: "Brief" });
    await user.type(input, "/");
    expect(screen.getByRole("listbox", { name: "Inline commands" })).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.getByText("/ date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove date command" })).toBeInTheDocument();
  });

  it("reveals and closes only the dependent ProgressiveDisclosureField inputs", async () => {
    const user = userEvent.setup();
    render(<ProgressiveDisclosureField label="Delivery" />);
    await user.click(screen.getByRole("radio", { name: "Ship to an address" }));
    expect(screen.getByRole("textbox", { name: "Address" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Pick up" }));
    expect(screen.queryByRole("textbox", { name: "Address" })).not.toBeInTheDocument();
  });

  it("stops UnitScrubber pointer updates after pointer cleanup", () => {
    const change = vi.fn();
    render(<UnitScrubber label="Radius" defaultValue={20} min={0} max={100} onValueChange={change} />);
    const target = screen.getByTestId("unit-scrubber-target");
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 100, height: 50, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    fireEvent.pointerDown(target, { pointerId: 1, clientX: 50 });
    fireEvent.pointerUp(target, { pointerId: 1, clientX: 50 });
    const callsAfterUp = change.mock.calls.length;
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 90 });
    expect(change.mock.calls.length).toBe(callsAfterUp);
  });

  it("keeps EditablePropertyRail to one active editor and saves its row", async () => {
    const user = userEvent.setup();
    render(<EditablePropertyRail items={[{ id: "status", label: "Status", value: "Review", options: ["Draft", "Review", "Ready"] }, { id: "owner", label: "Owner", value: "Flora" }]} />);
    await user.click(screen.getByRole("button", { name: "Edit Status" }));
    await user.selectOptions(screen.getByRole("combobox"), "Ready");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Owner" })).toBeInTheDocument();
  });

  it("distributes pasted SegmentedInputComposer values across parts", () => {
    render(<SegmentedInputComposer label="Release date" defaultSegments={["", "", ""]} />);
    const year = screen.getByRole("textbox", { name: "Year" });
    fireEvent.paste(year, { clipboardData: { getData: () => "20261122" } });
    expect(screen.getByRole("textbox", { name: "Year" })).toHaveValue("2026");
    expect(screen.getByRole("textbox", { name: "Month" })).toHaveValue("11");
    expect(screen.getByRole("textbox", { name: "Day" })).toHaveValue("22");
  });
});
