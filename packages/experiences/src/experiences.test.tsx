import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { allExperiences } from "@pinky/registry";
import { BubbleField } from "./backgrounds/bubble-field";
import { SoftMeshBackground } from "./backgrounds/soft-mesh-background";
import { MagneticCtaHero } from "./heroes/magnetic-cta-hero";
import { MorphingHero } from "./heroes/morphing-hero";
import { OrbitMenu } from "./spatial/orbit-menu";
import { SpatialCarousel } from "./spatial/spatial-carousel";
import { BlurRouteTransition } from "./transitions/blur-route-transition";
import { SharedElementTransition } from "./transitions/shared-element-transition";

describe("experience accessibility and lifecycle", () => {
  it("keeps shared route elements as real links", () => {
    render(
      <SharedElementTransition name="case study" href="/work/pinky">
        Pinky case study
      </SharedElementTransition>,
    );

    expect(screen.getByRole("link", { name: "Pinky case study" })).toHaveAttribute("href", "/work/pinky");
  });

  it("replaces route content and focuses the region when motion is reduced", async () => {
    setReducedMotion(true);
    const { rerender } = render(
      <BlurRouteTransition transitionKey="one">
        <p>First route</p>
      </BlurRouteTransition>,
    );

    rerender(
      <BlurRouteTransition transitionKey="two">
        <p>Second route</p>
      </BlurRouteTransition>,
    );

    expect(screen.getByText("Second route")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Second route").parentElement?.parentElement).toHaveFocus());
  });

  it("opens an orbit menu in DOM order, supports arrows and restores focus", async () => {
    const user = userEvent.setup();
    render(
      <OrbitMenu
        items={[
          { id: "save", label: "Save" },
          { id: "share", label: "Share" },
          { id: "archive", label: "Archive" },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open Actions" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).toHaveFocus());
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Share" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("announces carousel changes and supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <SpatialCarousel
        items={[
          { id: "one", label: "First", content: <div>One</div> },
          { id: "two", label: "Second", content: <div>Two</div> },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByText("Second", { selector: "span" })).toHaveAttribute("aria-live", "polite");
    screen.getByRole("region", { name: "Carousel" }).focus();
    await user.keyboard("{Home}");
    expect(screen.getByText("First", { selector: "span" })).toBeInTheDocument();
  });

  it("caps deterministic bubbles and preserves readable hero actions", () => {
    const { container, rerender } = render(
      <BubbleField count={99} disabled>
        <span>Calm content</span>
      </BubbleField>,
    );
    const bubbleCount = container.querySelectorAll("[aria-hidden] > span").length;
    expect(bubbleCount).toBe(18);

    rerender(
      <MagneticCtaHero
        title="Design with restraint"
        primaryAction={{ label: "Read the guide", href: "/guide" }}
        spotlight={false}
        disabled
      />,
    );
    expect(screen.getByRole("heading", { name: "Design with restraint" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read the guide" })).toHaveAttribute("href", "/guide");
  });

  it("flattens representative Hero and Background experiences for reduced motion", () => {
    setReducedMotion(true);
    const { container, rerender } = render(
      <MorphingHero title="A calm opening" media={<div>Persistent artwork</div>} />,
    );
    expect(container.querySelector("section")).not.toHaveStyle({ minHeight: "150vh" });
    expect(screen.getByText("Persistent artwork")).toBeVisible();

    rerender(
      <SoftMeshBackground>
        <p>Readable foreground</p>
      </SoftMeshBackground>,
    );
    expect(screen.getByText("Readable foreground")).toBeVisible();
    expect(container.querySelector<HTMLElement>("[aria-hidden] span")?.style.willChange).toBe("");
  });

  it("registers every production experience once with a live-ready status", () => {
    expect(allExperiences).toHaveLength(31);
    expect(new Set(allExperiences.map((item) => item.slug))).toHaveProperty("size", 31);
    expect(allExperiences.every((item) => item.status === "ready")).toBe(true);
    expect(allExperiences.every((item) => item.demoPath.endsWith(`#${item.slug}`))).toBe(true);
  });
});
