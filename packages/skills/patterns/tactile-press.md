# Tactile Press

Turn a small set of button depth models into a deliberate interaction hierarchy. Tactile press is useful when primary, secondary, and quiet actions should feel related without becoming identical.

## What it does

The pattern pairs visible depth with a short press response. Extruded controls travel through their shadow, inset controls settle into a recessed surface, and layered controls compress the gap between their face and backing plate.

## Interaction anatomy

- **Surface:** a readable face that keeps its label stable during motion.
- **Depth cue:** shadow, inset, or backing layer that explains where the control can travel.
- **Engagement:** hover or keyboard focus previews the travel; press completes it.
- **Hierarchy:** use one depth model per action role instead of mixing effects at random.

## Live example

The live wall places extruded, inset, and layered controls together so their different depth models can be compared directly.

## Usage

```tsx
import { ExtrudedButton, InsetButton, LayeredButton } from "@pinky/components";

export function Actions() {
  return (
    <div className="flex items-center gap-3">
      <ExtrudedButton>Publish</ExtrudedButton>
      <LayeredButton>Preview</LayeredButton>
      <InsetButton>Save draft</InsetButton>
    </div>
  );
}
```

## Tune

- Keep travel between 2–6px so the label remains easy to track.
- Reserve the strongest depth for the primary action.
- Keep adjacent controls close in height even when their depth cues differ.
- Use a compact 120–180ms response; the press should feel immediate.
- Reduce surrounding card decoration so the buttons remain the visual subject.

## Accessibility

Use semantic buttons, visible labels, and a clear focus-visible treatment. Do not communicate action priority with depth alone; label wording, order, and contrast still need to carry meaning. Keep the complete hit target at least 44px on touch screens.

## Reduced motion

Remove the travel animation and switch directly between resting and engaged depth states. Preserve the border, fill, or shadow change so focus and press remain perceptible without movement.
