# Double Ring Button

Frame a compact icon action with two concentric response layers: a stable hit target and a quieter outer ring that can acknowledge proximity.

## What it does

The double-ring model makes a small icon action easier to locate without making the icon itself oversized. The outer ring can react before contact while the inner control remains the semantic button.

## Interaction anatomy

- **Inner control:** owns the icon, label, focus, and click behavior.
- **Outer ring:** expands the visual footprint without creating another target.
- **Proximity response:** restrained attraction or emphasis previews availability.
- **Press response:** the rings compress together to confirm activation.

## Live example

The live preview wraps the actual button in a bounded proximity field and keeps the semantic target centered.

## Usage

```tsx
import { DoubleRingButton } from "@pinky/components";
import { Proximity } from "@pinky/primitives";
import { Plus } from "lucide-react";

export function AddAction() {
  return (
    <Proximity distance={72} axis="both">
      <DoubleRingButton aria-label="Add item" icon={<Plus aria-hidden />} />
    </Proximity>
  );
}
```

## Tune

- Keep the inner hit target at least 44×44px.
- Limit proximity distance so nearby controls do not react together.
- Use the outer ring for emphasis, never for essential status.
- Pair unfamiliar icons with a tooltip or adjacent text.

## Accessibility

Every icon-only instance needs an explicit accessible name. Keyboard focus must activate the same visual response as pointer proximity, and the decorative outer ring should remain outside the accessibility tree.

## Reduced motion

Disable magnetic translation and reveal the engaged ring state immediately on focus or press. Keep the target size and focus contrast unchanged.
