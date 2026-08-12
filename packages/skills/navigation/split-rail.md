# Split Rail Menu

Build a menu trigger from two aligned rails that separate and recompose as navigation opens and closes.

## What it does

Split rails provide a precise, architectural trigger identity. Their motion is linear and compact, which works well beside editorial or product navigation where a conventional hamburger would feel generic.

## Interaction anatomy

- **Rails:** two strokes share a center axis in the resting state.
- **Separation:** opening creates a clear spatial distinction between states.
- **Hit area:** a larger button surrounds the narrow visual mark.
- **State contract:** controlled props keep the trigger and menu synchronized.

## Live example

The live preview shows the real rail geometry at its intended compact scale while preserving a touch-friendly button.

## Usage

```tsx
import { SplitRail } from "@pinky/components";

<SplitRail
  open={open}
  onOpenChange={setOpen}
  controls="project-navigation"
  label="Open project navigation"
  closeLabel="Close project navigation"
/>;
```

## Tune

- Keep the visual rails thin but the button at least 44px square.
- Align rail weight with nearby icon strokes.
- Use restrained separation so the mark still reads as one control.
- Avoid placing other animated lines immediately beside it.

## Accessibility

The narrow rails must not define the hit target. Use the full button area for pointer and touch input, preserve visible focus, and supply open/close labels plus `aria-controls`.

## Reduced motion

Render the final separated or closed arrangement immediately. A small color change can reinforce state without translating the rails.
