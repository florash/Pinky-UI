# Floating Dock Navigation

## Purpose

Floating Dock Navigation is a compact lower dock whose selected destination expands and can expose one contextual action. It keeps navigation and the nearest creation action in one mobile surface without imitating a desktop operating-system dock.

## Use when

- A product has a persistent lower navigation model plus one frequent contextual action.
- The action should remain near the current destination.

## Interaction

Tap an item to expand its label and lift it slightly from the dock. The trailing action remains a stable button and never depends on hover.

## Accessibility

Use a labelled `nav`, `aria-current` for the current destination and a separate accessible name for the contextual action. Keep every item keyboard reachable.

## Reduced motion

Keep the expanded label and selected state but remove lift, width and opacity travel.

## Tune

- Limit the dock to four destinations plus one action.
- Keep the action meaningful to the current task.
