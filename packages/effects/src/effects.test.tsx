import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { setPointerCapability, setReducedMotion } from "../../../vitest.setup";
import { BlurReveal } from "./motion/blur-reveal";
import { Confetti } from "./motion/confetti";
import { LiquidLoader } from "./motion/liquid-loader";
import { Marquee } from "./motion/marquee";
import { MaskReveal } from "./motion/mask-reveal";
import { SplitTextReveal } from "./text/split-text-reveal";
import { TextScramble } from "./text/text-scramble";
import { CursorBlend } from "./cursor/cursor-blend";
import { CursorProvider, CursorTarget, useCursorTarget } from "./cursor/cursor-provider";
import { HoverImagePreview, HoverImagePreviewItem } from "./cursor/hover-image-preview";
import { LensCursor } from "./cursor/lens-cursor";
import { LinkPreview, LinkPreviewItem } from "./cursor/link-preview";
import { SiblingDim, SiblingDimItem } from "./motion/sibling-dim";
import { SoftCursor } from "./cursor/soft-cursor";
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

describe("repeated mount/unmount — global-listener cleanup", () => {
  // The shared pointer source (packages/primitives/src/internal/pointer-store.ts)
  // ref-counts subscribers and only attaches its window/document listeners while
  // at least one cursor-family component is mounted. Fifty mount/unmount cycles
  // in the same test — no route change, no tree rebuild — is the case a
  // route-to-route leak check can't see: a single component's own effect
  // cleanup either balances every time or it doesn't.
  const TRACKED_EVENTS = new Set(["pointermove", "pointerdown", "pointerleave", "blur"]);

  function countTrackedListeners() {
    let net = 0;
    const spies = [window, document].map((target) => {
      const add = vi.spyOn(target, "addEventListener");
      const remove = vi.spyOn(target, "removeEventListener");
      return { add, remove };
    });
    return {
      read: () => {
        net = 0;
        for (const { add, remove } of spies) {
          for (const call of add.mock.calls) if (TRACKED_EVENTS.has(call[0])) net += 1;
          for (const call of remove.mock.calls) if (TRACKED_EVENTS.has(call[0])) net -= 1;
        }
        return net;
      },
      restore: () => spies.forEach(({ add, remove }) => { add.mockRestore(); remove.mockRestore(); }),
    };
  }

  it("balances SoftCursor's global pointer listeners over 50 mount/unmount cycles", () => {
    setPointerCapability(true);
    const tracker = countTrackedListeners();

    for (let cycle = 0; cycle < 50; cycle += 1) {
      const { unmount } = render(<SoftCursor />);
      unmount();
    }

    expect(tracker.read()).toBe(0);
    tracker.restore();
  });

  it("balances HoverImagePreview's global pointer listeners over 50 mount/unmount cycles", () => {
    setPointerCapability(true);
    const tracker = countTrackedListeners();

    for (let cycle = 0; cycle < 50; cycle += 1) {
      const { unmount } = render(
        <HoverImagePreview>
          <HoverImagePreviewItem src="/cover.jpg">
            <a href="/project">Project</a>
          </HoverImagePreviewItem>
        </HoverImagePreview>,
      );
      unmount();
    }

    expect(tracker.read()).toBe(0);
    tracker.restore();
  });

  // SiblingDim binds its handlers as plain onPointerEnter/onPointerLeave/onFocus/
  // onBlur JSX props on the DOM node itself, not a manual window/document
  // listener in a useEffect — React's own reconciliation removes them when the
  // element unmounts, so there is no cleanup path here to test.
});

describe("cursor blend", () => {
  it("renders nothing without a confirmed fine pointer, so touch never mounts decorative cursor DOM", () => {
    const { container } = render(<CursorBlend />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("mask reveal without a hover-capable pointer", () => {
  it("never masks a hover-triggered reveal's content — no reveal gesture exists to lift it", () => {
    // The global matchMedia mock answers "no" to every query but reduced-motion,
    // so `usePointerCapability().hasHover` is false here — the touch case.
    const { container } = render(
      <MaskReveal trigger="hover">
        <button type="button">Open case study</button>
      </MaskReveal>,
    );
    const masked = container.querySelector('[style*="clip-path"]');
    expect(masked?.getAttribute("style")).not.toMatch(/clip-path:\s*inset\(0% 0% 100% 0%\)/);
    expect(screen.getByRole("button", { name: "Open case study" })).toBeInTheDocument();
  });
});

describe("link preview", () => {
  it("reveals a card for keyboard focus without a pointer", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LinkPreview>
        <LinkPreviewItem title="Soft Matter" description="A study in restrained motion.">
          <a href="/soft-matter">Soft Matter</a>
        </LinkPreviewItem>
      </LinkPreview>,
    );

    await user.tab();
    await waitFor(() => expect(container.querySelector("[data-pinky-preview]")).toBeInTheDocument());
    expect(screen.getByText("Soft Matter", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("A study in restrained motion.")).toBeInTheDocument();
  });
});

describe("sibling dim", () => {
  it("dims the other items while one is hovered, and clears on leave", async () => {
    setPointerCapability(true);
    const user = userEvent.setup();
    render(
      <SiblingDim>
        <SiblingDimItem id="a">Overview</SiblingDimItem>
        <SiblingDimItem id="b">Pricing</SiblingDimItem>
      </SiblingDim>,
    );

    const overview = screen.getByText("Overview");
    const pricing = screen.getByText("Pricing");

    await user.hover(overview);
    expect(pricing.className).toContain("opacity-45");
    expect(overview.className).not.toContain("opacity-45");

    await user.unhover(overview);
    expect(pricing.className).not.toContain("opacity-45");
  });

  it("never enters a dimmed state without a hover-capable pointer, via the same usePointerCapability gate every hover effect shares", () => {
    render(
      <SiblingDim>
        <SiblingDimItem id="a">Overview</SiblingDimItem>
        <SiblingDimItem id="b">Pricing</SiblingDimItem>
      </SiblingDim>,
    );

    const overview = screen.getByText("Overview");
    const pricing = screen.getByText("Pricing");
    fireEvent.pointerEnter(overview);
    expect(pricing.className).not.toContain("opacity-45");
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

describe("marquee", () => {
  afterEach(() => setReducedMotion(false));

  it("renders two copies of the content for a seamless loop, the second hidden from assistive tech", () => {
    render(
      <Marquee label="Studio names">
        <span>Soft Matter</span>
      </Marquee>,
    );
    const copies = screen.getAllByText("Soft Matter");
    expect(copies).toHaveLength(2);
    expect(copies[1]!.closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it("falls back to a plain scrollable row under reduced motion", () => {
    setReducedMotion(true);
    render(
      <Marquee label="Studio names">
        <span>Soft Matter</span>
      </Marquee>,
    );
    expect(screen.getAllByText("Soft Matter")).toHaveLength(1);
  });
});

describe("confetti", () => {
  afterEach(() => setReducedMotion(false));

  it("renders nothing until trigger increments past its initial value", () => {
    const { container, rerender } = render(<Confetti trigger={0} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Confetti trigger={1} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it("stays inert under reduced motion even when triggered", () => {
    setReducedMotion(true);
    const { container } = render(<Confetti trigger={1} />);
    expect(container).toBeEmptyDOMElement();
  });
});
