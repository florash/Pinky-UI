# Bracket Menu

Use paired brackets as a compact navigation trigger whose open state feels like a frame expanding to reveal content.

## What it does

The bracket trigger turns punctuation-like geometry into a clear open/closed signal. It is distinctive at small sizes while remaining quieter than a large icon animation.

## Interaction anatomy

- **Pair:** two bracket marks form one centered trigger.
- **Open state:** spacing and orientation create a wider frame.
- **Label:** an accessible name identifies the navigation action.
- **Control:** expanded state stays synchronized with the menu surface.

## Live example

The live preview uses the actual controlled trigger and resets when pointer or keyboard attention leaves the recipe.

## Usage

```tsx
import { BracketMenu } from "@pinky-ui/components";

<BracketMenu
  open={menuOpen}
  onOpenChange={setMenuOpen}
  controls="site-menu"
  label="Open site menu"
  closeLabel="Close site menu"
/>;
```

## Tune

- Keep the brackets large enough to remain legible at 1× zoom.
- Use compact spacing in the resting state and a modest open expansion.
- Place the trigger on a calm surface so its silhouette stays clear.
- Keep open and close timing symmetrical.

## Accessibility

Provide distinct open and close labels, expose the expanded state, and connect the trigger to the controlled region. Ensure the focus-visible treatment encloses the complete hit target, not only the bracket strokes.

## Reduced motion

Snap the brackets between their two arrangements. The changed silhouette and `aria-expanded` state continue to communicate the result.
