import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { MessageBubble } from "./message-bubble";
import { PromptInput, type SlashCommand } from "./prompt-input";
import { StreamingActions } from "./streaming-actions";
import { StreamingText } from "./streaming-text";
import { ThinkingPanel } from "./thinking-panel";
import { ToolCallCard } from "./tool-call-card";

describe("StreamingText", () => {
  it("exposes the full text to assistive tech immediately, even mid-stream", () => {
    render(<StreamingText text="Hello there" cursor={false} />);
    expect(screen.getByText("Hello there", { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("reveals the full text instantly with reduced motion", () => {
    setReducedMotion(true);
    const onDone = vi.fn();
    render(<StreamingText text="Done fast" onDone={onDone} />);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("jumps to the full text when streaming is interrupted, without double-firing onDone", () => {
    const onDone = vi.fn();
    render(<StreamingText text="Interrupted response" streaming={false} onDone={onDone} />);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe("ThinkingPanel", () => {
  it("stays collapsed by default and expands on click", async () => {
    const user = userEvent.setup();
    render(<ThinkingPanel>Reasoning trace</ThinkingPanel>);

    // Content stays mounted (GridReveal clips via CSS rather than unmounting)
    // but is `inert` — out of the tab order and off assistive tech — while collapsed.
    expect(screen.getByText("Reasoning trace").closest("[inert]")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Thinking" }));
    expect(screen.getByText("Reasoning trace").closest("[inert]")).toBeNull();
  });

  it("shows the elapsed duration once thinking has stopped", () => {
    render(
      <ThinkingPanel thinking={false} duration={4}>
        trace
      </ThinkingPanel>,
    );
    expect(screen.getByRole("button", { name: "Thought for 4s" })).toBeInTheDocument();
  });
});

describe("MessageBubble", () => {
  it("labels user and assistant turns for assistive tech", () => {
    render(
      <>
        <MessageBubble role="user">Question</MessageBubble>
        <MessageBubble role="assistant">Answer</MessageBubble>
      </>,
    );
    expect(screen.getByRole("group", { name: "Your message" })).toHaveTextContent("Question");
    expect(screen.getByRole("group", { name: "Assistant message" })).toHaveTextContent("Answer");
  });
});

describe("ToolCallCard", () => {
  it("only expands when it has details to show", async () => {
    const user = userEvent.setup();
    render(<ToolCallCard name="search_files" status="done" />);
    expect(screen.getByRole("button", { name: /search_files/ })).toBeDisabled();

    render(
      <ToolCallCard name="run_tests" status="running">
        stdout: 12 passed
      </ToolCallCard>,
    );
    const trigger = screen.getByRole("button", { name: /run_tests/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText("stdout: 12 passed")).toBeInTheDocument();
  });
});

describe("PromptInput", () => {
  const COMMANDS: SlashCommand[] = [{ id: "clear", label: "clear", description: "Clear the thread" }];

  function Controlled({ onSubmit, onCommand }: { onSubmit: (value: string) => void; onCommand?: (command: SlashCommand) => void }) {
    const [value, setValue] = useState("");
    return <PromptInput value={value} onChange={setValue} onSubmit={onSubmit} onCommand={onCommand} commands={COMMANDS} />;
  }

  it("submits on Enter and keeps Shift+Enter as a newline", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Controlled onSubmit={onSubmit} />);

    const textarea = screen.getByPlaceholderText("Message…");
    await user.type(textarea, "hello{Shift>}{Enter}{/Shift}world");
    expect((textarea as HTMLTextAreaElement).value).toBe("hello\nworld");

    await user.type(textarea, "{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("hello\nworld");
  });

  it("does not submit empty input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Controlled onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("opens the slash command menu and runs a command from the keyboard", async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();
    render(<Controlled onSubmit={vi.fn()} onCommand={onCommand} />);

    const textarea = screen.getByPlaceholderText("Message…");
    await user.type(textarea, "/cl");
    expect(await screen.findByRole("option", { name: /clear/ })).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(onCommand).toHaveBeenCalledWith({ id: "clear", label: "clear", description: "Clear the thread" });
  });
});

describe("StreamingActions", () => {
  it("swaps between Stop and Regenerate with the corresponding handler", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    const onRegenerate = vi.fn();
    const { rerender } = render(<StreamingActions state="streaming" onStop={onStop} onRegenerate={onRegenerate} />);

    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalledTimes(1);

    rerender(<StreamingActions state="idle" onStop={onStop} onRegenerate={onRegenerate} />);
    await user.click(screen.getByRole("button", { name: "Regenerate" }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });
});
