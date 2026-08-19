import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  LiveActivityCard,
  NotificationStack,
  ReactionPicker,
  VerticalFeed,
  VoiceWaveform,
} from "./mobile-feed";

const observed: IntersectionObserver[] = [];

class FakeIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Element[] = [];
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observed.push(this as unknown as IntersectionObserver);
  }
  observe(el: Element) { this.elements.push(el); }
  disconnect() {}
  unobserve() {}
  trigger(target: Element, ratio: number) {
    this.callback([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe("Mobile feed systems", () => {
  it("tracks the active VerticalFeed item via intersection and announces it", () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    observed.length = 0;
    const onIndexChange = vi.fn();
    render(
      <VerticalFeed
        items={[
          { id: "a", content: "A", label: "Slide A" },
          { id: "b", content: "B", label: "Slide B" },
        ]}
        onIndexChange={onIndexChange}
      />,
    );
    const observer = observed[0] as unknown as FakeIntersectionObserver;
    act(() => observer.trigger(observer.elements[1]!, 0.9));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByText(/Slide B — 2 of 2/)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("lets VoiceWaveform's slider be seeked from the keyboard", async () => {
    const user = userEvent.setup();
    const onSeek = vi.fn();
    render(<VoiceWaveform amplitudes={[0.2, 0.6, 0.9, 0.4]} progress={0.5} onSeek={onSeek} label="Message from Flora" />);
    const slider = screen.getByRole("slider", { name: "Message from Flora" });
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(onSeek).toHaveBeenCalledWith(0.55);
  });

  it("toggles VoiceWaveform play state via its button", async () => {
    const user = userEvent.setup();
    const onPlayingChange = vi.fn();
    render(<VoiceWaveform amplitudes={[0.2, 0.6]} onPlayingChange={onPlayingChange} />);
    await user.click(screen.getByRole("button", { name: "Play voice message" }));
    expect(onPlayingChange).toHaveBeenCalledWith(true);
  });

  it("opens ReactionPicker from its corner button and selects a reaction", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ReactionPicker
        options={[{ id: "heart", emoji: "❤️", label: "Love" }, { id: "laugh", emoji: "😂", label: "Haha" }]}
        onValueChange={onValueChange}
        label="React to message"
      >
        <p>Hello</p>
      </ReactionPicker>,
    );
    await user.click(screen.getByRole("button", { name: "React to message" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Love" }));
    expect(onValueChange).toHaveBeenCalledWith("heart");
  });

  it("closes ReactionPicker on Escape", async () => {
    const user = userEvent.setup();
    render(
      <ReactionPicker options={[{ id: "heart", emoji: "❤️", label: "Love" }]} label="React">
        <p>Hello</p>
      </ReactionPicker>,
    );
    await user.click(screen.getByRole("button", { name: "React" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("renders LiveActivityCard's status and lets it be dismissed", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<LiveActivityCard title="Delivery arriving" subtitle="12 min away" progress={0.6} onDismiss={onDismiss} />);
    expect(screen.getByRole("status")).toHaveTextContent("Delivery arriving");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("expands NotificationStack from its collapsed button and dismisses an item", async () => {
    const user = userEvent.setup();
    const items = [
      { id: "one", title: "First", body: "Body one" },
      { id: "two", title: "Second", body: "Body two" },
    ];
    function Wrapper() {
      const [list, setList] = useState(items);
      return <NotificationStack items={list} onDismiss={(id) => setList((current) => current.filter((item) => item.id !== id))} />;
    }
    render(<Wrapper />);
    await user.click(screen.getByRole("button", { name: /First. And 1 more notifications. Expand./ }));
    expect(screen.getByText("Second")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss First" }));
    expect(screen.queryByText("First")).not.toBeInTheDocument();
  });

  it("returns null for an empty NotificationStack", () => {
    const { container } = render(<NotificationStack items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
