# Extruded Button

Give a primary action a physical face and a visible base, then let the face travel toward that base when the user engages it.

## What it does

An extruded button makes press depth legible before interaction begins. Its shadow is structural rather than decorative: it describes the distance the button can move.

## Interaction anatomy

- **Face:** the label-bearing surface stays crisp and high contrast.
- **Base:** a compact offset shadow establishes depth and direction.
- **Preview:** hover and keyboard focus move the face partway down.
- **Press:** active input closes the remaining gap.

## Live example

The live preview uses the real button, including hover, focus, press, and touch behavior.

## Usage

```tsx
import { ExtrudedButton } from "@pinky-ui/components";

export function PublishAction() {
  return (
    <ExtrudedButton thickness={5} tone="primary">
      Publish
    </ExtrudedButton>
  );
}
```

## Tune

- Set `thickness` between 3 and 6 for a compact interface.
- Match `tone` to the action hierarchy, not the surrounding decoration.
- Keep labels short so the moving face reads as one solid object.
- Leave enough outer space for the offset base to remain visible.

## Accessibility

The component remains a native button, so preserve its label and do not suppress its focus-visible state. Use `disabled` for unavailable actions and avoid using depth as the only indicator of state.

## Reduced motion

Jump directly to the engaged offset instead of animating through intermediate positions. Retain the compressed shadow so the state change remains clear.
