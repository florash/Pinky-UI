import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import { BeforeAfter } from "./before-after";
import { FloatingMediaPlayer } from "./floating-media-player";
import { ImageSequence } from "./image-sequence";
import { MorphLightbox } from "./morph-lightbox";

describe("Media systems", () => {
  it("opens a morph lightbox, navigates and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<MorphLightbox items={[
      { id: "one", label: "First image", thumbnail: <span>Open first</span>, media: <p>First full</p> },
      { id: "two", label: "Second image", thumbnail: <span>Open second</span>, media: <p>Second full</p> },
    ]} />);
    const trigger = screen.getByRole("button", { name: "Open first" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "First image" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next media" }));
    expect(screen.getByText("Second full")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(trigger).not.toHaveFocus();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("adjusts BeforeAfter through its native keyboard range and reports controlled changes", () => {
    const change = vi.fn();
    render(<BeforeAfter before={<div>Before</div>} after={<div>After</div>} value={50} onValueChange={change} />);
    const range = screen.getByRole("slider", { name: /comparison/i });
    fireEvent.change(range, { target: { value: "51" } });
    expect(change).toHaveBeenCalledWith(51);
    expect(range).toHaveValue("50");
  });

  it("moves an image sequence with Arrow keys", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<ImageSequence frames={["/1.jpg", "/2.jpg", "/3.jpg"]} alt={(index) => `Frame ${index + 1}`} onIndexChange={change} />);
    const sequence = screen.getByRole("slider", { name: "Image sequence" });
    expect(sequence).toHaveAttribute("aria-valuetext", "Frame 1 of 3");
    sequence.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByAltText("Frame 2")).toHaveAttribute("src", "/2.jpg");
    expect(sequence).toHaveAttribute("aria-valuetext", "Frame 2 of 3");
    expect(change).toHaveBeenCalledWith(1);
  });

  it("minimizes, restores and closes the floating player", async () => {
    const user = userEvent.setup();
    const mode = vi.fn();
    render(<FloatingMediaPlayer label="Product reel" onModeChange={mode}><div>Reel</div></FloatingMediaPlayer>);
    await user.click(screen.getByRole("button", { name: "Minimize player" }));
    expect(mode).toHaveBeenCalledWith("floating");
    expect(screen.getByRole("button", { name: "Restore player" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close player" }));
    expect(screen.queryByRole("region", { name: "Product reel" })).not.toBeInTheDocument();
  });

  it("keeps media comparison operable when motion is reduced", () => {
    setReducedMotion(true);
    render(<BeforeAfter before={<div>Original media</div>} after={<div>Revised media</div>} />);
    expect(screen.getByText("Original media")).toBeVisible();
    expect(screen.getByRole("slider")).toBeEnabled();
  });
});
