# Neighbor Shift Navigation

## Purpose

`NeighborShiftNavigation` makes the active destination gain real width while nearby items yield space. It is a compact way to make a current location feel spatially anchored without adding a second indicator layer.

## Interaction anatomy

- **Active item:** selection, pointer attention and keyboard focus share one state.
- **Shift:** the active link receives more room and neighbours rebalance.
- **Current marker:** `aria-current` and a small metadata cue make the state readable.
- **Touch:** tapping selects; the row does not depend on hover.

## Live example

Focus or move across the links in the preview. The active item expands within the same strip and remains a normal destination.

## Usage

```tsx
import { NeighborShiftNavigation } from "@pinky-ui/experiences";

<NeighborShiftNavigation items={sections} aria-label="Project sections" />;
```

## Tune

- Use three to seven short labels.
- Keep the width difference modest so every destination remains scannable.
- Do not combine it with another moving active pill in the same row.

## Accessibility

Keep every item as a native link, expose the active location with `aria-current`, and provide a focus ring that remains inside the reflowing row.

## Reduced motion

Snap the active width to its final value. Current state and destination order must remain clear without the shift animation.
