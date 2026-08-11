import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { BlurReveal } from "./motion/blur-reveal";
import { LiquidLoader } from "./motion/liquid-loader";
import { SplitTextReveal } from "./text/split-text-reveal";
import { TextScramble } from "./text/text-scramble";
import { CursorProvider, CursorTarget, useCursorTarget } from "./cursor/cursor-provider";
import { HoverImagePreview, HoverImagePreviewItem } from "./cursor/hover-image-preview";
import { LensCursor } from "./cursor/lens-cursor";
import { calculateScrollProgress, calculateViewportProgress } from "./scroll";

function CursorReadout() {
  const target = useCursorTarget();
  return <output data-testid="cursor-label">{target?.label ?? "none"}</output>;
}

describe("cursor context", () => {
  it("switches labels on focus and clears them on blur", async () => {
    const user = userEvent.setup();
    render(
      <CursorProvider>
        <CursorReadout />
        <CursorTarget label="Open">
          <button type="button">Project</button>
        </CursorTarget>
      </CursorProvider>,
    );

    await user.tab();
    expect(screen.getByTestId("cursor-label")).toHaveTextContent("Open");
    await user.tab();
    expect(screen.getByTestId("cursor-label")).toHaveTextContent("none");
  });
});

describe("hover image preview", () => {
  it("reveals an image for keyboard focus without a pointer", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <HoverImagePreview>
        <HoverImagePreviewItem src="/project.jpg">
          <a href="/project">Project</a>
        </HoverImagePreviewItem>
      </HoverImagePreview>,
    );

    await user.tab();
    await waitFor(() => expect(container.querySelector("[data-pinky-preview]")).toBeInTheDocument());
    expect(container.querySelector("img")).toHaveAttribute("src", "/project.jpg");
  });
});

describe("reduced motion fallbacks", () => {
  it("keeps reveal content directly readable", () => {
    setReducedMotion(true);
    render(
      <>
        <BlurReveal>
          <p>Sharp content</p>
        </BlurReveal>
        <SplitTextReveal by="character">Interfaces feel alive.</SplitTextReveal>
        <LiquidLoader label="Saving" />
      </>,
    );

    expect(screen.getByText("Sharp content")).toBeInTheDocument();
    expect(screen.getByLabelText("Interfaces feel alive.")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Saving" })).toHaveAttribute("aria-busy", "true");
  });

  it("keeps the final text accessible while scramble is decorative", () => {
    setReducedMotion(true);
    render(<TextScramble text="Open project" />);

    expect(screen.getByLabelText("Open project")).toBeInTheDocument();
    expect(screen.getByText("Open project")).toBeInTheDocument();
  });
});

describe("cursor media fallback", () => {
  it("does not remove the child media when the lens is disabled", () => {
    render(
      <LensCursor src="/cover.jpg" disabled>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cover.jpg" alt="Project cover" />
      </LensCursor>,
    );

    expect(screen.getByRole("img", { name: "Project cover" })).toBeInTheDocument();
  });
});

describe("scroll calculations", () => {
  it("clamps page and viewport progress to the useful range", () => {
    expect(calculateScrollProgress(100, 1_000, 400)).toBeCloseTo(1 / 6);
    expect(calculateScrollProgress(-10, 1_000, 400)).toBe(0);
    expect(calculateScrollProgress(900, 1_000, 1_000)).toBe(0);
    expect(calculateViewportProgress(-200, 1_000, 500)).toBeCloseTo(0.4);
    expect(calculateViewportProgress(900, 1_000, 500)).toBe(0);
  });
});
