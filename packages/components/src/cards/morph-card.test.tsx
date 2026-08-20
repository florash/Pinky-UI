import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import { MorphCard } from "./morph-card";

function renderCard(props: Partial<Parameters<typeof MorphCard>[0]> = {}) {
  return render(
    <MorphCard
      label="Mira Odaka"
      expandedContent={
        <div>
          <p>Full profile</p>
          <button type="button">Follow</button>
        </div>
      }
      {...props}
    >
      <p>Mira Odaka</p>
    </MorphCard>,
  );
}

describe("MorphCard", () => {
  it("starts collapsed, with the trigger describing itself", () => {
    renderCard();

    const trigger = screen.getByRole("button", { name: "Mira Odaka" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("expands into a named dialog", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: "Mira Odaka" }));

    const dialog = screen.getByRole("dialog", { name: "Mira Odaka" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Full profile")).toBeInTheDocument();
  });

  it("closes on Escape and restores focus to the card", async () => {
    const user = userEvent.setup();
    renderCard();

    const trigger = screen.getByRole("button", { name: "Mira Odaka" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    // The panel animates out, so wait for it to actually leave the tree.
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("portals the dialog to document.body, so a filtered ancestor can't break its position", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    await user.click(screen.getByRole("button", { name: "Mira Odaka" }));

    const dialog = screen.getByRole("dialog");
    expect(container.contains(dialog)).toBe(false);
    expect(dialog.closest("body")).toBe(document.body);
  });

  it("moves focus into the panel when it opens", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: "Mira Odaka" }));

    expect(screen.getByRole("button", { name: "Follow" })).toHaveFocus();
  });

  it("opens from the keyboard", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.tab();
    expect(screen.getByRole("button", { name: "Mira Odaka" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("reports open state and can be controlled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderCard({ open: false, onOpenChange });

    await user.click(screen.getByRole("button", { name: "Mira Odaka" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Controlled: the parent decides, so nothing opened on its own.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("locks background scrolling only while open", async () => {
    const user = userEvent.setup();
    renderCard();

    expect(document.body.style.overflow).not.toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Mira Odaka" }));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.overflow).not.toBe("hidden"));
  });

  it("still opens, closes and restores focus with motion disabled", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    renderCard();

    const trigger = screen.getByRole("button", { name: "Mira Odaka" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Mira Odaka" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
