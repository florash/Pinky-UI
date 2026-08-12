# Menu Trigger Motion

Choose trigger motion that explains how a compact navigation control changes state without turning the trigger into a miniature animation showcase.

## What it does

This pattern compares line, bracket, and text-based triggers as different state-signaling strategies. Each trigger uses the same open/closed contract, while its motion identity follows its visual construction.

## Interaction anatomy

- **Trigger:** a native button owns the expanded state and accessible label.
- **Transformation:** lines, brackets, or words change just enough to distinguish open from closed.
- **Controlled state:** the menu surface and trigger share one source of truth.
- **Reset:** closing restores a quiet, legible resting mark.

## Live example

The reference wall runs three real menu triggers together. Only the hovered, focused, or tapped preview enters its active state.

## Usage

```tsx
import { useState } from "react";
import { BracketMenu } from "@pinky/components";

export function CompactNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BracketMenu
        open={open}
        onOpenChange={setOpen}
        controls="primary-navigation"
        label="Open navigation"
        closeLabel="Close navigation"
      />
      <nav id="primary-navigation" hidden={!open}>…</nav>
    </>
  );
}
```

## Tune

- Use one trigger identity consistently within a product area.
- Keep the transformation between 160 and 260ms.
- Match the trigger’s visual weight to nearby navigation labels.
- Close the controlled menu on route change and Escape.
- Avoid running several trigger animations at the same time.

## Accessibility

Expose `aria-expanded`, connect the button to its menu with `aria-controls`, and update the accessible label between open and closed states. The menu itself still needs correct focus management and Escape behavior.

## Reduced motion

Switch directly between the closed and open marks. Preserve the label and expanded state so the control remains fully understandable without line rotation or morphing.
