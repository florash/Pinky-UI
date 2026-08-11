import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FluidTabs } from "./fluid-tabs";

const ITEMS = [
  { id: "preview", label: "Preview", content: <p>Preview panel</p> },
  { id: "code", label: "Code", content: <p>Code panel</p> },
  { id: "props", label: "Props", content: <p>Props panel</p> },
];

function renderTabs(props: Partial<Parameters<typeof FluidTabs>[0]> = {}) {
  return render(<FluidTabs aria-label="Views" items={ITEMS} {...props} />);
}

describe("FluidTabs", () => {
  it("selects the first tab and shows its panel", () => {
    renderTabs();

    expect(screen.getByRole("tab", { name: "Preview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Preview panel");
  });

  it("swaps the panel when another tab is clicked", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole("tab", { name: "Code" }));

    expect(screen.getByRole("tab", { name: "Code" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveAttribute("aria-selected", "false");
    // Exactly one panel — a lingering panel would describe stale content.
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Code panel");
  });

  it("moves selection with the arrow keys and wraps around", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.tab();
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Code" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Code" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Props" })).toHaveAttribute("aria-selected", "true");
  });

  it("jumps to the ends with Home and End", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.tab();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Props" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps a single tab stop, on the selected tab", async () => {
    const user = userEvent.setup();
    renderTabs();

    const tabIndexes = () => screen.getAllByRole("tab").map((tab) => tab.tabIndex);
    expect(tabIndexes()).toEqual([0, -1, -1]);

    await user.click(screen.getByRole("tab", { name: "Code" }));
    expect(tabIndexes()).toEqual([-1, 0, -1]);
  });

  it("skips disabled tabs when navigating by keyboard", async () => {
    const user = userEvent.setup();
    render(
      <FluidTabs
        aria-label="Views"
        items={[
          { id: "a", label: "A" },
          { id: "b", label: "B", disabled: true },
          { id: "c", label: "C" },
        ]}
      />,
    );

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "false");
  });

  it("reports changes and honours a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ value: "preview", onValueChange });

    await user.click(screen.getByRole("tab", { name: "Code" }));

    expect(onValueChange).toHaveBeenCalledWith("code");
    // Controlled: the parent owns the state, so nothing moved on its own.
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveAttribute("aria-selected", "true");
  });

  it("links every panel to the tab that controls it", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole("tab", { name: "Props" }));

    const tab = screen.getByRole("tab", { name: "Props" });
    const panel = screen.getByRole("tabpanel");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });
});
