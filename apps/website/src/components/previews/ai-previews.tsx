"use client";

import {
  MessageBubble,
  PromptInput,
  StreamingActions,
  StreamingText,
  ThinkingPanel,
  ToolCallCard,
  type ToolCallStatus,
} from "@pinky-ui/ai-ui";
import { useEffect, useState, type ReactNode } from "react";

function ReplayButton({ onClick, children = "Replay" }: { onClick: () => void; children?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
    >
      {children}
    </button>
  );
}

function StreamingTextPreview() {
  const [seed, setSeed] = useState(0);
  return (
    <div className="w-full space-y-3">
      <StreamingText key={seed} text="Here's a streamed response, arriving one token at a time." speed={38} />
      <ReplayButton onClick={() => setSeed((value) => value + 1)} />
    </div>
  );
}

function ThinkingPanelPreview() {
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    if (!thinking) return;
    const timer = window.setTimeout(() => setThinking(false), 2000);
    return () => window.clearTimeout(timer);
  }, [thinking]);

  return (
    <div className="w-full space-y-3">
      <ThinkingPanel thinking={thinking} duration={thinking ? undefined : 2} defaultOpen>
        Checked three sources, compared timestamps, settled on the most recent.
      </ThinkingPanel>
      <ReplayButton onClick={() => setThinking(true)} />
    </div>
  );
}

function MessageBubblePreview() {
  return (
    <div className="flex w-full flex-col gap-3">
      <MessageBubble role="user" index={0}>
        How do I stream a response?
      </MessageBubble>
      <MessageBubble role="assistant" index={1}>
        Reveal it token by token with Streaming Text.
      </MessageBubble>
    </div>
  );
}

function ToolCallCardPreview() {
  const [status, setStatus] = useState<ToolCallStatus>("running");

  useEffect(() => {
    if (status !== "running") return;
    const timer = window.setTimeout(() => setStatus("done"), 1800);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="w-full space-y-2">
      <ToolCallCard name="search_files" status={status} summary={status === "done" ? "12 matches in src/" : undefined} defaultOpen>
        {'{ query: "streaming" }'}
      </ToolCallCard>
      <ReplayButton onClick={() => setStatus("running")}>Run again</ReplayButton>
    </div>
  );
}

function PromptInputPreview() {
  const [value, setValue] = useState("");
  return (
    <PromptInput
      value={value}
      onChange={setValue}
      onSubmit={() => setValue("")}
      commands={[
        { id: "clear", label: "clear", description: "Clear the thread" },
        { id: "summarize", label: "summarize", description: "Summarize the conversation" },
      ]}
      className="w-full"
    />
  );
}

function StreamingActionsPreview() {
  const [state, setState] = useState<"idle" | "streaming">("streaming");
  return <StreamingActions state={state} onStop={() => setState("idle")} onRegenerate={() => setState("streaming")} />;
}

export const AI_PREVIEWS: Record<string, ReactNode> = {
  "streaming-text": <StreamingTextPreview />,
  "thinking-panel": <ThinkingPanelPreview />,
  "message-bubble": <MessageBubblePreview />,
  "tool-call-card": <ToolCallCardPreview />,
  "prompt-input": <PromptInputPreview />,
  "streaming-actions": <StreamingActionsPreview />,
};
