# Action Sheet

## Purpose

The classic iOS action sheet: a flat list of actions for one named object,
with an explicit Cancel. Not a generic sheet shell — it exists to answer
"what can I do with this thing," nothing more.

## Use when

A single object (a photo, a message, a row) has two to five discrete
actions and the choice should feel local and dismissible, not like
navigating to a new surface.

## Avoid

- Arbitrary content or forms — that's Detent Sheet or Content-Aware Sheet
- Searchable command entry — that's Quick Action Sheet
- A single action — use a button or Hold to Confirm for destructive ones

## Interaction

Opens from the bottom with a spring settle. Tapping an action runs it and
closes the sheet. The Cancel button, the scrim and Escape all close without
running anything.

## Accessibility

`role="dialog"` with `aria-modal`, focus moves to the first action on open
and returns to the trigger on close. Escape and the scrim both dismiss.
Destructive actions are marked by colour but the label itself always says
what happens — colour is never the only signal.

## Reduced motion

The sheet appears and disappears without the spring travel; the action list
and Cancel button remain exactly the same.

## Composition and anti-patterns

Don't nest an Action Sheet inside a Dialog or another sheet — pick one modal
surface per interaction. Keep the action list short; past five items,
consider Quick Action Sheet or a dedicated screen instead.
