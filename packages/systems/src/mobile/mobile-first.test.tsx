import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import {
  AuthCompletionMorph,
  ContextualBottomBar,
  FloatingActionIsland,
  FloatingTabBar,
  KeyboardAwareComposer,
  MobileSelectionBar,
  ProgressiveAuthSurface,
  ScrollCompactBottomNav,
  SearchMorphHeader,
  StickyBottomCTA,
  SwipeToConfirm,
} from "./mobile-first";

describe("Mobile-first systems", () => {
  it("changes the structural active destination in a floating tab bar", async () => {
    const user = userEvent.setup();
    render(<FloatingTabBar />);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("button", { name: "Search" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("transforms the same bottom region into contextual selection actions", async () => {
    const user = userEvent.setup();
    const clear = vi.fn();
    const { rerender } = render(<ContextualBottomBar selectedCount={0} onClearSelection={clear} />);
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    rerender(<ContextualBottomBar selectedCount={3} onClearSelection={clear} />);
    expect(screen.getByRole("toolbar", { name: "Selection actions" })).toHaveTextContent("3 selected");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it("uses hysteresis for scroll compact navigation and restores on upward movement", () => {
    const { container } = render(<ScrollCompactBottomNav />);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 120, writable: true });
    fireEvent.scroll(window);
    expect(container.querySelector("[data-compact=\"true\"]")).toBeInTheDocument();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 80, writable: true });
    fireEvent.scroll(window);
    expect(container.querySelector("[data-compact=\"false\"]")).toBeInTheDocument();
  });

  it("keeps the sticky CTA disabled while work is pending", () => {
    const action = vi.fn();
    render(<StickyBottomCTA label="Publish" pending onAction={action} />);
    expect(screen.getByRole("button", { name: "Working…" })).toBeDisabled();
  });

  it("expands a compact action island into local creation choices", async () => {
    const user = userEvent.setup();
    render(<FloatingActionIsland label="Create" />);
    const trigger = screen.getByRole("button", { name: "Open Create actions" });
    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Close Create actions" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "New note" })).toBeInTheDocument();
  });

  it("confirms a swipe action and keeps Enter as an accessible fallback", async () => {
    const user = userEvent.setup();
    const confirm = vi.fn();
    render(<SwipeToConfirm label="Archive project" onConfirm={confirm} />);
    const slider = screen.getByRole("slider", { name: "Archive project" });
    slider.focus();
    await user.keyboard("{Enter}");
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("confirmed");
  });

  it("restores focus when Search Morph Header closes with Escape", async () => {
    const user = userEvent.setup();
    render(<SearchMorphHeader title="Explore" />);
    const trigger = screen.getByRole("button", { name: "Search" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox")).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("submits a keyboard-aware composer without losing its surface", async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<KeyboardAwareComposer onSubmit={submit} />);
    const input = screen.getByRole("textbox", { name: "Add a note" });
    await user.type(input, "A considered note");
    await user.keyboard("{Control>}{Enter}{/Control}");
    expect(submit).toHaveBeenCalledWith("A considered note");
    expect(input).toHaveValue("");
  });

  it("reveals a safe-area-aware selection bar after a source is selected", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(<MobileSelectionBar onAction={action} />);
    await user.click(screen.getByRole("button", { name: "North star, Draft" }));
    expect(screen.getByRole("toolbar", { name: "Mobile selection actions" })).toHaveTextContent("1 selected");
    await user.click(screen.getByRole("button", { name: "Move" }));
    expect(action).toHaveBeenCalledWith(["one"]);
  });

  it("moves through progressive authentication without showing every field at once", async () => {
    const user = userEvent.setup();
    render(<ProgressiveAuthSurface />);
    await user.type(screen.getByRole("textbox", { name: "Email address" }), "flora@example.com");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("button", { name: /verification code/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /verification code/i }));
    expect(screen.getByRole("textbox", { name: "Verification code" })).toBeInTheDocument();
  });

  it("keeps completion state attached and clears its pending timer on unmount", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<AuthCompletionMorph />);
    await user.click(screen.getByRole("button", { name: "Complete sign in" }));
    await waitFor(() => expect(screen.getByText("Checking your access.")).toBeInTheDocument(), { timeout: 800 });
    await waitFor(() => expect(screen.getByText("Welcome in.")).toBeInTheDocument(), { timeout: 1500 });
    unmount();
  });

  it("keeps mobile surfaces readable with motion disabled", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<><SearchMorphHeader /><AuthCompletionMorph /></>);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
