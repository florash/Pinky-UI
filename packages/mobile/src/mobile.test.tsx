import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { DragToDismiss } from "./native/drag-to-dismiss";
import { DynamicIslandLayer } from "./native/dynamic-island-layer";
import { GlassLayer } from "./native/glass-layer";

describe("GlassLayer", () => {
  it("renders its content", () => {
    render(
      <GlassLayer edge="bottom">
        <p>Tab bar</p>
      </GlassLayer>,
    );
    expect(screen.getByText("Tab bar")).toBeInTheDocument();
  });
});

describe("DynamicIslandLayer", () => {
  it("starts compact and expands on tap, announcing the state to assistive tech", async () => {
    const user = userEvent.setup();
    render(<DynamicIslandLayer label="Delivery" compact={<span>2 items</span>} expanded={<span>Arriving in 4 minutes</span>} />);

    const trigger = screen.getByRole("button", { name: "Expand Delivery" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("2 items")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Collapse Delivery" })).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText("Arriving in 4 minutes")).toBeInTheDocument();
  });

  it("is a controlled component when `state` is provided", async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    render(
      <DynamicIslandLayer
        label="Call"
        state="compact"
        onStateChange={onStateChange}
        compact={<span>Calling…</span>}
        expanded={<span>Call details</span>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Expand Call" }));
    expect(onStateChange).toHaveBeenCalledWith("expanded");
    // Controlled: the visible state does not change until the parent passes state="expanded".
    expect(screen.getByText("Calling…")).toBeInTheDocument();
  });
});

describe("DragToDismiss", () => {
  it("renders its content", () => {
    render(
      <DragToDismiss onDismiss={vi.fn()}>
        <p>Photo</p>
      </DragToDismiss>,
    );
    expect(screen.getByText("Photo")).toBeInTheDocument();
  });

  it("renders a plain, non-draggable wrapper with reduced motion so a consumer's own close control is the only path", () => {
    setReducedMotion(true);
    const { container } = render(
      <DragToDismiss onDismiss={vi.fn()}>
        <p>Photo</p>
      </DragToDismiss>,
    );
    expect(screen.getByText("Photo")).toBeInTheDocument();
    expect(container.querySelector("[style*='touch-action']")).not.toBeInTheDocument();
  });
});
