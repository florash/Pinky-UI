import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { BrokenOffsetGrid } from "./editorial/broken-offset-grid";
import { CinematicHorizontalGallery } from "./editorial/cinematic-horizontal-gallery";
import { EditorialMosaic } from "./editorial/editorial-mosaic";
import { GalleryListMorph } from "./editorial/gallery-list-morph";
import { SplitScreenGallery } from "./editorial/split-screen-gallery";
import { Curved3DGrid } from "./spatial/curved-3d-grid";
import { InfiniteSpatialCanvas, clampCanvasPan, clampCanvasZoom } from "./spatial/infinite-spatial-canvas";
import { StackSpatial } from "./spatial/stack-spatial";

const ITEMS = [
  { id: "one", label: "One", meta: "01", content: <span>One content</span> },
  { id: "two", label: "Two", meta: "02", content: <span>Two content</span> },
  { id: "three", label: "Three", meta: "03", content: <span>Three content</span> },
];

describe("editorial layouts", () => {
  it("keeps the mosaic and offset grid in deterministic DOM order", () => {
    const { rerender } = render(<EditorialMosaic items={ITEMS} label="Editorial" />);
    expect(screen.getAllByRole("listitem").map((item) => item.textContent?.includes("content"))).toEqual([true, true, true]);

    rerender(<BrokenOffsetGrid items={ITEMS} label="Broken" />);
    expect(screen.getAllByRole("listitem").map((item) => item.textContent?.includes("content"))).toEqual([true, true, true]);
  });

  it("changes the split-screen collection through an explicit control", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<SplitScreenGallery items={ITEMS.map((item) => ({ ...item, primary: item.content, secondary: item.content }))} onIndexChange={onIndexChange} />);

    await user.click(screen.getByRole("button", { name: "Next split-screen item" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("preserves item identity while Gallery and List views change", async () => {
    const user = userEvent.setup();
    render(<GalleryListMorph items={ITEMS.map((item) => ({ id: item.id, title: item.label, meta: item.meta, media: item.content }))} />);

    expect(screen.getByRole("button", { name: "Gallery" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "List" }));

    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("listitem")).toHaveLength(ITEMS.length);
    for (const item of ITEMS) expect(screen.getByText(item.label)).toBeInTheDocument();
  });

  it("maps keyboard selection to the cinematic rail without requiring scroll APIs", () => {
    const onIndexChange = vi.fn();
    render(<CinematicHorizontalGallery items={ITEMS} onIndexChange={onIndexChange} />);
    const rail = screen.getByRole("list", { name: "Cinematic horizontal gallery" });

    fireEvent.keyDown(rail, { key: "ArrowRight" });

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});

describe("spatial layouts", () => {
  it("moves Curved 3D Grid selection with its visible Next control", async () => {
    const user = userEvent.setup();
    render(<Curved3DGrid items={ITEMS} />);

    await user.click(screen.getByRole("button", { name: "Next curved grid item" }));

    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Two · 02")).toBeInTheDocument();
  });

  it("uses one toggle to move Stack → Spatial between arrangements", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(<StackSpatial items={ITEMS} onExpandedChange={onExpandedChange} />);
    const toggle = screen.getByRole("button", { name: "Spread into space" });

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);

    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Stack up" })).toHaveAttribute("aria-pressed", "true");
  });

  it("bounds canvas pan and zoom and exposes a keyboard-independent reset", async () => {
    const user = userEvent.setup();
    expect(clampCanvasPan(240, -80, 80)).toBe(80);
    expect(clampCanvasPan(-240, -80, 80)).toBe(-80);
    expect(clampCanvasZoom(2)).toBe(1.35);

    render(<InfiniteSpatialCanvas items={ITEMS.map((item, index) => ({ ...item, x: index * 80, y: index * 40 }))} />);
    await user.click(screen.getByRole("button", { name: "Zoom in spatial canvas" }));

    expect(screen.getByText("Zoom 110% · 3 items")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset view" })).toBeInTheDocument();
  });

  it("keeps the interaction controls available with reduced motion", () => {
    setReducedMotion(true);
    render(<StackSpatial items={ITEMS} />);

    expect(screen.getByRole("button", { name: "Spread into space" })).toBeEnabled();
    expect(screen.getAllByRole("listitem")).toHaveLength(ITEMS.length);
  });

  it("keeps direct canvas controls available with reduced motion", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<InfiniteSpatialCanvas items={ITEMS.map((item, index) => ({ ...item, x: index * 80, y: index * 40 }))} />);

    await user.click(screen.getByRole("button", { name: "Zoom in spatial canvas" }));
    expect(screen.getByText("Zoom 110% · 3 items")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset view" })).toBeEnabled();
  });
});
