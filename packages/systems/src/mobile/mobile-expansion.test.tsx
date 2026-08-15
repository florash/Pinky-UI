import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import {
  BottomSearchSheet,
  CardStackBrowse,
  DetentSheet,
  ExpandInPlaceCard,
  FullscreenMediaMorph,
  LongPressSelection,
  MobileValidationMorph,
  MorphingBottomNavigation,
  ProgressiveMobileForm,
  SwipeActions,
} from "./mobile-expansion";

describe("Mobile-first expansion systems", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("morphs active bottom navigation geometry without losing current semantics", async () => {
    const user = userEvent.setup();
    render(<MorphingBottomNavigation />);
    await user.click(screen.getByRole("button", { name: /Search/ }));
    expect(screen.getByRole("button", { name: /Search/ })).toHaveAttribute("aria-current", "page");
  });

  it("opens bottom search, focuses the field and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(<BottomSearchSheet />);
    const trigger = screen.getByRole("button", { name: "Search from the bottom" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Search results" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps three detents selectable by buttons", async () => {
    const user = userEvent.setup();
    render(<DetentSheet />);
    await user.click(screen.getByRole("button", { name: "Open detents" }));
    await user.click(screen.getByRole("button", { name: "Full" }));
    expect(screen.getByText("Detent / full")).toBeInTheDocument();
  });

  it("enters long-press selection and exposes an action toolbar", () => {
    vi.useFakeTimers();
    render(<LongPressSelection />);
    const item = screen.getByRole("button", { name: "North star, Draft" });
    fireEvent.pointerDown(item, { pointerType: "touch" });
    act(() => vi.advanceTimersByTime(540));
    fireEvent.pointerUp(item, { pointerType: "touch" });
    expect(screen.getByRole("toolbar", { name: "Long press selection actions" })).toHaveTextContent("1 selected");
  });

  it("keeps a visible button fallback for swipe actions", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(<SwipeActions onAction={action} />);
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("committed");
  });

  it("moves progressive mobile form answers into editable summaries", async () => {
    const user = userEvent.setup();
    render(<ProgressiveMobileForm />);
    await user.type(screen.getByPlaceholderText("Your name"), "Flora");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: /Name Flora Edit/ })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("A clear next task")).toBeInTheDocument();
  });

  it("keeps the next card behind the current card and supports keyboard browsing", async () => {
    const user = userEvent.setup();
    render(<CardStackBrowse />);
    const current = screen.getByRole("group", { name: "Card Signal" });
    current.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("group", { name: "Card Material" })).toBeInTheDocument();
  });

  it("expands a card in place with disclosure semantics", async () => {
    const user = userEvent.setup();
    render(<ExpandInPlaceCard />);
    const button = screen.getByRole("button", { name: /A quiet surface/ });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/detail belongs directly below/)).toBeInTheDocument();
  });

  it("opens fullscreen media and restores the source focus", async () => {
    const user = userEvent.setup();
    render(<FullscreenMediaMorph />);
    const source = screen.getByRole("button", { name: /Soft study/ });
    await user.click(source);
    expect(screen.getByRole("dialog", { name: "Soft study" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close media" }));
    await waitFor(() => expect(source).toHaveFocus());
  });

  it("keeps validation readable without colour-only state", async () => {
    const user = userEvent.setup();
    render(<MobileValidationMorph />);
    const input = screen.getByRole("textbox", { name: "Email" });
    await user.type(input, "invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Add an @");
  });

  it("keeps the same state machine usable with reduced motion", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<><MorphingBottomNavigation /><BottomSearchSheet /></>);
    await user.click(screen.getByRole("button", { name: "Search from the bottom" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
