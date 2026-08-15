# Thumb-Reach Menu

## Purpose

Thumb-Reach Menu places the trigger near the lower edge and fans a short action set upward. It is a useful alternative when actions are important on a large phone but a top-corner menu creates reach or context problems.

## Use when

- Three or four secondary actions belong to a local task.
- The lower edge is already the user's working zone.

## Interaction

Tap the lower trigger to open a vertical action group. Escape, selecting an action, tapping the trigger again and a visible close state all dismiss the group.

## Accessibility

Expose `aria-haspopup="menu"`, `aria-expanded` and `menuitem` semantics. Move focus into the first action on open and return it to the trigger on close.

## Reduced motion

Show the action group immediately and retain the same focus order.

## Tune

- Keep the fan short enough to avoid reaching the status bar.
- Use labels that make the action outcome clear.
