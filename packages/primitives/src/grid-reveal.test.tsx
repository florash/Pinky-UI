import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { GridReveal } from "./reveal/grid-reveal";

describe("GridReveal", () => {
  it("keeps content mounted at all times, collapsed to a zero row when closed", () => {
    const { container } = render(
      <GridReveal open={false}>
        <p>Panel content</p>
      </GridReveal>,
    );
    expect(screen.getByText("Panel content")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveStyle({ gridTemplateRows: "0fr" });
  });

  it("expands to a 1fr row when open", () => {
    const { container } = render(
      <GridReveal open>
        <p>Panel content</p>
      </GridReveal>,
    );
    expect(container.firstElementChild).toHaveStyle({ gridTemplateRows: "1fr" });
  });

  it("marks the collapsed content inert — out of the tab order and off assistive tech — and lifts that once open", () => {
    const { container, rerender } = render(
      <GridReveal open={false} contentProps={{ id: "panel" }}>
        <button type="button">Inside</button>
      </GridReveal>,
    );
    // jsdom doesn't implement the `inert` IDL property getter, only the
    // attribute reflection — check the attribute directly.
    expect(container.querySelector("#panel")).toHaveAttribute("inert");

    rerender(
      <GridReveal open contentProps={{ id: "panel" }}>
        <button type="button">Inside</button>
      </GridReveal>,
    );
    expect(container.querySelector("#panel")).not.toHaveAttribute("inert");
  });

  it("keeps the inner wrapper clipped with min-height: 0, the property that makes the collapse actually work in a grid", () => {
    const { container } = render(
      <GridReveal open={false} contentProps={{ id: "panel" }}>
        <p>Content</p>
      </GridReveal>,
    );
    expect(container.querySelector("#panel")).toHaveStyle({ overflow: "hidden", minHeight: "0" });
  });

  it("leaves content out of inert when inertWhenClosed is false — for a label that must stay the accessible name even while visually clipped", () => {
    const { container } = render(
      <GridReveal open={false} inertWhenClosed={false} contentProps={{ id: "label" }}>
        <span>Menu</span>
      </GridReveal>,
    );
    expect(container.querySelector("#label")).not.toHaveAttribute("inert");
  });

  it("uses grid-template-columns for a column-axis reveal", () => {
    const { container } = render(
      <GridReveal open={false} axis="columns">
        <span>Label</span>
      </GridReveal>,
    );
    expect(container.firstElementChild).toHaveStyle({ gridTemplateColumns: "0fr" });
    expect(container.querySelector("span")?.parentElement).toHaveStyle({ minWidth: "0" });
  });

  it("switches instantly, with no transition, under reduced motion", () => {
    setReducedMotion(true);
    const { container } = render(
      <GridReveal open={false}>
        <p>Content</p>
      </GridReveal>,
    );
    expect(container.firstElementChild).toHaveStyle({ transition: "none" });
  });
});
