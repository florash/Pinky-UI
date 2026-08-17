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
import { allAi } from "@pinky-ui/registry";
import Link from "next/link";
import { useEffect, useState } from "react";

import { RegistryCatalogue } from "@/components/site/registry-catalogue";

const panelStyle = {
  minHeight: 220,
  borderRadius: 24,
  padding: 24,
  background: "color-mix(in oklab, var(--color-white) 76%, var(--pinky-page))",
  border: "1px solid var(--color-line)",
  boxShadow: "var(--shadow-soft)",
};

export function AiShowcase() {
  return (
    <div className="relative overflow-hidden pb-32">
      <section className="mx-auto max-w-[76rem] px-5 pt-14 sm:px-8 sm:pt-16">
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">AI</p>
        <h1 className="mt-4 max-w-3xl text-section text-balance-tight">
          Motion for the interfaces everyone is building right now.
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-700">
          Streaming text, tool calls and a chat composer with Pinky&apos;s restraint — every state renders
          completely without motion first, so reduced motion and screen readers never wait on an animation.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="#streaming" className="rounded-pill bg-ink-900 px-5 py-3 text-sm text-milk">
            Explore the family
          </Link>
          <Link href="#browse-all" className="px-2 py-3 text-sm text-ink-700 underline decoration-line-strong underline-offset-4">
            Browse all {allAi.length} components →
          </Link>
        </div>
      </section>

      <section id="streaming" className="mx-auto max-w-[76rem] px-5 pt-28 sm:px-8">
        <SectionLabel eyebrow="01 · Streaming" title="Tokens arrive; the interface says so." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div style={panelStyle}>
            <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Streaming Text</p>
            <div className="mt-6 text-lg leading-relaxed">
              <StreamingTextDemo />
            </div>
          </div>
          <div style={panelStyle}>
            <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Streaming Actions</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">One button, two roles — it morphs instead of swapping out.</p>
            <div className="mt-6">
              <StreamingActionsDemo />
            </div>
          </div>
        </div>
      </section>

      <section id="composer" className="mx-auto max-w-[76rem] px-5 pt-32 sm:px-8">
        <SectionLabel eyebrow="02 · Composer" title="A prompt field built for slash commands and attachments." />
        <div className="mt-10 rounded-[28px] border border-line bg-white/70 p-6 shadow-soft sm:p-10" style={{ maxWidth: "40rem" }}>
          <PromptInputDemo />
        </div>
      </section>

      <section id="structure" className="mx-auto max-w-[76rem] px-5 pt-32 sm:px-8">
        <SectionLabel eyebrow="03 · Structure" title="A conversation is more than message text." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div style={panelStyle}>
            <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Message Bubble</p>
            <div className="mt-6 flex flex-col gap-3">
              <MessageBubble role="user" index={0}>Can you check the deploy logs?</MessageBubble>
              <MessageBubble role="assistant" index={1}>On it — pulling the last run now.</MessageBubble>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div style={{ ...panelStyle, minHeight: "auto" }}>
              <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Thinking Panel</p>
              <div className="mt-4">
                <ThinkingPanel defaultOpen duration={3} label="Thinking">
                  Checked three log sources, compared timestamps, settled on the most recent deploy.
                </ThinkingPanel>
              </div>
            </div>
            <div style={{ ...panelStyle, minHeight: "auto" }}>
              <p className="font-mono text-xs tracking-[0.16em] text-ink-500 uppercase">Tool Call Card</p>
              <div className="mt-4">
                <ToolCallCardDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RegistryCatalogue id="browse-all" items={allAi} hrefPrefix="/ai" label="AI components" />
    </div>
  );
}

function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">{eyebrow}</p>
      <h2 className="mt-4 text-section text-balance-tight">{title}</h2>
    </div>
  );
}

function StreamingTextDemo() {
  const [seed, setSeed] = useState(0);
  return (
    <div className="space-y-4">
      <StreamingText key={seed} text="Pulling the last three deploys and comparing their build times…" speed={32} />
      <button type="button" onClick={() => setSeed((value) => value + 1)} className="rounded-pill border border-line bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
        Replay
      </button>
    </div>
  );
}

function StreamingActionsDemo() {
  const [state, setState] = useState<"idle" | "streaming">("streaming");
  return <StreamingActions state={state} onStop={() => setState("idle")} onRegenerate={() => setState("streaming")} />;
}

function PromptInputDemo() {
  const [value, setValue] = useState("");
  return (
    <PromptInput
      value={value}
      onChange={setValue}
      onSubmit={() => setValue("")}
      onAttach={() => undefined}
      commands={[
        { id: "clear", label: "clear", description: "Clear the thread" },
        { id: "summarize", label: "summarize", description: "Summarize the conversation" },
      ]}
    />
  );
}

function ToolCallCardDemo() {
  const [status, setStatus] = useState<ToolCallStatus>("running");

  useEffect(() => {
    if (status !== "running") return;
    const timer = window.setTimeout(() => setStatus("done"), 1800);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="space-y-2">
      <ToolCallCard name="fetch_deploy_logs" status={status} summary={status === "done" ? "Found 3 deploys in the last hour" : undefined} defaultOpen>
        {'{ service: "web", limit: 3 }'}
      </ToolCallCard>
      <button type="button" onClick={() => setStatus("running")} className="rounded-pill border border-line bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
        Run again
      </button>
    </div>
  );
}
