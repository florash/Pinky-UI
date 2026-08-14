import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import {
  AccordionGallery,
  CursorPreviewList,
  DirectionalCardReveal,
  ExpandableContentRow,
  FocusStripCollection,
  HoverImageReveal,
  ListDetailMorph,
  MagazineIndex,
  PeekPanelCollection,
  ProgressiveCollection,
  ScrubPreview,
  SharedPreviewCollection,
} from "./collections";

const surface = (label: string) => <span>{label}</span>;

describe("Collection browsing systems", () => {
  it("changes one cursor preview from keyboard focus and touch-safe click", async () => {
    const user = userEvent.setup();
    render(<CursorPreviewList label="Projects" items={[{ id: "one", label: "One", preview: surface("Preview one") }, { id: "two", label: "Two", preview: surface("Preview two") }]} />);
    expect(screen.getByRole("button", { name: /One/ })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: /Two/ }));
    await waitFor(() => expect(screen.getAllByText("Preview two").length).toBeGreaterThan(0));
    expect(screen.getByRole("button", { name: /Two/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps the editorial list primary while changing one hover image region", async () => {
    const user = userEvent.setup();
    render(<HoverImageReveal label="Work" items={[{ id: "a", label: "Alpha", media: surface("Media alpha") }, { id: "b", label: "Beta", media: surface("Media beta") }]} />);
    await user.tab();
    await user.tab();
    expect(screen.getAllByText("Media beta").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Beta/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("expands content rows in document flow with disclosure semantics", async () => {
    const user = userEvent.setup();
    render(<ExpandableContentRow items={[{ id: "a", label: "Story", summary: "Summary", content: <p>Story detail</p> }]} />);
    const trigger = screen.getByRole("button", { name: /Story/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Story detail")).toBeInTheDocument();
  });

  it("morphs a selected source into detail and restores source focus on Escape", async () => {
    const user = userEvent.setup();
    render(<ListDetailMorph items={[{ id: "a", title: "Alpha", media: surface("Alpha media"), detail: <p>Alpha detail</p> }]} />);
    const source = screen.getByRole("button", { name: /Alpha.*Open detail/i });
    await user.click(source);
    expect(screen.getByText("Alpha detail")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByRole("button", { name: /Alpha.*Open detail/i })).toHaveFocus());
  });

  it("scrubs frames with the keyboard and exposes a bounded slider value", async () => {
    const user = userEvent.setup();
    render(<ScrubPreview frames={[surface("Frame one"), surface("Frame two"), surface("Frame three")]} labels={["One", "Two", "Three"]} />);
    const slider = screen.getByRole("slider", { name: "Scrub preview" });
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "2");
    await waitFor(() => expect(screen.getByText("Frame two")).toBeInTheDocument());
  });

  it("reveals a directional card from a keyboard-safe fallback", async () => {
    const user = userEvent.setup();
    render(<DirectionalCardReveal label="Open card" reveal={<span>Card detail</span>}><span>Card summary</span></DirectionalCardReveal>);
    const trigger = screen.getByRole("button", { name: "Open card" });
    await user.tab();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Card detail")).toBeInTheDocument();
  });

  it("keeps a peek panel attached while source items stay visible", async () => {
    const user = userEvent.setup();
    render(<PeekPanelCollection items={[{ id: "a", label: "Alpha", preview: surface("Alpha preview"), detail: <p>Alpha context</p> }, { id: "b", label: "Beta", preview: surface("Beta preview"), detail: <p>Beta context</p> }]} />);
    await user.click(screen.getByRole("button", { name: /Beta/ }));
    expect(screen.getAllByText("Alpha").length).toBeGreaterThan(0);
    await waitFor(() => expect(screen.getByText("Beta context")).toBeInTheDocument());
  });

  it("browses magazine content with an ordered active index", async () => {
    const user = userEvent.setup();
    render(<MagazineIndex items={[{ id: "a", title: "Alpha", preview: surface("Alpha issue") }, { id: "b", title: "Beta", preview: surface("Beta issue") }]} />);
    const alpha = screen.getByRole("button", { name: /Alpha/ });
    await user.click(screen.getByRole("button", { name: /Beta/ }));
    expect(alpha).toHaveAttribute("aria-pressed", "false");
    await waitFor(() => expect(screen.getByText("Beta issue")).toBeInTheDocument());
  });

  it("redistributes progressive collection space instead of hiding inactive labels", async () => {
    const user = userEvent.setup();
    render(<ProgressiveCollection items={[{ id: "a", label: "Alpha", summary: "Alpha summary", content: <p>Alpha detail</p> }, { id: "b", label: "Beta", summary: "Beta summary", content: <p>Beta detail</p> }]} />);
    await user.click(screen.getByRole("button", { name: /Beta/ }));
    expect(screen.getByText("Alpha summary")).toBeInTheDocument();
    expect(screen.getByText("Beta detail")).toBeInTheDocument();
  });

  it("changes focus strip width through an explicit active state", async () => {
    const user = userEvent.setup();
    render(<FocusStripCollection items={[{ id: "a", label: "Alpha", content: <span>Alpha content</span> }, { id: "b", label: "Beta", content: <span>Beta content</span> }]} />);
    const beta = screen.getByRole("button", { name: /Beta/ });
    await user.click(beta);
    expect(beta).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps one shared preview mounted for a compact collection", async () => {
    const user = userEvent.setup();
    render(<SharedPreviewCollection items={[{ id: "a", label: "Alpha", preview: surface("Shared alpha") }, { id: "b", label: "Beta", preview: surface("Shared beta") }]} />);
    await user.click(screen.getByRole("button", { name: /Beta/ }));
    await waitFor(() => expect(screen.getByText("Shared beta")).toBeInTheDocument());
    expect(screen.queryByText("Shared alpha")).not.toBeInTheDocument();
  });

  it("opens an accordion gallery and preserves its row identity", async () => {
    const user = userEvent.setup();
    render(<AccordionGallery items={[{ id: "a", title: "Alpha", media: surface("Alpha media"), content: <p>Alpha caption</p> }]} />);
    const trigger = screen.getByRole("button", { name: /Alpha/ });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Alpha caption")).toBeInTheDocument();
  });

  it("keeps collection states readable with reduced motion", () => {
    setReducedMotion(true);
    const changed = vi.fn();
    render(<><ProgressiveCollection onActiveIdChange={changed} items={[{ id: "a", label: "Alpha", content: <span>Alpha detail</span> }, { id: "b", label: "Beta", content: <span>Beta detail</span> }]} /><AccordionGallery items={[{ id: "a", title: "Gallery", media: surface("Gallery media") }]} /></>);
    expect(screen.getByRole("button", { name: /Alpha/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Gallery/ })).toHaveAttribute("aria-expanded", "false");
  });
});
