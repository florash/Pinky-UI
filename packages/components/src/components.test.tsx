import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { GlowBorder } from "./effects/glow-border";
import { JellyCard } from "./cards/jelly-card";
import { MagneticButton } from "./buttons/magnetic-button";

describe("signature components", () => {
  it("render their content", () => {
    render(
      <JellyCard>
        <h2>Elastic surface</h2>
      </JellyCard>,
    );
    expect(screen.getByRole("heading", { name: "Elastic surface" })).toBeInTheDocument();
  });

  it("keeps Magnetic Button a real button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick}>Get started</MagneticButton>);

    const button = screen.getByRole("button", { name: "Get started" });
    expect(button).toHaveAttribute("type", "button");

    // Reachable and operable from the keyboard, with no pointer involved.
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not let a disabled Magnetic Button fire", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <MagneticButton disabled onClick={onClick}>
        Disabled
      </MagneticButton>,
    );

    await user.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks Glow Border's light as decorative", () => {
    const { container } = render(
      <GlowBorder>
        <p>Plan</p>
      </GlowBorder>,
    );

    const decorations = container.querySelectorAll("[aria-hidden='true']");
    expect(decorations.length).toBeGreaterThan(0);

    for (const decoration of decorations) {
      // Nothing readable or focusable may live inside the light layer — it is
      // scenery, and it must not be announced or reachable.
      expect(decoration.textContent).toBe("");
      expect(decoration.querySelector("a, button, input, [tabindex]")).toBeNull();
    }

    expect(screen.getByText("Plan")).toBeInTheDocument();
  });
});

describe("reduced motion", () => {
  it("still renders Jelly Card's content and surface", () => {
    setReducedMotion(true);
    render(
      <JellyCard>
        <p>Content survives</p>
      </JellyCard>,
    );

    expect(screen.getByText("Content survives")).toBeInTheDocument();
  });

  it("leaves the Magnetic Button untransformed", () => {
    setReducedMotion(true);
    render(<MagneticButton>Anchored</MagneticButton>);

    const button = screen.getByRole("button", { name: "Anchored" });
    const wrapper = button.parentElement;
    expect(wrapper).not.toBeNull();
    // No pointer offset is written at all when motion is off.
    expect(wrapper?.style.transform ?? "none").toMatch(/^(none|)$/);
  });

  it("keeps tabs operable with motion disabled", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    const { FluidTabs } = await import("./navigation/fluid-tabs");

    render(
      <FluidTabs
        aria-label="Views"
        items={[
          { id: "one", label: "One", content: <p>Panel one</p> },
          { id: "two", label: "Two", content: <p>Panel two</p> },
        ]}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two");
  });
});
