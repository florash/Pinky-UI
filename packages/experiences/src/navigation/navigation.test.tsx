import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CursorPreviewNav } from "./cursor-preview-nav";
import { LiquidNavbar } from "./liquid-navbar";
import { MorphMenu } from "./morph-menu";

const ITEMS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "notes", label: "Notes" },
];

describe("LiquidNavbar", () => {
  it("selects items and reports the active id", async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();
    render(<LiquidNavbar items={ITEMS} onActiveChange={onActiveChange} />);

    await user.click(screen.getByRole("button", { name: "Work" }));
    expect(onActiveChange).toHaveBeenCalledWith("work");
    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute("aria-pressed", "true");
  });

  it("moves selection and focus with arrow keys", async () => {
    const user = userEvent.setup();
    render(<LiquidNavbar items={ITEMS} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Home" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Work" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute("aria-pressed", "true");
  });

  it("uses page semantics for links", () => {
    render(
      <LiquidNavbar
        activeId="work"
        items={ITEMS.map((item) => ({ ...item, href: `/${item.id}` }))}
      />,
    );
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });
});

describe("MorphMenu", () => {
  it("opens, closes with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(
      <MorphMenu
        items={[
          { id: "work", label: "Work", href: "/work" },
          { id: "about", label: "About", href: "/about" },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: /menu/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Site navigation" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});

describe("CursorPreviewNav", () => {
  it("reveals preview media for keyboard focus while link labels remain stable", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CursorPreviewNav
        items={[
          { id: "pinky", label: "Pinky UI", href: "/pinky", image: "/pinky.jpg" },
        ]}
      />,
    );

    await user.tab();
    expect(screen.getByRole("link", { name: /pinky ui/i })).toHaveFocus();
    await waitFor(() => expect(container.querySelector("[data-pinky-preview]")).toBeInTheDocument());
    expect(container.querySelector("[data-pinky-preview] img")).toHaveAttribute("src", "/pinky.jpg");
  });
});
