import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import { DoubleTapLike, MiniPlayer, StoryProgress, SwipeToReply } from "./mobile-social";

describe("Mobile social systems", () => {
  afterEach(() => {
    vi.useRealTimers();
    setReducedMotion(false);
  });

  it("steps StoryProgress via the labelled tap zones and reports the current segment", async () => {
    const user = userEvent.setup();
    render(<StoryProgress count={3} duration={50000}>content</StoryProgress>);
    expect(screen.getByText("Segment 1 of 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next segment" }));
    expect(screen.getByText("Segment 2 of 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous segment" }));
    expect(screen.getByText("Segment 1 of 3")).toBeInTheDocument();
  });

  it("advances StoryProgress on its own after the segment duration", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    setReducedMotion(true);
    render(<StoryProgress count={2} duration={1000} onComplete={onComplete}>content</StoryProgress>);
    act(() => vi.advanceTimersByTime(1050));
    expect(screen.getByText("Segment 2 of 2")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1050));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("pauses StoryProgress on hold and does not also step on release", () => {
    vi.useFakeTimers();
    setReducedMotion(true);
    render(<StoryProgress count={2} duration={1000}>content</StoryProgress>);
    const zone = screen.getByRole("button", { name: "Next segment" });
    fireEvent.pointerDown(zone, { pointerType: "touch" });
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByText(/paused/)).toBeInTheDocument();
    fireEvent.pointerUp(zone, { pointerType: "touch" });
    expect(screen.getByText("Segment 1 of 2")).toBeInTheDocument();
  });

  it("keeps DoubleTapLike's explicit button as a full toggle, independent of the double-tap gesture", async () => {
    const user = userEvent.setup();
    render(<DoubleTapLike label="Like photo"><img alt="" /></DoubleTapLike>);
    const button = screen.getByRole("button", { name: "Like photo" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("sets DoubleTapLike liked on a double-tap without unliking on a third tap", () => {
    const onLikedChange = vi.fn();
    render(<DoubleTapLike onLikedChange={onLikedChange}><img alt="media" /></DoubleTapLike>);
    const media = screen.getByAltText("media").parentElement as HTMLElement;
    fireEvent.pointerUp(media);
    fireEvent.pointerUp(media);
    expect(onLikedChange).toHaveBeenCalledWith(true);
    onLikedChange.mockClear();
    fireEvent.pointerUp(media);
    fireEvent.pointerUp(media);
    expect(onLikedChange).toHaveBeenCalledWith(true);
  });

  it("expands MiniPlayer on tap and lets play/pause work without also expanding", async () => {
    const user = userEvent.setup();
    const onPlayingChange = vi.fn();
    render(<MiniPlayer title="Focus mix" playing={false} onPlayingChange={onPlayingChange} />);
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(onPlayingChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Expand player/ }));
    expect(screen.getByRole("dialog", { name: "Focus mix" })).toBeInTheDocument();
  });

  it("collapses an expanded MiniPlayer on Escape and focuses the panel on open", async () => {
    const user = userEvent.setup();
    render(<MiniPlayer title="Focus mix" defaultExpanded />);
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("keeps a visible button fallback for SwipeToReply", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn();
    render(<SwipeToReply onReply={onReply} replyLabel="Reply to note"><p>Studio's open until 6.</p></SwipeToReply>);
    await user.click(screen.getByRole("button", { name: "Reply to note" }));
    expect(onReply).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("Reply started.");
  });

  it("commits SwipeToReply past the drag threshold and cancels a short drag", () => {
    const onReply = vi.fn();
    render(<SwipeToReply onReply={onReply}><p>message</p></SwipeToReply>);
    const bubble = screen.getByText("message").parentElement as HTMLElement;
    bubble.setPointerCapture = vi.fn();
    bubble.hasPointerCapture = vi.fn(() => true);
    bubble.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(bubble, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(bubble, { clientX: 20, clientY: 0 });
    fireEvent.pointerUp(bubble, { clientX: 20, clientY: 0 });
    expect(onReply).not.toHaveBeenCalled();

    fireEvent.pointerDown(bubble, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(bubble, { clientX: 60, clientY: 0 });
    fireEvent.pointerUp(bubble, { clientX: 60, clientY: 0 });
    expect(onReply).toHaveBeenCalledTimes(1);
  });
});
