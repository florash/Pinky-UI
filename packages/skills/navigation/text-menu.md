# Text Menu Trigger

Use a word-based menu trigger when clarity matters more than icon shorthand, while still giving open and close states a refined visual transition.

## What it does

The text trigger keeps the action explicit: “Menu” becomes “Close” as state changes. Subtle text motion adds tactility without asking the user to decode a custom symbol.

## Interaction anatomy

- **Visible word:** names the current action in plain language.
- **State swap:** open and close labels occupy the same stable footprint.
- **Focus treatment:** surrounds the complete text button.
- **Controlled state:** the visible word and expanded state update together.

## Live example

The preview runs the real text trigger and demonstrates the same response for pointer, focus, keyboard, and tap input.

## Usage

```tsx
import { TextMenu } from "@pinky-ui/components";

<TextMenu
  open={open}
  onOpenChange={setOpen}
  controls="main-navigation"
  label="Open main navigation"
  closeLabel="Close main navigation"
/>;
```

## Tune

- Keep visible labels short enough to share one stable width.
- Avoid all-caps unless the surrounding navigation uses it consistently.
- Use restrained tracking so the state change does not cause layout shift.
- Keep the text transition secondary to the menu surface opening.

## Accessibility

Update both the visible and accessible action label when state changes. Preserve `aria-expanded`, `aria-controls`, a 44px touch target, and a clear focus-visible treatment.

## Reduced motion

Replace the animated text exchange with an immediate label swap. The explicit wording provides a complete non-motion state cue.
