import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import {
  AdaptivePopover,
  AnchoredInspector,
  ContextMenuSurface,
  CursorActionSurface,
  EdgeDockedPanel,
  ExpandingActionSurface,
  FollowAnchorSurface,
  MorphingContextSurface,
  NestedSurfaceStack,
  PeekOverlay,
  SelectionToolbar,
  SharedContextSurface,
  SpotlightOverlay,
} from "./contextual-surfaces";
import { Tooltip } from "./tooltip";

describe("Overlay and contextual surface systems", () => {
  it("rebinds an anchored inspector without losing the source list", async () => {
    const user = userEvent.setup();
    render(<AnchoredInspector items={[{ id: "one", label: "One", value: "Ready" }, { id: "two", label: "Two", value: "Attached" }]} />);
    await user.click(screen.getByRole("button", { name: /Two/ }));
    expect(screen.getByRole("button", { name: /One/ })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Two inspector" })).toHaveTextContent("Attached");
  });

  it("opens an adaptive popover and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<AdaptivePopover label="Open details" title="Details">Readable context</AdaptivePopover>);
    const trigger = screen.getByRole("button", { name: /Open details/ });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Details" })).toHaveTextContent("Readable context");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Details" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("supports explicit and outside dismissal for a context menu surface", async () => {
    const user = userEvent.setup();
    render(<ContextMenuSurface />);
    await user.click(screen.getByRole("button", { name: /Right-click or open actions/ }));
    expect(screen.getByRole("region", { name: "Context actions" })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole("region", { name: "Context actions" })).not.toBeInTheDocument());
  });

  it("reveals a selection toolbar only after a source is selected", async () => {
    const user = userEvent.setup();
    render(<SelectionToolbar items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }]} />);
    expect(screen.queryByRole("toolbar", { name: "Selection toolbar" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^One/ }));
    expect(screen.getByRole("toolbar", { name: "Selection toolbar" })).toHaveTextContent("1 selected");
    await user.click(screen.getByRole("button", { name: "Clear" }));
    await waitFor(() => expect(screen.queryByRole("toolbar", { name: "Selection toolbar" })).not.toBeInTheDocument());
  });

  it("keeps a peek overlay tied to the selected source", async () => {
    const user = userEvent.setup();
    render(<PeekOverlay />);
    await user.click(screen.getByRole("button", { name: /Release notes/ }));
    expect(screen.getByRole("dialog", { name: /Release notes preview/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close peek" }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: /Release notes preview/ })).not.toBeInTheDocument());
  });

  it("moves through a nested surface with Back and Escape", async () => {
    const user = userEvent.setup();
    render(<NestedSurfaceStack />);
    await user.click(screen.getByRole("button", { name: "Open layered settings" }));
    await user.click(screen.getByRole("button", { name: "Open access" }));
    expect(screen.getByRole("dialog", { name: "Access details" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("dialog", { name: "Account surface" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Account surface" })).not.toBeInTheDocument());
  });

  it("opens and closes a local spotlight while preserving the target", async () => {
    const user = userEvent.setup();
    render(<SpotlightOverlay />);
    const target = screen.getByRole("button", { name: /Primary action/ });
    await user.click(target);
    expect(screen.getByRole("dialog", { name: "Spotlight context" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Spotlight context" })).not.toBeInTheDocument());
    expect(target).toHaveFocus();
  });

  it("supports a cursor action surface through keyboard focus and pinning", async () => {
    const user = userEvent.setup();
    render(<CursorActionSurface />);
    const source = screen.getByRole("button", { name: /Surface/ });
    await user.click(source);
    expect(source).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Inspect layer" })).toBeInTheDocument();
  });

  it("docks a panel and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<EdgeDockedPanel />);
    const trigger = screen.getByRole("button", { name: "Open panel" });
    await user.click(trigger);
    expect(screen.getByRole("region", { name: "Docked context panel" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("region", { name: "Docked context panel" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("expands object actions in place", async () => {
    const user = userEvent.setup();
    render(<ExpandingActionSurface />);
    await user.click(screen.getByRole("button", { name: /More actions/ }));
    const toolbar = screen.getByRole("toolbar", { name: "Project actions" });
    expect(toolbar).toHaveTextContent("Duplicate");
    expect(toolbar).not.toHaveAttribute("inert");
    fireEvent.keyDown(document, { key: "Escape" });
    // GridReveal keeps the surface mounted and clips it via CSS rather than
    // unmounting; `inert` is what takes it off the tab order and assistive
    // tech now.
    await waitFor(() => expect(screen.getByRole("toolbar", { name: "Project actions" })).toHaveAttribute("inert"));
  });

  it("keeps context attached while a source moves", async () => {
    const user = userEvent.setup();
    render(<FollowAnchorSurface />);
    await user.click(screen.getByRole("button", { name: "→" }));
    expect(screen.getByRole("status")).toHaveTextContent("46% horizontal");
  });

  it("rebinds one shared context surface across peer sources", async () => {
    const user = userEvent.setup();
    render(<SharedContextSurface />);
    await user.click(screen.getByRole("button", { name: /^Signals/ }));
    expect(screen.getByRole("region", { name: "Shared context surface" })).toHaveTextContent("Signals");
    expect(screen.getByRole("button", { name: /^Overview/ })).toHaveAttribute("aria-selected", "false");
  });

  it("morphs into an editor and returns focus with Escape", async () => {
    const user = userEvent.setup();
    render(<MorphingContextSurface />);
    const trigger = screen.getByRole("button", { name: /Context note/ });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Context note" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps contextual surfaces usable when motion is reduced", () => {
    setReducedMotion(true);
    render(<><AdaptivePopover /><SelectionToolbar /><NestedSurfaceStack /></>);
    expect(screen.getAllByRole("button", { name: /Open context/ })[0]).toBeInTheDocument();
    expect(screen.getByText("Select an item to reveal its local actions.")).toBeInTheDocument();
  });
});

describe("Tooltip without a hover-capable pointer", () => {
  it("opens on tap, closes on an outside tap, and still fires the trigger's own click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Tooltip content="Delete this item">
          <button type="button" onClick={onClick}>Delete</button>
        </Tooltip>
        <p>Outside</p>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Delete" });
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Delete this item");

    await user.click(screen.getByText("Outside"));
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete this item">
        <button type="button">Delete</button>
      </Tooltip>,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });
});
