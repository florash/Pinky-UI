# Layered Button

Separate a button face from a colored backing plate to create tactile depth without the weight of a large shadow.

## What it does

The layered model keeps depth graphic and controlled. Engagement narrows the separation between the two surfaces, which makes the action feel responsive while preserving a clean silhouette.

## Interaction anatomy

- **Front layer:** carries the action label and focus treatment.
- **Backing layer:** provides direction, contrast, and depth.
- **Separation:** determines how pronounced the tactile effect feels.
- **Compression:** hover, focus, and press reduce the visible gap.

## Live example

The preview exposes the actual layered surfaces, so the relationship between separation and compression is visible in place.

## Usage

```tsx
import { LayeredButton } from "@pinky-ui/components";

export function ContinueAction() {
  return <LayeredButton separation={5}>Continue</LayeredButton>;
}
```

## Tune

- Use 3–6px of `separation` for most interface actions.
- Keep the backing color distinct but quieter than the label surface.
- Align neighboring controls by their front faces, not their backing layers.
- Avoid another heavy card shadow immediately around the button.

## Accessibility

Keep the foreground label at accessible contrast and retain a visible focus-visible ring around the actionable face. The backing plate is decoration and should not contain essential information.

## Reduced motion

Replace animated compression with an immediate layer-position change. A fill or border shift can reinforce engagement when movement is minimized.
