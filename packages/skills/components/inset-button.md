# Inset Button

Use a recessed surface for a quiet action that should feel integrated into its container rather than floating above it.

## What it does

Inset depth makes the control feel carved into a soft surface. A small internal shadow and restrained face movement provide feedback without competing with the primary action.

## Interaction anatomy

- **Recess:** an internal shadow locates the control within its parent surface.
- **Face:** label and optional icon remain stable and readable.
- **Engagement:** focus or hover deepens the recess slightly.
- **Press:** a short compression confirms activation.

## Live example

The live example keeps the surrounding surface quiet so the inset response can be read at its intended scale.

## Usage

```tsx
import { InsetButton } from "@pinky/components";
import { Bookmark } from "lucide-react";

export function SaveAction() {
  return <InsetButton icon={<Bookmark aria-hidden />}>Save</InsetButton>;
}
```

## Tune

- Use inset controls for secondary or persistent utility actions.
- Keep the recess shallow enough that the label does not look disabled.
- Pair icons with text when the action would otherwise be ambiguous.
- Match the parent surface hue so the inset reads as physically connected.

## Accessibility

Do not rely on recessed styling to imply disabled state. Preserve semantic button behavior, a visible keyboard focus treatment, and sufficient contrast between the control and its parent surface.

## Reduced motion

Switch shadow and fill states without interpolated travel. The control should still become visibly more engaged on focus and press.
