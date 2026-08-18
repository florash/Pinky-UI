import type { DiscoveryMetadata, Preset, PropDef } from "./types";

/**
 * `@pinky-ui/ai-ui` metadata. A small, deliberately separate registry module
 * — these components answer a different brief (streaming, tool state, a
 * chat composer) than the rest of the catalogue, so they get their own
 * family and route (`/ai`) instead of being folded into `components`.
 */
export type AiFamily = "text" | "reasoning" | "message" | "tool" | "input" | "actions";

export type AiRegistryEntry = {
  slug: string;
  name: string;
  family: AiFamily;
  description: string;
  status: "ready";
  tags: string[];
  importPath: string;
  usage: string;
  props: PropDef[];
  presets: Preset[];
  accessibility: string[];
  reducedMotion: string;
  performance: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  related: string[];
  skill?: string;
  discovery?: DiscoveryMetadata;
};

const IMPORT = 'import { %NAME% } from "@pinky-ui/ai-ui";';

export const aiComponents: AiRegistryEntry[] = [
  {
    slug: "streaming-text",
    name: "Streaming Text",
    family: "text",
    description: "Token-by-token reveal with a blinking cursor, interruptible mid-stream.",
    status: "ready",
    tags: ["streaming", "chat", "typewriter", "cursor"],
    importPath: IMPORT.replace("%NAME%", "StreamingText"),
    usage: `<StreamingText text={partialResponse} streaming={isStreaming} />`,
    props: [
      { name: "text", type: "string", description: "The text revealed so far — grow it as tokens arrive to stream in real time." },
      { name: "speed", type: "number", defaultValue: "45", description: "Characters revealed per second while animating." },
      { name: "streaming", type: "boolean", defaultValue: "true", description: "Set to false to reveal the remaining text immediately, e.g. from a Stop button." },
      { name: "onDone", type: "() => void", description: "Called once the visible text catches up with `text`." },
      { name: "cursor", type: "boolean", defaultValue: "true", description: "Shows a blinking block cursor while text is still catching up." },
      { name: "as", type: '"p" | "span" | "div"', defaultValue: '"p"', description: "Element the text renders as." },
      { name: "className", type: "string", description: "Applied to the outer element." },
    ],
    presets: [
      { name: "Default", description: "A natural token-arrival pace.", props: {} },
      { name: "Fast", description: "For long responses where the reveal shouldn't outlast reading.", props: { speed: 90 } },
      { name: "Deliberate", description: "A slower, more legible pace for short, important messages.", props: { speed: 24 } },
    ],
    accessibility: [
      "The complete text is available to screen readers immediately through a visually hidden node — nobody has to wait on the animation to hear the message.",
      "The animated glyphs and blinking cursor are `aria-hidden`; only the hidden complete text is announced.",
    ],
    reducedMotion: "With prefers-reduced-motion: reduce, the full text renders immediately and the cursor never appears.",
    performance: ["Reveal runs off a single requestAnimationFrame loop per instance and cancels on unmount or when `text` changes to an unrelated value."],
    whenToUse: ["Assistant responses arriving over a stream (SSE, WebSocket, chunked fetch).", "Any place a typewriter reveal signals \"still arriving\" without blocking on it."],
    whenNotToUse: ["Static text that never streams — render it directly instead.", "Long-form content where a reveal would just delay reading."],
    related: ["streaming-actions", "message-bubble"],
  },
  {
    slug: "thinking-panel",
    name: "Thinking Panel",
    family: "reasoning",
    description: "A collapsible reasoning panel that swaps its label between \"thinking\" and \"thought for Xs\".",
    status: "ready",
    tags: ["reasoning", "chat", "disclosure", "agent"],
    importPath: IMPORT.replace("%NAME%", "ThinkingPanel"),
    usage: `<ThinkingPanel thinking={isReasoning} duration={reasoningSeconds}>
  {reasoningTrace}
</ThinkingPanel>`,
    props: [
      { name: "children", type: "ReactNode", description: "The reasoning content, shown when the panel is open." },
      { name: "thinking", type: "boolean", defaultValue: "false", description: "Still receiving reasoning tokens. Keeps the indicator pulsing and shows the live label." },
      { name: "duration", type: "number", description: "Seconds spent reasoning, shown in the label once `thinking` is false." },
      { name: "label", type: "string", defaultValue: '"Thinking"', description: "The panel's base label." },
      { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Whether the panel starts expanded, for an uncontrolled panel." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the panel is toggled." },
      { name: "className", type: "string", description: "Applied to the outer element." },
    ],
    presets: [
      { name: "Default", description: "Starts collapsed; the reasoning is available but out of the way.", props: {} },
      { name: "Expanded", description: "Starts open — for agent traces the user usually wants to inspect.", props: { defaultOpen: true } },
    ],
    accessibility: [
      "The trigger is a real `<button>` with `aria-expanded` and `aria-controls`.",
      "The content region carries `role=\"region\"` with a matching `aria-label`.",
    ],
    reducedMotion: "The panel still expands and collapses; only the height/opacity transition and the pulsing indicator are removed.",
    performance: ["The expand/collapse animation measures height via Motion's layout animation, not a JS-driven resize loop."],
    whenToUse: ["Surfacing an agent's reasoning trace without making it the default focus of the conversation.", "Any \"working\" state that resolves into a short summary."],
    whenNotToUse: ["Content the user needs to see immediately — don't hide required output behind a disclosure."],
    related: ["tool-call-card", "streaming-text"],
  },
  {
    slug: "message-bubble",
    name: "Message Bubble",
    family: "message",
    description: "A staggered, spring-entrance chat bubble with distinct user and assistant tones.",
    status: "ready",
    tags: ["chat", "message", "bubble", "stagger"],
    importPath: IMPORT.replace("%NAME%", "MessageBubble"),
    usage: `<MessageBubble role="assistant" index={0}>
  Here's what I found.
</MessageBubble>`,
    props: [
      { name: "role", type: '"user" | "assistant"', description: "Which side and tone the bubble renders in." },
      { name: "children", type: "ReactNode", description: "The message content." },
      { name: "avatar", type: "ReactNode", description: "Optional avatar rendered beside the bubble." },
      { name: "index", type: "number", defaultValue: "0", description: "Position in the message list — later bubbles enter with a small extra delay, capped at six positions." },
      { name: "className", type: "string", description: "Applied to the outer flex row." },
    ],
    presets: [],
    accessibility: [
      "Each bubble is a labelled `role=\"group\"` (\"Your message\" / \"Assistant message\") so a screen reader can distinguish turns without relying on position.",
    ],
    reducedMotion: "The bubble renders in its final position with no entrance animation.",
    performance: ["The entrance animates only opacity, `y` and `scale` — transform-only, no layout thrash."],
    whenToUse: ["Any chat or assistant conversation thread."],
    whenNotToUse: ["Non-conversational content — this is a message-turn primitive, not a general card."],
    related: ["streaming-text", "thinking-panel"],
  },
  {
    slug: "tool-call-card",
    name: "Tool Call Card",
    family: "tool",
    description: "A tool invocation card that flows through pending, running, done and error states.",
    status: "ready",
    tags: ["agent", "tool-call", "status", "chat"],
    importPath: IMPORT.replace("%NAME%", "ToolCallCard"),
    usage: `<ToolCallCard name="search_files" status="running" summary="Searching src/…">
  {"{ query: \\"streaming\\" }"}
</ToolCallCard>`,
    props: [
      { name: "name", type: "string", description: "The tool's name, e.g. \"search_files\"." },
      { name: "status", type: '"pending" | "running" | "done" | "error"', description: "Drives the icon and label." },
      { name: "summary", type: "string", description: "One-line result shown while the details panel is collapsed." },
      { name: "children", type: "ReactNode", description: "Expandable detail — arguments, output, a diff. Omit to make the card non-expanding." },
      { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Whether the detail panel starts expanded." },
      { name: "className", type: "string", description: "Applied to the outer element." },
    ],
    presets: [],
    accessibility: [
      "The card carries `role=\"status\"` so status changes (running → done) are announced without a full page interrupt.",
      "The trigger button is disabled, not just visually inert, when there is no detail to expand.",
    ],
    reducedMotion: "The running-state spinner still rotates using a plain CSS/Motion loop tied to `useMotionEnabled`'s fallback; only the expand/collapse height animation is removed.",
    performance: ["The running spinner is a single rotating element, not a Lottie or sprite sheet."],
    whenToUse: ["Rendering an agent's tool or function calls inline in a conversation."],
    whenNotToUse: ["A single boolean loading state — reach for `StreamingActions` or a plain spinner instead."],
    related: ["thinking-panel", "streaming-actions"],
  },
  {
    slug: "prompt-input",
    name: "Prompt Input",
    family: "input",
    description: "An auto-growing chat composer with attachments and a keyboard-navigable slash-command menu.",
    status: "ready",
    tags: ["chat", "input", "composer", "slash-command"],
    importPath: IMPORT.replace("%NAME%", "PromptInput"),
    usage: `<PromptInput
  value={value}
  onChange={setValue}
  onSubmit={sendMessage}
  commands={[{ id: "clear", label: "clear", description: "Clear the thread" }]}
/>`,
    props: [
      { name: "value", type: "string", description: "The composer's current text." },
      { name: "onChange", type: "(value: string) => void", description: "Fires on every keystroke." },
      { name: "onSubmit", type: "(value: string) => void", description: "Fires on Enter (without Shift) or the send button, when the value isn't empty." },
      { name: "placeholder", type: "string", defaultValue: '"Message…"', description: "Placeholder text." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the field and the send button, e.g. while a response streams." },
      { name: "maxRows", type: "number", defaultValue: "8", description: "The textarea stops growing past this many lines and scrolls instead." },
      { name: "attachments", type: "PromptAttachment[]", defaultValue: "[]", description: "Attachment chips shown above the field." },
      { name: "onRemoveAttachment", type: "(id: string) => void", description: "Shows a remove control on each attachment chip." },
      { name: "onAttach", type: "() => void", description: "Shows an attach button when provided." },
      { name: "commands", type: "SlashCommand[]", defaultValue: "[]", description: "Typing \"/\" at the start of an empty line opens this menu." },
      { name: "onCommand", type: "(command: SlashCommand) => void", description: "Fires when a slash command is chosen; the field is cleared after." },
      { name: "className", type: "string", description: "Applied to the outer element." },
    ],
    presets: [],
    accessibility: [
      "The field exposes `role=\"combobox\"` with `aria-expanded`/`aria-controls`/`aria-autocomplete` only while the command menu is open, so it reads as plain text input the rest of the time.",
      "The command menu is a real `role=\"listbox\"`/`role=\"option\"` pair, fully operable with ArrowUp/ArrowDown/Enter/Escape.",
    ],
    reducedMotion: "The command menu appears and disappears without its slide/fade transition; the textarea's height still adjusts, since that is layout, not decoration.",
    performance: ["Textarea height is read from `scrollHeight` and written directly to the DOM node — no controlled re-render for the resize."],
    whenToUse: ["The primary composer for a chat or agent interface."],
    whenNotToUse: ["A single-line search or filter field — this is sized and keyed for multi-line prompts."],
    related: ["streaming-actions", "message-bubble"],
  },
  {
    slug: "streaming-actions",
    name: "Streaming Actions",
    family: "actions",
    description: "One button that morphs between Stop and Regenerate as a response streams in and finishes.",
    status: "ready",
    tags: ["chat", "streaming", "button", "morph"],
    importPath: IMPORT.replace("%NAME%", "StreamingActions"),
    usage: `<StreamingActions state={isStreaming ? "streaming" : "idle"} onStop={stop} onRegenerate={regenerate} />`,
    props: [
      { name: "state", type: '"idle" | "streaming"', description: "Which action — and which icon and label — the button currently offers." },
      { name: "onStop", type: "() => void", description: "Called when clicked while `state` is \"streaming\"." },
      { name: "onRegenerate", type: "() => void", description: "Called when clicked while `state` is \"idle\"." },
      { name: "className", type: "string", description: "Applied to the button." },
    ],
    presets: [],
    accessibility: ["A single real `<button>` throughout — the label text itself communicates the action; nothing depends on the icon shape alone."],
    reducedMotion: "The icon and label still swap; only the shared-layout morph animation between the two shapes is removed.",
    performance: ["Uses Motion's `layout`/`layoutId` to animate the shared icon and width change — no manual FLIP measurement."],
    whenToUse: ["Directly under or beside a streaming assistant response."],
    whenNotToUse: ["Anywhere Stop and Regenerate need to be two separate, simultaneously visible controls."],
    related: ["streaming-text", "tool-call-card"],
  },
];

export const allAi = aiComponents;

export function getAi(slug: string): AiRegistryEntry | undefined {
  return aiComponents.find((entry) => entry.slug === slug);
}
