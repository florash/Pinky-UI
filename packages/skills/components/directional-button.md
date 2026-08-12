# Directional Button

Let the action’s geometry indicate where the interface will move next: forward, back, or into a related surface.

## What it does

A directional button couples a restrained lateral response with clear copy or an arrow. It is especially useful for sequential flows where spatial direction reinforces the user’s mental model.

## Interaction anatomy

- **Direction:** left, right, or vertical intent is established before motion.
- **Label:** names the destination or action instead of relying on an arrow alone.
- **Engagement:** the face shifts a few pixels along its declared axis.
- **Press:** the shift tightens to confirm the command.

## Live example

The live preview compares backward and forward actions using the same component and timing.

## Usage

```tsx
import { DirectionalButton } from "@pinky/components";

export function StepActions() {
  return (
    <div className="flex gap-3">
      <DirectionalButton direction="back">Previous</DirectionalButton>
      <DirectionalButton direction="forward">Next</DirectionalButton>
    </div>
  );
}
```

## Tune

- Match `direction` to the actual navigation outcome.
- Keep movement subtle; 2–4px is enough to establish direction.
- Use parallel wording for paired previous and next actions.
- Avoid combining lateral motion with an unrelated vertical page transition.

## Accessibility

Direction must also be explicit in the accessible name. Maintain a visible focus-visible state and logical DOM order; visual placement should not reverse the keyboard sequence.

## Reduced motion

Disable directional travel and use an immediate color, border, or arrow-position state instead. The destination remains understandable from the label.
