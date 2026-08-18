# @pinky-ui/ai-ui

Animated interface primitives for AI and agent chat products — streaming text, thinking states,
tool call cards, prompt input, and message bubbles. Existing component libraries cover static chat
UI; this package covers the motion.

## Registry installation

The `@pinky-ui/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source, or `npx pinky-ui add <slug>` once the CLI is published.

### After npm publication

```bash
npm install @pinky-ui/ai-ui @pinky-ui/primitives react motion
```

## Use

```tsx
import { StreamingText, ThinkingPanel, MessageBubble, ToolCallCard, PromptInput, StreamingActions } from "@pinky-ui/ai-ui";

<MessageBubble role="assistant">
  <StreamingText text={partialResponse} streaming={isStreaming} />
</MessageBubble>;
```

Every component renders its complete content without motion first — reduced-motion users and
screen readers get the finished text, panel or state immediately, never a wait on the animation.
MIT licensed.
