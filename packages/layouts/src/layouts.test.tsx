import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { CardFan } from "./stacks/card-fan";
import { DraggableCardStack } from "./stacks/draggable-card-stack";
import { ExpandableBento } from "./grids/expandable-bento";
import { MasonryGallery } from "./galleries/masonry-gallery";
import { PolaroidWall } from "./galleries/polaroid-wall";
import { StackGrid } from "./grids/stack-grid";

const PHOTOS = ["Kyoto", "Lisbon", "Oslo", "Taipei"];

describe("MasonryGallery", () => {
  it("renders every item exactly once", () => {
    render(
      <MasonryGallery label="Photos">
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </MasonryGallery>,
    );

    for (const photo of PHOTOS) {
      expect(screen.getByText(photo)).toBeInTheDocument();
    }
    expect(screen.getByRole("list", { name: "Photos" })).toBeInTheDocument();
  });

  it("does not create empty columns when the item set is smaller than the responsive count", () => {
    render(
      <MasonryGallery label="Small gallery" columns={4}>
        <p>First</p>
        <p>Second</p>
      </MasonryGallery>,
    );

    expect(screen.getByRole("list", { name: "Small gallery" }).children).toHaveLength(2);
  });
});

describe("PolaroidWall", () => {
  it("keeps items in DOM order despite the scatter", () => {
    render(
      <PolaroidWall>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </PolaroidWall>,
    );

    const rendered = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(rendered).toEqual(PHOTOS);
  });

  it("places items identically across renders, so hydration is stable", () => {
    const first = render(
      <PolaroidWall>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </PolaroidWall>,
    );
    const firstHtml = first.container.innerHTML;
    first.unmount();

    const second = render(
      <PolaroidWall>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </PolaroidWall>,
    );

    expect(second.container.innerHTML).toBe(firstHtml);
  });
});

describe("StackGrid", () => {
  it("keeps every item present in both arrangements", async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();

    render(
      <StackGrid onModeChange={onModeChange}>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </StackGrid>,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(PHOTOS.length);

    await user.click(screen.getByRole("button", { name: "Spread out" }));

    expect(onModeChange).toHaveBeenCalledWith("grid");
    expect(screen.getAllByRole("listitem")).toHaveLength(PHOTOS.length);
    expect(screen.getByRole("button", { name: "Stack up" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("DraggableCardStack", () => {
  it("advances with the Next button, so drag is never required", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <DraggableCardStack onDismiss={onDismiss}>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </DraggableCardStack>,
    );

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onDismiss).toHaveBeenCalledWith(0);
  });

  it("announces dismissals politely", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DraggableCardStack>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </DraggableCardStack>,
    );

    await user.click(screen.getByRole("button", { name: "Next" }));

    const live = container.querySelector("[aria-live='polite']");
    await waitFor(() => expect(live?.textContent).toMatch(/dismissed/i));
  });

  it("is operable from the keyboard", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <DraggableCardStack onDismiss={onDismiss}>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </DraggableCardStack>,
    );

    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalled();
  });

  it("keeps its controls with motion disabled", () => {
    setReducedMotion(true);
    render(
      <DraggableCardStack>
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </DraggableCardStack>,
    );

    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
  });
});

describe("ExpandableBento", () => {
  const ITEMS = [
    { id: "a", label: "Motion", preview: <span>Motion</span>, detail: <p>Detail A</p> },
    { id: "b", label: "Light", preview: <span>Light</span>, detail: <p>Detail B</p> },
  ];

  it("expands in place and exposes the relationship", async () => {
    const user = userEvent.setup();
    render(<ExpandableBento items={ITEMS} />);

    const trigger = screen.getByRole("button", { name: "Motion" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Detail A")).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Detail A")).toBeInTheDocument();
    expect(trigger.getAttribute("aria-controls")).toBeTruthy();
  });

  it("collapses on Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<ExpandableBento items={ITEMS} />);

    const trigger = screen.getByRole("button", { name: "Motion" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByText("Detail A")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("keeps only one tile open at a time", async () => {
    const user = userEvent.setup();
    render(<ExpandableBento items={ITEMS} />);

    await user.click(screen.getByRole("button", { name: "Motion" }));
    await user.click(screen.getByRole("button", { name: "Light" }));

    expect(screen.queryByText("Detail A")).not.toBeInTheDocument();
    expect(screen.getByText("Detail B")).toBeInTheDocument();
  });
});

describe("CardFan", () => {
  it("moves selection with the arrow keys", async () => {
    const user = userEvent.setup();
    const onActiveIndexChange = vi.fn();

    render(
      <CardFan onActiveIndexChange={onActiveIndexChange} label="Plans">
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </CardFan>,
    );

    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);

    await user.keyboard("{End}");
    expect(onActiveIndexChange).toHaveBeenCalledWith(PHOTOS.length - 1);
  });

  it("keeps a single tab stop on the active card", async () => {
    const user = userEvent.setup();
    render(
      <CardFan label="Plans">
        {PHOTOS.map((photo) => (
          <p key={photo}>{photo}</p>
        ))}
      </CardFan>,
    );

    const cards = screen.getAllByRole("button");
    expect(cards.map((card) => card.tabIndex)).toEqual([0, -1, -1, -1]);

    await user.tab();
    expect(cards[0]).toHaveFocus();
  });

  it("keeps deck selection usable with reduced motion", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<CardFan label="Plans">{PHOTOS.map((photo) => <p key={photo}>{photo}</p>)}</CardFan>);

    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Lisbon" })).toHaveAttribute("aria-pressed", "true");
  });
});
